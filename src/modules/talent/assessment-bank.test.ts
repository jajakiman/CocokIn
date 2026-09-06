import { describe, expect, it } from "vitest";
import {
  getQuestionsForCareer,
  getTechnicalQuestions,
  getSoftSkillQuestions,
  ASSESSMENT_QUESTIONS,
} from "./assessment-bank";
import { getAllCareerIds } from "./career-taxonomy";
import type { CareerDomainId } from "./types";

describe("assessment bank (10 technical + 3 soft skill per career)", () => {
  it("provides 13 questions for every career domain", () => {
    for (const careerId of getAllCareerIds()) {
      expect(getQuestionsForCareer(careerId)).toHaveLength(13);
    }
  });

  it("splits 10 technical and 3 soft skill questions per career", () => {
    for (const careerId of getAllCareerIds()) {
      expect(getTechnicalQuestions(careerId)).toHaveLength(10);
      expect(getSoftSkillQuestions(careerId)).toHaveLength(3);
    }
  });

  it("gives every technical question a skillId matching the career taxonomy", async () => {
    const { CAREER_TAXONOMY } = await import("./career-taxonomy");
    for (const q of ASSESSMENT_QUESTIONS) {
      const domain = CAREER_TAXONOMY[q.careerId as CareerDomainId];
      const skillIds = [
        ...domain.technicalSkills,
        ...domain.softSkills,
      ].map((s) => s.skillId);
      expect(q.skillId, `${q.id} must map to a taxonomy skill`).toBeDefined();
      expect(
        skillIds,
        `${q.id} skillId ${q.skillId} must exist in taxonomy ${q.careerId}`,
      ).toContain(q.skillId);
    }
  });

  it("has unique question ids across the bank", () => {
    const ids = new Set(ASSESSMENT_QUESTIONS.map((q) => q.id));
    expect(ids.size).toBe(ASSESSMENT_QUESTIONS.length);
  });

  it("offers 4 options with one max-score answer per question", () => {
    for (const q of ASSESSMENT_QUESTIONS) {
      expect(q.options).toHaveLength(4);
      const maxScores = q.options.filter((o) => o.score === 100);
      expect(maxScores, `${q.id} needs exactly one 100-score option`).toHaveLength(1);
    }
  });
});
