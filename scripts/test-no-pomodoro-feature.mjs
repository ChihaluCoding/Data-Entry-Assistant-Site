import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const dataEntryFormSource = readFileSync(
  new URL("../src/app/components/DataEntryForm.tsx", import.meta.url),
  "utf8"
);

test("DataEntryForm からポモドーロタイマー機能が削除されている", () => {
  const removedPatterns = [
    "ポモドーロタイマー",
    "pomodoro",
    "Pomodoro",
    "Timer",
    "SkipForward",
  ];

  for (const pattern of removedPatterns) {
    assert.equal(
      dataEntryFormSource.includes(pattern),
      false,
      `${pattern} が DataEntryForm に残っています`
    );
  }
});
