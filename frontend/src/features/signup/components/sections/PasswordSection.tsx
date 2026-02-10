import { BindField, PasswordStatus } from '../formTypes';
import { PasswordGuidance } from '../parts/PasswordGuidance';
import { PasswordRuleList } from '../parts/PasswordRuleList';

type Props = {
  bind: BindField;
  status: PasswordStatus;
};

export function PasswordSection({ bind, status }: Props) {
  return (
    <section className="form-section">
      <h2 className="section-title">パスワード</h2>
      <div className="form-row">
        <div className="form-label"><span className="form-label__text">パスワード</span></div>
        <div className="form-control"><input type="password" className="input-text" {...bind('password')} /></div>
      </div>
      <div className="form-row">
        <div className="form-label"><span className="form-label__text">パスワード確認</span></div>
        <div className="form-control"><input type="password" className="input-text" {...bind('passwordConfirm')} /></div>
      </div>
      <PasswordGuidance />
      <PasswordRuleList status={status} />
    </section>
  );
}
