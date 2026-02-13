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

> 現状: signup の主要フォームコントロールは shadcn 互換プリミティブへ置換済み。
> ただしページ全体の見た目は legacy CSS と Tailwind を併用して維持しています。

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

### 5-3. signup画面 UI対応表（画面パーツ → 実装ファイル）

> 添付いただいたスクリーンショット（上から順に①〜④）と見比べる前提の対応表です。  
> このリポジトリには添付画像ファイルを直接配置できないため、画像への直接埋め込みリンクではなく「スクリーンショット番号」で対応を明記します。

| 画面上の領域 | 対応スクリーンショット | 主担当ファイル | 補助ファイル / UIプリミティブ |
|---|---|---|---|
| ヘッダー（JRロゴ、黒/赤タブ） | ①, ④ | `frontend/src/shared/components/layout/PageHeader.tsx` | `frontend/src/shared/styles/legacy-app.css`（`.jr-header*`, `.jr-tab*`） |
| ページ外枠（Header/Main/Footer） | ①〜④ | `frontend/src/shared/components/layout/AppShell.tsx` | `frontend/src/shared/styles/legacy-app.css`（`.page*`, `.site-footer*`） |
| 会員登録ページの見出し・注意文 | ① | `frontend/src/features/signup/pages/SignupPage.tsx` | `frontend/src/shared/styles/legacy-app.css`（`.notice*`） |
| 残り必須項目コールアウト（右の赤い吹き出し） | ①〜③ | `frontend/src/features/signup/components/parts/RequiredRemaining.tsx` | `frontend/src/shared/components/ui/alert.tsx` |
| フォーム送信の親コンテナ | ①〜③ | `frontend/src/features/signup/components/SignupForm.tsx` | `frontend/src/shared/components/ui/button.tsx`（登録ボタン） |
| エラーサマリ（フォーム先頭） | （エラー発生時） | `frontend/src/features/signup/components/parts/FieldErrorSummary.tsx` | `frontend/src/shared/components/ui/alert.tsx` |
| 個人情報セクション | ① | `frontend/src/features/signup/components/sections/PersonalSection.tsx` | `input.tsx`, `select.tsx`, `radio-group.tsx` |
| 住所セクション | ② | `frontend/src/features/signup/components/sections/AddressSection.tsx` | `input.tsx`, `select.tsx`, `button.tsx` |
| 連絡先セクション | ② | `frontend/src/features/signup/components/sections/ContactSection.tsx` | `input.tsx`, `radio-group.tsx` |
| 利用者情報の提供（同意チェック） | ③ | `frontend/src/features/signup/components/sections/ConsentSection.tsx` | `frontend/src/shared/components/ui/checkbox.tsx` |
| パスワードセクション（注意文、表示/非表示、ルール） | ③ | `frontend/src/features/signup/components/sections/PasswordSection.tsx` | `frontend/src/features/signup/components/parts/PasswordRuleList.tsx`, `input.tsx`, `button.tsx` |
| 登録情報の編集（モック）画面 | ④ | `frontend/src/features/signup/pages/MemberEditPage.tsx` | `frontend/src/features/signup/api/getMember.ts` |

### 5-4. UI変更時の最短ルート（対応表の使い方）

1. まず「どのスクリーンショット領域を直したいか」を決める。  
2. 上の対応表で `主担当ファイル` を開く。  
3. 見た目だけなら `shared/styles/legacy-app.css` か Tailwind class を調整。  
4. 入力仕様まで変えるなら、`model/uiTypes.ts` / `members.mappers.ts` / backend DTO も同時確認。


---

## 5-5. shared層

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

## 10. shadcn/ui移行の実績と今後の運用方針

1. signup の主要フォームコントロールは置換済み（Input/Select/RadioGroup/Checkbox/Button/Alert）。
2. 今後は新規画面・新規部品を shadcn 互換プリミティブで追加。
3. 既存の見た目維持が必要な箇所は legacy CSS を局所利用し、段階的に Tailwind/token へ寄せる。
4. 置換で未使用化した legacy クラスは都度削除し、肥大化を防止する。

### 継続運用で触る場所

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

---

## 15. React 初学者向け補講（Week 2 で詰まりやすい点）

### Q1. なぜ「送信後にだけエラー表示」なのか

- `useSignupForm.ts` では `submitted` が `true` の時だけ `validateSignup(value)` を実行する。
- これにより、初期表示や入力途中でエラーを出しすぎず、UX を保てる。

### Q2. `bind` が返す `value / disabled / onChange` とは

- `value`: その入力欄の現在値。
- `disabled`: 編集不可かどうか（`lockedKeys.has(key)` で判定）。
- `onChange`: 入力変更時に state を更新する関数。

`<Input {...bind('email')} />` のように渡せば、Controlled form の接続を共通化できる。

### Q3. `Set` が分からない

