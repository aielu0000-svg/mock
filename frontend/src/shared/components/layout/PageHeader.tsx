export function PageHeader() {
  return (
    <header className="jr-header" role="banner">
      <div className="jr-header__top">
        <div className="jr-header__top-inner">
          <a className="jr-brand" href="#" aria-label="JR九州Web会員サービス">
            <img className="jr-brand__img" src="/head_logo_002.png" alt="JR九州Web会員サービス" />
          </a>
        </div>
      </div>

      <nav className="jr-header__bar" aria-label="サービス切替">
        <div className="jr-header__bar-inner">
          <a className="jr-tab jr-tab--portal is-active" href="#">
            <span className="jr-tab__icon" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <rect x="4" y="4" width="7" height="7" rx="1" />
                <rect x="13" y="4" width="7" height="7" rx="1" />
                <rect x="4" y="13" width="7" height="7" rx="1" />
                <rect x="13" y="13" width="7" height="7" rx="1" />
              </svg>
            </span>
            <span className="jr-tab__label">Web会員ポータル</span>
          </a>
        </div>
      </nav>
    </header>
  );
}
