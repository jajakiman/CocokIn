import type {
  CareerDomainId,
  SkillAssessmentScore,
  SkillGapAnalysis,
  SkillGapItem,
} from "./types";
import { CAREER_TAXONOMY } from "./career-taxonomy";

const MAX_MAJOR_GAPS = 3;

/**
 * Skill Gap Analyzer — PRD §3.1 FR-TAL-03.
 * gap(s) = Talent_Score(s) - Benchmark_Score(s)
 * Negative = gap. Major = top N negative deviations.
 * Pure function: no IO.
 */
export function analyzeSkillGap(
  careerId: CareerDomainId,
  scores: SkillAssessmentScore[],
): SkillGapAnalysis {
  const domain = CAREER_TAXONOMY[careerId];
  const scoreMap = new Map<string, SkillAssessmentScore>();
  for (const s of scores) {
    scoreMap.set(s.skillId, s);
  }

  // Only compute gaps for skills the talent has been assessed on
  const allBenchmarks = [...domain.technicalSkills, ...domain.softSkills];
  const gaps: SkillGapItem[] = [];

  for (const bench of allBenchmarks) {
    const score = scoreMap.get(bench.skillId);
    if (!score) continue;
    const benchmarkScore = score.benchmarkScore ?? bench.benchmarkScore;

    gaps.push({
      skillId: bench.skillId,
      name: bench.name,
      talentScore: score.talentScore,
      benchmarkScore,
      gap: score.talentScore - benchmarkScore,
    });
  }

  // Sort ascending by gap (worst gaps first)
  gaps.sort((a, b) => a.gap - b.gap);

  // Major skill gaps = skills with negative gaps, take top N
  const majorSkillGapIds = gaps
    .filter((g) => g.gap < 0)
    .slice(0, MAX_MAJOR_GAPS)
    .map((g) => g.skillId);

  return {
    careerId,
    gaps,
    majorSkillGapIds,
  };
}
