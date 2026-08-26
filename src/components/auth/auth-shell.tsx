import Link from "next/link";
import type { ReactNode } from "react";
import { ShieldCheck, Sparkle } from "@phosphor-icons/react/dist/ssr";

type AuthShellProps = {
  children: ReactNode;
  title: string;
  description: string;
  contextTitle: string;
  context: ReactNode;
};

export function AuthShell({
  children,
  title,
  description,
  contextTitle,
  context,
}: AuthShellProps) {
  return (
    <div className="auth-shell">
      <div className="auth-shell__form">
        <Link className="auth-shell__brand" href="/" aria-label="CocokIn beranda">
          <span className="brand-dot" aria-hidden="true" />
          <strong>CocokIn</strong>
        </Link>

        <main id="main-content" tabIndex={-1} className="auth-shell__form-inner">
          <header className="auth-shell__heading">
            <h1>{title}</h1>
            <p>{description}</p>
          </header>
          {children}
        </main>
      </div>

      <aside className="auth-shell__context" aria-hidden="true">
        <div className="auth-shell__context-inner">
          <div className="auth-shell__context-pill">
            <Sparkle size={14} weight="fill" />
            <span>Kolaborasi yang Jelas & Terarah</span>
          </div>
          <h2>{contextTitle}</h2>
          <div className="auth-shell__context-copy">
            {context}
          </div>

          <div className="auth-shell__protection">
            <ShieldCheck aria-hidden="true" size={28} weight="duotone" />
            <span>
              Dana proyek terlindungi dan hasil kerja bergaransi 30 hari.
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
