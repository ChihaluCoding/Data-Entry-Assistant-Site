import test from "node:test";
import assert from "node:assert/strict";

function resolveResidentFolderWriteStartRow({
  sheetRows,
  startRow,
  rowsNeeded,
  writeToColumnF,
}) {
  const normalizedRows = Array.isArray(sheetRows) ? sheetRows : [];
  const needed = Math.max(1, Math.floor(Number(rowsNeeded) || 1));
  const targetStartColumn = 3;
  const targetEndColumn = writeToColumnF ? 6 : 5;

  for (let rowIndex = startRow - 1; rowIndex <= normalizedRows.length - needed; rowIndex += 1) {
    let canUseBlock = true;

    for (let offset = 0; offset < needed; offset += 1) {
      const row = normalizedRows[rowIndex + offset] || [];
      const hasValueOutsideTargetColumns = row.some((value, index) => {
        const column = index + 1;
        if (column >= targetStartColumn && column <= targetEndColumn) {
          return false;
        }
        return String(value || "").trim() !== "";
      });

      if (hasValueOutsideTargetColumns) {
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

test("C:E モードでは C:E に既存値があってもその行を再利用する", () => {
  const sheetRows = createSheetRows(8);
  sheetRows[5][2] = "既存C";
  sheetRows[5][3] = "既存D";
  sheetRows[5][4] = "既存E";

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

test("C:F モードでは F 列に既存値があってもその行を再利用する", () => {
  const sheetRows = createSheetRows(8);
  sheetRows[5][5] = "既存F";

  assert.equal(
    resolveResidentFolderWriteStartRow({
      sheetRows,
      startRow: 6,
      rowsNeeded: 1,
      writeToColumnF: true,
    }),
    6
  );
});

test("対象外列に値がある行は従来どおりスキップする", () => {
  const sheetRows = createSheetRows(8);
  sheetRows[5][0] = "氏名";

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

test("複数行書き込みでは対象外列が空の連続ブロックを探す", () => {
  const sheetRows = createSheetRows(10);
  sheetRows[5][2] = "既存C";
  sheetRows[6][0] = "他列あり";

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
