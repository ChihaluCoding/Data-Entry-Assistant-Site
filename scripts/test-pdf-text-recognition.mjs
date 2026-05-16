import test from "node:test";
import assert from "node:assert/strict";

import {
  buildPdfTextRecognitionMessage,
  normalizePdfTextItems,
  shouldUseOcrFallback,
} from "../src/app/lib/pdfTextRecognition.js";

test("PDFテキスト項目を表示用テキストへ整形する", () => {
  const result = normalizePdfTextItems([
    { str: "山田" },
    { str: "　太郎" },
    { str: "" },
    { str: "東京都" },
  ]);

  assert.equal(result, "山田　太郎 東京都");
});

test("PDF内テキストが少ない場合だけOCRフォールバック対象にする", () => {
  assert.equal(shouldUseOcrFallback("短い", 20), true);
  assert.equal(
    shouldUseOcrFallback("十分な文字数があるPDF内テキストです。OCRは不要です。", 20),
    false
  );
});

test("PDF文字抽出結果のメッセージを生成する", () => {
  assert.equal(
    buildPdfTextRecognitionMessage({
      source: "embedded",
      pageCount: 2,
      embeddedTextLength: 123,
      ocrPageCount: 0,
    }),
    "PDF内テキストを抽出しました（2ページ、123文字）。"
  );
  assert.equal(
    buildPdfTextRecognitionMessage({
      source: "ocr",
      pageCount: 3,
      embeddedTextLength: 0,
      ocrPageCount: 1,
    }),
    "PDF内テキストが少ないため、先頭1ページをOCRしました。"
  );
});
