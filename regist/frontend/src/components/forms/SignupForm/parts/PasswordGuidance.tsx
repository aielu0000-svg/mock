// frontend/src/components/forms/SignupForm/parts/PasswordGuidance.tsx
function WarningIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#d10000" d="M1 21h22L12 2 1 21z" />
      <path fill="#ffffff" d="M12 16.5c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1z" />
      <path fill="#ffffff" d="M11 10h2v5h-2z" />
    </svg>
  );
}

export function PasswordGuidance() {
  return (
    <div className="pw-guidance" role="note" aria-label="パスワードの注意事項">
      <span aria-hidden="true">
        <WarningIcon />
      </span>

      <details className="flex-1">
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
