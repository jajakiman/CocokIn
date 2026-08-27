"use client";

import { Gauge, Sparkle } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export function MatchingScorecardShowcase() {
  const factors = [
    {
      name: "Skill Match",
      weight: "Bobot 40%",
      desc: "Menilai kesesuaian keahlian berdasarkan hasil tes dan proyek yang pernah diselesaikan.",
      score: 85,
    },
    {
      name: "Career Alignment",
      weight: "Bobot 20%",
      desc: "Memastikan proyek sejalan dengan minat karier Talent agar pengerjaan lebih maksimal.",
      score: 100,
    },
    {
      name: "Availability",
      weight: "Bobot 15%",
      desc: "Mencocokkan waktu luang Talent dengan tenggat yang dibutuhkan pemilik usaha.",
      score: 100,
    },
    {
      name: "Experience Level",
      weight: "Bobot 15%",
      desc: "Menyelaraskan tingkat kerumitan tugas dengan pengalaman kerja Talent sebelumnya.",
      score: 80,
    },
    {
      name: "Work Mode & City",
      weight: "Bobot 10%",
      desc: "Menyesuaikan pilihan kerja jarak jauh, hybrid, atau tatap muka dengan kebutuhan proyek.",
      score: 100,
    },
  ];

  return (
    <section className="heyretro-section" id="matching-engine">
      <div className="heyretro-container">
        <motion.div
          className="section-header-centered"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="section-pill">
            <Gauge size={14} weight="bold" />
            <span>Pencocokan Cerdas & Terbuka</span>
          </div>
          <h2>Sistem Pencocokan yang Terbuka & Adil</h2>
          <p>
            Menghubungkan kebutuhan bisnis dengan keahlian Talent secara objektif dan transparan.
            UMKM mendapatkan orang yang tepat, Talent mendapatkan proyek yang sesuai.
          </p>
        </motion.div>

        {/* HeyRetro Style 2-Zone Matching Showcase */}
        <div className="matching-showcase-layout">
          {/* Left: Overall Score Metric Badge */}
          <motion.div
            className="matching-score-summary"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <span className="summary-eyebrow">
              <Sparkle size={16} weight="fill" /> Hasil Kalkulasi Objektif
            </span>
            <div className="summary-number">
              <strong>87</strong>
              <span>/ 100</span>
            </div>
            <h3>Indeks Kesesuaian Sangat Tinggi</h3>
            <p>
              Kombinasi skor keahlian terverifikasi dan target karier menunjukkan kesiapan tinggi untuk menyelesaikan proyek tepat waktu.
            </p>
            <div className="summary-tags">
              <span>✓ Bebas Rekrutmen Manual</span>
              <span>✓ Transparan bagi Kedua Pihak</span>
            </div>
          </motion.div>

          {/* Right: 5 Weighted Factor Cards */}
          <motion.div
            className="matching-factors-list"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-60px" }}
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.06,
                },
              },
            }}
          >
            {factors.map((f) => (
              <motion.article
                key={f.name}
                className="factor-row-card"
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
                }}
              >
                <div className="factor-row-card__header">
                  <div>
                    <h4>{f.name}</h4>
                    <span className="factor-weight-pill">{f.weight}</span>
                  </div>
                  <strong className="factor-score">{f.score}</strong>
                </div>
                <p className="factor-row-card__desc">{f.desc}</p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
