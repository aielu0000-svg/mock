import { BindField, SignupValidationErrors } from '../formTypes';
import { RequiredBadge } from '../parts/RequiredBadge';
import { FieldError } from '../parts/FieldError';

type Props = {
  bind: BindField;
  errors: SignupValidationErrors;
};

export function ContactSection({ bind, errors }: Props) {
  const tel1 = bind('tel1');
  const tel2 = bind('tel2');
  const tel3 = bind('tel3');
  const email = bind('email');
  const newsletterBind = bind('newsletter');

  return (
    <section className="form-section" aria-labelledby="section-contact">
      <h2 className="section-title" id="section-contact">連絡先 <RequiredBadge /></h2>

      <div className="form-row">
        <div className="form-label" style={{ alignItems: 'flex-start' }}>
          <span className="form-label__text">電話番号<span className="required-asterisk">＊</span><span className="sr-only">必須</span></span>
        </div>
        <div className="form-control">
          <div className="input-tel">
            <input className="input-text input-tel1" maxLength={5} inputMode="numeric" {...tel1} />
            <span className="unit-text">-</span>
            <input className="input-text input-tel2" maxLength={5} inputMode="numeric" {...tel2} />
            <span className="unit-text">-</span>
            <input className="input-text input-tel3" maxLength={4} inputMode="numeric" {...tel3} />
          </div>
          <FieldError message={errors.tel1 || errors.tel2 || errors.tel3} />
          <p className="help-text">半角</p>
        </div>
      </div>

      <div className="form-row">
        <div className="form-label" style={{ alignItems: 'flex-start' }}>
          <label className="form-label__text">メールアドレス（Web会員ID）<span className="required-asterisk">＊</span><span className="sr-only">必須</span></label>
        </div>
        <div className="form-control">
          <input className="input-text" type="email" autoComplete="email" {...email} />
          <FieldError message={errors.email} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-label" style={{ alignItems: 'flex-start' }}>
          <span className="form-label__text">お知らせメール<span className="required-asterisk">＊</span><span className="sr-only">必須</span></span>
        </div>
        <div className="form-control radio-group">
          <label className="radio-item"><input type="radio" name="newsletter" value="yes" checked={newsletterBind.value === 'yes'} onChange={newsletterBind.onChange} disabled={newsletterBind.disabled} />受け取る</label>
          <label className="radio-item"><input type="radio" name="newsletter" value="no" checked={newsletterBind.value === 'no'} onChange={newsletterBind.onChange} disabled={newsletterBind.disabled} />受け取らない</label>
          <FieldError message={errors.newsletter} />
          <p className="help-text">キャンペーンやおすすめ情報などのメールマガジンをお送りします。</p>
        </div>
      </div>
    </section>
  );
}
