// frontend/src/components/layout/AppShell.tsx
import { Outlet } from "react-router-dom";

export function AppShell() {
  return (
    <div>
      <header className="jr-header">
        <div className="jr-header__top">
          <div className="jr-header__top-inner">
            <a className="jr-brand" href="/">
              <img className="jr-brand__img" src="/head_logo_002.svg" alt="JR logo" />
              <span className="jr-brand__title">えきねっと</span>
            </a>
          </div>
        </div>
        <div className="jr-header__bar">
          <div className="jr-header__bar-inner">
            <span className="jr-tab jr-tab--train">
              <span className="jr-tab__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <path d="M5 3h14v11a4 4 0 0 1-4 4h-6a4 4 0 0 1-4-4V3Z" />
                  <path d="M7 21h10" />
                  <path d="M7 11h10" />
                </svg>
              </span>
              鉄道利用
            </span>
            <span className="jr-tab jr-tab--portal is-active">
              <span className="jr-tab__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" role="presentation">
                  <circle cx="12" cy="8" r="3" />
                  <path d="M5 21a7 7 0 0 1 14 0" />
                </svg>
              </span>
              会員登録
            </span>
          </div>
        </div>
      </header>

      <main className="page">
        <div className="page__inner">
          <Outlet />
        </div>
      </main>

      <footer className="site-footer">
        <div className="site-footer__inner">
          <div className="site-footer__copy">© JR East Network Co., Ltd.</div>
        </div>
      </footer>
    </div>
  );
}
