import test from "node:test";
import assert from "node:assert/strict";

function normalizeCell(value) {
  return String(value || "").trim();
}

function rowHasValueOutsideCe(row) {
  return row.some((value, index) => {
    const column = index + 1;
    if (column >= 3 && column <= 5) {
      return false;
    }
    return normalizeCell(value) !== "";
  });
}

function findFirstWritableResidentFolderRow(rows, startRow, rowsNeeded) {
  for (let rowIndex = 0; rowIndex <= rows.length - rowsNeeded; rowIndex += 1) {
    let isWritableBlock = true;
    for (let offset = 0; offset < rowsNeeded; offset += 1) {
      if (rowHasValueOutsideCe(rows[rowIndex + offset])) {
        isWritableBlock = false;
        break;
      }
    }
    if (isWritableBlock) {
      return startRow + rowIndex;
    }
  }
  return startRow + rows.length;
}

test("C:E だけ既存値の行は再利用対象になる", () => {
  const rows = [
    ["", "", "oldC", "oldD", "oldE", "", ""],
    ["", "", "", "", "", "", ""],
  ];
  assert.equal(findFirstWritableResidentFolderRow(rows, 6, 1), 6);
});

test("C:E 以外に値がある行は従来どおりスキップする", () => {
  const rows = [
    ["", "Bあり", "oldC", "oldD", "oldE", "", ""],
    ["", "", "", "", "", "", ""],
  ];
  assert.equal(findFirstWritableResidentFolderRow(rows, 6, 1), 7);
});

test("複数行書き込みは連続して再利用可能なブロックを探す", () => {
  const rows = [
    ["", "", "old1", "old1", "old1", "", ""],
    ["", "Bあり", "", "", "", "", ""],
    ["", "", "old3", "old3", "old3", "", ""],
    ["", "", "", "", "", "", ""],
  ];
  assert.equal(findFirstWritableResidentFolderRow(rows, 6, 2), 8);
});
