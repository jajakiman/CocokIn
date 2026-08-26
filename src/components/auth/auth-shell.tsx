import Link from "next/link";
import type { ReactNode } from "react";

type AuthShellProps = {
  title: string;
  description: string;
  contextTitle: string;
  context: ReactNode;
  children: ReactNode;
};

export function AuthShell({
  title,
  description,
  contextTitle,
  context,
  children,
}: AuthShellProps) {
  return (
    <>
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>
      <main className="auth-shell" id="main-content">
        <section className="auth-shell__form" aria-labelledby="auth-title">
          <Link className="auth-shell__brand" href="/" aria-label="CocokIn beranda">
            CocokIn
          </Link>
          <div className="auth-shell__form-inner">
            <header className="auth-shell__heading">
              <h1 id="auth-title">{title}</h1>
              <p>{description}</p>
            </header>
            {children}
          </div>
        </section>
        <aside className="auth-shell__context" aria-labelledby="auth-context-title">
          <div>
            <p className="auth-shell__eyebrow">Talent bertumbuh. UMKM naik kelas.</p>
            <h2 id="auth-context-title">{contextTitle}</h2>
            {context}
          </div>
        </aside>
      </main>
    </>
  );
}
