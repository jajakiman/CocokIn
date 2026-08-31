import { describe, expect, it } from "vitest";

import { isTalentOnboardingComplete, talentOnboardingSchema } from "./onboarding";

describe("Talent onboarding", () => {
  it("requires academic data, target career, one skill, and portfolio choice", () => {
    expect(talentOnboardingSchema.safeParse({ university: "", major: "", careerTarget: "", skills: [], hasNoPortfolio: false }).success).toBe(false);
    expect(talentOnboardingSchema.safeParse({
      university: "Universitas Indonesia",
      major: "Sistem Informasi",
      careerTarget: "Frontend Developer",
      portfolioUrl: "https://github.com/talent",
      hasNoPortfolio: false,
      skills: ["React"],
    }).success).toBe(true);
  });

  it("treats the no-portfolio declaration as a valid alternative", () => {
    expect(isTalentOnboardingComplete({
      university: "Universitas Indonesia",
      major: "Sistem Informasi",
      careerTarget: "Frontend Developer",
      portfolioUrl: null,
      hasNoPortfolio: true,
      skillCount: 1,
      onboardingCompletedAt: new Date(),
    })).toBe(true);
  });
});
