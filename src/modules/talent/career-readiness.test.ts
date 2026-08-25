import { describe, expect, it } from "vitest";
import { calculateCareerReadiness } from "./career-readiness";
import type { AssessmentAnswer, CareerDomainId, SkillAssessmentScore } from "./types";

describe("calculateCareerReadiness", () => {
  const careerId: CareerDomainId = "frontend-dev";

  it("returns composite = 60% technical + 40% soft skill", () => {
    // Frontend-dev has 6 technical skills, 3 soft skills in taxonomy
    // We'll provide answers that map to known scores
    const technicalAnswers: AssessmentAnswer[] = [
      { questionId: "fe-html-1", selectedScore: 100 },
      { questionId: "fe-css-1", selectedScore: 100 },
      { questionId: "fe-js-1", selectedScore: 100 },
      { questionId: "fe-react-1", selectedScore: 100 },
      { questionId: "fe-tailwind-1", selectedScore: 100 },
      { questionId: "fe-nextjs-1", selectedScore: 100 },
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
    expect(result.careerId).toBe("frontend-dev");
  });

  it("handles mixed scores correctly", () => {
    const answers: AssessmentAnswer[] = [
      { questionId: "fe-html-1", selectedScore: 80 },
      { questionId: "fe-css-1", selectedScore: 60 },
      { questionId: "fe-js-1", selectedScore: 40 },
      { questionId: "fe-react-1", selectedScore: 100 },
      { questionId: "fe-tailwind-1", selectedScore: 20 },
      { questionId: "fe-nextjs-1", selectedScore: 0 },
      { questionId: "ss-problem-1", selectedScore: 80 },
      { questionId: "ss-comm-1", selectedScore: 60 },
      { questionId: "ss-digital-1", selectedScore: 40 },
    ];

    const result = calculateCareerReadiness(careerId, answers);

    // Technical avg: (80+60+40+100+20+0)/6 = 300/6 = 50
    expect(result.technicalScore).toBe(50);
    // Soft avg: (80+60+40)/3 = 180/3 = 60
    expect(result.softSkillScore).toBe(60);
    // Composite: 0.6 * 50 + 0.4 * 60 = 30 + 24 = 54
    expect(result.compositeScore).toBe(54);
  });

  it("clamps scores to 0-100 range", () => {
    const answers: AssessmentAnswer[] = [
      { questionId: "fe-html-1", selectedScore: 150 },
      { questionId: "fe-css-1", selectedScore: -20 },
      { questionId: "fe-js-1", selectedScore: 100 },
      { questionId: "fe-react-1", selectedScore: 100 },
      { questionId: "fe-tailwind-1", selectedScore: 100 },
      { questionId: "fe-nextjs-1", selectedScore: 100 },
      { questionId: "ss-problem-1", selectedScore: 100 },
      { questionId: "ss-comm-1", selectedScore: 100 },
      { questionId: "ss-digital-1", selectedScore: 100 },
    ];

    const result = calculateCareerReadiness(careerId, answers);

    // Individual scores clamped: 100, 0, 100, 100, 100, 100 => avg 83.33 -> 83
    expect(result.technicalScore).toBe(83);
    expect(result.compositeScore).toBeGreaterThanOrEqual(0);
    expect(result.compositeScore).toBeLessThanOrEqual(100);
  });

  it("returns breakdown per skill", () => {
    const answers: AssessmentAnswer[] = [
      { questionId: "fe-html-1", selectedScore: 90 },
      { questionId: "fe-css-1", selectedScore: 70 },
      { questionId: "fe-js-1", selectedScore: 50 },
      { questionId: "fe-react-1", selectedScore: 80 },
      { questionId: "fe-tailwind-1", selectedScore: 60 },
      { questionId: "fe-nextjs-1", selectedScore: 40 },
      { questionId: "ss-problem-1", selectedScore: 75 },
      { questionId: "ss-comm-1", selectedScore: 65 },
      { questionId: "ss-digital-1", selectedScore: 85 },
    ];

    const result = calculateCareerReadiness(careerId, answers);

    expect(result.technicalBreakdown).toHaveLength(6);
    expect(result.softSkillBreakdown).toHaveLength(3);

    const htmlScore = result.technicalBreakdown.find(
      (s: SkillAssessmentScore) => s.skillId === "html",
    );
    expect(htmlScore?.talentScore).toBe(90);
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
    ];

    const result = calculateCareerReadiness("ui-ux-designer", answers);

    expect(result.careerId).toBe("ui-ux-designer");
    // Technical: (80+70+60+90+50)/5 = 350/5 = 70
    expect(result.technicalScore).toBe(70);
    // No soft-skill answers → 0
    expect(result.softSkillScore).toBe(0);
    // Composite: 0.6 * 70 + 0.4 * 0 = 42
    expect(result.compositeScore).toBe(42);
  });
});
