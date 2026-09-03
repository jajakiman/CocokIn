import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { CompositeScoreDonut } from "@/src/components/talent/composite-score-donut";
import { ReadinessBarChart } from "@/src/components/talent/readiness-bar-chart";
import type { SkillAssessmentScore } from "@/src/modules/talent/types";

describe("CompositeScoreDonut", () => {
  it("renders composite percentage and weighted contributions", () => {
    render(
      <CompositeScoreDonut
        technicalScore={85}
        softSkillScore={90}
        compositeScore={87}
      />,
    );

    expect(screen.getByText("87%")).toBeInTheDocument();
    expect(screen.getByText(/Kontribusi Teknis/i)).toBeInTheDocument();
    expect(screen.getByText(/Soft Skill \(40%\)/i)).toBeInTheDocument();
    // 85 * 0.6 = 51, 90 * 0.4 = 36
    expect(screen.getByText("51 poin")).toBeInTheDocument();
    expect(screen.getByText("36 poin")).toBeInTheDocument();
  });

  it("labels high readiness category", () => {
    render(
      <CompositeScoreDonut
        technicalScore={100}
        softSkillScore={100}
        compositeScore={100}
      />,
    );
    expect(screen.getByText("Siap Kerja (Tinggi)")).toBeInTheDocument();
  });

  it("provides an accessible aria description of the formula", () => {
    render(
      <CompositeScoreDonut
        technicalScore={50}
        softSkillScore={50}
        compositeScore={50}
      />,
    );
    const described = screen.getByRole("img");
    expect(described).toHaveAttribute(
      "aria-label",
      expect.stringContaining("Skor Komposit 50%"),
    );
  });
});

describe("ReadinessBarChart", () => {
  const technical: SkillAssessmentScore[] = [
    { skillId: "html", name: "HTML", talentScore: 85 },
    { skillId: "css", name: "CSS", talentScore: 80 },
    { skillId: "javascript", name: "JavaScript", talentScore: 60 },
  ];
  const soft: SkillAssessmentScore[] = [
    { skillId: "problem-solving", name: "Problem Solving", talentScore: 90 },
    { skillId: "communication", name: "Komunikasi Profesional", talentScore: 95 },
    { skillId: "digital-literacy", name: "Digital Literacy", talentScore: 50 },
  ];

  it("renders skill rows with talent score and benchmark", () => {
    render(
      <ReadinessBarChart
        careerId="frontend-dev"
        technicalBreakdown={technical}
        softSkillBreakdown={soft}
      />,
    );

    expect(screen.getByText("HTML")).toBeInTheDocument();
    expect(
      screen.getByText(/Benchmark: 75% \| \+10% Kompeten/),
    ).toBeInTheDocument();
    // javascript benchmark is 70, 60 - 70 = -10
    expect(
      screen.getByText(/Benchmark: 70% \| -10% di bawah standar/),
    ).toBeInTheDocument();
  });

  it("renders section headings with counts", () => {
    render(
      <ReadinessBarChart
        careerId="frontend-dev"
        technicalBreakdown={technical}
        softSkillBreakdown={soft}
      />,
    );

    expect(screen.getByText("Keahlian Teknis (3)")).toBeInTheDocument();
    expect(screen.getByText("Soft Skill (3)")).toBeInTheDocument();
  });

  it("exposes meter semantics per skill for screen readers", () => {
    render(
      <ReadinessBarChart
        careerId="frontend-dev"
        technicalBreakdown={technical}
        softSkillBreakdown={soft}
      />,
    );

    const meters = screen.getAllByRole("meter");
    expect(meters).toHaveLength(6);
    expect(meters[0]).toHaveAttribute("aria-valuenow", "85");
    expect(meters[0]).toHaveAttribute(
      "aria-label",
      expect.stringContaining("HTML"),
    );
  });
});