このプロジェクトでは「編集不可キー」の管理に `Set` を使っている。

- `Set` は「重複なしの集合」。
- `.has(key)` で含有判定できるため、配列の `.includes(key)` より意図が明確。
- 例: `lockedKeys.has('email')` が `true` なら email は編集不可。

配列でも実装はできるが、キー重複の防止と判定の読みやすさで `Set` が適している。


### Week 2 実践ミニ課題（React基礎の定着）

1. `useSignupForm.ts` を開き、次の 3 行を声に出して説明する。
   - `const [value, setValue] = useState...`
   - `const errors = useMemo...`
   - `bind: (key) => ({ value, disabled, onChange })`
2. `Set` を配列に置き換えたら何が起きるかを 1 文で書く（例: 重複管理が必要になる）。
3. `PersonalSection.tsx` で `bind('lastNameKanji')` が `<Input ...>` に渡る箇所を確認し、
   「表示値」「編集可否」「変更処理」がどこから来るかをメモする。

### 受講者向けチェック回答（今回の質問に対応）

- 「送信ボタンを押した後にだけエラーが出る」理解は正しい。
- `bind` の `value / disabled / onChange` の理解も正しい。
- `Set` は「重複しない箱」。`lockedKeys.has('email')` のように、
  特定キーが含まれているかを即座に判定するために使う。



---

## 16. 学習講義の進め方（対話形式）

この章は「解説 → 課題 → 回答フィードバック」の対話形式で進めるための台本。

### 進行ルール

1. 講師（AI）がセクションを解説する。
2. 受講者が課題に回答する。
3. 講師（AI）が正誤判定と補足解説を返す。
4. 次セクションへ進む。

### セクション順（固定）

- Week 1: JS/TS基礎（`SignupForm.tsx` 上半分 / `uiTypes.ts` / `formTypes.ts`）
- Week 2: React基礎（`useSignupForm.ts` / `PersonalSection.tsx`）
- Week 3: SPA/API（`main.tsx` / `router.tsx` / `routes.tsx` / `createMember.ts` / `client.ts`）
- Week 4: 実務演習（`uiTypes.ts` → `defaults.ts` → section → mapper → backend）

### 1回あたりのテンプレート

- 前提知識の解説: 3〜5分（用語・目的・読む観点）
- 解説: 5〜10分（重要概念を3点まで）
- 課題: 2〜3問（短答式）※各課題に「参照ページ（見るファイル）」を併記
- フィードバック: 正誤 + どこを再読するか（ファイル名と行の目安）

この進め方を使えば、学習者は「理解したつもり」を避けながら、実コードで段階的に理解できる。


---

## 17. Week 1 課題の回答例とフィードバック

### 受講者回答（例）

1. `lastNameKanji`, `firstNameKanji`, `lastNameKana`
2. 
   - `lastNameKanji: '姓を入力してください。'`
   - `firstNameKanji: '名を入力してください。'`
   - `lastNameKana: 'セイを入力してください。'`
3. 
```ts
{
  lastNameKanji: '姓を入力してください。',
  birthMonth: '生月を選択してください。'
}
```

### 判定

- 1 は正解（`REQUIRED_KEYS` に含まれる）。
- 2 は正解（`REQUIRED_MESSAGES` と一致）。
- 3 も正解（`getRequiredErrors` が返す `{ key: message }` 形式として妥当）。

### 次に進むポイント

- Week 2 では `useSignupForm.ts` の `bind` を `PersonalSection.tsx` 側で追う。
- 特に `value / disabled / onChange` が `<Input {...bind('lastNameKanji')} />` にどう渡るかを確認する。


---



## 18. Week 2 課題の回答例とフィードバック

### 受講者回答（例）

1. `value, disabled, onChange`
2. `lockedkey?`
3. 「同じキーが重複しない。高速で判断できる」

### 判定

- 1 は正解。`bind` は `value / disabled / onChange` を返す。
- 2 は惜しい。正しくは `lockedKeys.has(key)` を見て `disabled` を決める。
- 3 は正解。`Set` は重複しない集合で、`has` 判定が明確。

### 前提知識（次回から先に説明する内容）

- `disabled` は「入力欄を編集不可にする HTML 属性」。
- `lockedKeys` は `Set<keyof SignupFormValue>` で、編集不可項目のキー集合。
- `lockedKeys.has(key)` が `true` の時、その項目は `disabled: true` になる。

### 次に進むポイント（Week 3）

- `main.tsx` で Router 起動を確認。
- `routes.tsx` で URL と画面対応を確認。
- `SignupForm.tsx` の `onSubmit` を success/fail に分けて追跡。




---

## 19. Week 3 課題の回答例とフィードバック

### 受講者回答（例）

1. 「画面を初期化しrootとproviderを起動する」
2. 「ランダムなリンク」
3. 
   - データ送信開始
   - サーバーエラーの確認
   - フィールドエラーの確認
   - どちらもなければ送信

