// frontend/src/components/forms/SignupForm/parts/PasswordGuidance.tsx
export function PasswordGuidance() {
  return (
    <div className="pw-guidance" role="note" aria-label="パスワードの注意事項">
      <span className="pw-guidance__icon" aria-hidden="true" />

      <details className="pw-guidance__details">
        <summary className="pw-guidance__summary">
          パスワードは【半角英字・数字・記号の全てを含む8文字以上12文字以内】で設定してください。大文字と小文字は区別されます。
          <span className="pw-guidance__more">クリックして詳細</span>
        </summary>
        <div className="pw-guidance__body">
          ※使用できる記号は - ! " # $ % &amp; ' ( ) * + , . / : ; &lt; = &gt; ? @ [ ] ^ _ ` {"{"} | {"}"} ~ です。
        </div>
      </details>
    </div>
  );
}
