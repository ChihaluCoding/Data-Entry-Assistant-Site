const TRANSFER_DESTINATION_NOTICE_TEXT = "転出先が判明";

const compactText = (text) => text.replace(/\s+/g, "");

export const containsTransferDestinationNoticeText = (text) => {
  return compactText(String(text ?? "")).includes(TRANSFER_DESTINATION_NOTICE_TEXT);
};

const decodeCandidatesFromBytes = (bytes) => {
  const candidates = [];
  const decoders = ["utf-8", "utf-16le", "utf-16be"];

  for (const encoding of decoders) {
    try {
      candidates.push(new TextDecoder(encoding).decode(bytes));
    } catch {
      // 未対応エンコーディングは候補から外す
    }
  }

  return candidates;
};

const hasNoticeInRawPdfBytes = (bytes) => {
  return decodeCandidatesFromBytes(bytes).some(containsTransferDestinationNoticeText);
};

const hasBasicPdfStructure = (bytes) => {
  const head = new TextDecoder("utf-8").decode(bytes.slice(0, 16));
  const tail = new TextDecoder("utf-8").decode(bytes.slice(Math.max(0, bytes.length - 1024)));

  return head.startsWith("%PDF-") && tail.includes("%%EOF");
};

export const detectPdfTransferDestinationNotice = async (blob) => {
  const arrayBuffer = await blob.arrayBuffer();
  const bytes = new Uint8Array(arrayBuffer);

  if (hasNoticeInRawPdfBytes(bytes)) {
    return true;
  }
  if (!hasBasicPdfStructure(bytes)) {
    return false;
  }

  try {
    const pdfjs = await import("pdfjs-dist/build/pdf.mjs");
    if (pdfjs.GlobalWorkerOptions && !pdfjs.GlobalWorkerOptions.workerSrc) {
      pdfjs.GlobalWorkerOptions.workerSrc = new URL(
        "pdfjs-dist/build/pdf.worker.mjs",
        import.meta.url
      ).toString();
    }

    const loadingTask = pdfjs.getDocument({ data: bytes.slice() });
    const document = await loadingTask.promise;

    try {
      for (let pageNumber = 1; pageNumber <= document.numPages; pageNumber += 1) {
        const page = await document.getPage(pageNumber);
        const textContent = await page.getTextContent();
        const pageText = textContent.items
          .map((item) => (typeof item.str === "string" ? item.str : ""))
          .join("");

        if (containsTransferDestinationNoticeText(pageText)) {
          return true;
        }
      }
    } finally {
      await document.destroy();
    }
  } catch {
    return false;
  }

  return false;
};
