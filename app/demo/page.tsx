import Link from "next/link";
import type { Metadata } from "next";
import { PublicHeader } from "@/src/components/public/public-header";
import { PublicFooter } from "@/src/components/public/public-footer";
import { User, Storefront, ArrowRight, Info } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Demo Sistem & Data Sintetis | CocokIn",
  description: "Eksplorasi alur kerja platform CocokIn untuk Talent dan UMKM menggunakan data sintetis deterministik.",
};

export default function DemoPage() {
  return (
    <div className="public-shell">
      <PublicHeader />
      <main id="main-content" className="demo-page-content">
        <div className="demo-page-container">
          <div className="demo-page-header">
            <p className="eyebrow">Interactive Preview · Staging</p>
            <h1>Eksplorasi Mode Demo CocokIn</h1>
            <p className="demo-page-desc">
              Pilih peran untuk memeriksa alur kerja, matching algoritmik, dan ruang kerja proyek.
              Seluruh data di dalam demo ini bersifat <strong>sintetis (SEEDED_DEMO)</strong> dan tidak
              mengubah data nyata.
            </p>
          </div>

          <div className="demo-disclaimer" role="note">
            <Info size={20} weight="duotone" className="text-primary" />
            <div>
              <strong>Catatan Mode Staging</strong>
              <p>
                Mode demo tidak memerlukan autentikasi login atau akun email asli. Anda dapat keluar
                kembali ke beranda kapan saja.
              </p>
            </div>
          </div>

          <div className="demo-cards-grid">
            <article className="demo-card">
              <div className="demo-card__icon demo-card__icon--talent">
                <User size={32} weight="duotone" />
              </div>
              <h2>Demo Peran Talent</h2>
              <p>
                Lihat evaluasi kesiapan karier Nadia Putri, periksa analisis <em>Major Skill Gap</em>,
                jelajahi marketplace proyek dengan Cocok Score live, dan tinjau Paspor Keahlian.
              </p>
              <Link href="/talent?demo=talent" className="primary-action demo-card__btn">
                <span>Buka Demo Talent</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
            </article>

            <article className="demo-card">
              <div className="demo-card__icon demo-card__icon--business">
                <Storefront size={32} weight="duotone" />
              </div>
              <h2>Demo Peran UMKM</h2>
              <p>
                Periksa kontrol proyek Warung Bu Siti, pantau pengiriman deliverable milestone,
                skor kesiapan digital usaha, dan simulasi peninjauan pelamar.
              </p>
              <Link href="/business?demo=business" className="secondary-action demo-card__btn">
                <span>Buka Demo UMKM</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
            </article>
          </div>
        </div>
      </main>
      <PublicFooter />
    </div>
  );
}
