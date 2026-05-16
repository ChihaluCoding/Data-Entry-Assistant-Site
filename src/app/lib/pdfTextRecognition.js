const PDF_WORKER_SRC = new URL(
  "pdfjs-dist/build/pdf.worker.mjs",
  import.meta.url
).toString();

export const PDF_EMBEDDED_TEXT_MIN_LENGTH_FOR_OCR = 20;
export const DEFAULT_PDF_OCR_MAX_PAGES = 1;
export const DEFAULT_PDF_OCR_SCALE = 2;

let isPdfWorkerConfigured = false;
let pdfJsModulePromise = null;

async function loadPdfJs() {
  if (!pdfJsModulePromise) {
    pdfJsModulePromise = import("pdfjs-dist");
  }

  return pdfJsModulePromise;
}

export async function configurePdfTextWorker() {
  if (isPdfWorkerConfigured) {
    return;
  }

  const pdfjsLib = await loadPdfJs();
  pdfjsLib.GlobalWorkerOptions.workerSrc = PDF_WORKER_SRC;
  isPdfWorkerConfigured = true;
}

export function normalizePdfTextItems(items) {
  return items
    .map((item) => ("str" in item ? item.str : ""))
    .join(" ")
    .replace(/[ \t]*　[ \t]*/g, "　")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/[ \t]{2,}/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function shouldUseOcrFallback(text, threshold = PDF_EMBEDDED_TEXT_MIN_LENGTH_FOR_OCR) {
  return text.trim().length < threshold;
}

export function buildPdfTextRecognitionMessage({
  source,
  pageCount,
  embeddedTextLength,
  ocrPageCount,
}) {
  if (source === "embedded") {
    return `PDF内テキストを抽出しました（${pageCount}ページ、${embeddedTextLength}文字）。`;
  }

  if (source === "ocr") {
    return `PDF内テキストが少ないため、先頭${ocrPageCount}ページをOCRしました。`;
  }

  return "文字を抽出できませんでした。スキャン品質やPDFの保護設定を確認してください。";
}

export async function extractEmbeddedTextFromPdfDocument(pdfDocument) {
  const pageTexts = [];

  for (let pageNumber = 1; pageNumber <= pdfDocument.numPages; pageNumber += 1) {
    const page = await pdfDocument.getPage(pageNumber);
    const textContent = await page.getTextContent();
    const text = normalizePdfTextItems(textContent.items);
    if (text) {
      pageTexts.push(`--- ${pageNumber}ページ ---\n${text}`);
    }
  }

  return pageTexts.join("\n\n").trim();
}

export async function renderPdfPageToImageDataUrl(pdfDocument, pageNumber, scale) {
  if (typeof document === "undefined") {
    throw new Error("OCR用のPDFページ描画はブラウザでのみ実行できます。");
  }

  const page = await pdfDocument.getPage(pageNumber);
  const viewport = page.getViewport({ scale });
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("OCR用Canvasを作成できませんでした。");
  }

  canvas.width = Math.ceil(viewport.width);
  canvas.height = Math.ceil(viewport.height);
  await page.render({ canvasContext: context, viewport }).promise;
  return canvas.toDataURL("image/png");
}

export async function runOcrForPdfDocument(
  pdfDocument,
  {
    maxPages = DEFAULT_PDF_OCR_MAX_PAGES,
    scale = DEFAULT_PDF_OCR_SCALE,
    onProgress,
  } = {}
) {
  const { createWorker } = await import("tesseract.js");
  const pageCount = Math.min(pdfDocument.numPages, maxPages);
  const worker = await createWorker(["jpn", "eng"], 1, {
    logger: (message) => {
      if (message?.status && typeof onProgress === "function") {
        const progress =
          typeof message.progress === "number"
            ? ` ${Math.round(message.progress * 100)}%`
            : "";
        onProgress(`${message.status}${progress}`);
      }
    },
  });

  try {
    const pageTexts = [];
    for (let pageNumber = 1; pageNumber <= pageCount; pageNumber += 1) {
      if (typeof onProgress === "function") {
        onProgress(`${pageNumber}ページ目をOCR中...`);
      }
      const imageDataUrl = await renderPdfPageToImageDataUrl(
        pdfDocument,
        pageNumber,
        scale
      );
      const result = await worker.recognize(imageDataUrl);
      const text = result?.data?.text?.trim() ?? "";
      if (text) {
        pageTexts.push(`--- ${pageNumber}ページ OCR ---\n${text}`);
      }
    }

    return {
      text: pageTexts.join("\n\n").trim(),
      pageCount,
    };
  } finally {
    await worker.terminate();
  }
}

export async function extractPdfTextWithOptionalOcr(
  pdfBlob,
  {
    ocrThreshold = PDF_EMBEDDED_TEXT_MIN_LENGTH_FOR_OCR,
    ocrMaxPages = DEFAULT_PDF_OCR_MAX_PAGES,
    onOcrProgress,
  } = {}
) {
  await configurePdfTextWorker();

  const data = new Uint8Array(await pdfBlob.arrayBuffer());
  const pdfjsLib = await loadPdfJs();
  const pdfDocument = await pdfjsLib.getDocument({ data }).promise;
  const embeddedText = await extractEmbeddedTextFromPdfDocument(pdfDocument);
  const embeddedTextLength = embeddedText.trim().length;

  if (!shouldUseOcrFallback(embeddedText, ocrThreshold)) {
    return {
      text: embeddedText,
      source: "embedded",
      pageCount: pdfDocument.numPages,
      embeddedTextLength,
      ocrPageCount: 0,
      message: buildPdfTextRecognitionMessage({
        source: "embedded",
        pageCount: pdfDocument.numPages,
        embeddedTextLength,
        ocrPageCount: 0,
      }),
    };
  }

  const ocrResult = await runOcrForPdfDocument(pdfDocument, {
    maxPages: ocrMaxPages,
    onProgress: onOcrProgress,
  });
  const source = ocrResult.text ? "ocr" : "none";

  return {
    text: ocrResult.text,
    source,
    pageCount: pdfDocument.numPages,
    embeddedTextLength,
    ocrPageCount: ocrResult.pageCount,
    message: buildPdfTextRecognitionMessage({
      source,
      pageCount: pdfDocument.numPages,
      embeddedTextLength,
      ocrPageCount: ocrResult.pageCount,
    }),
  };
}
