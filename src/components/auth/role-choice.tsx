import Link from "next/link";
import { User, Storefront, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export function RoleChoice() {
  return (
    <div className="auth-role-choice">
      <Link href="/register/talent" className="auth-role-card">
        <div className="auth-role-card__icon">
          <User size={32} weight="duotone" />
        </div>
        <div>
          <strong style={{ fontSize: "1.1rem" }}>Daftar sebagai Talent</strong>
          <span style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
            Mahasiswa, fresh graduate, atau talenta muda yang ingin menguji skill dan meraih portofolio nyata.
          </span>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--primary)" }}>
            <span>✓ Asesmen Karier</span>
            <span>✓ Cocok Score Matching</span>
            <span>✓ Verified Passport</span>
          </div>
        </div>
        <ArrowRight size={20} weight="bold" />
      </Link>

      <Link href="/register/business" className="auth-role-card">
        <div className="auth-role-card__icon" style={{ color: "var(--success)" }}>
          <Storefront size={32} weight="duotone" />
        </div>
        <div>
          <strong style={{ fontSize: "1.1rem" }}>Daftar sebagai UMKM</strong>
          <span style={{ fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
            Pemilik bisnis yang ingin menuntaskan solusi digital praktis dengan talenta terverifikasi.
          </span>
          <div style={{ display: "flex", gap: "0.75rem", marginTop: "0.5rem", fontSize: "0.75rem", color: "var(--success)" }}>
            <span>✓ Diagnosis Kebutuhan</span>
            <span>✓ Milestone Terstruktur</span>
            <span>✓ Garansi 30 Hari</span>
          </div>
        </div>
        <ArrowRight size={20} weight="bold" />
      </Link>
    </div>
  );
}
