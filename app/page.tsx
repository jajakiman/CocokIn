import Link from "next/link";

const roles = [
  { href: "/talent", label: "Talent", detail: "Pertumbuhan skill, matching, dan bukti kerja." },
  { href: "/business", label: "UMKM", detail: "Diagnosis kebutuhan, proyek, dan hasil bisnis." },
  { href: "/admin", label: "Admin", detail: "Verifikasi, audit, dan operasi platform." },
];

export default function Home() {
  return (
    <main className="role-entry">
      <section className="role-entry__intro">
        <p className="eyebrow">Release 0 · Data sintetis</p>
        <h1>Satu sistem, tiga sudut pandang.</h1>
        <p>
          Pilih preview role untuk memeriksa fondasi UI CocokIn sebelum domain dan provider
          production diaktifkan.
        </p>
      </section>
      <section aria-label="Pilih role" className="role-entry__grid">
        {roles.map((role) => (
          <Link className="role-card" href={role.href} key={role.href}>
            <span>{role.label}</span>
            <p>{role.detail}</p>
            <strong>Buka preview</strong>
          </Link>
        ))}
      </section>
      <Link className="text-link" href="/dev/design-system">
        Lihat katalog design system
      </Link>
    </main>
  );
}
