import assert from "node:assert/strict";

import {
  buildSheetUrlWithGid,
  extractGoogleSheetId,
  normalizeSheetUrl,
} from "../src/app/lib/googleSheet.ts";

const fixtureId = "1EScIk20fx6oTDj43-xF0LeHYJzCUSNp2dMlNvHOsIRU";

const extractionCases = [
  {
    label: "通常の edit URL",
    input: `https://docs.google.com/spreadsheets/d/${fixtureId}/edit?usp=sharing`,
    expected: fixtureId,
  },
  {
    label: "hash 付き URL",
    input: `https://docs.google.com/spreadsheets/d/${fixtureId}/edit#gid=123456`,
    expected: fixtureId,
  },
  {
    label: "preview URL",
    input: `https://docs.google.com/spreadsheets/d/${fixtureId}/preview`,
    expected: fixtureId,
  },
  {
    label: "id クエリ付き URL",
    input: `https://docs.google.com/spreadsheets/u/0/?id=${fixtureId}&usp=sharing`,
    expected: fixtureId,
  },
  {
    label: "生のシートID",
    input: fixtureId,
    expected: fixtureId,
  },
];

for (const testCase of extractionCases) {
  assert.equal(
    extractGoogleSheetId(testCase.input),
    testCase.expected,
    `${testCase.label} でシートIDを取得できません`
  );
}

assert.equal(
  normalizeSheetUrl(
    `https://docs.google.com/spreadsheets/d/${fixtureId}/pubhtml?gid=0&single=true`
  ),
  `https://docs.google.com/spreadsheets/d/${fixtureId}/edit?gid=0&single=true`,
  "pubhtml URL の正規化に失敗しました"
);

assert.equal(
  buildSheetUrlWithGid(
    `https://docs.google.com/spreadsheets/d/${fixtureId}/edit?usp=sharing`,
    "456"
  ),
  `https://docs.google.com/spreadsheets/d/${fixtureId}/edit?usp=sharing&gid=456`,
  "gid 付き URL の組み立てに失敗しました"
);

console.log("sheet-id extraction verification passed");
