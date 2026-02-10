# SPAモック保守ガイド（完全版）

この文書は、`/workspace/mock` の現状実装を **自分で修正・保守し続けるための実務向けガイド** です。  
対象は以下です。

- 全体アーキテクチャ
- データ/画面の流れ
- 使用技術
- ファイルごとの責務
- 主要コードの読み方
- 「どこを直せば何が変わるか」の具体例
- 将来（Quarkus移行 / shadcn/ui導入）で壊さないための注意点

---

## 1. まず結論（このモックの姿）

- これは **API契約依存のSPA** です（理想どおり）。
- 画面は React + React Router で描画し、UIルートは Spring が `/spa/index.html` にフォワードします。
- 登録/取得は `/api/members` 契約で接続されています。
- 旧MPAテンプレートは削除され、バックエンドは「API + SPA静的配信」に整理済みです。

---

## 2. 全体構成（ディレクトリ）

```txt
.
├── frontend/                      # SPA本体（React + Vite + Tailwind）
│   ├── src/
│   │   ├── app/                   # エントリ、Router
│   │   ├── features/signup/       # 会員登録機能
│   │   └── shared/                # 共通API、共通レイアウト、共通スタイル
│   └── scripts/build-and-export.mjs
├── regist/                        # Spring Boot（API + SPA配信）
│   └── src/main/java/ninsho/regist/
│       ├── api/MemberApiController.java
│       └── web/PageController.java
└── docs/spa-maintenance-guide-ja.md
```

---

## 3. 画面・APIの流れ（重要）

### 3-1. 画面遷移

1. ユーザーが `/signup` へアクセス
2. Spring `PageController` が `/spa/index.html` を返す
3. React Router が `SignupPage` を描画
4. フォーム送信で `POST /api/members`
5. 成功レスポンスの `id` を使って `/member/{id}/edit` へ遷移
6. `MemberEditPage` が `GET /api/members/{id}` を呼び、登録内容を表示

### 3-2. API依存ポイント

- フロントが依存している契約
  - `POST /api/members`（成功時 `id`）
  - `GET /api/members/{id}`（表示用データ）
  - エラー時 `fieldErrors` 配列

この契約を維持できれば、Spring→Quarkus移行でもフロント改修を最小化できます。

---

## 4. 使用技術

- **Frontend**
  - React 18
  - React Router v6
  - TypeScript
  - Vite
  - Tailwind（基盤導入済み）
  - 既存デザイン互換CSS（`legacy-app.css`）
- **Backend**
  - Spring Boot 3
  - Spring Web
  - Validation
  - springdoc-openapi
- **運用/CI**
  - GitHub Actions（frontend build artifact出力）

> 予定: UI層は将来的に shadcn/ui を導入可能。現状は MPA互換優先で legacy CSS を使用。

---

## 5. フロントエンド詳細

## 5-1. 起動・ルーティング

- `frontend/src/app/main.tsx`
  - Reactアプリ起動
  - `RouterProvider` をアタッチ
  - `globals.css` 読み込み
- `frontend/src/app/router.tsx`
  - `createBrowserRouter(routes)` を生成
- `frontend/src/app/routes.tsx`
  - `/, /signup, /member/:id/edit` を定義
- `frontend/src/app/providers.tsx`
  - 現状は薄いラッパー（将来、QueryClient等を追加する場所）

### どこをいじると何が変わる？

- 新しい画面URLを増やす → `routes.tsx`
- 全ページ共通Provider追加（例: Zustand, React Query） → `providers.tsx`

---

## 5-2. signup機能（feature単位）

### ページ

- `pages/SignupPage.tsx`
  - 見出し、注意文、`SignupForm` を配置
- `pages/MemberEditPage.tsx`
  - 編集モック画面
  - `GET /api/members/{id}` で表示
  - `/signup` に戻るとき prefill を sessionStorage へ格納

### API層

- `api/members.types.ts`
  - 契約型（Request/Response/MemberView）
- `api/members.mappers.ts`
  - フォーム値 → APIリクエスト形に変換
- `api/createMember.ts`
  - POST 呼び出し
- `api/getMember.ts`
  - GET 呼び出し

### モデル/バリデーション

- `model/uiTypes.ts`
  - フォームUIの全フィールド定義
- `model/defaults.ts`
  - 初期値（month/day 初期 `01`）
- `model/schema.ts`
  - 現在はパスワード不一致チェック中心

### Hooks

- `hooks/useSignupForm.ts`
  - フォーム値 state 管理
  - `submitted` 管理
  - prefill読込と固定項目ロック管理
- `hooks/useRequiredRemaining.ts`
  - 残り必須件数カウント
- `hooks/usePasswordRules.ts`
  - 数字/英字/記号の判定

### コンポーネント

- `components/SignupForm.tsx`
  - 送信の中心
  - 必須エラー文言マップ
  - APIエラーの画面反映・alert表示
