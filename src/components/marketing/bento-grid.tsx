import {
  Brain,
  Gauge,
  Kanban,
  SealCheck,
  TrendUp,
  Sparkle,
} from "@phosphor-icons/react/dist/ssr";

export function BentoGrid() {
  return (
    <section className="landing-section" id="fitur-unggulan">
      <div className="landing-section__container">
        <div className="landing-section__header">
          <p className="landing-eyebrow">Solusi Terintegrasi</p>
          <h2>Dirancang untuk Hasil yang Terukur dan Terpercaya</h2>
          <p>
            Menggabungkan evaluasi kesiapan talenta dengan digitalisasi UMKM dalam ekosistem
            transparan.
          </p>
        </div>

        <div className="bento-grid">
          {/* Card 1: Adaptive Assessment */}
          <article className="bento-card">
            <div>
              <div className="bento-card__icon">
                <Brain size={28} weight="duotone" />
              </div>
              <h3>Adaptive Career Readiness</h3>
              <p>
                Evaluasi kompetensi teknis dan soft-skill adaptif sesuai 4 jalur profesi: Frontend,
                UI/UX, Data, dan Digital Marketing.
              </p>
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <span className="status-badge" data-tone="info">
                <Sparkle size={14} weight="fill" /> Bobot 60% Teknis + 40% Soft Skill
              </span>
            </div>
          </article>

          {/* Card 2: Deterministic Matching (Span 2) */}
          <article className="bento-card bento-card--span-2">
            <div>
              <div className="bento-card__icon">
                <Gauge size={28} weight="duotone" />
              </div>
              <h3>Smart Cocok Score Engine (0–100)</h3>
              <p>
                Algoritma pencocokan multi-faktor deterministik yang transparan: Skill (40%), Karier
                (20%), Waktu (15%), Pengalaman (15%), dan Mode Kerja (10%). Tanpa penilaian acak atau
                bias.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
              <span className="status-badge" data-tone="success">4 Tingkat Bukti Keahlian</span>
              <span className="status-badge" data-tone="warning">Insentif Penutupan Gap</span>
              <span className="status-badge" data-tone="info">Transparan 100%</span>
            </div>
          </article>

          {/* Card 3: Milestone Workspace */}
          <article className="bento-card bento-card--span-2">
            <div>
              <div className="bento-card__icon">
                <Kanban size={28} weight="duotone" />
              </div>
              <h3>Milestone Workspace & Staging Delivery</h3>
              <p>
                Pengerjaan terstruktur 1–4 tahapan milestone dengan penyerahan deliverable HTTPS
                staging preview URL sebelum persetujuan dan rilis dana.
              </p>
            </div>
            <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "1.5rem" }}>
              <span className="status-badge" data-tone="neutral">Payout 90% per Milestone</span>
              <span className="status-badge" data-tone="info">10% Retensi Garansi 30 Hari</span>
            </div>
          </article>

          {/* Card 4: Verified Portfolio */}
          <article className="bento-card">
            <div>
              <div className="bento-card__icon">
                <SealCheck size={28} weight="duotone" />
              </div>
              <h3>Verified Passport & Portfolio</h3>
              <p>
                Setiap proyek tuntas otomatis menghasilkan paspor keahlian dan portofolio resmi
                berstempel validasi pemilik usaha UMKM.
              </p>
            </div>
            <div style={{ marginTop: "1.5rem" }}>
              <span className="status-badge" data-tone="success">
                <TrendUp size={14} weight="bold" /> Bukti Kerja Nyata
              </span>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
