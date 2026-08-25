import Link from "next/link";
import type { ReactNode } from "react";

import { getRoleConfig, type AppRole } from "./role-config";

type AppShellProps = {
  children: ReactNode;
  role: AppRole;
};

export function AppShell({ children, role }: AppShellProps) {
  const config = getRoleConfig(role);

  return (
    <div className="app-shell" data-density={config.density} data-role={role}>
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>

      <aside className="app-sidebar">
        <Link className="brand-mark" href="/">
          <span aria-hidden="true">C</span>
          <strong>CocokIn</strong>
        </Link>
        <p className="role-label">Mode {config.label}</p>
        <nav aria-label="Navigasi utama">
          {config.navigation.map((item, index) => (
            <Link className="nav-link" data-active={index === 0} href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <header className="app-topbar">
        <span className="mobile-brand">CocokIn</span>
        <span>{config.label}</span>
      </header>

      <main id="main-content">{children}</main>

      <nav aria-label="Navigasi mobile" className="mobile-navigation">
        {config.navigation.map((item) => (
          <Link href={item.href} key={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
