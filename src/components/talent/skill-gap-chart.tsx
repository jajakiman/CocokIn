"use client";

import type { CareerDomainId, SkillAssessmentScore } from "@/src/modules/talent/types";
import { analyzeSkillGap } from "@/src/modules/talent/skill-gap";
import { getCareerDomain } from "@/src/modules/talent/career-taxonomy";
import { StatusBadge } from "@/src/design-system/status-badge";

type SkillGapChartProps = {
  careerId: CareerDomainId;
  scores: SkillAssessmentScore[];
};

export function SkillGapChart({ careerId, scores }: SkillGapChartProps) {
  const analysis = analyzeSkillGap(careerId, scores);
  const career = getCareerDomain(careerId);

  if (analysis.gaps.length === 0) {
    return (
      <div className="skill-gap-empty">
        <p>Belum ada data asesmen. Kerjakan asesmen kesiapan karier terlebih dahulu.</p>
      </div>
    );
  }

  return (
    <div className="skill-gap-chart">
      <div className="skill-gap-header">
        <h2>Analisis Skill Gap</h2>
        <p className="skill-gap-header__career">{career.label}</p>
      </div>

      {analysis.majorSkillGapIds.length > 0 && (
        <div className="major-gaps">
          <h3>Major Skill Gaps</h3>
          <p className="major-gaps__description">
            Skill dengan deviasi terbesar dari standar industri. Prioritaskan proyek yang melatih
            skill ini.
          </p>
          <div className="major-gaps__list">
            {analysis.majorSkillGapIds.map((skillId) => {
              const gap = analysis.gaps.find((g) => g.skillId === skillId);
              return gap ? (
                <StatusBadge key={skillId} tone="destructive">
                  {gap.name} ({gap.gap > 0 ? "+" : ""}
                  {gap.gap})
                </StatusBadge>
              ) : null;
            })}
          </div>
        </div>
      )}

      <div className="skill-gap-bars">
        {analysis.gaps.map((gap) => {
          const isMajorGap = analysis.majorSkillGapIds.includes(gap.skillId);
          const isPositive = gap.gap >= 0;
          const barWidth = Math.abs(gap.gap);

          return (
            <div key={gap.skillId} className="gap-bar-row" data-major={isMajorGap}>
              <div className="gap-bar-row__label">
                <span className="gap-bar-row__name">{gap.name}</span>
                <span className="gap-bar-row__scores">
                  {gap.talentScore} / {gap.benchmarkScore}
                </span>
              </div>
              <div className="gap-bar-row__visual">
                <div className="gap-bar-row__benchmark" />
                <div
                  className="gap-bar-row__bar"
                  data-positive={isPositive}
                  style={{ width: `${Math.min(barWidth, 100)}%` }}
                />
                <span className="gap-bar-row__gap">
                  {gap.gap > 0 ? "+" : ""}
                  {gap.gap}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="skill-gap-legend">
        <div className="legend-item">
          <div className="legend-item__dot" data-tone="success" />
          <span>Di atas benchmark (positif)</span>
        </div>
        <div className="legend-item">
          <div className="legend-item__dot" data-tone="destructive" />
          <span>Di bawah benchmark (gap)</span>
        </div>
      </div>
    </div>
  );
}
