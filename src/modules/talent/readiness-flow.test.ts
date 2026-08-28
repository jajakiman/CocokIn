import { describe, expect, it } from "vitest";

import type { CareerReadinessResult } from "./types";
import {
  getReadinessScores,
  getReadinessSkillGapIds,
  resolveSkillGapInput,
} from "./readiness-flow";

const result: CareerReadinessResult = {
  careerId: "frontend-dev",
  technicalScore: 55,
  softSkillScore: 80,
  compositeScore: 65,
  technicalBreakdown: [
    { skillId: "html-css", name: "HTML & CSS", talentScore: 80 },
    { skillId: "javascript", name: "JavaScript", talentScore: 45 },
    { skillId: "react", name: "React", talentScore: 50 },
  ],
  softSkillBreakdown: [
    { skillId: "communication", name: "Communication", talentScore: 80 },
  ],
};

describe("readiness flow", () => {
  it("flattens the latest assessment breakdown for skill-gap analysis", () => {
    expect(getReadinessScores(result)).toEqual([
      ...result.technicalBreakdown,
      ...result.softSkillBreakdown,
    ]);
  });

  it("returns major gap ids from the latest assessment for matching", () => {
    expect(getReadinessSkillGapIds(result)).toEqual(["javascript", "react"]);
  });

  it("returns no live gap data before an assessment exists", () => {
    expect(getReadinessScores(null)).toEqual([]);
    expect(getReadinessSkillGapIds(null)).toEqual([]);
  });

  it("uses the frontend demo fallback only for the seeded frontend profile", () => {
    const fallback = result.technicalBreakdown;

    expect(resolveSkillGapInput(null, "frontend-dev", fallback)).toEqual({
      careerId: "frontend-dev",
      scores: fallback,
    });
    expect(resolveSkillGapInput(null, "data-analyst", fallback)).toEqual({
      careerId: "data-analyst",
      scores: [],
    });
  });

  it("always prefers the active assessment career and scores", () => {
    expect(resolveSkillGapInput(result, "data-analyst", [])).toEqual({
      careerId: "frontend-dev",
      scores: [...result.technicalBreakdown, ...result.softSkillBreakdown],
    });
  });
});
