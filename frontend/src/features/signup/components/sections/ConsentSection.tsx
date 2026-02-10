export function ConsentSection() {
  return (
    <section className="form-section" aria-labelledby="section-userinfo">
      <h2 className="section-title" id="section-userinfo">利用者情報の提供</h2>

      <div className="form-row">
        <div className="form-label" style={{ alignItems: 'flex-start' }}>
          <span className="sr-only">利用者情報の提供</span>
        </div>
        <div className="form-control">
          <p>
            パーソナライズされた広告やサービスの提供のために、<br />
            外国にある第三者企業へ一部のお客さま情報を提供することに同意します。<br />
            なお、ログイン後に「会員情報変更」で同意内容の変更ができます。
          </p>

          <p>
            【ご確認ください】
            <a href="#" onClick={(e) => e.preventDefault()} aria-label="お客さま情報の提供の詳細はこちら（リンク先なし）">お客さま情報の提供の詳細はこちら</a>
          </p>

          <div className="radio-group" role="group" aria-label="利用者情報の提供への同意">
            <label className="radio-item">
              <input type="checkbox" id="userinfoConsent" name="userinfoConsent" defaultChecked />
              <span>同意する</span>
            </label>
          </div>
        </div>
      </div>
    </section>
  );
}
