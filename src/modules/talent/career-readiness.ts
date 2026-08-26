import type {
  AssessmentAnswer,
  CareerDomainId,
  CareerReadinessResult,
  SkillAssessmentScore,
} from "./types";
import { CAREER_TAXONOMY } from "./career-taxonomy";
import { ASSESSMENT_QUESTIONS } from "./assessment-bank";

function clamp(v: number): number {
  return Math.min(100, Math.max(0, v));
}

/**
 * Calculate Career Readiness Score — PRD §3.1 FR-TAL-02.
 * Composite = 60% Technical + 40% Soft Skill (averages).
 * Pure function: no IO.
 */
export function calculateCareerReadiness(
  careerId: CareerDomainId,
  answers: AssessmentAnswer[],
): CareerReadinessResult {
  const domain = CAREER_TAXONOMY[careerId];
  const answerMap = new Map<string, number>();
  for (const a of answers) {
    answerMap.set(a.questionId, a.selectedScore);
  }

  // Build question → skill mapping from assessment bank
  const careerQuestions = ASSESSMENT_QUESTIONS.filter(
    (q) => q.careerId === careerId,
  );
  const techQuestions = careerQuestions.filter((q) => q.type === "TECHNICAL");
  const softQuestions = careerQuestions.filter((q) => q.type === "SOFT_SKILL");

  // Map each technical question to its corresponding skill by index order
  const technicalBreakdown: SkillAssessmentScore[] = domain.technicalSkills.map(
    (skill, i) => {
      const question = techQuestions[i];
      const raw = question ? (answerMap.get(question.id) ?? 0) : 0;
      return {
        skillId: skill.skillId,
        name: skill.name,
        talentScore: clamp(raw),
      };
    },
  );

  const softSkillBreakdown: SkillAssessmentScore[] = domain.softSkills.map(
    (skill, i) => {
      const question = softQuestions[i];
      const raw = question ? (answerMap.get(question.id) ?? 0) : 0;
      return {
        skillId: skill.skillId,
        name: skill.name,
        talentScore: clamp(raw),
      };
    },
  );

  const technicalScore =
    technicalBreakdown.length > 0
      ? Math.round(
          technicalBreakdown.reduce((s, e) => s + e.talentScore, 0) /
            technicalBreakdown.length,
        )
      : 0;

  const softSkillScore =
    softSkillBreakdown.length > 0
      ? Math.round(
          softSkillBreakdown.reduce((s, e) => s + e.talentScore, 0) /
            softSkillBreakdown.length,
        )
      : 0;

  const compositeScore = Math.round(technicalScore * 0.6 + softSkillScore * 0.4);

  return {
    careerId,
    technicalScore,
    softSkillScore,
    compositeScore,
    technicalBreakdown,
    softSkillBreakdown,
  };
}
