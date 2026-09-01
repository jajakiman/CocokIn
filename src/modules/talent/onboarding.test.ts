import { describe, expect, it } from "vitest";

import { isTalentOnboardingComplete, talentOnboardingSchema } from "./onboarding";

describe("Talent onboarding", () => {
  it("requires academic data, target career, and portfolio choice without forcing skills in onboarding", () => {
    expect(talentOnboardingSchema.safeParse({ university: "", major: "", careerTarget: "", hasNoPortfolio: false }).success).toBe(false);
    expect(talentOnboardingSchema.safeParse({
      university: "Universitas Indonesia",
      major: "Sistem Informasi",
      careerTarget: "Frontend Developer",
      portfolioUrl: "https://github.com/talent",
      hasNoPortfolio: false,
    }).success).toBe(true);
  });

  it("treats the no-portfolio declaration as a valid alternative", () => {
    expect(isTalentOnboardingComplete({
      university: "Universitas Indonesia",
      major: "Sistem Informasi",
      careerTarget: "Frontend Developer",
      portfolioUrl: null,
      hasNoPortfolio: true,
      onboardingCompletedAt: new Date(),
    })).toBe(true);
  });
});
