import test from "node:test";
import assert from "node:assert/strict";

const toFullWidthAlphabet = (rawValue) => {
  return rawValue.replace(/[A-Za-z]/g, (char) =>
    String.fromCharCode(char.charCodeAt(0) + 0xfee0)
  );
};

const normalizeBuildingValue = (rawValue) => {
  return toFullWidthAlphabet(rawValue);
};

test("建物名の数字は半角化せず入力幅を維持する", () => {
  assert.equal(normalizeBuildingValue("１０１"), "１０１");
  assert.equal(normalizeBuildingValue("101"), "101");
  assert.equal(normalizeBuildingValue("１０1"), "１０1");
});

test("建物名の英字だけ全角化する", () => {
  assert.equal(normalizeBuildingValue("A101"), "Ａ101");
  assert.equal(normalizeBuildingValue("Ａ101"), "Ａ101");
  assert.equal(normalizeBuildingValue("B棟"), "Ｂ棟");
});
