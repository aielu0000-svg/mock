import { BindField, SignupValidationErrors } from '../formTypes';
import { FieldError } from '../parts/FieldError';
import { RequiredBadge } from '../parts/RequiredBadge';

type Props = {
  bind: BindField;
  errors: SignupValidationErrors;
};

export function PersonalSection({ bind, errors }: Props) {
  return (
    <section className="form-section">
      <h2 className="section-title">個人情報 <RequiredBadge /></h2>
      <div className="form-row">
        <div className="form-label"><span className="form-label__text">お名前（漢字）</span></div>
        <div className="form-control input-pair">
          <input className="input-text" placeholder="姓" {...bind('lastNameKanji')} />
          <input className="input-text" placeholder="名" {...bind('firstNameKanji')} />
          <FieldError message={errors.lastNameKanji || errors.firstNameKanji} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-label"><span className="form-label__text">お名前（カナ）</span></div>
        <div className="form-control input-pair">
          <input className="input-text" placeholder="セイ" {...bind('lastNameKana')} />
          <input className="input-text" placeholder="メイ" {...bind('firstNameKana')} />
        </div>
      </div>
    </section>
  );
}
