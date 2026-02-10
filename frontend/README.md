# Frontend migration workspace

このディレクトリは、MPA -> SPA 置き換え用の React + Tailwind 実装を段階移行するための作業領域です。

## 方針
1. API契約(`/api/members`, `/api/members/{id}`)は固定。
2. デザインは既存 `app.css` を利用して差分最小で維持。
3. Nodeがローカルにない場合は GitHub Actions で `dist` を生成し artifact を利用。

## Build artifact
- GitHub Actions: `.github/workflows/frontend-build.yml`
- 出力: `frontend/dist`