- セクション群
  - `sections/PersonalSection.tsx`
  - `sections/AddressSection.tsx`
  - `sections/ContactSection.tsx`
  - `sections/ConsentSection.tsx`
  - `sections/PasswordSection.tsx`
- パーツ群
  - `parts/FieldError.tsx`
  - `parts/FieldErrorSummary.tsx`
  - `parts/RequiredRemaining.tsx`
  - `parts/RequiredBadge.tsx`
  - `parts/PasswordRuleList.tsx`

### どこをいじると何が変わる？（実例）

1. 必須エラーメッセージを変更したい  
   → `SignupForm.tsx` の `REQUIRED_MESSAGES`

2. パスワードルール表示の文言/記号判定を変えたい  
   → 表示は `PasswordRuleList.tsx`、判定は `usePasswordRules.ts`

3. 項目追加（例: 職業）したい  
   - `uiTypes.ts` に追加
   - `defaults.ts` に初期値追加
   - 対応Sectionに入力欄追加
   - `members.mappers.ts` でAPIへ写像
   - バックエンドDTOと検証も追加

4. 「登録後の遷移先」を変更したい  
   → `SignupForm.tsx` の `location.href = ...`

5. 編集画面から戻るときの固定項目ルールを変えたい  
   → `useSignupForm.ts` の `lockedKeys` 判定ロジック

---

## 5-3. shared層

- `shared/api/client.ts`
  - 共通 fetch ラッパー
  - `ApiHttpError` を投げる
- `shared/api/errors.ts`
  - APIエラーから `fieldErrors` を正規化
- `shared/components/layout/AppShell.tsx`
  - Header/Main/Footer 枠
- `shared/components/layout/PageHeader.tsx`
  - JR風ヘッダUI
- `shared/styles/tokens.css`
  - デザイントークン
- `shared/styles/legacy-app.css`
  - MPA互換スタイル（大量）
- `shared/styles/globals.css`
  - tokens + legacy + tailwind directive

### どこをいじると何が変わる？

- 画面全体の共通レイアウト変更 → `AppShell.tsx`
- ヘッダのロゴ・タブ変更 → `PageHeader.tsx`
- 既存デザイン維持しつつ微調整 → `legacy-app.css`
- 将来Tailwind主導に寄せる → `globals.css`/`tokens.css` から段階移行

---

## 6. バックエンド詳細

## 6-1. エントリ/設定

- `regist/src/main/java/ninsho/regist/RegistApplication.java`
  - Spring Boot起動
- `regist/src/main/resources/application.properties`
  - DataSource/JPA自動構成を除外（このモックはDB非依存運用）

## 6-2. 画面ルート

- `regist/src/main/java/ninsho/regist/web/PageController.java`
  - `/, /signup, /member/{id}/edit` を `forward:/spa/index.html` へ統一

## 6-3. API

- `regist/src/main/java/ninsho/regist/api/MemberApiController.java`
  - `POST /api/members`
    - 必須チェック
    - 形式チェック（email, birthYear, zip）
    - パスワード一致チェック
    - 成功時 `id` 発行してメモリ保存
  - `GET /api/members/{id}`
    - メモリ保持したデータを返却

### どこをいじると何が変わる？

1. バリデーション厳格化  
   → `MemberApiController#create` のチェック追加

2. APIエラーメッセージ変更  
   → `FieldError` 生成文言を変更

3. DB化（永続化）したい  
   → `store` を Repository 実装に置換

4. ルート追加（例: `/profile`）  
   → `PageController` フォワード対象に追加 + frontend routes追加

---

## 7. ビルド/デプロイ

### frontend

- `npm run dev` : ローカル開発
- `npm run build` : `dist/` 出力
- `npm run export:spring` : buildして `regist/static/spa` へコピー

関連ファイル:
- `frontend/package.json`
- `frontend/scripts/build-and-export.mjs`
- `frontend/vite.config.ts` (`base: '/spa/'` 重要)

### backend

- Springは `static/spa` 配下の `index.html`/asset を配信
- UI URLは `PageController` 経由でSPAへフォワード

### CI

- `.github/workflows/frontend-build.yml`
  - `frontend/**` 変更時にビルド
  - `frontend/dist` を artifact化

---

## 8. 契約依存SPAとして壊れやすいポイント

1. **APIレスポンスの破壊的変更**
   - `id` の欠落
   - `fieldErrors` 形式変更

2. **配信パス変更**
   - `vite.config.ts` の `base` と Springの公開パスが不一致

3. **ルーティング差分**
   - frontend routes だけ追加して backend forward を忘れる

4. **prefillフォーマット差分**
   - `MemberEditPage` と `useSignupForm` の連携キーが崩れる

---

## 9. 変更時の実務チェックリスト

- [ ] 画面追加したら `frontend/src/app/routes.tsx` を更新
- [ ] 直アクセス対応で `PageController` のフォワード対象を更新
- [ ] API契約変更時は `members.types.ts` と backend DTOを同時更新
- [ ] バリデーション文言が画面とAPIで矛盾しないか確認
- [ ] `vite.config.ts base` と配信先パスの整合を確認
- [ ] `npm run build` / Spring起動で `/signup` と `/member/:id/edit` を手動確認

