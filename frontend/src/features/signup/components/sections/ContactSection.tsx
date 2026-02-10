import { RequiredBadge } from '../parts/RequiredBadge';

export function ContactSection({ bind }: any) {
  return (
    <section className="form-section">
      <h2 className="section-title">連絡先 <RequiredBadge /></h2>
      <div className="form-row">
        <div className="form-label"><span className="form-label__text">電話番号</span></div>
        <div className="form-control input-pair">
          <input className="input-text" {...bind('tel1')} />
          <input className="input-text" {...bind('tel2')} />
          <input className="input-text" {...bind('tel3')} />
        </div>
      </div>
      <div className="form-row">
        <div className="form-label"><span className="form-label__text">メール</span></div>
        <div className="form-control"><input className="input-text" {...bind('email')} /></div>
      </div>
    </section>
  );
}
