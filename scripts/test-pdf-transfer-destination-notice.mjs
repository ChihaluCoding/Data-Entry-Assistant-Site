import test from "node:test";
import assert from "node:assert/strict";

import {
  containsTransferDestinationNoticeText,
  detectPdfTransferDestinationNotice,
} from "../src/app/lib/pdfTransferDestinationNotice.js";

test("PDF判定対象文言を含む文字列を検知する", () => {
  assert.equal(containsTransferDestinationNoticeText("申請書 転出先が判明 済"), true);
});

test("PDF判定対象文言を含まない文字列は検知しない", () => {
  assert.equal(containsTransferDestinationNoticeText("申請書 転出予定なし"), false);
});

test("PDF判定対象文言を含むBlobを検知する", async () => {
  const blob = new Blob(["%PDF-1.7\n% 転出先が判明\n"]);

  assert.equal(await detectPdfTransferDestinationNotice(blob), true);
});

test("PDF判定対象文言を含まないBlobは検知しない", async () => {
  const blob = new Blob(["%PDF-1.7\n% 通常の申請書\n"]);

  assert.equal(await detectPdfTransferDestinationNotice(blob), false);
});
