// frontend/src/components/layout/AppShell.tsx
import { Outlet, Link, useLocation } from "react-router-dom";

export function AppShell() {
  const loc = useLocation();

  return (
    <div className="min-h-screen">
      <header className="border-b border-border">
        <div className="mx-auto max-w-4xl px-4 py-4 flex items-center justify-between">
          <div className="font-semibold">Member SPA</div>
          <nav className="text-sm text-muted-fg flex gap-4">
            <Link className={loc.pathname.startsWith("/signup") ? "text-fg" : ""} to="/signup">
              Signup
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  );
}
