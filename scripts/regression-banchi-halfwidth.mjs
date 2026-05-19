import assert from "node:assert/strict";

import { normalizeBanchiValueAsHalfWidth } from "../src/app/lib/banchiNormalization.js";

const cases = [
  {
    name: "全角数字と丁目番号の区切りは半角ハイフンへ正規化される",
    input: "１丁目７番１号",
    expected: "1－7－1",
  },
  {
    name: "丁目の漢数字は消えずに数字へ正規化される（回帰）",
    input: "一丁目１２３４番",
    expected: "1－1234",
  },
  {
    name: "番地入力中の空白は削除される",
    input: "一 丁目 １２３４ 番",
    expected: "1－1234",
  },
  {
    name: "全角英字と全角ハイフンは半角化される",
    input: "Ａ－１２",
    expected: "A－12",
  },
  {
    name: "IMEの長音記号ーも半角ハイフンへ正規化される（回帰）",
    input: "１ー２",
    expected: "1－2",
  },
  {
    name: "番地の末尾区切りは取り除かれる",
    input: "1番地",
    expected: "1",
  },
  {
    name: "ひらがなの番地区切りも全角マイナスへ正規化される",
    input: "3ちょうめ42ばん19ごう",
    expected: "3－42－19",
  },
  {
    name: "丁目番号以外の漢字も全角マイナスへ正規化される",
    input: "3甲42乙19丙50",
    expected: "3－42－19－50",
  },
  {
    name: "長音や半角ハイフン以外のダッシュも全角マイナスへ正規化される",
    input: "1―2",
    expected: "1－2",
  },
  {
    name: "空白だけの入力は空文字になる（異常系）",
    input: "  　",
    expected: "",
  },
];

for (const testCase of cases) {
  const actual = normalizeBanchiValueAsHalfWidth(testCase.input);
  assert.equal(actual, testCase.expected, testCase.name);
}

console.log("banchi halfwidth regression: ok");
