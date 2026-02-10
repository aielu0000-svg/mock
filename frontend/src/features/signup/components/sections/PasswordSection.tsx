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
  return (
    <section className="form-section">
      <h2 className="section-title">パスワード</h2>
      <div className="form-row">
        <div className="form-label"><span className="form-label__text">パスワード</span></div>
        <div className="form-control">
          <input type="password" className="input-text" {...bind('password')} />
          <FieldError message={errors.password} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-label"><span className="form-label__text">パスワード確認</span></div>
        <div className="form-control">
          <input type="password" className="input-text" {...bind('passwordConfirm')} />
          <FieldError message={errors.passwordConfirm} />
        </div>
      </div>
      <PasswordGuidance />
      <PasswordRuleList status={status} />
    </section>
  );
}
