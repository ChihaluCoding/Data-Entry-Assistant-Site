# 仕様書: 住民票フォルダ書き込み関連を元の版へ戻す（2026-04-11）

## 背景
- Apps Script に貼る `Code.gs` は、住民票フォルダ書き込みの特殊判定を入れる前の版へ戻したい。
- ユーザーが提示した元コードは、`C:D:E` 固定で空行へ追記する単純な実装である。

## スコープ
- [`resident-sheet-webhook-setup-20260303.md`](guidelines/resident-sheet-webhook-setup-20260303.md) 内の `Code.gs` サンプルを、元の版へ戻す。
- `handleAppendResidentFolderRows` は `C:D:E` 固定で `findFirstEmptyRowInColumns(sheet, startRow, 3, 3)` を使う。
- `findFirstEmptyBlockInColumns` の説明用コードは削除する。
- フロント側の `住民票フォルダ書き込みをC:Fにする` 設定、関連ペイロード、関連仕様書を削除する。

## 制約
- 住民票フォルダ書き込みは `C:D:E` 固定に戻す。
- 既存の他モードの書き込み仕様は変更しない。

## 受け入れ基準
- ガイド内の `handleAppendResidentFolderRows` に `writeToColumnF` が存在しない。
- ガイド内の住民票フォルダ書き込みは `C:D:E` のみを書き込む。
- ガイド内に `findFirstEmptyBlockInColumns` が存在しない。
- フロント側に `住民票フォルダ書き込みをC:Fにする` が存在しない。
- フロント側の住民票フォルダ書き込み payload に `writeToColumnF` が存在しない。

## 非スコープ
- 実運用中の Apps Script デプロイ作業
