"use client";

import { Gauge } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export function MatchingScorecardShowcase() {
  const factors = [
    {
      name: "Skill Match",
      weight: "Bobot 40%",
      desc: "Multiplier level bukti (Self-Declared 0.5, Assessed 0.8, Verified 1.0).",
      score: 85,
    },
    {
      name: "Career Alignment",
      weight: "Bobot 20%",
      desc: "Kesesuaian target profesi & bonus penutupan Major Skill Gap (+20 poin).",
      score: 100,
    },
    {
      name: "Availability",
      weight: "Bobot 15%",
      desc: "Ketersediaan jam kerja (Full-Time, Part-Time, Weekend) vs durasi proyek.",
      score: 100,
    },
    {
      name: "Experience Level",
      weight: "Bobot 15%",
      desc: "Jumlah proyek tuntas vs tingkat kesulitan proyek (Beginner hingga Advanced).",
      score: 80,
    },
    {
      name: "Work Mode & City",
      weight: "Bobot 10%",
      desc: "Kesesuaian sistem Remote (100%), Hybrid (100%/50%), atau Onsite satu kota.",
      score: 100,
    },
  ];

  return (
    <section className="scorecard-section" id="matching-engine">
      <div className="scorecard-container">
        <motion.div
          className="scorecard-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <div className="workable-pill">
            <Gauge size={14} weight="bold" />
            <span>Smart Matching Engine</span>
          </div>
          <h2>Pencocokan Cerdas 100% Deterministik</h2>
          <p>
            Formula matematis transparan PRD §4.1 tanpa black-box. Memberikan kepastian rasional bagi UMKM dan keadilan bagi Talent.
          </p>
        </motion.div>

        <motion.div
          className="scorecard-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
        >
          {factors.map((f) => (
            <motion.article
              key={f.name}
              className="scorecard-factor-card"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
              }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
            >
              <div>
                <div className="scorecard-factor-card__top">
                  <span className="scorecard-factor-card__weight">{f.weight}</span>
                  <span style={{ fontSize: "1.1rem", fontWeight: 850, color: "var(--success)", fontVariantNumeric: "tabular-nums" }}>
                    {f.score}
                  </span>
                </div>
                <h3>{f.name}</h3>
                <p>{f.desc}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
