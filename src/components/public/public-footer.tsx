import { ShieldCheck } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const footerLinks = [
  { href: "#cara-kerja", label: "Cara Kerja" },
  { href: "#untuk-talent", label: "Untuk Talent" },
  { href: "#untuk-umkm", label: "Untuk UMKM" },
  { href: "/login", label: "Masuk" },
  { href: "/register", label: "Daftar" },
] as const;

export function PublicFooter() {
  return (
    <footer className="public-footer">
      <div className="public-footer__inner">
        <div className="public-footer__summary">
          <Link className="public-brand public-brand--footer" href="/">CocokIn</Link>
          <p>Talent bertumbuh, UMKM naik kelas melalui proyek digital yang terukur.</p>
          <p className="public-footer__platform-note">
            <ShieldCheck aria-hidden="true" size={18} />
            Platform Matching & Vertical SaaS Indonesia
          </p>
        </div>
        <nav className="public-footer__nav" aria-label="Navigasi footer">
          {footerLinks.map((link) => (
            <Link href={link.href} key={link.href}>{link.label}</Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
