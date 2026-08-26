"use client";

import { useState } from "react";
import { CheckCircle, Warning } from "@phosphor-icons/react";

export function CocokScoreSimulator() {
  const [skillFactor, setSkillFactor] = useState(85);
  const [careerFactor, setCareerFactor] = useState(100);
  const [availFactor, setAvailFactor] = useState(100);
  const [expFactor, setExpFactor] = useState(80);
  const [workModeFactor, setWorkModeFactor] = useState(100);

  // PRD §4.1 formula
  const calculatedTotal = Math.round(
    skillFactor * 0.4 +
      careerFactor * 0.2 +
      availFactor * 0.15 +
      expFactor * 0.15 +
      workModeFactor * 0.1,
  );

  const getScoreColor = (score: number) => {
    if (score >= 75) return "var(--success)";
    if (score >= 50) return "var(--warning)";
    return "var(--destructive)";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 75) return "Sangat Cocok (High Match)";
    if (score >= 50) return "Cukup Cocok (Moderate Match)";
    return "Perlu Peningkatan Kompetensi";
  };

  return (
    <section className="landing-section" id="simulator-matching">
      <div className="landing-section__container">
        <div className="landing-section__header">
          <p className="landing-eyebrow">Simulasi Deterministik Interaktif</p>
          <h2>Coba Langsung Formula Cocok Score</h2>
          <p>
            Geser parameter berikut untuk melihat bagaimana platform menghitung skor kecocokan
            secara matematis dan transparan tanpa kotak hitam (black box).
          </p>
        </div>

        <div className="simulator-card">
          <div className="simulator-controls">
            {/* Slider 1: Skill */}
            <div className="simulator-slider-row">
              <label htmlFor="sim-skill">
                <span>Kesesuaian Skill (Bobot 40%)</span>
                <strong>{skillFactor}%</strong>
              </label>
              <input
                id="sim-skill"
                type="range"
                min="0"
                max="100"
                value={skillFactor}
                onChange={(e) => setSkillFactor(Number(e.target.value))}
                className="simulator-slider"
              />
            </div>

            {/* Slider 2: Career */}
            <div className="simulator-slider-row">
              <label htmlFor="sim-career">
                <span>Keselarasan Karier & Gap Closure (Bobot 20%)</span>
                <strong>{careerFactor}%</strong>
              </label>
              <input
                id="sim-career"
                type="range"
                min="0"
                max="100"
                value={careerFactor}
                onChange={(e) => setCareerFactor(Number(e.target.value))}
                className="simulator-slider"
              />
            </div>

            {/* Slider 3: Availability */}
            <div className="simulator-slider-row">
              <label htmlFor="sim-avail">
                <span>Ketersediaan Waktu (Bobot 15%)</span>
                <strong>{availFactor}%</strong>
              </label>
              <input
                id="sim-avail"
                type="range"
                min="0"
                max="100"
                value={availFactor}
                onChange={(e) => setAvailFactor(Number(e.target.value))}
                className="simulator-slider"
              />
            </div>

            {/* Slider 4: Experience */}
            <div className="simulator-slider-row">
              <label htmlFor="sim-exp">
                <span>Kesesuaian Pengalaman / Tingkat Proyek (Bobot 15%)</span>
                <strong>{expFactor}%</strong>
              </label>
              <input
                id="sim-exp"
                type="range"
                min="0"
                max="100"
                value={expFactor}
                onChange={(e) => setExpFactor(Number(e.target.value))}
                className="simulator-slider"
              />
            </div>

            {/* Slider 5: Work Mode */}
            <div className="simulator-slider-row">
              <label htmlFor="sim-mode">
                <span>Mode Kerja Remote / Hybrid / Onsite (Bobot 10%)</span>
                <strong>{workModeFactor}%</strong>
              </label>
              <input
                id="sim-mode"
                type="range"
                min="0"
                max="100"
                value={workModeFactor}
                onChange={(e) => setWorkModeFactor(Number(e.target.value))}
                className="simulator-slider"
              />
            </div>
          </div>

          {/* Result Output */}
          <div
            style={{
              background: "var(--surface-subtle)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-lg)",
              padding: "1.5rem",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "1rem",
            }}
          >
            <div>
              <span
                style={{
                  fontSize: "0.85rem",
                  fontWeight: "700",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  color: "var(--muted-foreground)",
                }}
              >
                Hasil Kalkulasi Cocok Score
              </span>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  marginTop: "0.25rem",
                }}
              >
                {calculatedTotal >= 75 ? (
                  <CheckCircle size={20} weight="fill" color="var(--success)" />
                ) : (
                  <Warning size={20} weight="fill" color="var(--warning)" />
                )}
                <strong style={{ color: getScoreColor(calculatedTotal), fontSize: "1.1rem" }}>
                  {getScoreLabel(calculatedTotal)}
                </strong>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <span
                style={{
                  fontSize: "3rem",
                  fontWeight: "900",
                  fontVariantNumeric: "tabular-nums",
                  color: getScoreColor(calculatedTotal),
                  lineHeight: 1,
                }}
              >
                {calculatedTotal}
              </span>
              <span style={{ fontSize: "1.1rem", color: "var(--muted-foreground)" }}>/100</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
