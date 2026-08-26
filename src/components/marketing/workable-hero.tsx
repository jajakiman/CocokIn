import Link from "next/link";
import { User, Storefront, ArrowRight, Sparkle, ShieldCheck, CheckCircle } from "@phosphor-icons/react/dist/ssr";

export function WorkableHero() {
  return (
    <section className="workable-hero" id="hero">
      <div className="workable-hero__container">
        {/* Left: Value Proposition & CTAs */}
        <div>
          <div className="workable-pill">
            <Sparkle size={14} weight="fill" />
            <span>Marketplace-Enabled Vertical SaaS</span>
          </div>

          <h1>
            Ekosistem Kerja Nyata untuk Talenta Muda & Digitalisasi UMKM.
          </h1>

          <p className="workable-hero__lead">
            Bukan platform freelance biasa. Pengerjaan terstruktur 3–14 hari berbasis milestone,
            pencocokan 100% deterministik, dan penerbitan portofolio resmi berstempel UMKM.
          </p>

          <div className="workable-hero__ctas">
            <Link href="/register/talent" className="cta-btn-primary">
              <User size={18} weight="bold" />
              <span>Mulai sebagai Talent</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link href="/register/business" className="cta-btn-secondary">
              <Storefront size={18} weight="bold" />
              <span>Mulai sebagai UMKM</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>

          <div style={{ display: "flex", gap: "1.5rem", marginTop: "2rem", flexWrap: "wrap", fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <CheckCircle size={16} weight="fill" color="var(--success)" /> Matching 100% Deterministik
            </span>
            <span style={{ display: "flex", alignItems: "center", gap: "0.4rem" }}>
              <ShieldCheck size={16} weight="fill" color="var(--primary)" /> 100% Liability Reserve & Garansi
            </span>
          </div>
        </div>

        {/* Right: Authentic Product UI Frame */}
        <div className="hero-product-card" aria-label="Pratinjau antarmuka pengerjaan proyek CocokIn">
          <div className="hero-product-card__header">
            <h3>Pusat Kerja & Kolaborasi Terukur</h3>
            <span className="status-badge" data-tone="success">Proyek Aktif</span>
          </div>

          <div className="hero-product-card__body">
            {/* Top Subcard: Talent Card */}
            <div className="hero-subcard">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase" }}>Talent Pelaksana</span>
                  <strong style={{ display: "block", fontSize: "1.05rem" }}>Nadia Putri</strong>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>Cocok Score</span>
                  <strong style={{ display: "block", color: "var(--success)", fontSize: "1.2rem", fontVariantNumeric: "tabular-nums" }}>87/100</strong>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap", fontSize: "0.75rem" }}>
                <span className="skill-tag">React Verified</span>
                <span className="skill-tag">HTML/CSS Assessed</span>
                <span className="skill-tag">Next.js</span>
              </div>
            </div>

            {/* Bottom Subcard: MSME Project Card */}
            <div className="hero-subcard" style={{ background: "var(--surface-selected)", borderColor: "var(--brand-blue)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--success)", textTransform: "uppercase" }}>Proyek UMKM</span>
                  <strong style={{ display: "block", fontSize: "1.05rem" }}>Warung Bu Siti</strong>
                </div>
                <span className="status-badge" data-tone="warning">Milestone 2/3</span>
              </div>
              <p style={{ fontSize: "0.85rem", color: "var(--foreground)", fontWeight: 600, margin: "0 0 0.5rem" }}>
                Website Katalog & Pemesanan WhatsApp (8 Hari)
              </p>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "0.375rem", padding: "0.5rem 0.75rem", fontSize: "0.75rem", display: "flex", justifyContent: "space-between" }}>
                <span>Deliverable: <code>staging.warungbusiti.id</code></span>
                <span style={{ color: "var(--success)", fontWeight: 700 }}>✓ HTTPS Review Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
