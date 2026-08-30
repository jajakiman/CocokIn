import Link from "next/link";
import { User, Storefront, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export function RoleChoice() {
  return (
    <div className="auth-role-choice">
      <Link href="/register/talent" className="auth-role-card">
        <div className="auth-role-card__icon">
          <User size={24} weight="duotone" />
        </div>
        <div className="flex-1 min-w-0">
          <strong className="block text-[#001040] text-base font-bold">Daftar sebagai Talent</strong>
          <span className="block text-xs text-[#53647A] mt-1 leading-relaxed">
            Mahasiswa atau talenta muda yang ingin menguji skill dan meraih portofolio proyek nyata.
          </span>
        </div>
        <ArrowRight size={18} weight="bold" className="text-[#9AABC2] shrink-0" />
      </Link>

      <Link href="/register/business" className="auth-role-card">
        <div className="auth-role-card__icon" style={{ color: "var(--brand-orange)" }}>
          <Storefront size={24} weight="duotone" />
        </div>
        <div className="flex-1 min-w-0">
          <strong className="block text-[#001040] text-base font-bold">Daftar sebagai UMKM</strong>
          <span className="block text-xs text-[#53647A] mt-1 leading-relaxed">
            Pemilik bisnis yang ingin menuntaskan transformasi digital praktis dengan talenta terverifikasi.
          </span>
        </div>
        <ArrowRight size={18} weight="bold" className="text-[#9AABC2] shrink-0" />
      </Link>
    </div>
  );
}
