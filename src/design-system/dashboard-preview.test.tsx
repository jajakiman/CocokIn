import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { DashboardPreview } from "./dashboard-preview";

describe("DashboardPreview", () => {
  it.each([
    ["talent", "Proyek aktif", "Rekomendasi untukmu"],
    ["business", "Menunggu review", "Proyek berjalan"],
    ["admin", "SLA terlewati", "Antrean verifikasi"],
  ] as const)("prioritizes the %s role tasks", (role, firstMetric, sectionTitle) => {
    render(<DashboardPreview role={role} />);

    expect(screen.getByRole("heading", { level: 1 })).toBeVisible();
    expect(within(screen.getByRole("region", { name: "Ringkasan" })).getByText(firstMetric)).toBeVisible();
    expect(screen.getByRole("heading", { level: 2, name: sectionTitle })).toBeVisible();
  });
});
