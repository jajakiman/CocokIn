import Link from "next/link";
import { PublicHeader } from "@/src/components/public/public-header";
import { PublicFooter } from "@/src/components/public/public-footer";
import { EditorialHero } from "./editorial-hero";
import { FeaturedProjects } from "./featured-projects";
import { RolePathways } from "./role-pathways";
import { HowItWorksProcess } from "./how-it-works-process";
import { ProductProof } from "./product-proof";
import {
  ShieldCheck,
  Scales,
  ArrowsClockwise,
  User,
  Storefront,
  ArrowRight,
  Sparkle,
  LockKey,
} from "@phosphor-icons/react/dist/ssr";

export function GuestLanding() {
  return (
    <div className="public-shell">
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>
      <PublicHeader />

      <main id="main-content" tabIndex={-1}>
        {/* 1. Editorial Hero with Case Study Browser Frame */}
        <EditorialHero />

        {/* 2. Trust & Metric Strip */}
        <section className="metric-strip" aria-label="Ringkasan standar platform">
          <div className="metric-strip__container">
            <div className="metric-strip-item">
              <Scales size={24} weight="duotone" className="metric-strip-item__icon" />
              <div>
                <strong>100% Liability Reserve</strong>
                <span>Kompensasi aman di penampungan</span>
              </div>
            </div>

            <div className="metric-strip-item">
              <ShieldCheck size={24} weight="duotone" className="metric-strip-item__icon" />
              <div>
                <strong>Garansi Kualitas 30 Hari</strong>
                <span>Retensi 10% pasca handover</span>
              </div>
            </div>

            <div className="metric-strip-item">
              <LockKey size={24} weight="duotone" className="metric-strip-item__icon" />
              <div>
                <strong>Persetujuan Hak Ganda</strong>
                <span>Izin Talent & Atribusi UMKM</span>
              </div>
            </div>

            <div className="metric-strip-item">
              <Sparkle size={24} weight="duotone" className="metric-strip-item__icon" />
              <div>
                <strong>Penyelarasan SDG 8 & 9</strong>
                <span>Pemberdayaan talenta & UMKM</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Featured Real Projects & Case Studies */}
        <FeaturedProjects />

        {/* 4. Two-Sided Role Pathways (Talent vs UMKM) */}
        <RolePathways />

        {/* 5. 4-Step Process */}
        <HowItWorksProcess />

        {/* 6. Product Proof Section */}
        <ProductProof />

        {/* 7. Institutional Trust & Governance Policy */}
        <section className="landing-section" id="trust">
          <div className="landing-section__container">
            <div className="section-header-editorial">
              <div>
                <p className="editorial-tag-pill">Etika & Keamanan Transaksi</p>
                <h2>Tata Kelola Platform yang Mengikat & Transparan</h2>
                <p>
                  Aturan bisnis resmi yang melindungi dana, hak cipta portofolio, dan kualitas hasil kerja.
                </p>
              </div>
            </div>

            <div className="trust-cards-grid">
              <article className="trust-card">
                <div className="trust-card__icon">
                  <Scales size={28} weight="duotone" />
                </div>
                <h3>100% Liability Reserve Coverage</h3>
                <p>
                  Dana pembayaran proyek disimpan aman di rekening terpisah dengan rasio proteksi 100%.
                  CocokIn menjamin hak pembayaran Talent dan hak pengembalian dana UMKM jika terjadi sengketa.
                </p>
              </article>

              <article className="trust-card">
                <div className="trust-card__icon">
                  <ShieldCheck size={28} weight="duotone" />
                </div>
                <h3>Penerbitan Portofolio Berizin Ganda</h3>
                <p>
                  Portofolio publik tidak dapat diterbitkan sepihak. Publikasi mensyaratkan izin eksplisit
                  dari Talent serta persetujuan atribusi bisnis dari pemilik UMKM.
                </p>
              </article>

              <article className="trust-card">
                <div className="trust-card__icon">
                  <ArrowsClockwise size={28} weight="duotone" />
                </div>
                <h3>Penjaminan Bug & Retensi 30 Hari</h3>
                <p>
                  10% dari setiap milestone pembayaran dialokasikan sebagai retensi garansi bug selama
                  30 hari setelah serah terima production handover tuntas.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 8. Strong Final Call to Action */}
        <section className="final-cta-section" id="final-cta">
          <div className="final-cta-container">
            <p className="editorial-tag-pill" style={{ background: "rgba(255, 255, 255, 0.1)", color: "var(--brand-cyan)", borderColor: "rgba(255, 255, 255, 0.2)" }}>
              Langkah Selanjutnya
            </p>
            <h2>Mulai Kolaborasi Terukur Hari Ini</h2>
            <p>
              Uji kesiapan kariermu dengan proyek nyata atau percepat digitalisasi usahamu dengan talenta muda terverifikasi.
            </p>

            <div className="final-cta-actions">
              <Link href="/register/talent" className="final-btn-talent">
                <User size={18} weight="bold" />
                <span>Mulai sebagai Talent</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
              <Link href="/register/business" className="final-btn-business">
                <Storefront size={18} weight="bold" />
                <span>Mulai sebagai UMKM</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
