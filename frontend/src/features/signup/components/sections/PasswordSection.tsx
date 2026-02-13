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

const ICON_HIDE = 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="m644 628-58-58q9-47-27-88t-93-32l-58-58q17-8 34.5-12t37.5-4q75 0 127.5 52.5T660 556q0 20-4 37.5T644 628Zm128 126-58-56q38-29 67.5-63.5T832 556q-50-101-143.5-160.5T480 336q-29 0-57 4t-55 12l-62-62q41-17 84-25.5t90-8.5q151 0 269 83.5T920 556q-23 59-60.5 109.5T772 754Zm20 246L624 834q-35 11-70.5 16.5T480 856q-151 0-269-83.5T40 556q21-53 53-98.5t73-81.5L56 264l56-56 736 736-56 56ZM222 432q-29 26-53 57t-41 67q50 101 143.5 160.5T480 776q20 0 39-2.5t39-5.5l-36-38q-11 3-21 4.5t-21 1.5q-75 0-127.5-52.5T300 556q0-11 1.5-21t4.5-21l-84-82Zm319 93Zm-151 75Z"/></svg>';
const ICON_SHOW = 'data:image/svg+xml;charset=UTF-8,<svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 96 960 960" width="24"><path d="M480 736q75 0 127.5-52.5T660 556q0-75-52.5-127.5T480 376q-75 0-127.5 52.5T300 556q0 75 52.5 127.5T480 736Zm0-72q-45 0-76.5-31.5T372 556q0-45 31.5-76.5T480 448q45 0 76.5 31.5T588 556q0 45-31.5 76.5T480 664Zm0 192q-146 0-266-81.5T40 556q54-137 174-218.5T480 256q146 0 266 81.5T920 556q-54 137-174 218.5T480 856Zm0-300Zm0 220q113 0 207.5-59.5T832 556q-50-101-144.5-160.5T480 336q-113 0-207.5 59.5T128 556q50 101 144.5 160.5T480 776Z"/></svg>';

export function PasswordSection({ bind, status, errors, showPassword, onTogglePassword, submitted }: Props) {
  const password = bind('password');
  const passwordConfirm = bind('passwordConfirm');
  const iconSrc = showPassword ? ICON_SHOW : ICON_HIDE;
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
              <Button className={`pw-visibility${showPassword ? ' is-visible' : ''}`} variant="secondary" size="default" type="button" id="passwordToggle" aria-label={showPassword ? 'パスワードを隠す' : 'パスワードを表示'} aria-pressed={showPassword} onClick={onTogglePassword} style={{ backgroundImage: `url(${iconSrc})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '22px 22px' }} />
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
              <Button className={`pw-visibility${showPassword ? ' is-visible' : ''}`} variant="secondary" size="default" type="button" id="passwordToggle2" aria-label={showPassword ? 'パスワード確認用を隠す' : 'パスワード確認用を表示'} aria-pressed={showPassword} onClick={onTogglePassword} style={{ backgroundImage: `url(${iconSrc})`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', backgroundSize: '22px 22px' }} />
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
