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
        {/* 1. Centered HeyRetro Hero & Live Board Showcase */}
        <WorkableHero />

        {/* 2. Compact Proof Bar */}
        <section className="heyretro-proof-bar" aria-label="Standar Kepercayaan Platform">
          <div className="heyretro-container">
            <div className="proof-bar-grid">
              <div className="proof-item">
                <div className="proof-item__icon">
                  <Scales size={20} weight="duotone" />
                </div>
                <div>
                  <strong>Dana Pembayaran Terlindungi</strong>
                  <span>Kewajiban pengguna tercatat transparan</span>
                </div>
              </div>

              <div className="proof-item">
                <div className="proof-item__icon">
                  <ShieldCheck size={20} weight="duotone" />
                </div>
                <div>
                  <strong>Garansi Perbaikan 30 Hari</strong>
                  <span>Retensi aman pasca serah terima</span>
                </div>
              </div>

              <div className="proof-item">
                <div className="proof-item__icon">
                  <LockKey size={20} weight="duotone" />
                </div>
                <div>
                  <strong>Persetujuan Bersama</strong>
                  <span>Izin Talent & persetujuan UMKM</span>
                </div>
              </div>

              <div className="proof-item">
                <div className="proof-item__icon">
                  <Sparkle size={20} weight="duotone" />
                </div>
                <div>
                  <strong>Penyelarasan SDG 8 & 9</strong>
                  <span>Karier bermakna & digitalisasi usaha</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Role Split 1: Talent */}
        <TalentFeatureSplit />

        {/* 4. Role Split 2: UMKM */}
        <BusinessFeatureSplit />

        {/* 5. Smart Matching Showcase */}
        <MatchingScorecardShowcase />

        {/* 6. Real Projects & Case Studies */}
        <FeaturedProjects />

        {/* 7. Trust & Institutional Governance */}
        <section className="heyretro-trust-section" id="trust">
          <div className="heyretro-container">
            <div className="section-header-centered section-header-centered--dark">
              <div className="section-pill section-pill--trust">
                <ShieldCheck size={14} weight="fill" />
                <span>Etika & Keamanan</span>
              </div>
              <h2>Perlindungan yang Jelas untuk Setiap Proyek</h2>
              <p>
                Aturan yang mudah dipahami untuk menjaga pembayaran, izin portofolio, dan kualitas hasil kerja.
              </p>
            </div>

            <div className="trust-cards-grid">
              <article className="trust-card">
                <div className="trust-card__icon">
                  <Scales size={26} weight="duotone" />
                </div>
                <h3>Dana Pembayaran Aman & Terlindungi</h3>
                <p>
                  Dana proyek dijaga sesuai kewajiban kepada pengguna. Hak pembayaran Talent dan hak
                  pengembalian dana UMKM tetap tercatat jika terjadi kendala.
                </p>
              </article>

              <article className="trust-card">
                <div className="trust-card__icon">
                  <ShieldCheck size={26} weight="duotone" />
                </div>
                <h3>Portofolio Terbit atas Persetujuan Bersama</h3>
                <p>
                  Portofolio publik hanya dapat diterbitkan setelah Talent memberikan izin dan pemilik
                  UMKM menyetujui penyebutan usahanya.
                </p>
              </article>

              <article className="trust-card">
                <div className="trust-card__icon">
                  <ArrowsClockwise size={26} weight="duotone" />
                </div>
                <h3>Garansi Perbaikan 30 Hari</h3>
                <p>
                  Sebagian pembayaran ditahan selama masa garansi agar kendala hasil kerja tetap ditangani
                  hingga 30 hari setelah serah terima.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 8. HeyRetro Style Final Action Banner */}
        <section className="heyretro-cta-section" id="final-cta">
          <div className="heyretro-container">
            <div className="cta-banner-box">
              <div className="section-pill section-pill--cta">
                <Sparkle size={14} weight="fill" />
                <span>Langkah Selanjutnya</span>
              </div>
              <h2>Mulai Kolaborasi Terukur Hari Ini</h2>
              <p>
                Buktikan kesiapan kariermu dengan proyek nyata atau wujudkan digitalisasi usahamu dengan talenta muda terverifikasi.
              </p>

              <div className="cta-banner-buttons">
                <Link href="/register/talent" className="hero-cta-btn hero-cta-btn--talent">
                  <User size={18} weight="bold" />
                  <span>Mulai sebagai Talent</span>
                  <ArrowRight size={16} weight="bold" />
                </Link>
                <Link href="/register/business" className="hero-cta-btn hero-cta-btn--business-dark">
                  <Storefront size={18} weight="bold" />
                  <span>Mulai sebagai UMKM</span>
                  <ArrowRight size={16} weight="bold" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
