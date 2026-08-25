export type EvidenceLevel =
  | "SELF_DECLARED"
  | "ASSESSED"
  | "PROJECT_APPLIED"
  | "PROJECT_VERIFIED";

export type WorkMode = "REMOTE" | "HYBRID" | "ONSITE";

export type ProjectDifficulty = "BEGINNER" | "INTERMEDIATE" | "ADVANCED";

export type AvailabilityType = "FULL_TIME" | "PART_TIME" | "WEEKEND";

export type TalentSkillInput = {
  skillId: string;
  name: string;
  level: EvidenceLevel;
};

export type ProjectSkillRequirement = {
  skillId: string;
  name: string;
};

export type TalentMatchProfile = {
  skills: TalentSkillInput[];
  targetCareerId: string;
  majorSkillGapIds?: string[];
  availability: AvailabilityType;
  completedProjectsCount: number;
  workModePreference: WorkMode;
  city?: string;
};

export type ProjectMatchRequirement = {
  requiredSkills: ProjectSkillRequirement[];
  targetCareerId: string;
  difficulty: ProjectDifficulty;
  durationDays: number;
  workMode: WorkMode;
  city?: string;
};

export type MatchingFactors = {
  skill: number;
  career: number;
  availability: number;
  experience: number;
  workMode: number;
};

export type CocokScoreResult = {
  total: number;
  factors: MatchingFactors;
  reasons: string[];
  gaps: string[];
};
