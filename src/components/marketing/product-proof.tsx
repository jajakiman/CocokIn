import { CheckCircle, Database, ShieldCheck } from "@phosphor-icons/react/dist/ssr";

import {
  SEEDED_PORTFOLIO_ENTRIES,
  SEEDED_PROJECTS,
  SEEDED_TALENT_PROFILE,
  SEEDED_WORKSPACE,
} from "@/src/fixtures/seeded-demo";
import { calculateCocokScore } from "@/src/modules/matching";

const factorLabels = {
  skill: "Skill",
  career: "Karier",
  availability: "Ketersediaan",
  experience: "Pengalaman",
  workMode: "Mode kerja",
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
    <section
      aria-labelledby="product-proof-title"
      className="landing-section landing-proof"
      id="product-proof"
    >
      <div className="landing-section__heading landing-proof__heading">
        <p className="landing-eyebrow">Lihat sistemnya, bukan janji kosong</p>
        <h2 id="product-proof-title">Bukti produk mengikuti perjalanan proyek.</h2>
        <p>
          Contoh ini memperlihatkan hubungan asesmen, matching, review, dan bukti kerja tanpa
          mengklaim hasil pengguna nyata.
        </p>
      </div>

      <div aria-label="Bukti produk" className="landing-proof__canvas" role="region">
        <p className="landing-proof__label">
          <Database aria-hidden="true" size={18} />
          Demonstrasi produk · Data sintetis
        </p>

        <article className="landing-proof__readiness">
          <p className="landing-proof__kicker">Career Readiness</p>
          <h3>Asesmen kesiapan berbasis skill</h3>
          <p>
            Profil sintetis memuat skor asesmen per skill dan level bukti, bukan klaim outcome
            karier.
          </p>
          <div className="landing-proof__skills" aria-label="Contoh skor asesmen skill">
            {SEEDED_TALENT_PROFILE.skillScores.slice(0, 3).map((skill) => (
              <span key={skill.skillId}>{skill.name} {skill.talentScore}</span>
            ))}
          </div>
        </article>

        <article className="landing-proof__score">
          <p className="landing-proof__kicker">Explainable Cocok Score</p>
          <div className="landing-proof__score-heading">
            <h3>{project.title}</h3>
            <strong>{score.total}/100</strong>
          </div>
          <dl className="landing-proof__factors">
            {Object.entries(score.factors).map(([factor, value]) => (
              <div key={factor}>
                <dt>{factorLabels[factor as keyof typeof factorLabels]}</dt>
                <dd>{factorLabels[factor as keyof typeof factorLabels]} {value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="landing-proof__review">
          <p className="landing-proof__kicker">Milestone review workspace</p>
          <h3>{reviewMilestone?.title}</h3>
          <p>{reviewMilestone?.deliverableSummary}</p>
          <span className="landing-status">
            <CheckCircle aria-hidden="true" size={18} />
            READY FOR REVIEW
          </span>
        </article>

        <article className="landing-proof__passport">
          <ShieldCheck aria-hidden="true" size={24} />
          <div>
            <p className="landing-proof__kicker">Verified Passport & Portfolio</p>
            <h3>{verifiedSkill?.name} · Project Verified</h3>
            <p><span>{portfolio.businessName}</span> · atribusi disetujui</p>
          </div>
        </article>
      </div>
    </section>
  );
}
