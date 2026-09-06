import { describe, expect, it } from "vitest";
import { analyzeSkillGap } from "./skill-gap";
import type { CareerDomainId, SkillAssessmentScore } from "./types";

describe("analyzeSkillGap", () => {
  const careerId: CareerDomainId = "fullstack-dev";

  it("calculates gap = talentScore - benchmarkScore per skill", () => {
    const scores: SkillAssessmentScore[] = [
      { skillId: "html-css", name: "HTML & CSS", talentScore: 90 },
      { skillId: "javascript", name: "JavaScript / TypeScript", talentScore: 50 },
      { skillId: "database", name: "Database & SQL", talentScore: 30 },
      { skillId: "react-nextjs", name: "React & Next.js", talentScore: 80 },
      { skillId: "git", name: "Git & Version Control", talentScore: 60 },
      { skillId: "deployment", name: "Deployment & DevOps", talentScore: 40 },
    ];

    const result = analyzeSkillGap(careerId, scores);

    // html-css: 90 - 70 = 20
    const htmlCssGap = result.gaps.find((g) => g.skillId === "html-css");
    expect(htmlCssGap?.gap).toBe(20);

    // javascript: 50 - 70 = -20
    const jsGap = result.gaps.find((g) => g.skillId === "javascript");
    expect(jsGap?.gap).toBe(-20);

    // database: 30 - 65 = -35
    const dbGap = result.gaps.find((g) => g.skillId === "database");
    expect(dbGap?.gap).toBe(-35);
  });

  it("identifies majorSkillGapIds as skills with largest negative gaps", () => {
    const scores: SkillAssessmentScore[] = [
      { skillId: "html-css", name: "HTML & CSS", talentScore: 90 },
      { skillId: "javascript", name: "JavaScript / TypeScript", talentScore: 50 },
      { skillId: "database", name: "Database & SQL", talentScore: 30 },
      { skillId: "react-nextjs", name: "React & Next.js", talentScore: 80 },
      { skillId: "git", name: "Git & Version Control", talentScore: 60 },
      { skillId: "deployment", name: "Deployment & DevOps", talentScore: 20 },
    ];

    const result = analyzeSkillGap(careerId, scores);

    // Negative gaps sorted: database(-35), deployment(-35), javascript(-20)
    // Major = top 3 negative
    expect(result.majorSkillGapIds).toContain("database");
    expect(result.majorSkillGapIds).toContain("deployment");
    expect(result.majorSkillGapIds).toContain("javascript");
    // html-css and react-nextjs are positive, should not be in major gaps
    expect(result.majorSkillGapIds).not.toContain("html-css");
    expect(result.majorSkillGapIds).not.toContain("react-nextjs");
  });

  it("sorts gaps by deviation ascending (worst gap first)", () => {
    const scores: SkillAssessmentScore[] = [
      { skillId: "html-css", name: "HTML & CSS", talentScore: 90 },
      { skillId: "javascript", name: "JavaScript / TypeScript", talentScore: 50 },
      { skillId: "database", name: "Database & SQL", talentScore: 30 },
    ];

    const result = analyzeSkillGap(careerId, scores);

    // Should be sorted: database(-35), javascript(-20), html-css(+20)
    expect(result.gaps[0].skillId).toBe("database");
    expect(result.gaps[1].skillId).toBe("javascript");
    expect(result.gaps[2].skillId).toBe("html-css");
  });

  it("returns empty majorSkillGapIds when talent meets all benchmarks", () => {
    const scores: SkillAssessmentScore[] = [
      { skillId: "html-css", name: "HTML & CSS", talentScore: 100 },
      { skillId: "javascript", name: "JavaScript / TypeScript", talentScore: 100 },
      { skillId: "database", name: "Database & SQL", talentScore: 100 },
      { skillId: "react-nextjs", name: "React & Next.js", talentScore: 100 },
      { skillId: "git", name: "Git & Version Control", talentScore: 100 },
      { skillId: "deployment", name: "Deployment & DevOps", talentScore: 100 },
    ];

    const result = analyzeSkillGap(careerId, scores);

    expect(result.majorSkillGapIds).toEqual([]);
  });

  it("handles partial scores (not all skills assessed)", () => {
    const scores: SkillAssessmentScore[] = [
      { skillId: "html-css", name: "HTML & CSS", talentScore: 90 },
    ];

    const result = analyzeSkillGap(careerId, scores);

    // Only html-css is assessed; remaining skills have no gap entry
    expect(result.gaps).toHaveLength(1);
    expect(result.gaps[0].skillId).toBe("html-css");
  });

  it("includes careerId in result", () => {
    const result = analyzeSkillGap(careerId, []);
    expect(result.careerId).toBe("fullstack-dev");
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
