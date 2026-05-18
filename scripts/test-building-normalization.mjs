import test from "node:test";
import assert from "node:assert/strict";
import {
  normalizeBuildingSelectedSpacingAndDash,
  normalizeBuildingValue,
} from "../src/app/lib/buildingNormalization.js";

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

test("建物名の選択範囲だけ空白とハイフン系記号を全角化する", () => {
  assert.deepEqual(
    normalizeBuildingSelectedSpacingAndDash("A-101 2号", 1, 6),
    {
      value: "A－101　2号",
      selectionStart: 1,
      selectionEnd: 6,
      changed: true,
    }
  );
  assert.deepEqual(
    normalizeBuildingSelectedSpacingAndDash("メゾンｰAーB", 3, 7),
    {
      value: "メゾン－A－B",
      selectionStart: 3,
      selectionEnd: 7,
      changed: true,
    }
  );
});

test("建物名の選択範囲がない場合は変更しない", () => {
  assert.deepEqual(
    normalizeBuildingSelectedSpacingAndDash("A-101 2号", 3, 3),
    {
      value: "A-101 2号",
      selectionStart: 3,
      selectionEnd: 3,
      changed: false,
    }
  );
});
