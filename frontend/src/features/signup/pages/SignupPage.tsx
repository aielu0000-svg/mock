import { AppShell } from '../../../shared/components/layout/AppShell';
import { SignupForm } from '../components/SignupForm';

export function SignupPage() {
  return (
    <AppShell>
      <h1 className="page-title">会員登録ぎあえおｇれあおｇれいおあ</h1>

      <div className="notice">
        <p className="notice__text">下記項目に必要事項をご入力ください。</p>
        <ul className="notice__list">
          <li>登録確認後、Web会員ID（主に使用するメールアドレス）へ確認メールを送付します。お間違いのないようお願いします。</li>
          <li>全角・半角の入力項目があります。ご注意ください。</li>
        </ul>
      </div>

      <SignupForm />
    </AppShell>
  );
}
