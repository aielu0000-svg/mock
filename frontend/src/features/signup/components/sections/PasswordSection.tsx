import { BindField, PasswordStatus, SignupValidationErrors } from '../formTypes';
import { PasswordRuleList } from '../parts/PasswordRuleList';
import { FieldError } from '../parts/FieldError';
import { Input } from '../../../../shared/components/ui/input';
import { Button } from '../../../../shared/components/ui/button';

type Props = {
  bind: BindField;
  status: PasswordStatus;
  errors: SignupValidationErrors;
  showPassword: boolean;
  onTogglePassword: () => void;
  submitted: boolean;
};

export function PasswordSection({ bind, status, errors, showPassword, onTogglePassword, submitted }: Props) {
  const password = bind('password');
  const passwordConfirm = bind('passwordConfirm');
  const passwordRequired = submitted && !String(password.value).trim();
  const passwordConfirmRequired = submitted && !String(passwordConfirm.value).trim();

  return (
    <section className="form-section" aria-labelledby="section-password">
      <h2 className="section-title" id="section-password">パスワード <span className="section-required">必須</span></h2>

      <div className="pw-guidance" role="note" aria-label="パスワードの注意事項">
        <span className="pw-guidance__icon" aria-hidden="true"></span>

        <details className="pw-guidance__details">
          <summary className="pw-guidance__summary">
            パスワードは【半角英字・数字・記号の全てを含む8文字以上12文字以内】で設定してください。{' '}
            <span className="pw-guidance__more">クリックして詳細</span>
          </summary>
          <div className="pw-guidance__body">
            ※使用できる記号は - ! &quot; # $ % &amp; &apos; ( ) * + , . / : ; &lt; = &gt; ? @ [ ] ^ _ ` {'{'} | {'}'} ~ です。
            <br />
            大文字と小文字は区別されます。
          </div>
        </details>
      </div>

      <div className="form-row">
        <div className="form-label" style={{ alignItems: 'flex-start' }}>
          <span className="form-label__text">パスワード<span className="required-asterisk">＊</span><span className="sr-only">必須</span></span>
        </div>
        <div className="form-control">
          <div className="pw-field-row">
            <div className="pw-input-wrap">
              <Input type={showPassword ? 'text' : 'password'} className="input-text input-text--pw" maxLength={12} autoComplete="new-password" id="passWord" {...password} />
              <Button className={`pw-visibility${showPassword ? ' is-visible' : ''}`} variant="secondary" size="default" type="button" id="passwordToggle" aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'} aria-pressed={showPassword} onClick={onTogglePassword}>
                <span className="pw-visibility__glyph" aria-hidden="true">{showPassword ? "🙈" : "👁"}</span>
              </Button>
            </div>
            <span className="pw-note" id="pwNote">[半角12文字以内]</span>
          </div>

          <FieldError message={errors.password} />
          <p className={`pw-error${passwordRequired ? ' is-visible' : ''}`} id="pwErrPassword">
            <span className="pw-error__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M12 2 1 21h22L12 2z" fill="currentColor" />
                <path d="M12 9v5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 17h.01" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            <span className="pw-error__text" id="requiredErrorMessageByPassWord">パスワードを入力してください。</span>
          </p>
          <PasswordRuleList status={status} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-label" style={{ alignItems: 'flex-start' }}>
          <span className="form-label__text">パスワード確認用<span className="required-asterisk">＊</span><span className="sr-only">必須</span></span>
        </div>
        <div className="form-control">
          <div className="pw-field-row">
            <div className="pw-input-wrap">
              <Input type={showPassword ? 'text' : 'password'} className="input-text input-text--pw" maxLength={12} autoComplete="new-password" id="resultPassword" {...passwordConfirm} />
              <Button className={`pw-visibility${showPassword ? ' is-visible' : ''}`} variant="secondary" size="default" type="button" id="passwordToggle2" aria-label={showPassword ? 'パスワード確認用を隠す' : 'パスワード確認用を表示'} aria-pressed={showPassword} onClick={onTogglePassword}>
                <span className="pw-visibility__glyph" aria-hidden="true">{showPassword ? "🙈" : "👁"}</span>
              </Button>
            </div>
            <span className="pw-note" id="pwNote2">[半角12文字以内]</span>
          </div>

          <FieldError message={errors.passwordConfirm} />
          <p className={`pw-error${passwordConfirmRequired ? ' is-visible' : ''}`} id="pwErrConfirm">
            <span className="pw-error__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18">
                <path d="M12 2 1 21h22L12 2z" fill="currentColor" />
                <path d="M12 9v5" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
                <path d="M12 17h.01" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            <span className="pw-error__text" id="requiredErrorMessageByResultPassword">パスワード確認用を入力してください。</span>
          </p>
        </div>
      </div>
    </section>
  );
}
