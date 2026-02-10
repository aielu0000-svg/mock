import { BindField, PasswordStatus, SignupValidationErrors } from '../formTypes';
import { PasswordGuidance } from '../parts/PasswordGuidance';
import { PasswordRuleList } from '../parts/PasswordRuleList';
import { FieldError } from '../parts/FieldError';

type Props = {
  bind: BindField;
  status: PasswordStatus;
  errors: SignupValidationErrors;
};

export function PasswordSection({ bind, status, errors }: Props) {
  const password = bind('password');
  const passwordConfirm = bind('passwordConfirm');

  return (
    <section className="form-section" aria-labelledby="section-password">
      <h2 className="section-title" id="section-password">パスワード <span className="section-required">必須</span></h2>

      <div className="form-row">
        <div className="form-label" style={{ alignItems: 'flex-start' }}>
          <span className="form-label__text">パスワード<span className="required-asterisk">＊</span><span className="sr-only">必須</span></span>
        </div>
        <div className="form-control">
          <input type="password" className="input-text" maxLength={20} autoComplete="new-password" {...password} />
          <FieldError message={errors.password} />
          <PasswordGuidance />
          <PasswordRuleList status={status} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-label" style={{ alignItems: 'flex-start' }}>
          <span className="form-label__text">パスワード（確認）<span className="required-asterisk">＊</span><span className="sr-only">必須</span></span>
        </div>
        <div className="form-control">
          <input type="password" className="input-text" maxLength={20} autoComplete="new-password" {...passwordConfirm} />
          <FieldError message={errors.passwordConfirm} />
        </div>
      </div>
    </section>
  );
}
