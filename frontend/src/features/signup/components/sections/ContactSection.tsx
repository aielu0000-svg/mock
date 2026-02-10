import { BindField, SignupValidationErrors } from '../formTypes';
import { RequiredBadge } from '../parts/RequiredBadge';
import { FieldError } from '../parts/FieldError';

type Props = {
  bind: BindField;
  errors: SignupValidationErrors;
};

export function ContactSection({ bind, errors }: Props) {
  return (
    <section className="form-section">
      <h2 className="section-title">連絡先 <RequiredBadge /></h2>
      <div className="form-row">
        <div className="form-label"><span className="form-label__text">電話番号</span></div>
        <div className="form-control input-pair">
          <input className="input-text" {...bind('tel1')} />
          <input className="input-text" {...bind('tel2')} />
          <input className="input-text" {...bind('tel3')} />
          <FieldError message={errors.tel1 || errors.tel2 || errors.tel3} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-label"><span className="form-label__text">メール</span></div>
        <div className="form-control">
          <input className="input-text" {...bind('email')} />
          <FieldError message={errors.email} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-label"><span className="form-label__text">お知らせメール</span></div>
        <div className="form-control radio-group">
          <label className="radio-item"><input type="radio" name="newsletter" value="yes" checked={bind('newsletter').value === 'yes'} onChange={bind('newsletter').onChange} />受け取る</label>
          <label className="radio-item"><input type="radio" name="newsletter" value="no" checked={bind('newsletter').value === 'no'} onChange={bind('newsletter').onChange} />受け取らない</label>
          <FieldError message={errors.newsletter} />
        </div>
      </div>
    </section>
  );
}