### 判定

- 1 は概ね正解。`main.tsx` は root へ描画し、Provider/Router を起動する。
- 2 は不正解。`:id` は「ランダム」ではなく URL パラメータ（会員ID）を表す。
- 3 は部分正解。実際は「送信前の検証」が先で、成功時は `/member/{id}/edit` へ遷移する。

### 正しい流れ（`onSubmit` の6ステップ）

1. `preventDefault()` で通常送信を止める。
2. `submitted` を `true` にし、サーバー系エラー状態を初期化する。
3. 必須エラーとクライアント検証エラーを確認し、あれば中断する。
4. `createMember(...)` で API 送信する。
5. 成功時は `res.id` を使って `/member/{id}/edit` へ遷移する。
6. 失敗時は field error を正規化して表示（なければ汎用エラー）。

### 参照ページ（見るファイル）

- `frontend/src/app/main.tsx`（Q1）
- `frontend/src/app/routes.tsx`（Q2）
- `frontend/src/features/signup/components/SignupForm.tsx`（Q3）




---

## 20. Week 4 課題の回答例とフィードバック

### 受講者回答（例）

1. `uiTypes.ts` に変数を追加
2. `defaults.ts`
3. `members.mappers.ts`

### 判定

- 1 は正解。追加項目（例: `occupation`）は `SignupFormValue` 型へ先に追加する。
- 2 は正解。初期値は `defaultSignupFormValue` に追加する。
- 3 は正解。送信 payload へ載せるため `toCreateMemberRequest` の写像を更新する。

### 参照ページ（見るファイル）

- `frontend/src/features/signup/model/uiTypes.ts`（型の追加）
- `frontend/src/features/signup/model/defaults.ts`（初期値の追加）
- `frontend/src/features/signup/api/members.mappers.ts`（UI→API 変換）

### 実装時チェックリスト（最終）

1. `uiTypes.ts` に新規キー追加（型エラーの起点を先に作る）。
2. `defaults.ts` に初期値を追加。
3. 対象 section へ入力欄を追加し `bind('newKey')` を接続。
4. `members.mappers.ts` で API DTO へ写像。
5. `members.types.ts` と backend DTO を同期。
6. backend validation を追加（必要時）。
7. 送信成功後の表示・遷移・エラー表示を手動確認。




---

## 21. Week 5 課題の回答例とフィードバック

### 受講者回答（例）

1. `occupation: string;`
2. `occupation: '';`
3. 「`name:` の中に `occupation: v.occupatioon` を追加する」

### 判定

- 1 は正解。`SignupFormValue` へ `occupation: string` を追加する方針で良い。
- 2 は正解。`defaultSignupFormValue` へ `occupation: ''` を追加する。
- 3 は部分正解。**追加場所の考え方は良いが、プロパティ名の typo に注意**。
  - 正: `occupation: v.occupation`
  - 誤: `occupation: v.occupatioon`

### 補足（構造の確認）

- `occupation` を `name` の中に入れるか、トップレベルに置くかは API 契約次第。
- 今回の回答どおり `name` 配下に置く場合は、`members.types.ts` と backend DTO も同じ構造へ揃える。

### 参照ページ（見るファイル）

- `frontend/src/features/signup/model/uiTypes.ts`
- `frontend/src/features/signup/model/defaults.ts`
- `frontend/src/features/signup/api/members.mappers.ts`
- `frontend/src/features/signup/api/members.types.ts`




---

## 22. 次の講義（Week 6: API契約とDTO同期の実践）

### 前提知識（先に読む）

- フロントの `members.mappers.ts` は UI値を API契約へ写像する境界。
- `members.types.ts` は API契約の型で、backend DTO と不一致だと送受信エラーの原因になる。
- 新規項目を追加したら「UI型・初期値・mapper・API型・backend DTO」を同時に揃える。

### 解説（重要3点）

1. `SignupFormValue` にキーを追加しただけでは API へは送られない。`toCreateMemberRequest` で明示的な写像が必要。
2. `CreateMemberRequest` 型へ追加しないと、mapper 側で型エラーまたは項目欠落が起きる。
3. backend DTO の受け口が未更新だと、サーバーで 400/500 や項目無視が発生する。

### 課題（参照ページつき）

1. `occupation` を API送信に含めるため、フロント側で最低限どの2ファイルを同時更新すべきか。
   - 参照: `frontend/src/features/signup/api/members.mappers.ts`
   - 参照: `frontend/src/features/signup/api/members.types.ts`
2. `occupation` を `name` 配下に置く場合、backend 側でどの構造を合わせる必要があるか（文章で回答）。
3. フロントで更新漏れを最も早く検知できる順序を1行で書く。

### 回答フォーマット

- Q1: 〜
- Q2: 〜
- Q3: 〜
