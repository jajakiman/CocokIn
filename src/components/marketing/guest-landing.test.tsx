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

  it("explains the product in clear language for Talent and UMKM", () => {
    render(<GuestLanding />);

    expect(screen.getByRole("heading", { name: /Pengembangan Karier & Pengalaman Nyata/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Solusi Digital untuk UMKM/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Sistem Pencocokan yang Terbuka & Adil/i })).toBeInTheDocument();
    expect(screen.queryByText(/PRD §4\.1|black-box|Vertical SaaS/i)).not.toBeInTheDocument();
  });

  it("renders real case studies and institutional trust governance", () => {
    render(<GuestLanding />);

    expect(screen.getByRole("heading", { name: /Hasil Kerja Nyata yang Telah Tervalidasi/i })).toBeInTheDocument();
    expect(screen.getByText(/Dana Pembayaran Aman & Terlindungi/i)).toBeInTheDocument();
    expect(screen.getByText(/Portofolio Terbit atas Persetujuan Bersama/i)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Garansi Perbaikan 30 Hari/i })).toBeInTheDocument();
  });
});
