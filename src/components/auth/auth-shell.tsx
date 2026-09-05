import Link from "next/link";
import type { ReactNode } from "react";
import { CocokInBrand } from "@/src/design-system/cocokin-brand";

type AuthShellProps = {
  children: ReactNode;
  title: string;
  description: string;
  contextTitle: string;
  context: ReactNode;
  hideHeading?: boolean;
};

export function AuthShell({
  children,
  title,
  description,
  contextTitle,
  context,
  hideHeading = false,
}: AuthShellProps) {
  return (
    <div className="auth-shell">
      <div className="auth-shell__form">
        <Link className="auth-shell__brand auth-shell__brand--mobile" href="/" aria-label="CocokIn beranda">
          <CocokInBrand className="auth-shell__wordmark" decorative priority variant="wordmark" />
        </Link>

        <main id="main-content" tabIndex={-1} className="auth-shell__form-inner">
          {!hideHeading ? (
            <header className="auth-shell__heading">
              <h1>{title}</h1>
              <p>{description}</p>
            </header>
          ) : null}
          {children}
        </main>
      </div>

      <aside className="auth-shell__context" aria-hidden="true">
        <div className="auth-shell__context-inner">
          <div className="auth-shell__brand-wrapper">
            <Link className="auth-shell__brand auth-shell__brand--desktop auth-shell__brand-badge" href="/" aria-label="CocokIn beranda">
              <CocokInBrand className="auth-shell__wordmark" decorative priority variant="wordmark" />
            </Link>
          </div>
          <h2>{contextTitle}</h2>
          <div className="auth-shell__context-copy">
            {context}
          </div>
        </div>
      </aside>
    </div>
  );
}
