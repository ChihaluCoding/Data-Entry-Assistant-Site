# 仕様書: 住民票Webhook URL更新（2026-04-11）

## 対象
- `.env`

## スコープ
- `VITE_RESIDENT_SHEET_WEBHOOK_URL` を、指定された Apps Script Web アプリの `/exec` URL に更新する。

## 制約
- 他の環境変数は変更しない。
- URL文字列は共有された値をそのまま使用する。

## 受け入れ条件
- `.env` の `VITE_RESIDENT_SHEET_WEBHOOK_URL` が指定URLへ更新されている。

## 非対象
- Apps Script 側コード変更
- フロントエンド機能変更
