import Link from "next/link";
import { PublicHeader } from "@/src/components/public/public-header";
import { PublicFooter } from "@/src/components/public/public-footer";
import { AnimatedHero } from "./animated-hero";
import { BentoGrid } from "./bento-grid";
import { CocokScoreSimulator } from "./cocok-score-simulator";
import { ProductProof } from "./product-proof";
import {
  ShieldCheck,
  Scales,
  ArrowsClockwise,
  User,
  Storefront,
} from "@phosphor-icons/react/dist/ssr";

export function GuestLanding() {
  return (
    <div className="public-shell">
      <a className="skip-link" href="#main-content">
        Lewati ke konten utama
      </a>
      <PublicHeader />

      <main id="main-content" tabIndex={-1}>
        {/* 1. 21st.dev Animated Hero */}
        <AnimatedHero />

        {/* 2. Bento Grid Value Proposition */}
        <BentoGrid />

        {/* 3. Interactive Cocok Score Simulator */}
        <CocokScoreSimulator />

        {/* 4. Product Proof Section */}
        <ProductProof />

        {/* 5. Trust, Governance, & Business Rules Policy */}
        <section className="landing-section" id="trust">
          <div className="landing-section__container">
            <div className="landing-section__header">
              <p className="landing-eyebrow">Etika & Keamanan Platform</p>
              <h2>Fondasi Kepercayaan Tanpa Kompromi</h2>
              <p>
                Aturan bisnis yang mengikat seluruh transaksi, persetujuan privasi data, dan
                penjaminan kualitas hasil.
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gap: "1.5rem",
                gridTemplateColumns: "repeat(auto-fit, minmax(18rem, 1fr))",
              }}
            >
              <article className="bento-card">
                <div className="bento-card__icon">
                  <Scales size={24} weight="duotone" />
                </div>
                <h3>100% Liability Reserve</h3>
                <p>
                  Dana proyek aman disimpan dalam cadangan kas terpisah dengan rasio proteksi 100%
                  untuk menjamin pembayaran hak Talent dan hak pengembalian dana UMKM.
                </p>
              </article>

              <article className="bento-card">
                <div className="bento-card__icon">
                  <ShieldCheck size={24} weight="duotone" />
                </div>
                <h3>Consent & Atribusi Resmi</h3>
                <p>
                  Penerbitan portofolio publik mewajibkan izin eksplisit dari Talent serta persetujuan
                  atribusi bisnis dari pemilik UMKM.
                </p>
              </article>

              <article className="bento-card">
                <div className="bento-card__icon">
                  <ArrowsClockwise size={24} weight="duotone" />
                </div>
                <h3>Garansi & Retensi 30 Hari</h3>
                <p>
                  10% nilai kompensasi proyek dialokasikan sebagai retensi garansi kualitas bug selama
                  30 hari pasca serah terima production handover.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* 6. Final Call to Action */}
        <section
          className="landing-section"
          id="final-cta"
          style={{ background: "linear-gradient(180deg, #ffffff 0%, var(--surface-subtle) 100%)" }}
        >
          <div className="landing-section__container" style={{ textAlign: "center" }}>
            <p className="landing-eyebrow">Siap Memulai?</p>
            <h2 style={{ fontSize: "clamp(2rem, 5vw, 3.25rem)", marginBottom: "1rem" }}>
              Bergabunglah dalam Ekosistem CocokIn
            </h2>
            <p
              style={{
                color: "var(--muted-foreground)",
                fontSize: "1.1rem",
                maxWidth: "52ch",
                margin: "0 auto 2.5rem",
              }}
            >
              Tingkatkan kesiapan kariermu dengan proyek nyata atau wujudkan digitalisasi usahamu
              dengan talenta muda teruji.
            </p>

            <div style={{ display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
              <Link href="/register/talent" className="cta-button--primary">
                <User size={20} weight="bold" />
                <span>Daftar sebagai Talent</span>
              </Link>
              <Link href="/register/business" className="cta-button--secondary">
                <Storefront size={20} weight="bold" />
                <span>Daftar sebagai UMKM</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />
    </div>
  );
}
