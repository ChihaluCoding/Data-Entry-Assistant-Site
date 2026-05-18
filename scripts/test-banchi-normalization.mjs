import test from "node:test";
import assert from "node:assert/strict";

import {
  applyBanchiCalculatorKey,
  normalizeBanchiValueForInputAsFullWidth,
  normalizeBanchiValueForInputAsHalfWidth,
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
  assert.equal(normalizeBanchiValueAsFullWidth("3甲42乙19丙50"), "３－４２－１９－５０");
});

test("番地のダッシュ類はすべて全角マイナスへ統一する", () => {
  assert.equal(normalizeBanchiValueAsFullWidth("1-2"), "１－２");
  assert.equal(normalizeBanchiValueAsFullWidth("1ー2"), "１－２");
  assert.equal(normalizeBanchiValueAsFullWidth("1―2"), "１－２");
  assert.equal(normalizeBanchiValueAsHalfWidth("1-2"), "1－2");
  assert.equal(normalizeBanchiValueAsHalfWidth("1ー2"), "1－2");
  assert.equal(normalizeBanchiValueAsHalfWidth("1―2"), "1－2");
});

test("基本モード向け番地は英数字を半角維持しつつ漢字を全角マイナスへ統一する", () => {
  assert.equal(normalizeBanchiValueAsHalfWidth("１－２"), "1－2");
  assert.equal(normalizeBanchiValueAsHalfWidth("Ａー１２"), "A－12");
  assert.equal(normalizeBanchiValueAsHalfWidth("3丁目42番19－50"), "3－42－19－50");
  assert.equal(normalizeBanchiValueAsHalfWidth("3ちょうめ42ばん19ごう"), "3－42－19");
  assert.equal(normalizeBanchiValueAsHalfWidth("3甲42乙19丙50"), "3－42－19－50");
});

test("番地入力中は単独や末尾のハイフンを保持する", () => {
  assert.equal(normalizeBanchiValueForInputAsHalfWidth("-"), "－");
  assert.equal(normalizeBanchiValueForInputAsHalfWidth("12-"), "12－");
  assert.equal(normalizeBanchiValueForInputAsFullWidth("-"), "－");
  assert.equal(normalizeBanchiValueForInputAsFullWidth("１２-"), "１２－");
});

test("番地入力中でも貼り付け末尾の漢字区切りから生成されたハイフンは残さない", () => {
  assert.equal(normalizeBanchiValueForInputAsHalfWidth("1丁目2-3番"), "1－2－3");
  assert.equal(normalizeBanchiValueForInputAsHalfWidth("1丁目2-3番地"), "1－2－3");
  assert.equal(normalizeBanchiValueForInputAsFullWidth("1丁目2-3番"), "１－２－３");
  assert.equal(normalizeBanchiValueForInputAsFullWidth("1丁目2-3番地"), "１－２－３");
});

test("番地入力中でも貼り付け末尾のひらがな区切りから生成されたハイフンは残さない", () => {
  assert.equal(normalizeBanchiValueForInputAsHalfWidth("1ちょうめ2ばん"), "1－2");
  assert.equal(normalizeBanchiValueForInputAsFullWidth("1ちょうめ2ばん"), "１－２");
});

test("番地電卓キーは数字と区切りの追加、末尾削除、クリアができる", () => {
  assert.equal(applyBanchiCalculatorKey("", "1"), "1");
  assert.equal(applyBanchiCalculatorKey("12", "dash"), "12－");
  assert.equal(applyBanchiCalculatorKey("12－3", "backspace"), "12－");
  assert.equal(applyBanchiCalculatorKey("12－3", "clear"), "");
});

test("番地電卓キーは未定義キーでは値を変更しない", () => {
  assert.equal(applyBanchiCalculatorKey("12", "plus"), "12");
});
