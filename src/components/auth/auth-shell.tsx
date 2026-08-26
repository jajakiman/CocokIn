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
        <Link className="auth-shell__brand" href="/">
          <span
            style={{
              background: "var(--brand-cyan)",
              color: "#0f2431",
              fontWeight: 900,
              width: "2.25rem",
              height: "2.25rem",
              borderRadius: "0.5rem",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              marginRight: "0.5rem",
            }}
          >
            C
          </span>
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

      {/* Right-Side Visual Showcase Context (21st.dev Style) */}
      <aside className="auth-shell__context" aria-hidden="true">
        <div>
          <div className="landing-pill" style={{ background: "rgba(255, 255, 255, 0.08)", borderColor: "rgba(255, 255, 255, 0.15)", color: "var(--brand-cyan)" }}>
            <Sparkle size={14} weight="fill" />
            <span>Ekosistem Terukur & Transparan</span>
          </div>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.2, marginBottom: "1.25rem" }}>
            {contextTitle}
          </h2>
          <div style={{ fontSize: "1.05rem", opacity: 0.9, lineHeight: 1.6, marginBottom: "2rem" }}>
            {context}
          </div>

          <div
            style={{
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "0.75rem",
              padding: "1.25rem",
              display: "flex",
              alignItems: "center",
              gap: "0.85rem",
            }}
          >
            <ShieldCheck size={28} weight="duotone" color="var(--brand-cyan)" />
            <span style={{ fontSize: "0.875rem", color: "#c9e0e8" }}>
              Seluruh transaksi pengerjaan terlindungi dengan 100% Liability Reserve & Garansi 30 Hari.
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
