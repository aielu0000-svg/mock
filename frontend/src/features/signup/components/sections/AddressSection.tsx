import { BindField } from '../formTypes';
import { RequiredBadge } from '../parts/RequiredBadge';

type Props = { bind: BindField };

export function AddressSection({ bind }: Props) {
  return (
    <section className="form-section">
      <h2 className="section-title">住所 <RequiredBadge /></h2>
      <div className="form-row">
        <div className="form-label"><span className="form-label__text">郵便番号</span></div>
        <div className="form-control input-zip">
          <input className="input-text input-zip1" {...bind('zip1')} />-
          <input className="input-text input-zip2" {...bind('zip2')} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-label"><span className="form-label__text">都道府県</span></div>
        <div className="form-control"><input className="input-text" {...bind('prefecture')} /></div>
      </div>
      <div className="form-row">
        <div className="form-label"><span className="form-label__text">市区町村・番地</span></div>
        <div className="form-control"><input className="input-text" {...bind('addressLine1')} /></div>
      </div>
    </section>
  );
}
