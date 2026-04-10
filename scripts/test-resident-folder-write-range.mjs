import test from "node:test";
import assert from "node:assert/strict";

function getResidentFolderWriteColumnCount(writeToColumnF) {
  return writeToColumnF ? 4 : 3;
}

test("C:E モードでは3列書き込む", () => {
  assert.equal(getResidentFolderWriteColumnCount(false), 3);
});

test("C:F モードでは4列書き込む", () => {
  assert.equal(getResidentFolderWriteColumnCount(true), 4);
});

test("列数切替は開始行判定に影響しない前提", () => {
  assert.equal(getResidentFolderWriteColumnCount(true) > getResidentFolderWriteColumnCount(false), true);
});
