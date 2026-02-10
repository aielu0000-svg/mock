import { PropsWithChildren } from 'react';
import { PageHeader } from './PageHeader';

export function AppShell({ children }: PropsWithChildren) {
  return (
    <>
      <PageHeader />
      <main className="page">
        <div className="page__inner">{children}</div>
      </main>
    </>
  );
}
