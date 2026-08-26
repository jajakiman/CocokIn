"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, type ReactNode } from "react";
import {
  House,
  ClipboardText,
  MagnifyingGlass,
  Briefcase,
  IdentificationBadge,
  FolderUser,
  User,
  ChartLineUp,
  Storefront,
  Users,
  ShieldCheck,
  Scales,
  Database,
  WarningCircle,
} from "@phosphor-icons/react";

import { getRoleConfig, type AppRole } from "./role-config";
import { DemoBanner } from "./demo-banner";

type AppShellProps = {
  children: ReactNode;
  role: AppRole;
  showDemoBanner?: boolean;
};

// Map icon string or name to Phosphor Icon component
function renderNavIcon(href: string, size = 20) {
  if (href === "/talent" || href === "/business" || href === "/admin") return <House size={size} weight="duotone" />;
  if (href.includes("/assessment")) return <ClipboardText size={size} weight="duotone" />;
  if (href.includes("/projects")) return <MagnifyingGlass size={size} weight="duotone" />;
  if (href.includes("/workspace")) return <Briefcase size={size} weight="duotone" />;
  if (href.includes("/passport")) return <IdentificationBadge size={size} weight="duotone" />;
  if (href.includes("/portfolio")) return <FolderUser size={size} weight="duotone" />;
  if (href.includes("/profile")) return <User size={size} weight="duotone" />;
  if (href.includes("/growth")) return <ChartLineUp size={size} weight="duotone" />;
  if (href.includes("/applicants")) return <Users size={size} weight="duotone" />;
  if (href.includes("/verification")) return <ShieldCheck size={size} weight="duotone" />;
  if (href.includes("/moderation")) return <WarningCircle size={size} weight="duotone" />;
  if (href.includes("/disputes")) return <Scales size={size} weight="duotone" />;
  if (href.includes("/taxonomy")) return <Database size={size} weight="duotone" />;
  return <Storefront size={size} weight="duotone" />;
}

function AppShellInner({ children, role, showDemoBanner }: AppShellProps) {
  const config = getRoleConfig(role);
  const pathname = usePathname() ?? "/";
  const searchParams = useSearchParams();
  const demoParam = searchParams?.get("demo");
  const isDemo = Boolean(demoParam) || showDemoBanner;

  const isNavActive = (href: string) => {
    if (href === `/${role}`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const getHrefWithDemo = (href: string) => {
    if (demoParam) {
      return `${href}?demo=${demoParam}`;
    }
    return href;
  };

  return (
    <div className="app-shell" data-density={config.density} data-role={role}>
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>

      {isDemo && <DemoBanner role={config.label} />}

      {/* Persistent / Collapsible Sidebar for Desktop & Tablet */}
      <aside className="app-sidebar">
        <div className="app-sidebar__brand-container">
          <Link className="brand-mark" href="/">
            <span className="brand-mark__icon" aria-hidden="true">C</span>
            <span className="brand-mark__text">CocokIn</span>
          </Link>
          <span className="role-pill">Mode {config.label}</span>
        </div>

        <nav aria-label="Navigasi utama" className="app-sidebar__nav">
          {config.navigation.map((item) => {
            const active = isNavActive(item.href);
            return (
              <Link
                className="nav-link"
                data-active={active}
                href={getHrefWithDemo(item.href)}
                key={item.href}
                aria-current={active ? "page" : undefined}
              >
                <span className="nav-link__icon" aria-hidden="true">
                  {renderNavIcon(item.href, 20)}
                </span>
                <span className="nav-link__label">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Topbar for Mobile Header */}
      <header className="app-topbar">
        <Link className="brand-mark brand-mark--sm" href="/">
          <span className="brand-mark__icon brand-mark__icon--sm" aria-hidden="true">C</span>
          <strong className="mobile-brand">CocokIn</strong>
        </Link>
        <div className="topbar-role-badge">
          <span className="status-badge" data-tone="info">
            {config.label}
          </span>
        </div>
      </header>

      {/* Main Content Area */}
      <main id="main-content" className="app-content">
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav aria-label="Navigasi mobile" className="mobile-navigation">
        {config.navigation.map((item) => {
          const active = isNavActive(item.href);
          return (
            <Link
              href={getHrefWithDemo(item.href)}
              key={item.href}
              className="mobile-nav-item"
              data-active={active}
              aria-current={active ? "page" : undefined}
            >
              <span className="mobile-nav-item__icon" aria-hidden="true">
                {renderNavIcon(item.href, 22)}
              </span>
              <span className="mobile-nav-item__label">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}

export function AppShell(props: AppShellProps) {
  return (
    <Suspense fallback={null}>
      <AppShellInner {...props} />
    </Suspense>
  );
}
