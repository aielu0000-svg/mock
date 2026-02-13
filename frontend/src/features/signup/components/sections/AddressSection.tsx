import { BindField, SignupValidationErrors } from '../formTypes';
import { RequiredBadge } from '../parts/RequiredBadge';
import { FieldError } from '../parts/FieldError';
import { Input } from '../../../../shared/components/ui/input';
import { Select } from '../../../../shared/components/ui/select';
import { Button } from '../../../../shared/components/ui/button';

type Props = {
  bind: BindField;
  errors: SignupValidationErrors;
};

const PREFECTURES = [
  '北海道','青森県','岩手県','宮城県','秋田県','山形県','福島県','茨城県','栃木県','群馬県','埼玉県','千葉県','東京都','神奈川県',
  '新潟県','富山県','石川県','福井県','山梨県','長野県','岐阜県','静岡県','愛知県','三重県',
  '滋賀県','京都府','大阪府','兵庫県','奈良県','和歌山県','鳥取県','島根県','岡山県','広島県','山口県',
  '徳島県','香川県','愛媛県','高知県','福岡県','佐賀県','長崎県','熊本県','大分県','宮崎県','鹿児島県','沖縄県'
];

export function AddressSection({ bind, errors }: Props) {
  const zip1 = bind('zip1');
  const zip2 = bind('zip2');
  const prefecture = bind('prefecture');
  const addressLine1 = bind('addressLine1');
  const addressLine2 = bind('addressLine2');

  return (
    <section className="form-section" aria-labelledby="section-address">
      <h2 className="section-title" id="section-address">住所 <RequiredBadge /></h2>

      <div className="form-row">
        <div className="form-label" style={{ alignItems: 'flex-start' }}>
          <span className="form-label__text">郵便番号<span className="required-asterisk">＊</span><span className="sr-only">必須</span></span>
        </div>
        <div className="form-control">
          <div className="input-zip">
            <Input className="input-text input-zip1" maxLength={3} inputMode="numeric" {...zip1} />
            <span className="unit-text">-</span>
            <Input className="input-text input-zip2" maxLength={4} inputMode="numeric" {...zip2} />
            <Button className="button button--secondary" variant="secondary" type="button">住所検索</Button>
          </div>
          <FieldError message={errors.zip1 || errors.zip2} />
          <p className="help-text">半角3桁-4桁</p>
        </div>
      </div>

      <div className="form-row">
        <div className="form-label" style={{ alignItems: 'flex-start' }}>
          <span className="form-label__text">都道府県<span className="required-asterisk">＊</span><span className="sr-only">必須</span></span>
        </div>
        <div className="form-control">
          <Select className="input-select" {...prefecture}>
            <option value="">選択してください</option>
            {PREFECTURES.map((p) => <option key={p} value={p}>{p}</option>)}
          </Select>
          <FieldError message={errors.prefecture} />
          <p className="help-text"> </p>
        </div>
      </div>

      <div className="form-row">
        <div className="form-label" style={{ alignItems: 'flex-start' }}>
          <span className="form-label__text">市区町村・番地<span className="required-asterisk">＊</span><span className="sr-only">必須</span></span>
        </div>
        <div className="form-control">
          <Input className="input-text" maxLength={25} {...addressLine1} />
          <FieldError message={errors.addressLine1} />
          <p className="help-text">全角25文字以内</p>
        </div>
      </div>

      <div className="form-row">
        <div className="form-label" style={{ alignItems: 'flex-start' }}>
          <span className="form-label__text">アパート・マンション名等</span>
          <span className="badge badge--optional">任意</span>
        </div>
        <div className="form-control">
          <Input className="input-text" maxLength={25} {...addressLine2} />
          <p className="help-text">全角25文字以内</p>
        </div>
      </div>
    </section>
  );
}
