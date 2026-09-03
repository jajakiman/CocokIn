import { analyzeSkillGap } from "./skill-gap";
import type {
  CareerDomainId,
  CareerReadinessResult,
  SkillAssessmentScore,
} from "./types";

export function getReadinessScores(
  result: CareerReadinessResult | null,
): SkillAssessmentScore[] {
  return result
    ? [...result.technicalBreakdown, ...result.softSkillBreakdown]
    : [];
}

export function getReadinessSkillGapIds(
  result: CareerReadinessResult | null,
): string[] {
  return result
    ? analyzeSkillGap(result.careerId, getReadinessScores(result)).majorSkillGapIds
    : [];
}

export function resolveSkillGapInput(
  result: CareerReadinessResult | null,
  profileCareerId: CareerDomainId,
  frontendDemoScores: SkillAssessmentScore[],
): { careerId: CareerDomainId; scores: SkillAssessmentScore[] } {
  if (result) {
    return { careerId: result.careerId, scores: getReadinessScores(result) };
  }

  return {
    careerId: profileCareerId,
    scores: profileCareerId === "fullstack-dev" ? frontendDemoScores : [],
  };
}
