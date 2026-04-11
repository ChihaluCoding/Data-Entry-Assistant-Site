import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";

test("DataEntryForm に selectedSheetIdByMode 参照が残っていない", () => {
  const source = fs.readFileSync(
    new URL("../src/app/components/DataEntryForm.tsx", import.meta.url),
    "utf8"
  );

  assert.equal(source.includes("selectedSheetIdByMode"), false);
});
