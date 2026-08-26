import {
  CheckCircle,
  ShieldCheck,
  Brain,
  Gauge,
  Kanban,
  SealCheck,
} from "@phosphor-icons/react/dist/ssr";

import {
  SEEDED_PORTFOLIO_ENTRIES,
  SEEDED_PROJECTS,
  SEEDED_TALENT_PROFILE,
  SEEDED_WORKSPACE,
} from "@/src/fixtures/seeded-demo";
import { calculateCocokScore } from "@/src/modules/matching";

const factorLabels = {
  skill: "Skill (40%)",
  career: "Karier (20%)",
  availability: "Waktu (15%)",
  experience: "Pengalaman (15%)",
  workMode: "Mode Kerja (10%)",
} as const;

export function ProductProof() {
  const project = SEEDED_PROJECTS[0];
  const portfolio = SEEDED_PORTFOLIO_ENTRIES[0];
  const verifiedSkill = SEEDED_TALENT_PROFILE.passportEntries.find(
    (entry) => entry.evidenceLevel === "PROJECT_VERIFIED",
  );
  const reviewMilestone = SEEDED_WORKSPACE.milestones.find(
    (milestone) => milestone.status === "READY_FOR_REVIEW",
  );
  const score = calculateCocokScore(
    {
      skills: SEEDED_TALENT_PROFILE.passportEntries.map((entry) => ({
        skillId: entry.skillId,
        name: entry.name,
        level: entry.evidenceLevel,
      })),
      targetCareerId: SEEDED_TALENT_PROFILE.targetCareerId,
      availability: SEEDED_TALENT_PROFILE.availability,
      completedProjectsCount: SEEDED_TALENT_PROFILE.completedProjectsCount,
      workModePreference: SEEDED_TALENT_PROFILE.workModePreference,
      city: SEEDED_TALENT_PROFILE.city,
    },
    project.project,
  );

  return (
    <section className="landing-section" id="product-proof">
      <div className="landing-section__container">
        <div className="section-header-editorial">
          <div>
            <p className="editorial-tag-pill">Bukti Fungsional Nyata</p>
            <h2>Bukti Produk Mengikuti Perjalanan Proyek</h2>
            <p>
              Bukan sekadar klaim. Setiap modul saling terhubung dari asesmen kesiapan, matching deterministik,
              hingga verifikasi deliverable di lingkungan staging.
            </p>
          </div>
        </div>

        <div className="proof-grid">
          {/* Proof 1: Career Readiness */}
          <article className="proof-card">
            <div className="proof-card__header">
              <div className="proof-card__icon">
                <Brain size={24} weight="duotone" />
              </div>
              <div>
                <span className="proof-card__kicker">Tahap 1: Evaluasi Kesiapan</span>
                <h3>Career Readiness Assessment</h3>
              </div>
            </div>
            <p className="proof-card__desc">
              Skor komposit dihitung dari pengujian logika teknis dan soft-skill profesional.
            </p>
            <div className="proof-skills-list">
              {SEEDED_TALENT_PROFILE.skillScores.slice(0, 3).map((skill) => (
                <div key={skill.skillId} className="proof-skill-row">
                  <span className="proof-skill-name">{skill.name}</span>
                  <div className="proof-skill-bar-bg">
                    <div className="proof-skill-bar" style={{ width: `${skill.talentScore}%` }} />
                  </div>
                  <strong className="proof-skill-score">{skill.talentScore}/100</strong>
                </div>
              ))}
            </div>
          </article>

          {/* Proof 2: Explainable Cocok Score */}
          <article className="proof-card">
            <div className="proof-card__header">
              <div className="proof-card__icon">
                <Gauge size={24} weight="duotone" />
              </div>
              <div>
                <span className="proof-card__kicker">Tahap 2: Algoritma Matching</span>
                <h3>Explainable Cocok Score</h3>
              </div>
            </div>
            <div className="proof-score-banner">
              <div>
                <strong>{project.title}</strong>
                <span>Matching Deterministik Terbuka</span>
              </div>
              <div className="proof-score-value">{score.total}<span>/100</span></div>
            </div>
            <div className="proof-factors-grid">
              {Object.entries(score.factors).map(([factor, value]) => (
                <div key={factor} className="proof-factor-item">
                  <span>{factorLabels[factor as keyof typeof factorLabels]}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
          </article>

          {/* Proof 3: Milestone Review Workspace */}
          <article className="proof-card">
            <div className="proof-card__header">
              <div className="proof-card__icon">
                <Kanban size={24} weight="duotone" />
              </div>
              <div>
                <span className="proof-card__kicker">Tahap 3: Pengerjaan & Staging</span>
                <h3>Milestone Review Workspace</h3>
              </div>
            </div>
            <div style={{ marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
                <strong style={{ fontSize: "1rem" }}>{reviewMilestone?.title}</strong>
                <span className="status-badge" data-tone="warning">
                  <CheckCircle size={14} weight="fill" /> Ready for Review
                </span>
              </div>
              <p style={{ fontSize: "0.875rem", color: "var(--muted-foreground)", margin: 0 }}>
                {reviewMilestone?.deliverableSummary}
              </p>
            </div>
            <div className="proof-staging-link">
              <span>Staging Preview URL:</span>
              <code>https://preview.warungbusiti.id</code>
            </div>
          </article>

          {/* Proof 4: Verified Passport & Portfolio */}
          <article className="proof-card">
            <div className="proof-card__header">
              <div className="proof-card__icon">
                <SealCheck size={24} weight="duotone" />
              </div>
              <div>
                <span className="proof-card__kicker">Tahap 4: Serah Terima & Hak</span>
                <h3>Verified Passport & Portfolio</h3>
              </div>
            </div>
            <div className="proof-passport-stamp">
              <ShieldCheck size={32} weight="fill" color="var(--success)" />
              <div>
                <strong style={{ display: "block", fontSize: "1.05rem" }}>
                  {verifiedSkill?.name} · Project Verified
                </strong>
                <span style={{ fontSize: "0.85rem", color: "var(--muted-foreground)" }}>
                  Disahkan oleh: <strong>{portfolio.businessName}</strong> (Atribusi Resmi Disetujui)
                </span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
