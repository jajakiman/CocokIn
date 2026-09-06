import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DigitalGrowthChart } from "./digital-growth-chart";
import type { PillarGrowth } from "@/src/modules/business/digital-growth";

describe("DigitalGrowthChart Component (FR-BIZ-05)", () => {
  it("renders empty state message when no pillars are provided", () => {
    render(<DigitalGrowthChart pillars={[]} hasGrowth={false} />);
    expect(screen.getByText(/Belum ada data pilar kesiapan/i)).toBeInTheDocument();
  });

  it("renders 5 pillars comparison with scores and delta badges", () => {
    const pillars: PillarGrowth[] = [
      {
        key: "finance",
        label: "Keuangan Digital",
        description: "Pencatatan kas dan pembukuan digital",
        before: 60,
        after: 80,
        delta: 20,
        isPositive: true,
      },
      {
        key: "marketing",
        label: "Pemasaran & Penjualan",
        description: "Katalog online dan transaksi digital",
        before: 70,
        after: 85,
        delta: 15,
        isPositive: true,
      },
      {
        key: "team",
        label: "Kesiapan Tim",
        description: "Kapasitas SDM dan teknologi baru",
        before: 65,
        after: 75,
        delta: 10,
        isPositive: true,
      },
      {
        key: "operations",
        label: "SOP & Operasional",
        description: "Manajemen inventori dan alur pesanan",
        before: 70,
        after: 90,
        delta: 20,
        isPositive: true,
      },
      {
        key: "outsourcing",
        label: "Kolaborasi Talent",
        description: "Pendelegasian tugas ke talenta digital",
        before: 75,
        after: 85,
        delta: 10,
        isPositive: true,
      },
    ];

    render(<DigitalGrowthChart pillars={pillars} hasGrowth={true} />);

    // Heading and legend
    expect(screen.getByText("Evaluasi 5 Pilar Kesiapan Usaha")).toBeInTheDocument();
    expect(screen.getByText("Skor Awal (Baseline)")).toBeInTheDocument();
    expect(screen.getByText("Skor Saat Ini (Terkini)")).toBeInTheDocument();

    // All 5 pillars
    expect(screen.getByText("Keuangan Digital")).toBeInTheDocument();
    expect(screen.getByText("Pemasaran & Penjualan")).toBeInTheDocument();
    expect(screen.getByText("Kesiapan Tim")).toBeInTheDocument();
    expect(screen.getByText("SOP & Operasional")).toBeInTheDocument();
    expect(screen.getByText("Kolaborasi Talent")).toBeInTheDocument();

    // Delta badges
    const badges = screen.getAllByText("+20");
    expect(badges.length).toBe(2); // finance & operations
    expect(screen.getByText("+15")).toBeInTheDocument();

    // Meter accessibility roles
    const meters = screen.getAllByRole("meter");
    expect(meters).toHaveLength(5);
    expect(meters[0]).toHaveAttribute("aria-valuenow", "80");
  });
});
