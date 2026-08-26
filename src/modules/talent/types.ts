// ponytail: types only — no runtime deps; add Zod schemas when forms consume these

import type { EvidenceLevel } from "@/src/modules/matching/types";

// --- Career Taxonomy ---

export type CareerDomainId =
  | "frontend-dev"
  | "ui-ux-designer"
  | "data-analyst"
  | "digital-marketer";

export type SkillBenchmark = {
  skillId: string;
  name: string;
  benchmarkScore: number; // 0-100 industry standard
};

export type CareerDomain = {
  id: CareerDomainId;
  label: string;
  technicalSkills: SkillBenchmark[];
  softSkills: SkillBenchmark[];
};

// --- Assessment ---

export type AssessmentQuestionType = "TECHNICAL" | "SOFT_SKILL";

export type AssessmentOption = {
  label: string;
  score: number; // 0-100
};

export type AssessmentQuestion = {
  id: string;
  careerId: CareerDomainId;
  type: AssessmentQuestionType;
  text: string;
  options: AssessmentOption[];
};

export type AssessmentAnswer = {
  questionId: string;
  selectedScore: number;
};

// --- Career Readiness ---

export type SkillAssessmentScore = {
  skillId: string;
  name: string;
  talentScore: number; // 0-100
};

export type CareerReadinessResult = {
  careerId: CareerDomainId;
  technicalScore: number; // 0-100
  softSkillScore: number; // 0-100
  compositeScore: number; // 0-100 (60% tech + 40% soft)
  technicalBreakdown: SkillAssessmentScore[];
  softSkillBreakdown: SkillAssessmentScore[];
};

// --- Skill Gap ---

export type SkillGapItem = {
  skillId: string;
  name: string;
  talentScore: number;
  benchmarkScore: number;
  gap: number; // talent - benchmark (negative = gap)
};

export type SkillGapAnalysis = {
  careerId: CareerDomainId;
  gaps: SkillGapItem[];
  majorSkillGapIds: string[]; // top negative gaps
};

// --- Skill Passport ---

export type SkillPassportEntry = {
  skillId: string;
  name: string;
  evidenceLevel: EvidenceLevel;
  assessedScore?: number; // set after assessment
  verifiedProjectCount: number;
  lastUpdated: string; // ISO date
};

export type TalentSkillPassport = {
  talentId: string;
  careerId: CareerDomainId;
  entries: SkillPassportEntry[];
};
