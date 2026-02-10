# Frontend migration workspace

このディレクトリは、MPA -> SPA 置き換え用の React + Tailwind 実装を段階移行するための作業領域です。

## 方針
1. API契約(`/api/members`, `/api/members/{id}`)は固定。
2. デザインは既存 `app.css` を利用して差分最小で維持。
3. Nodeがローカルにない場合は GitHub Actions で `dist` を生成し artifact を利用。

## Build artifact
- GitHub Actions: `.github/workflows/frontend-build.yml`
- 出力 artifact: `frontend/dist`

## Spring への配置先（重要）
- **配置先は `regist/src/main/resources/static/spa/`** です。
- `entry.js` / `entry.css` を含む `frontend/dist` の中身をそのまま `static/spa/` 配下へ配置してください。
- `regist/src/main/resources/` 直下に置いても Spring の静的配信対象にならず、`/spa/entry.js` が 404 になります。
- ローカルで自動コピーする場合は `frontend/scripts/build-and-export.mjs` を利用してください。
