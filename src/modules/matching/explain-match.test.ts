import { describe, expect, it } from "vitest";

import { explainMatch } from "./explain-match";
import type { MatchingFactors, ProjectMatchRequirement, TalentMatchProfile } from "./types";

describe("explainMatch", () => {
  it("generates human-readable reasons and gap warnings in Indonesian", () => {
    const talent: TalentMatchProfile = {
      skills: [{ skillId: "react", name: "React", level: "PROJECT_VERIFIED" }],
      targetCareerId: "fullstack-dev",
      majorSkillGapIds: ["typescript"],
      availability: "PART_TIME",
      completedProjectsCount: 2,
      workModePreference: "REMOTE",
    };

    const project: ProjectMatchRequirement = {
      requiredSkills: [
        { skillId: "react", name: "React" },
        { skillId: "typescript", name: "TypeScript" },
      ],
      targetCareerId: "fullstack-dev",
      difficulty: "INTERMEDIATE",
      durationDays: 7,
      workMode: "REMOTE",
    };

    const factors: MatchingFactors = {
      skill: 75,
      career: 100,
      availability: 90,
      experience: 100,
      workMode: 100,
    };

    const { reasons, gaps } = explainMatch(talent, project, factors);

    expect(reasons.length).toBeGreaterThan(0);
    expect(reasons.some((r) => r.includes("React") && r.includes("terverifikasi"))).toBe(true);
    expect(reasons.some((r) => r.includes("skill gap") || r.includes("TypeScript"))).toBe(true);
    expect(gaps.length).toBeGreaterThan(0);
    expect(gaps.some((g) => g.includes("TypeScript"))).toBe(true);
  });
});