---

## 10. shadcn/ui導入に向けた段階移行案

1. まず「新規UI」だけ shadcn/ui で作成
2. 既存セクションを1つずつ置き換え
3. `legacy-app.css` 依存を徐々に減らす
4. 最後に不要クラスを削除

### 導入時に触る場所

- `frontend/src/shared/components`（共通UIを置く）
- `frontend/src/features/signup/components/sections/*`（段階置換）
- `frontend/src/shared/styles/legacy-app.css`（最終的に縮小）

---

## 11. ファイル別一覧（役割の早見表）

### frontend/app
- `main.tsx`: 起動点
- `providers.tsx`: 全体Provider
- `router.tsx`: BrowserRouter作成
- `routes.tsx`: 画面ルート定義

### frontend/features/signup/api
- `createMember.ts`: POST
- `getMember.ts`: GET
- `members.mappers.ts`: UI→API変換
- `members.types.ts`: API型定義

### frontend/features/signup/components
- `SignupForm.tsx`: 送信処理とセクション統合
- `formTypes.ts`: コンポーネント間の型
- `parts/*`: 汎用小パーツ
- `sections/*`: フォームの各領域

### frontend/features/signup/hooks
- `useSignupForm.ts`: フォーム状態管理
- `usePasswordRules.ts`: パスワード判定
- `useRequiredRemaining.ts`: 必須残件計算

### frontend/features/signup/model
- `defaults.ts`: 初期値
- `schema.ts`: クライアント側検証
- `uiTypes.ts`: UI型

### frontend/features/signup/pages
- `SignupPage.tsx`: 登録画面
- `MemberEditPage.tsx`: 編集モック画面

### frontend/shared
- `api/client.ts`: 共通fetch
- `api/errors.ts`: エラー正規化
- `components/layout/*`: レイアウト
- `styles/*`: スタイル（tokens + legacy + globals）

### regist/main
- `RegistApplication.java`: 起動
- `api/MemberApiController.java`: API本体
- `web/PageController.java`: SPAフォワード
- `application.properties`: 自動構成設定
- `resources/static/spa/.gitkeep`: 配置先キープ

### regist/test
- `RegistApplicationTests.java`: 起動確認テスト

---

## 12. 今後の保守方針（おすすめ）

- 「UI変更」と「API契約変更」をPRで分離する
- API契約破壊時は `members.types.ts` を必ず先に更新
- 大きいUI改修前にスクリーンショット比較（回帰確認）を実施
- Quarkus移行時はまず契約互換レイヤを作り、フロント無改修を目指す

---

## 13. 最後に

このモックは、

- **SPAとしての画面構造**
- **API契約でバックエンドに接続する現実的な構成**
- **将来のUI基盤移行（shadcn/ui）余地**

をすでに満たしています。保守は「契約整合」と「段階置換」を守れば安定して進められます。

---

## 14. shadcn/ui 段階移行手順（更新版）

`legacy-app.css` で見た目を維持しながら、コンポーネント単位で shadcn/ui を導入します。

### フェーズ1（今回実装）

1. `frontend/src/lib/utils.ts` に `cn` ユーティリティを追加。
2. `frontend/src/shared/components/ui/` に shadcn互換の `Button` / `Alert` を追加。
3. signup 画面の低リスク領域を置換。
   - エラーサマリ: `FieldErrorSummary` → `Alert`
   - 必須件数ボックス: `RequiredRemaining` → `Alert`
   - 送信ボタン: `button` → `Button`

### フェーズ2（今回で完了）

1. 入力系（`Input`, `Select`, `RadioGroup`）を `ui/` へ追加。 ✅
2. `PersonalSection` を新プリミティブへ置換。 ✅
3. `AddressSection` / `ContactSection` を同様に置換。 ✅
4. 1セクションごとに目視確認（hover/focus/disabled）を実施。

### フェーズ3（完了）

1. `legacy-app.css` 依存のクラスを棚卸し。 ✅（初回）
2. トークンへ寄せられる色・余白を Tailwind + token へ移管。 ✅（`FieldErrorSummary` / `RequiredRemaining` を Tailwind クラスへ移行）
3. 使用されなくなった legacy スタイルを削除。 ✅（`site-header*` / `site-brand*` / `site-nav__item` / `stepper*` / `required-remaining*` / `form-error-summary*` / `field-error-group*` / `required-callout*` を削除）

### 移行時のチェックポイント

- signup画面の主要フォームコントロール（Personal/Address/Contact/Password/Consent）は、shadcn互換プリミティブへ置換済み。
- API契約（`/api/members`, `/api/members/{id}`）は変更しない。
- `PageController` の SPA フォワード動線は変更しない。
- 画面差分は「同等」を目標にし、完全一致に固執しすぎない（特にフォーカスリング）。
