import Link from "next/link";
import { PublicHeader } from "@/src/components/public/public-header";
import { PublicFooter } from "@/src/components/public/public-footer";
import { WorkableHero } from "./workable-hero";
import { TalentFeatureSplit } from "./talent-feature-split";
import { BusinessFeatureSplit } from "./business-feature-split";
import { MatchingScorecardShowcase } from "./matching-scorecard-showcase";
import { FeaturedProjects } from "./featured-projects";
import {
  Scales,
  ShieldCheck,
  LockKey,
  Sparkle,
  ArrowsClockwise,
  User,
  Storefront,
  ArrowRight,
} from "@phosphor-icons/react/dist/ssr";

export function GuestLanding() {
  return (
    <div className="public-shell">
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>
      <PublicHeader />

      <main id="main-content" tabIndex={-1}>
        {/* 1. Workable Hero */}
        <WorkableHero />

        {/* 2. Credibility / Trust Strip */}
        <section className="credibility-strip" aria-label="Standar Kepercayaan Platform">
          <div className="credibility-strip__container">
            <div className="credibility-item">
              <div className="credibility-item__icon">
                <Scales size={22} weight="duotone" />
              </div>
              <div>
                <strong>100% Liability Reserve</strong>
                <span>Dana aman di penampungan terpisah</span>
              </div>
            </div>

            <div className="credibility-item">
              <div className="credibility-item__icon">
                <ShieldCheck size={22} weight="duotone" />
              </div>
              <div>
                <strong>Garansi Bug 30 Hari</strong>
                <span>10% retensi pasca serah terima</span>
              </div>
            </div>

            <div className="credibility-item">
              <div className="credibility-item__icon">
                <LockKey size={22} weight="duotone" />
              </div>
              <div>
                <strong>Atribusi Hak Ganda</strong>
                <span>Izin Talent & Atribusi UMKM</span>
              </div>
            </div>

            <div className="credibility-item">
              <div className="credibility-item__icon">
                <Sparkle size={22} weight="duotone" />
              </div>
              <div>
                <strong>Penyelarasan SDG 8 & 9</strong>
                <span>Pertumbuhan ekonomi & inovasi</span>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Deep Feature Split 1: Talent */}
        <TalentFeatureSplit />

        {/* 4. Deep Feature Split 2: UMKM */}
        <BusinessFeatureSplit />

        {/* 5. Smart Matching Engine Scorecard */}
        <MatchingScorecardShowcase />

        {/* 6. Featured Real Projects & Case Studies */}
        <FeaturedProjects />

        {/* 7. Institutional Governance & Trust */}
        <section className="trust-section" id="trust">
          <div className="trust-container">
            <div className="section-header-editorial">
              <div>
                <p className="editorial-tag-pill">Etika & Keamanan</p>
                <h2>Tata Kelola Platform yang Mengikat & Transparan</h2>
                <p>
                  Aturan bisnis resmi yang melindungi dana, hak cipta portofolio, dan kualitas hasil kerja.
                </p>
              </div>
            </div>

            <div className="trust-grid">
              <article className="trust-item-card">
                <div className="trust-item-card__icon">
                  <Scales size={28} weight="duotone" />
                </div>
                <h3>100% Liability Reserve Coverage</h3>
                <p>
                  Dana pembayaran proyek disimpan aman di rekening terpisah dengan rasio proteksi 100%.
                  CocokIn menjamin hak pembayaran Talent dan hak pengembalian dana UMKM jika terjadi sengketa.
                </p>
              </article>

              <article className="trust-item-card">
                <div className="trust-item-card__icon">
                  <ShieldCheck size={28} weight="duotone" />
                </div>
                <h3>Penerbitan Portofolio Berizin Ganda</h3>
                <p>
                  Portofolio publik tidak dapat diterbitkan sepihak. Publikasi mensyaratkan izin eksplisit
                  dari Talent serta persetujuan atribusi bisnis dari pemilik UMKM.
                </p>
              </article>

              <article className="trust-item-card">
                <div className="trust-item-card__icon">
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

        {/* 8. Workable-Style Pre-Footer Call to Action */}
        <section className="pre-footer-cta" id="final-cta">
          <div className="pre-footer-container">
            <p className="editorial-tag-pill" style={{ background: "rgba(255, 255, 255, 0.1)", color: "var(--brand-cyan)", borderColor: "rgba(255, 255, 255, 0.2)" }}>
              Langkah Selanjutnya
            </p>
            <h2>Mulai Kolaborasi Terukur Hari Ini</h2>
            <p>
              Buktikan kesiapan kariermu dengan proyek nyata atau wujudkan digitalisasi usahamu dengan talenta muda terverifikasi.
            </p>

            <div className="pre-footer-actions">
              <Link href="/register/talent" className="pre-footer-btn-talent">
                <User size={18} weight="bold" />
                <span>Mulai sebagai Talent</span>
                <ArrowRight size={16} weight="bold" />
              </Link>
              <Link href="/register/business" className="pre-footer-btn-business">
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
