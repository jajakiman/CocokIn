"use client";

import type { CareerDomainId, SkillAssessmentScore } from "@/src/modules/talent/types";
import { CAREER_TAXONOMY } from "@/src/modules/talent/career-taxonomy";

type ReadinessBarChartProps = {
  careerId: CareerDomainId;
  technicalBreakdown: SkillAssessmentScore[];
  softSkillBreakdown: SkillAssessmentScore[];
};

function SkillBar({
  name,
  talentScore,
  benchmarkScore,
  isSoftSkill = false,
}: {
  name: string;
  talentScore: number;
  benchmarkScore: number;
  isSoftSkill?: boolean;
}) {
  const gap = talentScore - benchmarkScore;
  const meetsBenchmark = gap >= 0;
  const barColor = meetsBenchmark ? "bg-[#047857]" : "bg-[#D97706]";
  const gapColor = meetsBenchmark ? "text-[#047857]" : "text-[#D97706]";
  const gapLabel = meetsBenchmark
    ? `+${gap}% Kompeten`
    : `${gap}% di bawah standar`;

  return (
    <div className="py-2" data-skill={name.toLowerCase()}>
      <div className="flex flex-wrap items-baseline justify-between gap-x-2 mb-1">
        <span className="text-sm font-semibold text-[#001040]">{name}</span>
        <span className={`text-xs font-bold ${gapColor} tabular-nums`}>
          {talentScore}%{" "}
          <span className="font-medium text-[#53647A]">
            (Benchmark: {benchmarkScore}% | {gapLabel})
          </span>
        </span>
      </div>
      <div
        className="relative h-3 rounded-full bg-[#F1F5FB] overflow-hidden"
        role="meter"
        aria-valuenow={talentScore}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name}: skor ${talentScore}%, benchmark industri ${benchmarkScore}%. ${meetsBenchmark ? "Melebihi benchmark." : "Di bawah benchmark."}${isSoftSkill ? " (Soft Skill)" : ""}`}
      >
        <div
          className={`h-full rounded-full ${barColor} transition-all duration-500 ease-out`}
          style={{ width: `${Math.min(Math.max(talentScore, 0), 100)}%` }}
        />
        {/* Benchmark marker */}
        <div
          className="absolute top-[-2px] bottom-[-2px] w-0.5 bg-[#001040]"
          style={{ left: `${Math.min(Math.max(benchmarkScore, 0), 100)}%` }}
          aria-hidden="true"
        />
      </div>
    </div>
  );
}

export function ReadinessBarChart({
  careerId,
  technicalBreakdown,
  softSkillBreakdown,
}: ReadinessBarChartProps) {
  const domain = CAREER_TAXONOMY[careerId];
  const benchmarkMap = new Map<string, number>();
  for (const skill of [...domain.technicalSkills, ...domain.softSkills]) {
    benchmarkMap.set(skill.skillId, skill.benchmarkScore);
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-sm font-extrabold text-[#001040] uppercase tracking-wider mb-1">
          Keahlian Teknis ({technicalBreakdown.length})
        </h3>
        <p className="text-xs text-[#53647A] mb-2">
          Rata-rata {technicalBreakdown.length} soal teknis &bull; Garis hitam =
          standar industri
        </p>
        <div className="divide-y divide-[#F1F5FB]">
          {technicalBreakdown.map((s) => (
            <SkillBar
              key={s.skillId}
              name={s.name}
              talentScore={s.talentScore}
              benchmarkScore={benchmarkMap.get(s.skillId) ?? 60}
            />
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-sm font-extrabold text-[#001040] uppercase tracking-wider mb-1">
          Soft Skill ({softSkillBreakdown.length})
        </h3>
        <p className="text-xs text-[#53647A] mb-2">
          Rata-rata {softSkillBreakdown.length} kasus soft skill &bull; Garis
          hitam = standar industri
        </p>
        <div className="divide-y divide-[#F1F5FB]">
          {softSkillBreakdown.map((s) => (
            <SkillBar
              key={s.skillId}
              name={s.name}
              talentScore={s.talentScore}
              benchmarkScore={benchmarkMap.get(s.skillId) ?? 60}
              isSoftSkill
            />
          ))}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-[#53647A]">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#047857]" /> Melebihi /
          memenuhi benchmark (kelebihan)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm bg-[#D97706]" /> Di bawah
          benchmark (celah skill)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-0.5 h-3 bg-[#001040]" /> Benchmark industri
        </span>
      </div>
    </div>
  );
}
