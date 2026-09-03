import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { MoneyBreakdown } from "./money-breakdown";
import { AuditTimeline, type AuditEvent } from "./audit-timeline";
import { CocokScoreCard } from "./cocok-score-card";
import type { CocokScoreResult } from "@/src/modules/matching/types";

describe("Extended Design System Primitives (MoneyBreakdown, AuditTimeline, CocokScoreCard)", () => {
  it("renders MoneyBreakdown correctly for talent role", () => {
    render(<MoneyBreakdown serviceValue={2000000} role="talent" />);

    expect(screen.getByText("Rincian Finansial Transparan")).toBeInTheDocument();
    expect(screen.getByText("Nilai Pekerjaan (Service Value)")).toBeInTheDocument();
    // Immediate payout 90% = 1.800.000
    expect(screen.getByText("Rp 1.800.000")).toBeInTheDocument();
    // Warranty retention 10% = 200.000
    expect(screen.getByText("Rp 200.000")).toBeInTheDocument();
  });

  it("renders MoneyBreakdown correctly for business role", () => {
    render(<MoneyBreakdown serviceValue={2000000} role="business" />);

    expect(screen.getByText("Biaya Platform CocokIn (10%)")).toBeInTheDocument();
    // Total funding = 2.000.000 + 200.000 = 2.200.000
    expect(screen.getByText("Rp 2.200.000")).toBeInTheDocument();
  });

  it("renders AuditTimeline with events and references", () => {
    const mockEvents: AuditEvent[] = [
      {
        id: "ev-1",
        timestamp: "2026-08-20T10:00:00Z",
        actor: "Nadia Putri",
        actorRole: "Talent",
        action: "Submit Milestone #1",
        description: "Tautan staging HTTPS berhasil diserahkan ke UMKM.",
        platformReference: "CCK-M1-SUB-01",
        tone: "info",
      },
    ];

    render(<AuditTimeline events={mockEvents} />);

    expect(screen.getByText("Submit Milestone #1")).toBeInTheDocument();
    expect(screen.getByText("Talent: Nadia Putri")).toBeInTheDocument();
    expect(screen.getByText("CCK-M1-SUB-01")).toBeInTheDocument();
  });

  it("renders CocokScoreCard with factors and reasons", () => {
    const mockResult: CocokScoreResult = {
      total: 88,
      factors: {
        skill: 90,
        career: 100,
        availability: 100,
        experience: 80,
        workMode: 100,
      },
      reasons: ["Skill React terverifikasi dari proyek sebelumnya."],
      gaps: [],
    };

    render(
      <CocokScoreCard
        result={mockResult}
        talentName="Nadia Putri"
        candidateRole="Fullstack Developer"
      />,
    );

    expect(screen.getByText("Nadia Putri")).toBeInTheDocument();
    expect(screen.getByText("Fullstack Developer")).toBeInTheDocument();
    expect(screen.getByText("88")).toBeInTheDocument();
    expect(screen.getByText("Sangat Cocok")).toBeInTheDocument();
    expect(screen.getByText("Skill React terverifikasi dari proyek sebelumnya.")).toBeInTheDocument();
  });
});
