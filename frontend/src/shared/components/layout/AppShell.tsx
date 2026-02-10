import { PropsWithChildren } from 'react';
import { PageHeader } from './PageHeader';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <>
      <PageHeader />
      <main className="page">
        <div className="page__inner">{children}</div>
      </main>
      <footer className="site-footer">
        <div className="site-footer__inner">
          <small className="site-footer__copy">Copyright © Kyushu Railway Company. All Rights Reserved.</small>
        </div>
      </footer>
    </>
  );
}
