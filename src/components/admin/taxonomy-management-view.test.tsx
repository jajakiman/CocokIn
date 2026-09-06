import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/src/adapters/admin/taxonomy-actions", () => ({
  createSkillAction: vi.fn(), updateCareerBenchmarkAction: vi.fn(), saveAssessmentQuestionAction: vi.fn(), toggleAssessmentQuestionAction: vi.fn(),
}));

import { TaxonomyManagementView } from "./taxonomy-management-view";

describe("TaxonomyManagementView", () => {
  it("renders skill, benchmark, and assessment question management", () => {
    render(<TaxonomyManagementView data={{
      skills: [{ id: "skill-1", key: "javascript", name: "JavaScript", category: "TECHNICAL", isActive: true }],
      careers: [{ id: "career-1", key: "fullstack-dev", name: "Fullstack Developer", requirements: [{ skillId: "skill-1", benchmarkScore: 70, skill: { name: "JavaScript" } }] }],
      questions: [{ id: "q-1", audience: "TALENT", kind: "TECHNICAL", careerKey: "fullstack-dev", skillKey: "javascript", pillar: null, text: "Pertanyaan JavaScript yang aktif?", position: 1, isActive: true, options: [] }],
    }} />);

    expect(screen.getByRole("heading", { name: "Master Data & Bank Soal" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Tambah Skill" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Benchmark Karier" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Buat / Perbarui Pertanyaan" })).toBeInTheDocument();
    expect(screen.getByText("Pertanyaan JavaScript yang aktif?")).toBeInTheDocument();
  });
});
