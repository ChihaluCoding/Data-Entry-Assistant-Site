# 大字・字・小字の自動接頭語付与仕様（2026-03-03）

## 対象
- `src/app/components/DataEntryForm.tsx`
- `guidelines/spec-auto-prefix-ooaza-aza-koaza-20260303.md`
- `package.json`
- `package-lock.json`

## スコープ
- 基本モードと住民票モードの対象フィールドで、入力値に接頭語を自動付与する。
  - 大字系: `大字`
  - 字系: `字`
  - 小字系: `小字`
- 既に接頭語が入力済みの場合は重複しないように正規化する。

## 制約
- 既存の住所補完、保存、書き込み、コピー機能を壊さない。
- 接頭語対象以外のフィールド挙動は変更しない。
- IME変換中は入力値をそのまま保持し、変換確定後にのみ接頭語を正規化する。

## 受け入れ条件
- 基本モード `ooaza/aza/koaza` でIME未確定中は入力途中の文字が勝手に確定されない。
- 基本モード `ooaza/aza/koaza` でIME確定後に `大字/字/小字` が自動で先頭に付与される。
- 住民票モード `departOoaza/departAza/departKoaza/registryOoaza/registryAza/registryKoaza` でも同様に付与される。
- 同じ接頭語が二重三重に付かない。
- `npm run build` が成功する。

## 非対象
- 番地・建物名など他フィールドの表記ルール変更
