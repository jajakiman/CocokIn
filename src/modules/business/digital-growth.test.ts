import { describe, it, expect } from "vitest";
import { calculateDigitalGrowth, type AssessmentRecord } from "./digital-growth";

describe("Digital Growth Calculation Module (FR-BIZ-05)", () => {
  it("handles empty assessments safely", () => {
    const growth = calculateDigitalGrowth([]);
    expect(growth.hasGrowth).toBe(false);
    expect(growth.baseline).toBeNull();
    expect(growth.latest).toBeNull();
    expect(growth.deltaScore).toBe(0);
    expect(growth.stage).toBe("Belum Asesmen");
  });

  it("handles a single baseline assessment (no growth yet)", () => {
    const singleAssessment: AssessmentRecord = {
      id: "a1",
      readinessScore: 70,
      financeScore: 60,
      marketingScore: 80,
      teamScore: 70,
      operationsScore: 70,
      outsourcingScore: 70,
      createdAt: new Date("2026-08-01"),
    };

    const growth = calculateDigitalGrowth([singleAssessment]);
    expect(growth.hasGrowth).toBe(false);
    expect(growth.baseline?.readinessScore).toBe(70);
    expect(growth.latest?.readinessScore).toBe(70);
    expect(growth.deltaScore).toBe(0);
    expect(growth.stage).toBe("Tahap Adopsi & Otomasi");
    expect(growth.pillars).toHaveLength(5);
    expect(growth.pillars[0].delta).toBe(0);
  });

  it("accurately calculates growth delta and 5-pillar progression across assessments", () => {
    const baseline: AssessmentRecord = {
      id: "a1",
      readinessScore: 72,
      financeScore: 65,
      marketingScore: 75,
      teamScore: 70,
      operationsScore: 75,
      outsourcingScore: 75,
      createdAt: new Date("2026-08-01"),
    };

    const postProject: AssessmentRecord = {
      id: "a2",
      readinessScore: 84,
      financeScore: 75,
      marketingScore: 85,
      teamScore: 85,
      operationsScore: 90,
      outsourcingScore: 85,
      createdAt: new Date("2026-09-01"),
    };

    const growth = calculateDigitalGrowth([baseline, postProject]);
    expect(growth.hasGrowth).toBe(true);
    expect(growth.deltaScore).toBe(12); // 84 - 72 = 12
    expect(growth.stage).toBe("Tahap Terintegrasi & Siap Skala");

    // Verify 5 pillars
    const finance = growth.pillars.find((p) => p.key === "finance");
    expect(finance?.before).toBe(65);
    expect(finance?.after).toBe(75);
    expect(finance?.delta).toBe(10);
    expect(finance?.isPositive).toBe(true);

    const operations = growth.pillars.find((p) => p.key === "operations");
    expect(operations?.delta).toBe(15); // 90 - 75 = 15

    const team = growth.pillars.find((p) => p.key === "team");
    expect(team?.delta).toBe(15); // 85 - 70 = 15
  });
});
