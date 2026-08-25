import Link from "next/link";
import type { CareerReadinessResult } from "@/src/modules/talent/types";
import { getCareerDomain } from "@/src/modules/talent/career-taxonomy";

type ReadinessResultProps = {
  result: CareerReadinessResult;
  onRestart: () => void;
};

export function ReadinessResult({ result, onRestart }: ReadinessResultProps) {
  const career = getCareerDomain(result.careerId);

  return (
    <div className="readiness-result">
      <div className="result-header">
        <h1>Hasil Asesmen Kesiapan Karier</h1>
        <p className="result-header__career">{career.label}</p>
      </div>

      <div className="result-score">
        <div className="score-composite">
          <p className="score-composite__label">Skor Komposit</p>
          <p className="score-composite__value">{result.compositeScore}/100</p>
          <p className="score-composite__breakdown">
            {result.technicalScore} Teknis • {result.softSkillScore} Soft Skill
          </p>
        </div>
      </div>

      <section className="result-section">
        <h2>Breakdown Technical Skills</h2>
        <div className="skill-breakdown">
          {result.technicalBreakdown.map((skill) => (
            <div key={skill.skillId} className="skill-row">
              <span className="skill-row__name">{skill.name}</span>
              <span className="skill-row__score">{skill.talentScore}/100</span>
            </div>
          ))}
        </div>
      </section>

      <section className="result-section">
        <h2>Breakdown Soft Skills</h2>
        <div className="skill-breakdown">
          {result.softSkillBreakdown.map((skill) => (
            <div key={skill.skillId} className="skill-row">
              <span className="skill-row__name">{skill.name}</span>
              <span className="skill-row__score">{skill.talentScore}/100</span>
            </div>
          ))}
        </div>
      </section>

      <div className="result-actions">
        <Link href="/talent/skill-gap" className="primary-action">
          Lihat Skill Gap
        </Link>
        <button type="button" className="secondary-action" onClick={onRestart}>
          Mulai ulang asesmen
        </button>
      </div>
    </div>
  );
}
