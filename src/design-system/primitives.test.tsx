import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { EmptyState } from "./empty-state";
import { ErrorSummary } from "./error-summary";
import { PageHeader } from "./page-header";
import { ResponsiveDataView } from "./responsive-data-view";
import { StepProgress } from "./step-progress";

describe("Shared Design System Primitives", () => {
  it("renders PageHeader correctly with eyebrow and action", () => {
    render(
      <PageHeader
        eyebrow="Ruang Kerja"
        title="Profil Talent"
        description="Kelola informasi karier"
        action={<button type="button">Simpan</button>}
      />,
    );

    expect(screen.getByText("Ruang Kerja")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1, name: "Profil Talent" })).toBeInTheDocument();
    expect(screen.getByText("Kelola informasi karier")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Simpan" })).toBeInTheDocument();
  });

  it("renders StepProgress with proper accessible states", () => {
    const steps = [
      { id: "s1", label: "Profil" },
      { id: "s2", label: "Karier" },
      { id: "s3", label: "Persetujuan" },
    ];

    render(<StepProgress steps={steps} currentStepIndex={1} />);

    const listItems = screen.getAllByRole("listitem");
    expect(listItems).toHaveLength(3);
    expect(listItems[0]).toHaveAttribute("data-status", "completed");
    expect(listItems[1]).toHaveAttribute("data-status", "current");
    expect(listItems[1]).toHaveAttribute("aria-current", "step");
    expect(listItems[2]).toHaveAttribute("data-status", "upcoming");
  });

  it("renders ErrorSummary when errors exist", () => {
    const errors = [
      { fieldId: "full-name", message: "Nama lengkap wajib diisi" },
      { message: "Harap setujui syarat layanan" },
    ];

    render(<ErrorSummary errors={errors} />);

    const alert = screen.getByRole("alert");
    expect(alert).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Nama lengkap wajib diisi" })).toHaveAttribute(
      "href",
      "#full-name",
    );
    expect(screen.getByText("Harap setujui syarat layanan")).toBeInTheDocument();
  });

  it("renders EmptyState with action", () => {
    render(
      <EmptyState
        title="Belum ada proyek"
        description="Jelajahi marketplace untuk menemukan proyek pertamamu"
        action={<button type="button">Cari Proyek</button>}
      />,
    );

    expect(screen.getByText("Belum ada proyek")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Cari Proyek" })).toBeInTheDocument();
  });

  it("renders ResponsiveDataView with table and card modes", () => {
    type TestRow = { id: string; name: string; score: number };
    const items: TestRow[] = [
      { id: "1", name: "Project Alpha", score: 90 },
      { id: "2", name: "Project Beta", score: 85 },
    ];

    const columns = [
      { key: "name", header: "Nama Proyek", render: (r: TestRow) => r.name },
      { key: "score", header: "Skor", render: (r: TestRow) => `${r.score}%` },
    ];

    render(
      <ResponsiveDataView
        items={items}
        keyExtractor={(r) => r.id}
        columns={columns}
      />,
    );

    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getAllByText("Project Alpha").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("90%").length).toBeGreaterThanOrEqual(1);
  });
});
