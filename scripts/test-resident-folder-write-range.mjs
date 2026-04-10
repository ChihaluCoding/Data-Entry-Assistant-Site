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

test("C:F モードの列数は C:E モードより1列多い", () => {
  assert.equal(getResidentFolderWriteColumnCount(true) > getResidentFolderWriteColumnCount(false), true);
});
