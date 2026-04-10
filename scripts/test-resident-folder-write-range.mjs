import test from "node:test";
import assert from "node:assert/strict";

function normalizeCell(value) {
  return String(value || "").trim();
}

function rowHasValueOutsideWriteColumns(row, startColumn, endColumn) {
  return row.some((value, index) => {
    const column = index + 1;
    if (column >= startColumn && column <= endColumn) {
      return false;
    }
    return normalizeCell(value) !== "";
  });
}

function findFirstWritableResidentFolderRow(rows, startRow, rowsNeeded, startColumn, endColumn) {
  for (let rowIndex = 0; rowIndex <= rows.length - rowsNeeded; rowIndex += 1) {
    let isWritableBlock = true;
    for (let offset = 0; offset < rowsNeeded; offset += 1) {
      if (rowHasValueOutsideWriteColumns(rows[rowIndex + offset], startColumn, endColumn)) {
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

test("C:E モードでは F 列に値がある行を再利用しない", () => {
  const rows = [["", "", "oldC", "oldD", "oldE", "Fあり", ""]];
  assert.equal(findFirstWritableResidentFolderRow(rows, 6, 1, 3, 5), 7);
});

test("C:F モードでは F 列に値があっても再利用できる", () => {
  const rows = [["", "", "oldC", "oldD", "oldE", "Fあり", ""]];
  assert.equal(findFirstWritableResidentFolderRow(rows, 6, 1, 3, 6), 6);
});

test("C:F モードでも G 列以降に値がある行は再利用しない", () => {
  const rows = [["", "", "oldC", "oldD", "oldE", "", "Gあり"]];
  assert.equal(findFirstWritableResidentFolderRow(rows, 6, 1, 3, 6), 7);
});
