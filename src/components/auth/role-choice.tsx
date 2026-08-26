import { ArrowRight, Briefcase, Storefront } from "@phosphor-icons/react/dist/ssr";
import Link from "next/link";

const roles = [
  {
    href: "/register/talent",
    label: "Talent",
    action: "Daftar sebagai Talent",
    description: "Ukur kesiapan karier, temukan micro-project, dan bangun bukti kerja terverifikasi.",
    icon: Briefcase,
  },
  {
    href: "/register/business",
    label: "UMKM",
    action: "Daftar sebagai UMKM",
    description: "Diagnosa kebutuhan digital, temukan Talent yang sesuai, dan tinjau hasil secara terukur.",
    icon: Storefront,
  },
] as const;

export function RoleChoice() {
  return (
    <div className="auth-role-choice">
      {roles.map(({ href, label, action, description, icon: Icon }) => (
        <Link className="auth-role-card" href={href} key={href} aria-label={action}>
          <Icon aria-hidden="true" className="auth-role-card__icon" size={28} />
          <span>
            <strong>{label}</strong>
            <span>{description}</span>
          </span>
          <ArrowRight aria-hidden="true" size={20} />
        </Link>
      ))}
      <p className="auth-form__switch">Sudah punya akun? <Link href="/login">Masuk</Link></p>
    </div>
  );
}
