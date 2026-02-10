import { BindField, SignupValidationErrors } from '../formTypes';
import { FieldError } from '../parts/FieldError';
import { RequiredBadge } from '../parts/RequiredBadge';

type Props = {
  bind: BindField;
  errors: SignupValidationErrors;
};

const months = Array.from({ length: 12 }, (_, i) => `${String(i + 1).padStart(2, '0')}`);
const days = Array.from({ length: 31 }, (_, i) => `${String(i + 1).padStart(2, '0')}`);

export function PersonalSection({ bind, errors }: Props) {
  const lastNameKanji = bind('lastNameKanji');
  const firstNameKanji = bind('firstNameKanji');
  const lastNameKana = bind('lastNameKana');
  const firstNameKana = bind('firstNameKana');
  const birthYear = bind('birthYear');
  const birthMonth = bind('birthMonth');
  const birthDay = bind('birthDay');
  const genderBind = bind('gender');

  return (
    <section className="form-section" aria-labelledby="section-basic">
      <h2 className="section-title" id="section-basic">個人情報 <RequiredBadge /></h2>

      <div className="form-row">
        <div className="form-label" style={{ paddingTop: 33, alignItems: 'flex-start' }}>
          <span className="form-label__text">お名前（漢字）<span className="required-asterisk">＊</span><span className="sr-only">必須</span></span>
        </div>
        <div className="form-control">
          <div className="input-pair">
            <div className="input-field">
              <label className="input-sub-label">姓</label>
              <input className="input-text" maxLength={15} {...lastNameKanji} />
            </div>
            <div className="input-field">
              <label className="input-sub-label">名</label>
              <input className="input-text" maxLength={15} {...firstNameKanji} />
            </div>
          </div>
          <FieldError message={errors.lastNameKanji || errors.firstNameKanji} />
          <p className="help-text">全角25文字以内</p>
        </div>
      </div>

      <div className="form-row">
        <div className="form-label" style={{ paddingTop: 33, alignItems: 'flex-start' }}>
          <span className="form-label__text">お名前（カナ）<span className="required-asterisk">＊</span><span className="sr-only">必須</span></span>
        </div>
        <div className="form-control">
          <div className="input-pair">
            <div className="input-field">
              <label className="input-sub-label">姓</label>
              <input className="input-text" maxLength={15} {...lastNameKana} />
            </div>
            <div className="input-field">
              <label className="input-sub-label">名</label>
              <input className="input-text" maxLength={15} {...firstNameKana} />
            </div>
          </div>
          <FieldError message={errors.lastNameKana || errors.firstNameKana} />
          <p className="help-text">全角25文字以内</p>
        </div>
      </div>

      <div className="form-row">
        <div className="form-label" style={{ alignItems: 'flex-start' }}>
          <span className="form-label__text">生年月日<span className="required-asterisk">＊</span><span className="sr-only">必須</span></span>
        </div>
        <div className="form-control">
          <div className="input-birthdate">
            <input className="input-text input-year" maxLength={4} inputMode="numeric" {...birthYear} />
            <span className="unit-text">年</span>
            <select className="input-select input-month" {...birthMonth}>
              {months.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
            <span className="unit-text">月</span>
            <select className="input-select input-day" {...birthDay}>
              {days.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <span className="unit-text">日</span>
            <span className="hint-bracket">［半角］</span>
          </div>
          <FieldError message={errors.birthYear || errors.birthMonth || errors.birthDay} />
          <p className="inline-warn"><span className="inline-warn__icon" aria-hidden="true"></span>「パスワード再発行の手続き」に生年月日の入力が必要となりますので正確にご入力ください。</p>
        </div>
      </div>

      <div className="form-row">
        <div className="form-label" style={{ alignItems: 'flex-start' }}>
          <span className="form-label__text">性別<span className="required-asterisk">＊</span><span className="sr-only">必須</span></span>
        </div>
        <div className="form-control">
          <div className="radio-group" role="radiogroup" aria-label="性別">
            <label className="radio-item"><input type="radio" name="gender" value="male" checked={genderBind.value === 'male'} onChange={genderBind.onChange} disabled={genderBind.disabled} />男性</label>
            <label className="radio-item"><input type="radio" name="gender" value="female" checked={genderBind.value === 'female'} onChange={genderBind.onChange} disabled={genderBind.disabled} />女性</label>
          </div>
          <FieldError message={errors.gender} />
        </div>
      </div>
    </section>
  );
}
