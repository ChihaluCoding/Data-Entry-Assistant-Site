import test from "node:test";
import assert from "node:assert/strict";

import {
  normalizeBanchiValueAsFullWidth,
  normalizeBanchiValueAsHalfWidth,
} from "../src/app/lib/banchiNormalization.js";

test("住民票モード向け番地は半角入力でも全角化される", () => {
  assert.equal(normalizeBanchiValueAsFullWidth("1-2"), "１－２");
  assert.equal(normalizeBanchiValueAsFullWidth("A-12"), "Ａ－１２");
});

test("住民票モード向け番地はIMEの長音記号も全角ハイフンへ統一する", () => {
  assert.equal(normalizeBanchiValueAsFullWidth("1ー2"), "１－２");
});

test("住民票モード向け番地は丁目や番も全角ハイフンへ統一する", () => {
  assert.equal(normalizeBanchiValueAsFullWidth("3丁目42番19－50"), "３－４２－１９－５０");
  assert.equal(normalizeBanchiValueAsFullWidth("3ちょうめ42ばん19ごう"), "３－４２－１９");
  assert.equal(normalizeBanchiValueAsFullWidth("1番地"), "１");
  assert.equal(normalizeBanchiValueAsFullWidth("1ばんち"), "１");
});

test("基本モード向け番地は従来どおり半角のまま維持する", () => {
  assert.equal(normalizeBanchiValueAsHalfWidth("１－２"), "1－2");
  assert.equal(normalizeBanchiValueAsHalfWidth("Ａー１２"), "A－12");
  assert.equal(normalizeBanchiValueAsHalfWidth("3丁目42番19－50"), "3－42－19－50");
  assert.equal(normalizeBanchiValueAsHalfWidth("3ちょうめ42ばん19ごう"), "3－42－19");
});
