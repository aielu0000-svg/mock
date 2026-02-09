// frontend/src/pages/SignupPage.tsx
import { useNavigate } from "react-router-dom";
import { SignupForm } from "../components/forms/SignupForm/SignupForm";

export function SignupPage() {
  const nav = useNavigate();
  return (
    <>
      <h1 className="page-title">会員登録</h1>

      <ul className="stepper" aria-label="登録ステップ">
        <li className="stepper__step stepper__step--done">
          <span className="stepper__circle" aria-hidden="true" />
          1. 事前確認
        </li>
        <li className="stepper__step stepper__step--active">
          <span className="stepper__circle" aria-hidden="true" />
          2. お客様情報入力
        </li>
        <li className="stepper__step">
          <span className="stepper__circle" aria-hidden="true" />
          3. 登録完了
        </li>
      </ul>

      <div className="notice" role="note" aria-label="ご案内">
        <p className="notice__text">入力内容をご確認のうえ、「登録する」ボタンを押してください。</p>
        <ul className="notice__list">
          <li>必須項目はすべて入力してください。</li>
          <li>半角英数字の入力を推奨します。</li>
        </ul>
      </div>

      <SignupForm onSuccess={(id) => nav(`/member/${encodeURIComponent(id)}/edit`)} />
    </>
  );
}
