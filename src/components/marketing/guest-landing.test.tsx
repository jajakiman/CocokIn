import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GuestLanding } from "./guest-landing";

describe("GuestLanding", () => {
  it("renders with a skip-to-main link targeting the main region", () => {
    render(<GuestLanding />);

    const skipLink = screen.getByRole("link", { name: "Lewati ke konten utama" });
    expect(skipLink).toHaveAttribute("href", "#main-content");
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
  });

  it("renders one H1 and equal registration CTAs for Talent and UMKM", () => {
    render(<GuestLanding />);

    const headings = screen.getAllByRole("heading", { level: 1 });
    expect(headings).toHaveLength(1);

    expect(screen.getAllByRole("link", { name: /Mulai sebagai Talent/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByRole("link", { name: /Mulai sebagai UMKM/i }).length).toBeGreaterThanOrEqual(1);
    expect(screen.queryByRole("link", { name: /daftar sebagai admin/i })).not.toBeInTheDocument();
  });

  it("renders the Bento Grid and Cocok Score Simulator", () => {
    render(<GuestLanding />);

    expect(screen.getByRole("heading", { name: /Dirancang untuk Hasil yang Terukur/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /Coba Langsung Formula Cocok Score/i })).toBeVisible();
  });

  it("renders explicit trust and governance boundaries", () => {
    render(<GuestLanding />);

    expect(screen.getByText(/100% Liability Reserve/i)).toBeVisible();
    expect(screen.getByText(/Consent & Atribusi Resmi/i)).toBeVisible();
    expect(screen.getByText(/Garansi & Retensi 30 Hari/i)).toBeVisible();
  });
});
