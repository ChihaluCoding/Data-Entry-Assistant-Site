import test from "node:test";
import assert from "node:assert/strict";

import {
  copyDepartValueToRegistryField,
  isResidentEditableNameField,
  syncCheckedRegistryFieldsWithDepart,
  toFullWidthSpace,
} from "../src/app/lib/residentFormHelpers.js";

const createResidentFormData = (overrides = {}) => ({
  residentSelfName: "",
  departName: "",
  departPrefecture: "",
  departCity: "",
  departTown: "",
  departOoaza: "",
  departAza: "",
  departKoaza: "",
  departBanchi: "",
  departBuilding: "",
  registryName: "",
  registryPrefecture: "",
  registryCity: "",
  registryTown: "",
  registryOoaza: "",
  registryAza: "",
  registryKoaza: "",
  registryBanchi: "",
  registryBuilding: "",
  residentAlias: "",
  ...overrides,
});

test("本籍同期チェックONの欄は転出欄の値へ追従する", () => {
  const formData = createResidentFormData({
    departName: "山田　太郎",
    departPrefecture: "東京都",
    registryName: "旧氏名",
    registryPrefecture: "大阪府",
  });

  const result = syncCheckedRegistryFieldsWithDepart(formData, {
    registryName: true,
    registryPrefecture: true,
  });

  assert.equal(result.registryName, "山田　太郎");
  assert.equal(result.registryPrefecture, "東京都");
});

test("本籍同期チェックOFFの欄と未定義欄は変更しない", () => {
  const formData = createResidentFormData({
    departCity: "新宿区",
    registryCity: "渋谷区",
    registryTown: "本町",
  });

  const result = syncCheckedRegistryFieldsWithDepart(formData, {
    registryCity: false,
  });

  assert.equal(result.registryCity, "渋谷区");
  assert.equal(result.registryTown, "本町");
});

test("チェックON時は指定した本籍欄へ対応する転出欄の現在値を反映する", () => {
  const formData = createResidentFormData({
    departBanchi: "１－２",
    registryBanchi: "",
  });

  const result = copyDepartValueToRegistryField(formData, "registryBanchi");

  assert.equal(result.registryBanchi, "１－２");
});

test("存在しない本籍同期欄を指定しても入力値を変更しない", () => {
  const formData = createResidentFormData({
    departBuilding: "Ａ101",
    registryBuilding: "Ｂ202",
  });

  const result = copyDepartValueToRegistryField(formData, "residentAlias");

  assert.deepEqual(result, formData);
});

test("自分の名前以外の住民票名前欄は半角空白を全角空白へ変換する対象になる", () => {
  assert.equal(isResidentEditableNameField("departName"), true);
  assert.equal(isResidentEditableNameField("registryName"), true);
  assert.equal(isResidentEditableNameField("residentSelfName"), false);
  assert.equal(toFullWidthSpace("山田 太郎"), "山田　太郎");
});
