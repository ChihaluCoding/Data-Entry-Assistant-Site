import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const dataEntryFormSource = readFileSync(
  new URL("../src/app/components/DataEntryForm.tsx", import.meta.url),
  "utf8"
);

test("基本モードのD列は読み込み中PDFファイル名を優先する", () => {
  assert.match(
    dataEntryFormSource,
    /const currentPdfFileName = currentPdfFileNameRef\.current\.trim\(\) \|\| pdfFileName\.trim\(\);/
  );
  assert.match(
    dataEntryFormSource,
    /const defaultDColumnValue = isSecondaryMapping \? basicEntry\.name : integratedAddress;/
  );
  assert.match(dataEntryFormSource, /D: currentPdfFileName \|\| defaultDColumnValue,/);
});

test("PDFキャッシュはBlobとファイル名を保存・復元する", () => {
  assert.match(
    dataEntryFormSource,
    /const saveReloadPdfBlob = async \(blob: Blob, fileName: string\): Promise<void>/
  );
  assert.match(dataEntryFormSource, /store\.put\({ id: RELOAD_PDF_RECORD_KEY, blob, fileName }\);/);
  assert.match(dataEntryFormSource, /const loadReloadPdfRecord = async \(\): Promise<ReloadPdfRecord \| null>/);
  assert.match(dataEntryFormSource, /setPdfFileName\(fileName\);/);
});
