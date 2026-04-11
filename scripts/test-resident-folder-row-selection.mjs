import test from "node:test";
import assert from "node:assert/strict";

function resolveResidentFolderWriteStartRow({
  sheetRows,
  startRow,
  rowsNeeded,
  writeToColumnF,
}) {
  const targetStartIndex = 2;
  const targetEndIndex = writeToColumnF ? 5 : 4;
  const needed = Math.max(1, Math.floor(Number(rowsNeeded) || 1));
  const normalizedRows = Array.isArray(sheetRows) ? sheetRows : [];

  for (let rowIndex = startRow - 1; rowIndex <= normalizedRows.length - needed; rowIndex += 1) {
    let canUseBlock = true;

    for (let offset = 0; offset < needed; offset += 1) {
      const row = normalizedRows[rowIndex + offset] || [];
      const targetValues = row.slice(targetStartIndex, targetEndIndex + 1);
      const hasValue = targetValues.some((value) => String(value || "").trim() !== "");
      if (hasValue) {
        canUseBlock = false;
        break;
      }
    }

    if (canUseBlock) {
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
      rowsNeeded: 1,
      writeToColumnF: false,
    }),
    7
  );
});

test("C:F モードでは F 列だけ埋まっていてもその行を飛ばす", () => {
  const sheetRows = createSheetRows(8);
  sheetRows[5][5] = "既存F";

  assert.equal(
    resolveResidentFolderWriteStartRow({
      sheetRows,
      startRow: 6,
      rowsNeeded: 1,
      writeToColumnF: true,
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
      rowsNeeded: 1,
      writeToColumnF: false,
    }),
    6
  );
});

test("複数行書き込みでは連続で空いている最初のブロックを探す", () => {
  const sheetRows = createSheetRows(10);
  sheetRows[6][2] = "既存C";

  assert.equal(
    resolveResidentFolderWriteStartRow({
      sheetRows,
      startRow: 6,
      rowsNeeded: 2,
      writeToColumnF: false,
    }),
    8
  );
});
