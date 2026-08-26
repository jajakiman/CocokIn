import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GuestLanding } from "./guest-landing";

describe("GuestLanding (Workable B2B SaaS Style)", () => {
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

  it("renders deep feature splits for Talent and UMKM", () => {
    render(<GuestLanding />);

    expect(screen.getByRole("heading", { name: /B2Talent Career Development SaaS/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /B2B MSME Enablement SaaS/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Pencocokan Cerdas 100% Deterministik/i })).toBeInTheDocument();
  });

  it("renders real case studies and institutional trust governance", () => {
    render(<GuestLanding />);

    expect(screen.getByRole("heading", { name: /Hasil Kerja Nyata yang Telah Tervalidasi/i })).toBeInTheDocument();
    expect(screen.getByText(/100% Liability Reserve Coverage/i)).toBeInTheDocument();
    expect(screen.getByText(/Penerbitan Portofolio Berizin Ganda/i)).toBeInTheDocument();
    expect(screen.getByText(/Penjaminan Bug & Retensi 30 Hari/i)).toBeInTheDocument();
  });
});
