import Link from "next/link";
import { User, Storefront, ArrowRight, Sparkle } from "@phosphor-icons/react/dist/ssr";

export function EditorialHero() {
  return (
    <section className="editorial-hero" id="hero">
      <div className="editorial-hero__container">
        <div className="editorial-hero__header">
          <div className="editorial-tag-pill">
            <Sparkle size={14} weight="fill" />
            <span>Marketplace-Enabled Vertical SaaS</span>
          </div>

          <h1>
            Satu ekosistem untuk membuktikan skill dan menyelesaikan proyek digital UMKM.
          </h1>

          <p className="editorial-hero__lead">
            Bukan platform freelance biasa. Pengerjaan terstruktur 3–14 hari berbasis milestone,
            pencocokan cerdas 100% deterministik, dan portofolio resmi berstempel UMKM.
          </p>

          <div className="editorial-hero__ctas">
            <Link href="/register/talent" className="cta-button--primary">
              <User size={18} weight="bold" />
              <span>Mulai sebagai Talent</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
            <Link href="/register/business" className="cta-button--secondary">
              <Storefront size={18} weight="bold" />
              <span>Mulai sebagai UMKM</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </div>
        </div>

        {/* Browser Mockup Case Study Preview Frame (Lil Big Things Style) */}
        <div className="hero-browser-frame" aria-label="Pratinjau antarmuka pengerjaan CocokIn">
          <div className="browser-frame-bar">
            <span className="browser-dot browser-dot--red" aria-hidden="true" />
            <span className="browser-dot browser-dot--yellow" aria-hidden="true" />
            <span className="browser-dot browser-dot--green" aria-hidden="true" />
            <span className="browser-url-pill">cocokin.id/talent/workspace/prj-act-01</span>
          </div>

          <div className="browser-content-preview">
            {/* Left Pane: Talent Profile & Score */}
            <div className="preview-talent-pane">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase" }}>
                    Talent Pelaksana
                  </span>
                  <strong style={{ display: "block", fontSize: "1.1rem" }}>Nadia Putri</strong>
                </div>
                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: "0.7rem", color: "var(--muted-foreground)" }}>Cocok Score</span>
                  <strong style={{ display: "block", color: "var(--success)", fontSize: "1.25rem", fontVariantNumeric: "tabular-nums" }}>
                    87/100
                  </strong>
                </div>
              </div>
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", marginBottom: "0.75rem" }}>
                <span className="status-badge" data-tone="success">React Verified</span>
                <span className="status-badge" data-tone="info">HTML/CSS Assessed</span>
                <span className="status-badge" data-tone="neutral">Next.js</span>
              </div>
              <p style={{ fontSize: "0.8125rem", color: "var(--muted-foreground)", margin: 0 }}>
                Kesiapan Karier: <strong>72/100</strong> • Institut Teknologi Bandung
              </p>
            </div>

            {/* Right Pane: Active Project & Milestone Status */}
            <div className="preview-project-pane">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <div>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--success)", textTransform: "uppercase" }}>
                    Proyek Aktif UMKM
                  </span>
                  <strong style={{ display: "block", fontSize: "1.1rem" }}>Warung Bu Siti</strong>
                </div>
                <span className="status-badge" data-tone="warning">Milestone 2/3</span>
              </div>
              <p style={{ fontSize: "0.85rem", fontWeight: 600, marginBottom: "0.5rem" }}>
                Website Katalog & Pemesanan WhatsApp (8 Hari)
              </p>
              <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: "0.375rem", padding: "0.6rem 0.75rem", fontSize: "0.8rem", display: "flex", justifyContent: "space-between" }}>
                <span>Staging URL: <code>staging.warungbusiti.id</code></span>
                <span style={{ color: "var(--success)", fontWeight: 700 }}>✓ HTTPS Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
