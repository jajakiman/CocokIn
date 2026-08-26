import Link from "next/link";
import {
  User,
  Storefront,
  CheckCircle,
  Lightning,
  ShieldCheck,
} from "@phosphor-icons/react/dist/ssr";

export function AnimatedHero() {
  return (
    <section className="landing-hero" id="hero">
      <div className="landing-hero__ambient" aria-hidden="true" />
      <div className="landing-hero__inner">
        <div className="landing-hero__copy">
          <div className="landing-pill">
            <span className="landing-pill__dot" aria-hidden="true" />
            <span>Platform Kolaborasi Proyek Digital</span>
          </div>

          <h1>
            Ubah Potensi Jadi <span className="highlight-gradient">Bukti Nyata</span>, Selesaikan
            Kebutuhan Solutif.
          </h1>

          <p className="landing-hero__lead">
            CocokIn menghubungkan talenta muda siap kerja dengan UMKM yang membutuhkan digitalisasi
            aplikatif melalui pengerjaan proyek mikro terstruktur dan bergaransi.
          </p>

          <div className="landing-hero__ctas">
            <Link href="/register/talent" className="cta-button--primary">
              <User size={20} weight="bold" />
              <span>Mulai sebagai Talent</span>
            </Link>
            <Link href="/register/business" className="cta-button--secondary">
              <Storefront size={20} weight="bold" />
              <span>Mulai sebagai UMKM</span>
            </Link>
          </div>

          <div
            style={{
              display: "flex",
              gap: "1.5rem",
              marginTop: "2rem",
              flexWrap: "wrap",
              fontSize: "0.85rem",
              color: "var(--muted-foreground)",
            }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <CheckCircle size={16} weight="fill" color="var(--success)" /> Pencocokan Objektif & Adil
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <ShieldCheck size={16} weight="fill" color="var(--primary)" /> Milestone Bergaransi 30 Hari
            </span>
          </div>
        </div>

        {/* 21st.dev Style Floating Matching Widget */}
        <div className="hero-match-widget" aria-label="Simulasi pencocokan cerdas">
          <div className="hero-match-widget__header">
            <h3>
              <Lightning size={16} weight="fill" style={{ display: "inline", marginRight: "4px" }} />
              Simulasi Pencocokan
            </h3>
            <span className="status-badge" data-tone="success">
              Siap Mencocokkan
            </span>
          </div>

          <div className="hero-match-widget__actors">
            <div className="actor-card">
              <div className="actor-card__avatar actor-card__avatar--talent">
                <User size={20} weight="duotone" />
              </div>
              <div className="actor-card__info">
                <strong>Nadia Putri</strong>
                <span>Frontend Dev • React, Next.js (Assessed: 90)</span>
              </div>
            </div>

            <div className="actor-card">
              <div className="actor-card__avatar actor-card__avatar--business">
                <Storefront size={20} weight="duotone" />
              </div>
              <div className="actor-card__info">
                <strong>Warung Bu Siti</strong>
                <span>Proyek: Website Katalog WhatsApp (8 Hari)</span>
              </div>
            </div>
          </div>

          <div className="hero-match-widget__result">
            <div className="hero-match-label">
              <strong>Cocok Score: 87/100</strong>
              <span>Sangat Cocok • Menutup Major Skill Gap</span>
            </div>
            <div className="hero-match-score">87</div>
          </div>
        </div>
      </div>
    </section>
  );
}
