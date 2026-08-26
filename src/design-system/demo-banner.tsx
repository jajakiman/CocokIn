import Link from "next/link";
import { Info, SignOut } from "@phosphor-icons/react/dist/ssr";

type DemoBannerProps = {
  role?: string;
};

export function DemoBanner({ role }: DemoBannerProps) {
  return (
    <aside className="demo-banner" aria-label="Informasi status mode demo">
      <div className="demo-banner__content">
        <span className="demo-banner__icon" aria-hidden="true">
          <Info size={16} weight="bold" />
        </span>
        <div className="demo-banner__text">
          <strong>Mode Demo {role ? `(${role})` : ""}</strong> · Seluruh data, skor, dan riwayat
          transaksi bersifat sintetis (SEEDED_DEMO).
        </div>
      </div>
      <Link href="/" className="demo-banner__exit">
        <SignOut size={14} weight="bold" aria-hidden="true" />
        <span>Keluar dari demo</span>
      </Link>
    </aside>
  );
}
