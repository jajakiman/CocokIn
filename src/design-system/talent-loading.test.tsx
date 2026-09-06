import { render, screen } from "@testing-library/react";
import { existsSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  AssessmentLoadingSkeleton,
  MarketplaceLoadingSkeleton,
  PassportLoadingSkeleton,
  PortfolioLoadingSkeleton,
  ProfileLoadingSkeleton,
  ProjectDetailLoadingSkeleton,
  WorkspaceLoadingSkeleton,
  WorkspaceOverviewLoadingSkeleton,
} from "./talent-loading";
import { Skeleton } from "./skeleton";

describe("Talent route loading states", () => {
  it.each([
    ["marketplace", MarketplaceLoadingSkeleton, "project-card"],
    ["project detail", ProjectDetailLoadingSkeleton, "project-detail"],
    ["workspace", WorkspaceLoadingSkeleton, "milestone"],
    ["passport", PassportLoadingSkeleton, "skill-row"],
    ["portfolio", PortfolioLoadingSkeleton, "portfolio-card"],
    ["assessment", AssessmentLoadingSkeleton, "score-tile"],
    ["profile", ProfileLoadingSkeleton, "profile-section"],
    ["workspace overview", WorkspaceOverviewLoadingSkeleton, "workspace-card"],
  ])("matches the %s content anatomy", (_, Component, anatomy) => {
    render(<Component />);

    expect(screen.getByRole("status", { name: "Memuat konten" })).toBeVisible();
    expect(screen.getAllByTestId(`skeleton-${anatomy}`).length).toBeGreaterThan(0);
  });

  it("matches marketplace and portfolio breakpoint details", () => {
    const { rerender } = render(<MarketplaceLoadingSkeleton />);
    expect(screen.getAllByTestId("skeleton-project-price")).toHaveLength(4);

    rerender(<PortfolioLoadingSkeleton />);
    expect(screen.getByTestId("skeleton-portfolio-grid")).toHaveClass("lg:grid-cols-3");
  });

  it("uses route-specific container widths", () => {
    const { rerender } = render(<ProfileLoadingSkeleton />);
    expect(screen.getByRole("status", { name: "Memuat konten" })).toHaveClass("max-w-4xl", "p-4", "md:p-8");

    rerender(<ProjectDetailLoadingSkeleton />);
    expect(screen.getByRole("status", { name: "Memuat konten" })).toHaveClass("max-w-5xl", "p-4", "md:p-8");
  });

  it("disables pulse motion when reduced motion is requested", () => {
    render(<Skeleton data-testid="base-skeleton" />);
    expect(screen.getByTestId("base-skeleton")).toHaveClass("motion-reduce:animate-none");
  });

  it("provides a route-level loading boundary for each Talent feature", () => {
    const routes = [
      "assessment",
      "passport",
      "portfolio",
      "profile",
      "projects",
      "projects/[projectId]",
      "projects/[projectId]/workspace",
      "workspace",
    ];

    for (const route of routes) {
      expect(existsSync(`app/(dashboard)/talent/${route}/loading.tsx`), route).toBe(true);
    }
  });
});
