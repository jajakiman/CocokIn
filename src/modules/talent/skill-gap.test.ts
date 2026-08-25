import { describe, expect, it } from "vitest";
import { analyzeSkillGap } from "./skill-gap";
import type { CareerDomainId, SkillAssessmentScore } from "./types";

describe("analyzeSkillGap", () => {
  const careerId: CareerDomainId = "frontend-dev";

  it("calculates gap = talentScore - benchmarkScore per skill", () => {
    const scores: SkillAssessmentScore[] = [
      { skillId: "html", name: "HTML", talentScore: 90 },
      { skillId: "css", name: "CSS", talentScore: 50 },
      { skillId: "javascript", name: "JavaScript", talentScore: 30 },
      { skillId: "react", name: "React", talentScore: 80 },
      { skillId: "tailwind", name: "Tailwind CSS", talentScore: 60 },
      { skillId: "nextjs", name: "Next.js", talentScore: 40 },
    ];

    const result = analyzeSkillGap(careerId, scores);

    // html: 90 - 75 = 15
    const htmlGap = result.gaps.find((g) => g.skillId === "html");
    expect(htmlGap?.gap).toBe(15);

    // css: 50 - 70 = -20
    const cssGap = result.gaps.find((g) => g.skillId === "css");
    expect(cssGap?.gap).toBe(-20);

    // javascript: 30 - 70 = -40
    const jsGap = result.gaps.find((g) => g.skillId === "javascript");
    expect(jsGap?.gap).toBe(-40);
  });

  it("identifies majorSkillGapIds as skills with largest negative gaps", () => {
    const scores: SkillAssessmentScore[] = [
      { skillId: "html", name: "HTML", talentScore: 90 },
      { skillId: "css", name: "CSS", talentScore: 50 },
      { skillId: "javascript", name: "JavaScript", talentScore: 30 },
      { skillId: "react", name: "React", talentScore: 80 },
      { skillId: "tailwind", name: "Tailwind CSS", talentScore: 60 },
      { skillId: "nextjs", name: "Next.js", talentScore: 20 },
    ];

    const result = analyzeSkillGap(careerId, scores);

    // Negative gaps sorted: javascript(-40), nextjs(-30), css(-20)
    // Major = top 3 negative
    expect(result.majorSkillGapIds).toContain("javascript");
    expect(result.majorSkillGapIds).toContain("nextjs");
    expect(result.majorSkillGapIds).toContain("css");
    // html and react are positive, should not be in major gaps
    expect(result.majorSkillGapIds).not.toContain("html");
    expect(result.majorSkillGapIds).not.toContain("react");
  });

  it("sorts gaps by deviation ascending (worst gap first)", () => {
    const scores: SkillAssessmentScore[] = [
      { skillId: "html", name: "HTML", talentScore: 90 },
      { skillId: "css", name: "CSS", talentScore: 50 },
      { skillId: "javascript", name: "JavaScript", talentScore: 30 },
    ];

    const result = analyzeSkillGap(careerId, scores);

    // Should be sorted: javascript(-40), css(-20), html(+15)
    expect(result.gaps[0].skillId).toBe("javascript");
    expect(result.gaps[1].skillId).toBe("css");
    expect(result.gaps[2].skillId).toBe("html");
  });

  it("returns empty majorSkillGapIds when talent meets all benchmarks", () => {
    const scores: SkillAssessmentScore[] = [
      { skillId: "html", name: "HTML", talentScore: 100 },
      { skillId: "css", name: "CSS", talentScore: 100 },
      { skillId: "javascript", name: "JavaScript", talentScore: 100 },
      { skillId: "react", name: "React", talentScore: 100 },
      { skillId: "tailwind", name: "Tailwind CSS", talentScore: 100 },
      { skillId: "nextjs", name: "Next.js", talentScore: 100 },
    ];

    const result = analyzeSkillGap(careerId, scores);

    expect(result.majorSkillGapIds).toEqual([]);
  });

  it("handles partial scores (not all skills assessed)", () => {
    const scores: SkillAssessmentScore[] = [
      { skillId: "html", name: "HTML", talentScore: 90 },
    ];

    const result = analyzeSkillGap(careerId, scores);

    // Only html is assessed; remaining skills have no gap entry
    expect(result.gaps).toHaveLength(1);
    expect(result.gaps[0].skillId).toBe("html");
  });

  it("includes careerId in result", () => {
    const result = analyzeSkillGap(careerId, []);
    expect(result.careerId).toBe("frontend-dev");
  });

  it("works for data-analyst career", () => {
    const scores: SkillAssessmentScore[] = [
      { skillId: "sql", name: "SQL", talentScore: 40 },
      { skillId: "python", name: "Python", talentScore: 30 },
    ];

    const result = analyzeSkillGap("data-analyst", scores);

    // sql: 40 - 70 = -30
    const sqlGap = result.gaps.find((g) => g.skillId === "sql");
    expect(sqlGap?.gap).toBe(-30);

    // python: 30 - 60 = -30
    const pyGap = result.gaps.find((g) => g.skillId === "python");
    expect(pyGap?.gap).toBe(-30);

    expect(result.majorSkillGapIds).toContain("sql");
    expect(result.majorSkillGapIds).toContain("python");
  });
});
