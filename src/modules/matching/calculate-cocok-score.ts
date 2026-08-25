import type {
  AvailabilityType,
  CocokScoreResult,
  EvidenceLevel,
  MatchingFactors,
  ProjectDifficulty,
  ProjectMatchRequirement,
  TalentMatchProfile,
  WorkMode,
} from "./types";
import { explainMatch } from "./explain-match";

const EVIDENCE_MULTIPLIER: Record<EvidenceLevel, number> = {
  PROJECT_VERIFIED: 1.0,
  ASSESSED: 0.8,
  PROJECT_APPLIED: 0.7,
  SELF_DECLARED: 0.5,
};

function calculateSkillFactor(
  talent: TalentMatchProfile,
  project: ProjectMatchRequirement,
): number {
  if (!project.requiredSkills || project.requiredSkills.length === 0) {
    return 100;
  }

  const talentSkillMap = new Map<string, EvidenceLevel>();
  for (const s of talent.skills) {
    talentSkillMap.set(s.skillId.toLowerCase(), s.level);
  }

  let totalScore = 0;
  for (const req of project.requiredSkills) {
    const level = talentSkillMap.get(req.skillId.toLowerCase());
    if (level) {
      totalScore += (EVIDENCE_MULTIPLIER[level] ?? 0.5) * 100;
    }
  }

  return Math.round(totalScore / project.requiredSkills.length);
}

function calculateCareerFactor(
  talent: TalentMatchProfile,
  project: ProjectMatchRequirement,
): number {
  let score = 30; // base score for cross-field

  if (
    talent.targetCareerId &&
    project.targetCareerId &&
    talent.targetCareerId.toLowerCase() === project.targetCareerId.toLowerCase()
  ) {
    score = 80;
  }

  // Bonus points if project satisfies major skill gaps
  if (talent.majorSkillGapIds && talent.majorSkillGapIds.length > 0) {
    const projectSkillIds = project.requiredSkills.map((s) => s.skillId.toLowerCase());
    const matchesGap = talent.majorSkillGapIds.some((gapId) =>
      projectSkillIds.includes(gapId.toLowerCase()),
    );
    if (matchesGap) {
      score = Math.min(100, score + 20);
    }
  }

  if (
    score === 80 &&
    (!talent.majorSkillGapIds || talent.majorSkillGapIds.length === 0)
  ) {
    score = 100;
  }

  return score;
}

function calculateAvailabilityFactor(
  availability: AvailabilityType,
  durationDays: number,
): number {
  if (availability === "FULL_TIME") {
    return 100;
  }

  if (availability === "PART_TIME") {
    return durationDays <= 10 ? 100 : 80;
  }

  if (availability === "WEEKEND") {
    return durationDays <= 5 ? 100 : 60;
  }

  return 70;
}

function calculateExperienceFactor(
  completedProjectsCount: number,
  difficulty: ProjectDifficulty,
): number {
  switch (difficulty) {
    case "BEGINNER":
      return completedProjectsCount <= 2 ? 100 : 90;
    case "INTERMEDIATE":
      if (completedProjectsCount >= 2 && completedProjectsCount <= 5) return 100;
      if (completedProjectsCount < 2) return 60;
      return 95;
    case "ADVANCED":
      if (completedProjectsCount >= 5) return 100;
      if (completedProjectsCount >= 3) return 80;
      if (completedProjectsCount >= 1) return 50;
      return 30;
    default:
      return 70;
  }
}

function calculateWorkModeFactor(
  talentMode: WorkMode,
  projectMode: WorkMode,
  talentCity?: string,
  projectCity?: string,
): number {
  if (projectMode === "REMOTE") {
    return 100;
  }

  const isSameCity =
    Boolean(talentCity) &&
    Boolean(projectCity) &&
    talentCity?.trim().toLowerCase() === projectCity?.trim().toLowerCase();

  if (projectMode === "ONSITE") {
    return isSameCity ? 100 : 0;
  }

  if (projectMode === "HYBRID") {
    return isSameCity ? 100 : 50;
  }

  return 50;
}

export function calculateCocokScore(
  talent: TalentMatchProfile,
  project: ProjectMatchRequirement,
): CocokScoreResult {
  const skillFactor = calculateSkillFactor(talent, project);
  const careerFactor = calculateCareerFactor(talent, project);
  const availabilityFactor = calculateAvailabilityFactor(
    talent.availability,
    project.durationDays,
  );
  const experienceFactor = calculateExperienceFactor(
    talent.completedProjectsCount,
    project.difficulty,
  );
  const workModeFactor = calculateWorkModeFactor(
    talent.workModePreference,
    project.workMode,
    talent.city,
    project.city,
  );

  const factors: MatchingFactors = {
    skill: Math.min(100, Math.max(0, skillFactor)),
    career: Math.min(100, Math.max(0, careerFactor)),
    availability: Math.min(100, Math.max(0, availabilityFactor)),
    experience: Math.min(100, Math.max(0, experienceFactor)),
    workMode: Math.min(100, Math.max(0, workModeFactor)),
  };

  // PRD §4.1 formula
  // Total = (0.40 * S_skill) + (0.20 * S_career) + (0.15 * S_avail) + (0.15 * S_exp) + (0.10 * S_pref)
  const weightedScore =
    factors.skill * 0.4 +
    factors.career * 0.2 +
    factors.availability * 0.15 +
    factors.experience * 0.15 +
    factors.workMode * 0.1;

  const total = Math.round(Math.min(100, Math.max(0, weightedScore)));

  const { reasons, gaps } = explainMatch(talent, project, factors);

  return {
    total,
    factors,
    reasons,
    gaps,
  };
}
