import { describe, expect, it } from "vitest";

import {
  claimSkillSchema,
  normalizeSkillName,
  talentProfileSchema,
} from "./profile";

describe("Talent profile", () => {
  it("accepts only canonical career targets", () => {
    expect(talentProfileSchema.safeParse({
      name: "Nadia Arina",
      bio: "Frontend developer",
      university: "Universitas Indonesia",
      major: "Sistem Informasi",
      careerTarget: "Frontend Developer",
      workModePreference: "REMOTE",
      timeAvailability: "PART_TIME",
    }).success).toBe(true);

    expect(talentProfileSchema.safeParse({
      name: "Nadia Arina",
      bio: "Frontend developer",
      university: "Universitas Indonesia",
      major: "Sistem Informasi",
      careerTarget: "Astronaut",
      workModePreference: "REMOTE",
      timeAvailability: "PART_TIME",
    }).success).toBe(false);
  });

  it("normalizes a claimed skill before persistence", () => {
    expect(normalizeSkillName("  react   native ")).toBe("React Native");
    expect(normalizeSkillName("next.js")).toBe("Next.js");
    expect(normalizeSkillName("gOLANG")).toBe("Golang");
    expect(normalizeSkillName("golang")).toBe("Golang");
    expect(claimSkillSchema.parse({ skillName: "  react   native " })).toEqual({
      skillName: "React Native",
    });
  });

  it("rejects empty and excessively long skill names", () => {
    expect(claimSkillSchema.safeParse({ skillName: "   " }).success).toBe(false);
    expect(claimSkillSchema.safeParse({ skillName: "x".repeat(61) }).success).toBe(false);
  });
});
