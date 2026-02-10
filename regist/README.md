# regist (backend)

Spring Boot API + SPA静的配信の構成です。

## 現在の構成
- SPA配信: `src/main/resources/static/spa/`
- 画像などの静的資産: `src/main/resources/static/`
- API: `src/main/java/ninsho/regist/api/`
- SPAエントリへのフォワード: `src/main/java/ninsho/regist/web/PageController.java`

## エンドポイント
- `POST /api/members`
- `GET /api/members/{id}`
- `GET /`, `GET /signup`, `GET /member/{id}/edit` は SPA エントリにフォワード

## 備考
- 旧MPAテンプレート/JSは削除済みです。
- フロントエンド成果物は `frontend/dist` を `static/spa/` へ配置してください。
