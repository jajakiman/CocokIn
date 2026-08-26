"use client";

import Link from "next/link";
import { Check, ArrowRight, User } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { SEEDED_TALENT_PROFILE } from "@/src/fixtures/seeded-demo";

export function TalentFeatureSplit() {
  return (
    <section className="feature-split-section" id="untuk-talent">
      <div className="feature-split-container">
        {/* Left: Copy & Value Proposition */}
        <motion.div
          className="feature-split__content"
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="workable-pill" style={{ background: "var(--info-subtle)", color: "var(--primary)" }}>
            <User size={14} weight="bold" />
            <span>Untuk Mahasiswa & Fresh Graduate</span>
          </div>

          <h2>Pengembangan Karier & Pengalaman Nyata</h2>
          <p className="feature-split__lead">
            Dapatkan pengalaman langsung dari kebutuhan bisnis nyata, kenali kemampuan yang perlu
            ditingkatkan, dan bangun portofolio yang diakui pemilik usaha.
          </p>

          <ul className="feature-checklist">
            <li>
              <Check size={20} weight="bold" color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong>Uji Kesiapan Karier</strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
                  Kenali kesiapan teknis dan cara kerja Anda sesuai jalur karier yang dipilih.
                </p>
              </div>
            </li>
            <li>
              <Check size={20} weight="bold" color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong>Pemetaan Kebutuhan Belajar</strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
                  Temukan kemampuan yang perlu diasah dan proyek yang tepat untuk mengembangkannya.
                </p>
              </div>
            </li>
            <li>
              <Check size={20} weight="bold" color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong>Paspor Keahlian & Portofolio Resmi</strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
                  Tampilkan bukti keahlian yang diperkuat oleh hasil tes dan pengakuan pemilik usaha.
                </p>
              </div>
            </li>
            <li>
              <Check size={20} weight="bold" color="var(--primary)" style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <strong>Kompensasi Utuh 100%</strong>
                <p style={{ margin: 0, fontSize: "0.875rem", color: "var(--muted-foreground)" }}>
                  Talent menerima pembayaran proyek secara penuh tanpa potongan biaya platform.
                </p>
              </div>
            </li>
          </ul>

          <Link href="/register/talent" className="cta-btn-primary" style={{ width: "fit-content" }}>
            <span>Daftar sebagai Talent</span>
            <ArrowRight size={16} weight="bold" />
          </Link>
        </motion.div>

        {/* Right: Interactive UI Card Showcase */}
        <motion.div
          className="feature-split__card"
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid var(--border)", paddingBottom: "1rem" }}>
            <div>
              <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "var(--primary)", textTransform: "uppercase" }}>Asesmen Kesiapan</span>
              <h3 style={{ fontSize: "1.15rem", margin: "0.15rem 0 0" }}>Nadia Putri — Frontend Dev</h3>
            </div>
            <span className="status-badge" data-tone="success">Score: 72/100</span>
          </div>

          <div style={{ display: "grid", gap: "0.75rem" }}>
            {SEEDED_TALENT_PROFILE.skillScores.slice(0, 4).map((s) => (
              <div key={s.skillId} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.875rem" }}>
                <span style={{ fontWeight: 600 }}>{s.name}</span>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", width: "55%" }}>
                  <div style={{ flex: 1, height: "0.5rem", background: "var(--surface-subtle)", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ width: `${s.talentScore}%`, height: "100%", background: "var(--primary)", borderRadius: "999px" }} />
                  </div>
                  <strong style={{ fontVariantNumeric: "tabular-nums", fontSize: "0.8rem", width: "2.5rem", textAlign: "right" }}>{s.talentScore}</strong>
                </div>
              </div>
            ))}
          </div>

          <div style={{ background: "var(--surface-subtle)", border: "1px solid var(--border)", borderRadius: "var(--radius-md)", padding: "1rem", marginTop: "0.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "var(--muted-foreground)" }}>Kemampuan yang Perlu Ditingkatkan</span>
                <strong style={{ display: "block", color: "var(--destructive)", fontSize: "0.9rem" }}>Next.js (-20) & JavaScript (-20)</strong>
              </div>
              <span className="status-badge" data-tone="warning">Prioritas Proyek</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
