import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const dataEntryFormSource = readFileSync(
  new URL("../src/app/components/DataEntryForm.tsx", import.meta.url),
  "utf8"
);
const packageJsonSource = readFileSync(
  new URL("../package.json", import.meta.url),
  "utf8"
);

test("PDF文字抽出/OCR機能が画面と直接依存から削除されている", () => {
  const removedSourcePatterns = [
    "extractPdfTextWithOptionalOcr",
    "pdfTextRecognition",
    "文字抽出",
    "OCR",
    "pdfRecognized",
    "pdfRecognition",
    "PdfTextRecognition",
  ];

  for (const pattern of removedSourcePatterns) {
    assert.equal(
      dataEntryFormSource.includes(pattern),
      false,
      `${pattern} が DataEntryForm に残っています`
    );
  }

  assert.equal(packageJsonSource.includes("tesseract.js"), false);
  assert.equal(packageJsonSource.includes('"pdfjs-dist"'), false);
  assert.equal(packageJsonSource.includes("test:pdf-text-recognition"), false);
});
