import Link from "next/link";
import { User, Storefront, Check, ArrowRight } from "@phosphor-icons/react/dist/ssr";

export function RolePathways() {
  return (
    <section className="landing-section" id="alur-kebutuhan">
      <div className="landing-section__container">
        <div className="section-header-editorial">
          <div>
            <p className="editorial-tag-pill">Pilihan Jalur Nilai</p>
            <h2>Dirancang untuk Kebutuhan Kedua Belah Pihak</h2>
            <p>
              Talent bertumbuh melalui portofolio valid, UMKM bertransformasi melalui digitalisasi nyata.
            </p>
          </div>
        </div>

        <div className="pathways-grid">
          {/* Pathway 1: Talent */}
          <article className="pathway-card pathway-card--talent" id="untuk-talent">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span
                  style={{
                    background: "var(--info-subtle)",
                    color: "var(--primary)",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    display: "inline-flex",
                  }}
                >
                  <User size={24} weight="duotone" />
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase" }}>
                  B2Talent Career SaaS
                </span>
              </div>

              <h3>Untuk Mahasiswa & Fresh Graduate</h3>
              <p className="pathway-card__desc">
                Raih jam terbang proyek nyata, ketahui celah kompetensi terhadap standar industri,
                dan bangun paspor keahlian yang diakui rekruter.
              </p>

              <ul className="pathway-feature-list">
                <li>
                  <Check size={18} weight="bold" color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span><strong>Career Readiness Assessment</strong> — Uji logika teknis & soft-skill adaptif.</span>
                </li>
                <li>
                  <Check size={18} weight="bold" color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span><strong>Skill Gap Analyzer</strong> — Ketahui deviasi kompetensi dan rekomendasi penutupan gap.</span>
                </li>
                <li>
                  <Check size={18} weight="bold" color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span><strong>Verified Digital Passport</strong> — Bukti validitas 4 level (Self-Declared hingga Verified).</span>
                </li>
                <li>
                  <Check size={18} weight="bold" color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span><strong>Kompensasi Utuh 100%</strong> — Tanpa potongan komisi platform untuk Talent.</span>
                </li>
              </ul>
            </div>

            <Link href="/register/talent" className="cta-button--primary" style={{ width: "fit-content" }}>
              <span>Daftar sebagai Talent</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </article>

          {/* Pathway 2: UMKM */}
          <article className="pathway-card pathway-card--business" id="untuk-umkm">
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1rem" }}>
                <span
                  style={{
                    background: "var(--success-subtle)",
                    color: "var(--success)",
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    display: "inline-flex",
                  }}
                >
                  <Storefront size={24} weight="duotone" />
                </span>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "var(--success)", textTransform: "uppercase" }}>
                  B2B MSME Enablement SaaS
                </span>
              </div>

              <h3>Untuk Pemilik Bisnis & UMKM</h3>
              <p className="pathway-card__desc">
                Tuntaskan kebutuhan digital usahamu dengan biaya terukur, alur kerja bebas istilah rumit,
                dan jaminan hasil yang dapat diuji di lingkungan staging.
              </p>

              <ul className="pathway-feature-list">
                <li>
                  <Check size={18} weight="bold" color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span><strong>Problem-to-Project Diagnosis</strong> — Formulasi kebutuhan bisnis menjadi lingkup terukur.</span>
                </li>
                <li>
                  <Check size={18} weight="bold" color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span><strong>Deterministic Smart Matching</strong> — Temukan pelaksana dengan Cocok Score tertinggi.</span>
                </li>
                <li>
                  <Check size={18} weight="bold" color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span><strong>Milestone Review Hub</strong> — Tinjau hasil live di HTTPS preview sebelum persetujuan dana.</span>
                </li>
                <li>
                  <Check size={18} weight="bold" color="var(--success)" style={{ flexShrink: 0, marginTop: "2px" }} />
                  <span><strong>Garansi Bug 30 Hari</strong> — Proteksi retensi 10% pasca serah terima production.</span>
                </li>
              </ul>
            </div>

            <Link href="/register/business" className="cta-button--secondary" style={{ width: "fit-content", borderColor: "var(--success)", color: "var(--success)" }}>
              <span>Daftar sebagai UMKM</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}
