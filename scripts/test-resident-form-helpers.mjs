import test from "node:test";
import assert from "node:assert/strict";

import {
  copyDepartValueToRegistryField,
  getGivenNameFromResidentName,
  getSurnameFromResidentName,
  isResidentEditableNameField,
  normalizeRegistryNameInputWithSyncedSurname,
  syncRegistrySurnameWithDepartName,
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

test("本籍名前の苗字だけ同期は転出名の全角空白より前を苗字として使う", () => {
  const formData = createResidentFormData({
    departName: "山田　太郎",
    registryName: "田中　花子",
  });

  const result = syncRegistrySurnameWithDepartName(formData);

  assert.equal(result.registryName, "山田　花子");
});

test("本籍名前の苗字だけ同期ON中は転出名の苗字変更だけが追従する", () => {
  const formData = createResidentFormData({
    departName: "佐藤　太郎",
    registryName: "山田　花子",
  });

  const result = syncCheckedRegistryFieldsWithDepart(formData, {}, {
    isRegistrySurnameSyncEnabled: true,
  });

  assert.equal(result.registryName, "佐藤　花子");
});

test("本籍名前の苗字だけ同期ON中は名だけの入力を転出苗字付きで保持する", () => {
  assert.equal(
    normalizeRegistryNameInputWithSyncedSurname("花子", "山田　太郎"),
    "山田　花子"
  );
});

test("本籍名前の苗字だけ同期ON中は転出苗字に続けて入力した名も保持する", () => {
  assert.equal(
    normalizeRegistryNameInputWithSyncedSurname("山田花子", "山田　太郎"),
    "山田　花子"
  );
});

test("本籍名前の苗字だけ同期ON中でも全角空白付きの手入力名を保持する", () => {
  assert.equal(
    normalizeRegistryNameInputWithSyncedSurname("田中　花子", "山田　太郎"),
    "山田　花子"
  );
});

test("本籍名前全体同期がONの場合は苗字だけ同期より全体同期を優先する", () => {
  const formData = createResidentFormData({
    departName: "佐藤　太郎",
    registryName: "山田　花子",
  });

  const result = syncCheckedRegistryFieldsWithDepart(
    formData,
    { registryName: true },
    { isRegistrySurnameSyncEnabled: true }
  );

  assert.equal(result.registryName, "佐藤　太郎");
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

test("全角空白がない名前は名前全体を苗字として判定し、名は空として扱う", () => {
  assert.equal(getSurnameFromResidentName("山田太郎"), "山田太郎");
  assert.equal(getGivenNameFromResidentName("山田太郎"), "");
});
