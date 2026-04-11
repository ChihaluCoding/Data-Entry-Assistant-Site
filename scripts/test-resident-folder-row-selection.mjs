import test from "node:test";
import assert from "node:assert/strict";

function resolveResidentFolderWriteStartRow({
  sheetRows,
  startRow,
  columnCount,
}) {
  const targetStartIndex = 2;
  const targetEndIndex = targetStartIndex + Math.max(1, Math.floor(Number(columnCount) || 3)) - 1;
  const normalizedRows = Array.isArray(sheetRows) ? sheetRows : [];

  for (let rowIndex = startRow - 1; rowIndex < normalizedRows.length; rowIndex += 1) {
    const row = normalizedRows[rowIndex] || [];
    const targetValues = row.slice(targetStartIndex, targetEndIndex + 1);
    const hasValue = targetValues.some((value) => String(value || "").trim() !== "");
    if (!hasValue) {
      return rowIndex + 1;
    }
  }

  return normalizedRows.length + 1;
}

function createSheetRows(totalRows) {
  return Array.from({ length: totalRows }, () => Array.from({ length: 8 }, () => ""));
}

test("C:E モードでは C:E に既存値がある行を飛ばす", () => {
  const sheetRows = createSheetRows(8);
  sheetRows[5][2] = "既存C";

  assert.equal(
    resolveResidentFolderWriteStartRow({
      sheetRows,
      startRow: 6,
      columnCount: 3,
    }),
    7
  );
});

test("対象外列に値があっても対象列が空ならその行を使う", () => {
  const sheetRows = createSheetRows(8);
  sheetRows[5][0] = "氏名";
  sheetRows[5][1] = "かな";

  assert.equal(
    resolveResidentFolderWriteStartRow({
      sheetRows,
      startRow: 6,
      columnCount: 3,
    }),
    6
  );
});

test("最初の空行だけを返し、後続行の埋まり具合は見ない", () => {
  const sheetRows = createSheetRows(10);
  sheetRows[6][2] = "後続行の既存値";

  assert.equal(
    resolveResidentFolderWriteStartRow({
      sheetRows,
      startRow: 6,
      columnCount: 3,
    }),
    6
  );
});
