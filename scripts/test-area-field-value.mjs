import test from "node:test";
import assert from "node:assert/strict";

import {
  formatAreaFieldValue,
  resolveAreaFieldValue,
} from "../src/app/lib/areaFieldValue.js";

test("大字欄はIME確定後に接頭語を付ける", () => {
  assert.equal(resolveAreaFieldValue("ooaza", "あさひ", false), "大字あさひ");
});

test("IME変換中の大字欄は生値を保持する", () => {
  assert.equal(resolveAreaFieldValue("ooaza", "あ", true), "あ");
});

test("既存の接頭語は重複しない", () => {
  assert.equal(formatAreaFieldValue("registryKoaza", "小字中央"), "小字中央");
});

test("空文字は空文字のまま返す", () => {
  assert.equal(formatAreaFieldValue("aza", "   "), "");
});
