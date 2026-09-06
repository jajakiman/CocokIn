"use client";

import Link from "next/link";
import { Check, ArrowRight, User } from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { SEEDED_TALENT_PROFILE } from "@/src/fixtures/seeded-demo";

export function TalentFeatureSplit() {
  return (
    <section className="heyretro-section heyretro-section--alt" id="untuk-talent">
      <div className="heyretro-container">
        <div className="heyretro-split-grid">
          {/* Left: Copy & Value Proposition */}
          <motion.div
            className="split-content"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="section-pill section-pill--talent">
              <User size={14} weight="bold" />
              <span>Untuk Mahasiswa & Fresh Graduate</span>
            </div>

            <h2>Pengembangan Karier & Pengalaman Nyata</h2>
            <p className="split-lead">
              Dapatkan pengalaman langsung dari kebutuhan bisnis nyata, kenali kemampuan yang perlu
              ditingkatkan, dan bangun portofolio yang diakui pemilik usaha.
            </p>

            <ul className="heyretro-checklist">
              <li>
                <span className="check-bullet"><Check size={16} weight="bold" /></span>
                <div>
                  <strong>Uji Kesiapan Karier</strong>
                  <p>Kenali kesiapan teknis dan cara kerja Anda sesuai jalur karier yang dipilih.</p>
                </div>
              </li>
              <li>
                <span className="check-bullet"><Check size={16} weight="bold" /></span>
                <div>
                  <strong>Pemetaan Kebutuhan Belajar</strong>
                  <p>Temukan kemampuan yang perlu diasah dan proyek yang tepat untuk mengembangkannya.</p>
                </div>
              </li>
              <li>
                <span className="check-bullet"><Check size={16} weight="bold" /></span>
                <div>
                  <strong>Paspor Keahlian & Portofolio Resmi</strong>
                  <p>Tampilkan bukti keahlian yang diperkuat oleh hasil tes dan pengakuan pemilik usaha.</p>
                </div>
              </li>
              <li>
                <span className="check-bullet"><Check size={16} weight="bold" /></span>
                <div>
                  <strong>Kompensasi Utuh 100%</strong>
                  <p>Talent menerima pembayaran proyek secara penuh tanpa potongan biaya platform.</p>
                </div>
              </li>
            </ul>

            <Link href="/register/talent" className="hero-cta-btn hero-cta-btn--talent" style={{ width: "fit-content" }}>
              <span>Daftar sebagai Talent</span>
              <ArrowRight size={16} weight="bold" />
            </Link>
          </motion.div>

          {/* Right: Interactive UI Card Showcase */}
          <motion.div
            className="split-card"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
          >
            <div className="split-card__header">
              <div>
                <span className="split-card__tag">Asesmen Kesiapan</span>
                <h3>Nadia Putri — Frontend Dev</h3>
              </div>
              <span className="status-badge" data-tone="success">Score: 72/100</span>
            </div>

            <div className="split-skills-bars">
              {SEEDED_TALENT_PROFILE.skillScores.slice(0, 4).map((s) => (
                <div key={s.skillId} className="skill-bar-row">
                  <span className="skill-name">{s.name}</span>
                  <div className="skill-meter-wrap">
                    <div className="skill-meter">
                      <div className="skill-meter__fill" style={{ width: `${s.talentScore}%` }} />
                    </div>
                    <strong className="skill-val">{s.talentScore}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div className="split-card__alert">
              <div>
                <span className="alert-label">Kemampuan yang Perlu Ditingkatkan</span>
                <strong>Next.js (-20) & JavaScript (-20)</strong>
              </div>
              <span className="status-badge" data-tone="warning">Prioritas Proyek</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
