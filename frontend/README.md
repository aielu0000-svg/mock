# Frontend migration workspace

このディレクトリは、MPA -> SPA 置き換え用の React + Tailwind 実装を段階移行するための作業領域です。

## 方針
1. API契約(`/api/members`, `/api/members/{id}`)は固定。
2. デザインは `src/shared/styles/legacy-app.css`（MPA由来CSSを移植）で維持。
3. Nodeがローカルにない場合は GitHub Actions で `dist` を生成し artifact を利用。
4. ヘッドレスUIは将来的に shadcn/ui 導入を想定（現状は既存CSS資産を優先）。

## Build artifact
- GitHub Actions: `.github/workflows/frontend-build.yml`
- 出力 artifact: `frontend/dist`

## Spring への配置先（重要）
- **配置先は `regist/src/main/resources/static/spa/`** です。
- リポジトリには空ディレクトリ維持用の `regist/src/main/resources/static/spa/.gitkeep` を配置済みです。
- `entry.js` / `entry.css` を含む `frontend/dist` の中身をそのまま `static/spa/` 配下へ配置してください。
- ローカルで自動コピーする場合は `frontend/scripts/build-and-export.mjs` を利用してください。
