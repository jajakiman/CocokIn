import { describe, expect, it } from "vitest";

import { calculateCocokScore } from "./calculate-cocok-score";
import type { ProjectMatchRequirement, TalentMatchProfile } from "./types";

describe("calculateCocokScore", () => {
  it("calculates a perfect score of 100 for a completely aligned match", () => {
    const talent: TalentMatchProfile = {
      skills: [
        { skillId: "react", name: "React", level: "PROJECT_VERIFIED" },
        { skillId: "tailwind", name: "Tailwind CSS", level: "PROJECT_VERIFIED" },
      ],
      targetCareerId: "frontend-dev",
      majorSkillGapIds: [],
      availability: "FULL_TIME",
      completedProjectsCount: 1,
      workModePreference: "REMOTE",
      city: "Jakarta",
    };

    const project: ProjectMatchRequirement = {
      requiredSkills: [
        { skillId: "react", name: "React" },
        { skillId: "tailwind", name: "Tailwind CSS" },
      ],
      targetCareerId: "frontend-dev",
      difficulty: "BEGINNER",
      durationDays: 7,
      workMode: "REMOTE",
    };

    const result = calculateCocokScore(talent, project);

    expect(result.total).toBe(100);
    expect(result.factors.skill).toBe(100);
    expect(result.factors.career).toBe(100);
    expect(result.factors.availability).toBe(100);
    expect(result.factors.experience).toBe(100);
    expect(result.factors.workMode).toBe(100);
    expect(result.reasons.length).toBeGreaterThan(0);
    expect(result.gaps).toHaveLength(0);
  });

  it("yields higher skill factor for verified skills compared to self-declared skills", () => {
    const verifiedTalent: TalentMatchProfile = {
      skills: [{ skillId: "nextjs", name: "Next.js", level: "PROJECT_VERIFIED" }],
      targetCareerId: "frontend-dev",
      availability: "FULL_TIME",
      completedProjectsCount: 1,
      workModePreference: "REMOTE",
    };

    const selfDeclaredTalent: TalentMatchProfile = {
      skills: [{ skillId: "nextjs", name: "Next.js", level: "SELF_DECLARED" }],
      targetCareerId: "frontend-dev",
      availability: "FULL_TIME",
      completedProjectsCount: 1,
      workModePreference: "REMOTE",
    };

    const project: ProjectMatchRequirement = {
      requiredSkills: [{ skillId: "nextjs", name: "Next.js" }],
      targetCareerId: "frontend-dev",
      difficulty: "BEGINNER",
      durationDays: 5,
      workMode: "REMOTE",
    };

    const verifiedScore = calculateCocokScore(verifiedTalent, project);
    const selfDeclaredScore = calculateCocokScore(selfDeclaredTalent, project);

    expect(verifiedScore.factors.skill).toBe(100);
    expect(selfDeclaredScore.factors.skill).toBe(50);
    expect(verifiedScore.total).toBeGreaterThan(selfDeclaredScore.total);
  });

  it("gives bonus career alignment score when project covers talent major skill gaps", () => {
    const talentWithGap: TalentMatchProfile = {
      skills: [],
      targetCareerId: "frontend-dev",
      majorSkillGapIds: ["typescript"],
      availability: "PART_TIME",
      completedProjectsCount: 0,
      workModePreference: "REMOTE",
    };

    const talentWithoutGap: TalentMatchProfile = {
      skills: [],
      targetCareerId: "frontend-dev",
      majorSkillGapIds: ["figma"],
      availability: "PART_TIME",
      completedProjectsCount: 0,
      workModePreference: "REMOTE",
    };

    const project: ProjectMatchRequirement = {
      requiredSkills: [{ skillId: "typescript", name: "TypeScript" }],
      targetCareerId: "frontend-dev",
      difficulty: "BEGINNER",
      durationDays: 7,
      workMode: "REMOTE",
    };

    const scoreWithGap = calculateCocokScore(talentWithGap, project);
    const scoreWithoutGap = calculateCocokScore(talentWithoutGap, project);

    expect(scoreWithGap.factors.career).toBeGreaterThan(scoreWithoutGap.factors.career);
    expect(scoreWithGap.reasons.some((r) => r.includes("skill gap"))).toBe(true);
  });

  it("handles location mismatch for onsite and hybrid projects strictly", () => {
    const talentJakarta: TalentMatchProfile = {
      skills: [{ skillId: "seo", name: "SEO", level: "ASSESSED" }],
      targetCareerId: "digital-marketing",
      availability: "FULL_TIME",
      completedProjectsCount: 1,
      workModePreference: "ONSITE",
      city: "Jakarta",
    };

    const talentSurabaya: TalentMatchProfile = {
      ...talentJakarta,
      city: "Surabaya",
    };

    const projectOnsiteJakarta: ProjectMatchRequirement = {
      requiredSkills: [{ skillId: "seo", name: "SEO" }],
      targetCareerId: "digital-marketing",
      difficulty: "BEGINNER",
      durationDays: 10,
      workMode: "ONSITE",
      city: "Jakarta",
    };

    const scoreJakarta = calculateCocokScore(talentJakarta, projectOnsiteJakarta);
    const scoreSurabaya = calculateCocokScore(talentSurabaya, projectOnsiteJakarta);

    expect(scoreJakarta.factors.workMode).toBe(100);
    expect(scoreSurabaya.factors.workMode).toBe(0);
    expect(scoreSurabaya.gaps.some((g) => g.toLowerCase().includes("lokasi") || g.toLowerCase().includes("onsite"))).toBe(true);
  });

  it("handles experience level scaling against project difficulty appropriately", () => {
    const beginnerTalent: TalentMatchProfile = {
      skills: [{ skillId: "figma", name: "Figma", level: "PROJECT_VERIFIED" }],
      targetCareerId: "ui-ux",
      availability: "FULL_TIME",
      completedProjectsCount: 0,
      workModePreference: "REMOTE",
    };

    const advancedProject: ProjectMatchRequirement = {
      requiredSkills: [{ skillId: "figma", name: "Figma" }],
      targetCareerId: "ui-ux",
      difficulty: "ADVANCED",
      durationDays: 14,
      workMode: "REMOTE",
    };

    const beginnerProject: ProjectMatchRequirement = {
      ...advancedProject,
      difficulty: "BEGINNER",
    };

    const scoreForAdvanced = calculateCocokScore(beginnerTalent, advancedProject);
    const scoreForBeginner = calculateCocokScore(beginnerTalent, beginnerProject);

    expect(scoreForBeginner.factors.experience).toBe(100);
    expect(scoreForAdvanced.factors.experience).toBeLessThan(60);
  });
});
