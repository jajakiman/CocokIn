import { describe, expect, it } from "vitest";
import { calculateCareerReadiness } from "./career-readiness";
import type { AssessmentAnswer, CareerDomainId, SkillAssessmentScore } from "./types";

describe("calculateCareerReadiness", () => {
  const careerId: CareerDomainId = "fullstack-dev";

  it("returns composite = 60% technical + 40% soft skill", () => {
    // Fullstack-dev has 10 technical skills, 3 soft skills in taxonomy
    const technicalAnswers: AssessmentAnswer[] = [
      { questionId: "fs-htmlcss-1", selectedScore: 100 },
      { questionId: "fs-js-1", selectedScore: 100 },
      { questionId: "fs-react-1", selectedScore: 100 },
      { questionId: "fs-responsive-1", selectedScore: 100 },
      { questionId: "fs-git-1", selectedScore: 100 },
      { questionId: "fs-api-1", selectedScore: 100 },
      { questionId: "fs-db-1", selectedScore: 100 },
      { questionId: "fs-auth-1", selectedScore: 100 },
      { questionId: "fs-server-1", selectedScore: 100 },
      { questionId: "fs-deploy-1", selectedScore: 100 },
    ];
    const softSkillAnswers: AssessmentAnswer[] = [
      { questionId: "ss-problem-1", selectedScore: 100 },
      { questionId: "ss-comm-1", selectedScore: 100 },
      { questionId: "ss-digital-1", selectedScore: 100 },
    ];

    const result = calculateCareerReadiness(careerId, [
      ...technicalAnswers,
      ...softSkillAnswers,
    ]);

    expect(result.technicalScore).toBe(100);
    expect(result.softSkillScore).toBe(100);
    // 60% * 100 + 40% * 100 = 100
    expect(result.compositeScore).toBe(100);
    expect(result.careerId).toBe("fullstack-dev");
  });

  it("handles mixed scores correctly", () => {
    const answers: AssessmentAnswer[] = [
      { questionId: "fs-htmlcss-1", selectedScore: 80 },
      { questionId: "fs-js-1", selectedScore: 60 },
      { questionId: "fs-react-1", selectedScore: 40 },
      { questionId: "fs-responsive-1", selectedScore: 100 },
      { questionId: "fs-git-1", selectedScore: 20 },
      { questionId: "fs-api-1", selectedScore: 0 },
      { questionId: "fs-db-1", selectedScore: 100 },
      { questionId: "fs-auth-1", selectedScore: 50 },
      { questionId: "fs-server-1", selectedScore: 30 },
      { questionId: "fs-deploy-1", selectedScore: 20 },
      { questionId: "ss-problem-1", selectedScore: 80 },
      { questionId: "ss-comm-1", selectedScore: 60 },
      { questionId: "ss-digital-1", selectedScore: 40 },
    ];

    const result = calculateCareerReadiness(careerId, answers);

    // Technical avg: (80+60+40+100+20+0+100+50+30+20)/10 = 500/10 = 50
    expect(result.technicalScore).toBe(50);
    // Soft avg: (80+60+40)/3 = 180/3 = 60
    expect(result.softSkillScore).toBe(60);
    // Composite: 0.6 * 50 + 0.4 * 60 = 30 + 24 = 54
    expect(result.compositeScore).toBe(54);
  });

  it("clamps scores to 0-100 range", () => {
    const answers: AssessmentAnswer[] = [
      { questionId: "fs-htmlcss-1", selectedScore: 150 },
      { questionId: "fs-js-1", selectedScore: -20 },
      { questionId: "fs-react-1", selectedScore: 100 },
      { questionId: "fs-responsive-1", selectedScore: 100 },
      { questionId: "fs-git-1", selectedScore: 100 },
      { questionId: "fs-api-1", selectedScore: 100 },
      { questionId: "fs-db-1", selectedScore: 100 },
      { questionId: "fs-auth-1", selectedScore: 100 },
      { questionId: "fs-server-1", selectedScore: 100 },
      { questionId: "fs-deploy-1", selectedScore: 100 },
      { questionId: "ss-problem-1", selectedScore: 100 },
      { questionId: "ss-comm-1", selectedScore: 100 },
      { questionId: "ss-digital-1", selectedScore: 100 },
    ];

    const result = calculateCareerReadiness(careerId, answers);

    // Individual scores clamped: 100, 0, 100, 100, 100, 100, 100, 100, 100, 100 => avg 900/10 = 90
    expect(result.technicalScore).toBe(90);
    expect(result.compositeScore).toBeGreaterThanOrEqual(0);
    expect(result.compositeScore).toBeLessThanOrEqual(100);
  });

  it("returns breakdown per skill", () => {
    const answers: AssessmentAnswer[] = [
      { questionId: "fs-htmlcss-1", selectedScore: 90 },
      { questionId: "fs-js-1", selectedScore: 70 },
      { questionId: "fs-react-1", selectedScore: 50 },
      { questionId: "fs-responsive-1", selectedScore: 80 },
      { questionId: "fs-git-1", selectedScore: 60 },
      { questionId: "fs-api-1", selectedScore: 40 },
      { questionId: "fs-db-1", selectedScore: 85 },
      { questionId: "fs-auth-1", selectedScore: 75 },
      { questionId: "fs-server-1", selectedScore: 65 },
      { questionId: "fs-deploy-1", selectedScore: 95 },
      { questionId: "ss-problem-1", selectedScore: 75 },
      { questionId: "ss-comm-1", selectedScore: 65 },
      { questionId: "ss-digital-1", selectedScore: 85 },
    ];

    const result = calculateCareerReadiness(careerId, answers);

    expect(result.technicalBreakdown).toHaveLength(10);
    expect(result.softSkillBreakdown).toHaveLength(3);

    const htmlCssScore = result.technicalBreakdown.find(
      (s: SkillAssessmentScore) => s.skillId === "html-css",
    );
    expect(htmlCssScore?.talentScore).toBe(90);

    const dbScore = result.technicalBreakdown.find(
      (s: SkillAssessmentScore) => s.skillId === "database",
    );
    expect(dbScore?.talentScore).toBe(85);
  });

  it("handles empty answers gracefully (zero scores)", () => {
    const result = calculateCareerReadiness(careerId, []);

    expect(result.technicalScore).toBe(0);
    expect(result.softSkillScore).toBe(0);
    expect(result.compositeScore).toBe(0);
  });

  it("works for other career domains", () => {
    const answers: AssessmentAnswer[] = [
      { questionId: "ux-figma-1", selectedScore: 80 },
      { questionId: "ux-research-1", selectedScore: 70 },
      { questionId: "ux-wireframe-1", selectedScore: 60 },
      { questionId: "ux-prototype-1", selectedScore: 90 },
      { questionId: "ux-ds-1", selectedScore: 50 },
      { questionId: "ux-usability-1", selectedScore: 70 },
      { questionId: "ux-ia-1", selectedScore: 80 },
      { questionId: "ux-hierarchy-1", selectedScore: 70 },
      { questionId: "ux-wcag-1", selectedScore: 60 },
      { questionId: "ux-mobile-1", selectedScore: 70 },
    ];

    const result = calculateCareerReadiness("ui-ux-designer", answers);

    expect(result.careerId).toBe("ui-ux-designer");
    // Technical: (80+70+60+90+50+70+80+70+60+70)/10 = 700/10 = 70
    expect(result.technicalScore).toBe(70);
    // No soft-skill answers → 0
    expect(result.softSkillScore).toBe(0);
    // Composite: 0.6 * 70 + 0.4 * 0 = 42
    expect(result.compositeScore).toBe(42);
  });
});
