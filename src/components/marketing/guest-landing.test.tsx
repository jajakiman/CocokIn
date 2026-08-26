import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import {
  SEEDED_PORTFOLIO_ENTRIES,
  SEEDED_PROJECTS,
  SEEDED_TALENT_PROFILE,
} from "@/src/fixtures/seeded-demo";
import { calculateCocokScore } from "@/src/modules/matching";

import { GuestLanding } from "./guest-landing";

describe("GuestLanding", () => {
  it("renders the approved eight-section public information architecture", () => {
    const { container } = render(<GuestLanding />);

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const sectionIds = Array.from(container.querySelectorAll("main > section"), (section) => section.id);
    expect(sectionIds).toEqual([
      "hero",
      "problem-outcome",
      "cara-kerja",
      "product-proof",
      "trust",
      "final-cta",
    ]);
    expect(container.querySelector("#untuk-talent")).toBeInTheDocument();
    expect(container.querySelector("#untuk-umkm")).toBeInTheDocument();
  });

  it("provides a skip link to the guest main content as the first focusable control", () => {
    const { container } = render(<GuestLanding />);

    const skipLink = screen.getByRole("link", { name: "Lewati ke konten utama" });
    expect(skipLink).toHaveClass("skip-link");
    expect(skipLink).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(container.querySelector("a, button")).toBe(skipLink);
  });

  it("gives Talent and UMKM equal registration paths plus a system demo", () => {
    render(<GuestLanding />);

    const main = screen.getByRole("main");
    expect(within(main).getAllByRole("link", { name: "Mulai sebagai Talent" })).toHaveLength(2);
    expect(within(main).getAllByRole("link", { name: "Mulai sebagai UMKM" })).toHaveLength(2);

    for (const link of within(main).getAllByRole("link", { name: "Mulai sebagai Talent" })) {
      expect(link).toHaveAttribute("href", "/register/talent");
    }
    for (const link of within(main).getAllByRole("link", { name: "Mulai sebagai UMKM" })) {
      expect(link).toHaveAttribute("href", "/register/business");
    }
    expect(within(main).getByRole("link", { name: "Lihat demo sistem" })).toHaveAttribute(
      "href",
      "/demo",
    );
    expect(screen.queryByRole("link", { name: /admin/i })).not.toBeInTheDocument();
  });

  it("shows centralized synthetic product proof without fabricated social proof", () => {
    render(<GuestLanding />);

    const proof = screen.getByRole("region", { name: "Bukti produk" });
    const score = calculateCocokScore(
      {
        skills: SEEDED_TALENT_PROFILE.passportEntries.map((entry) => ({
          skillId: entry.skillId,
          name: entry.name,
          level: entry.evidenceLevel,
        })),
        targetCareerId: SEEDED_TALENT_PROFILE.targetCareerId,
        availability: SEEDED_TALENT_PROFILE.availability,
        completedProjectsCount: SEEDED_TALENT_PROFILE.completedProjectsCount,
        workModePreference: SEEDED_TALENT_PROFILE.workModePreference,
        city: SEEDED_TALENT_PROFILE.city,
      },
      SEEDED_PROJECTS[0].project,
    );

    expect(within(proof).getByText("Demonstrasi produk · Data sintetis")).toBeVisible();
    expect(within(proof).getByText("Career Readiness")).toBeVisible();
    expect(within(proof).getByText("Explainable Cocok Score")).toBeVisible();
    expect(within(proof).getByText(`${score.total}/100`)).toBeVisible();
    expect(within(proof).getByText(`Skill ${score.factors.skill}`)).toBeVisible();
    expect(within(proof).getByText(`Karier ${score.factors.career}`)).toBeVisible();
    expect(within(proof).getByText("Milestone review workspace")).toBeVisible();
    expect(within(proof).getByText("Verified Passport & Portfolio")).toBeVisible();
    expect(within(proof).getByText(SEEDED_PROJECTS[0].title)).toBeVisible();
    expect(within(proof).getByText(SEEDED_PORTFOLIO_ENTRIES[0].businessName)).toBeVisible();
    expect(screen.queryByText(/testimoni|rating|\d+[,.]?\d* pengguna/i)).not.toBeInTheDocument();
  });

  it("states the platform trust boundaries accurately", () => {
    render(<GuestLanding />);

    expect(screen.getByText(/Cocok Score dihitung secara deterministik/i)).toBeVisible();
    expect(
      screen.getByText(/persetujuan publikasi Talent dan persetujuan atribusi UMKM/i),
    ).toBeVisible();
    expect(screen.getByText(/data demonstrasi seluruhnya sintetis/i)).toBeVisible();
    expect(screen.getByText(/operasi uang nyata tetap dinonaktifkan/i)).toBeVisible();
    expect(screen.queryByText(/escrow berizin/i)).not.toBeInTheDocument();
  });
});
