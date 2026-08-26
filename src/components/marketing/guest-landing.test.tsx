import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { GuestLanding } from "./guest-landing";

describe("GuestLanding (Lil Big Things Style)", () => {
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

  it("renders featured real case studies and two-sided pathways", () => {
    render(<GuestLanding />);

    expect(screen.getByRole("heading", { name: /Hasil Kerja Nyata yang Telah Tervalidasi/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /Untuk Mahasiswa & Fresh Graduate/i })).toBeVisible();
    expect(screen.getByRole("heading", { name: /Untuk Pemilik Bisnis & UMKM/i })).toBeVisible();
  });

  it("renders 4-step process and institutional trust governance", () => {
    render(<GuestLanding />);

    expect(screen.getByRole("heading", { name: /Empat Tahap dari Kebutuhan hingga Pembuktian/i })).toBeVisible();
    expect(screen.getByText(/100% Liability Reserve Coverage/i)).toBeVisible();
    expect(screen.getByText(/Penerbitan Portofolio Berizin Ganda/i)).toBeVisible();
    expect(screen.getByText(/Penjaminan Bug & Retensi 30 Hari/i)).toBeVisible();
  });
});
