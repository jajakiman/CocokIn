// Public API for talent module

export type {
  AssessmentAnswer,
  AssessmentOption,
  AssessmentQuestion,
  AssessmentQuestionType,
  CareerDomain,
  CareerDomainId,
  CareerReadinessResult,
  SkillAssessmentScore,
  SkillBenchmark,
  SkillGapAnalysis,
  SkillGapItem,
  SkillPassportEntry,
  TalentSkillPassport,
} from "./types";

export {
  CAREER_TAXONOMY,
  getAllCareerIds,
  getCareerDomain,
} from "./career-taxonomy";

export {
  ASSESSMENT_QUESTIONS,
  getQuestionsForCareer,
  getSoftSkillQuestions,
  getTechnicalQuestions,
} from "./assessment-bank";

export { calculateCareerReadiness } from "./career-readiness";
export { analyzeSkillGap } from "./skill-gap";
export {
  getReadinessScores,
  getReadinessSkillGapIds,
  resolveSkillGapInput,
} from "./readiness-flow";

export {
  canPromote,
  createPassport,
  markAssessed,
  promoteEvidence,
} from "./skill-passport";
