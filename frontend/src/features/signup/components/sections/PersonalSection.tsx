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
          <FieldError message={errors.lastNameKana || errors.firstNameKana} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-label"><span className="form-label__text">生年月日</span></div>
        <div className="form-control input-pair">
          <input className="input-text" placeholder="YYYY" {...bind('birthYear')} />
          <select className="input-select" {...bind('birthMonth')}>
            {Array.from({ length: 12 }, (_, i) => `${String(i + 1).padStart(2, '0')}`).map((m) => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className="input-select" {...bind('birthDay')}>
            {Array.from({ length: 31 }, (_, i) => `${String(i + 1).padStart(2, '0')}`).map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
          <FieldError message={errors.birthYear || errors.birthMonth || errors.birthDay} />
        </div>
      </div>

      <div className="form-row">
        <div className="form-label"><span className="form-label__text">性別</span></div>
        <div className="form-control radio-group">
          <label className="radio-item"><input type="radio" name="gender" value="male" checked={bind('gender').value === 'male'} onChange={bind('gender').onChange} />男性</label>
          <label className="radio-item"><input type="radio" name="gender" value="female" checked={bind('gender').value === 'female'} onChange={bind('gender').onChange} />女性</label>
          <FieldError message={errors.gender} />
        </div>
      </div>
    </section>
  );
}
