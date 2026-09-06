import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BusinessAssessmentWizard } from "./business-assessment-wizard";

const mockPush = vi.fn();
const questions = [
  ["business-q1", "Keuangan Digital", "Apakah bisnis Anda sudah memiliki pencatatan keuangan digital?", ["Belum", "Dalam Proses", "Sudah"]],
  ["business-q2", "Target Pasar", "Apakah Anda memiliki target pasar digital yang jelas?", ["Belum", "Sebagian", "Sudah"]],
  ["business-q3", "Kesiapan Tim", "Seberapa siap tim Anda untuk mengadopsi teknologi baru?", ["Kurang Siap", "Cukup Siap", "Sangat Siap"]],
  ["business-q4", "SOP Operasional", "Apakah Anda memiliki SOP (Standard Operating Procedure) operasional?", ["Tidak Ada", "Ada namun tidak lengkap", "Ada dan Lengkap"]],
  ["business-q5", "Kolaborasi", "Apakah Anda pernah menggunakan jasa freelancer/talent sebelumnya?", ["Belum Pernah", "Pernah, tapi kurang puas", "Pernah dan Puas"]],
].map(([id, pillar, text, labels]) => ({ id: id as string, careerId: "fullstack-dev" as const, type: "TECHNICAL" as const, pillar: pillar as string, text: text as string, options: (labels as string[]).map((label, index) => ({ id: `${id}-${index}`, label, score: index * 10 })) }));

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("BusinessAssessmentWizard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders modal dialog with 5 questions and required field indicators (*)", async () => {
    render(<BusinessAssessmentWizard questions={questions} />);

    // Dialog accessibility
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-assessment-title");
    const heading = screen.getByRole("heading", { name: "Asesmen Kesiapan Digital" });
    expect(heading).toBeInTheDocument();
    expect(heading.querySelector("svg")).toBeNull();

    // Required indicators (*)
    const asterisks = screen.getAllByTitle("Wajib dijawab");
    expect(asterisks.length).toBe(5);

    // All 5 pillar questions are present
    expect(screen.getByText(/pencatatan keuangan digital/i)).toBeInTheDocument();
    expect(screen.getByText(/target pasar digital yang jelas/i)).toBeInTheDocument();
    expect(screen.getByText(/mengadopsi teknologi baru/i)).toBeInTheDocument();
    expect(screen.getByText(/SOP \(Standard Operating Procedure\)/i)).toBeInTheDocument();
    expect(screen.getByText(/jasa freelancer\/talent/i)).toBeInTheDocument();
  });

  it("shows an accessible error alert when submitting with unanswered questions", async () => {
    const user = userEvent.setup();
    render(<BusinessAssessmentWizard questions={questions} />);

    const submitBtn = screen.getByRole("button", { name: /Selesaikan & Masuk ke Dashboard/i });
    await user.click(submitBtn);

    // Shows validation error alert without browser alert()
    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent(/Harap jawab seluruh 5 pertanyaan asesmen/i);
    expect(mockPush).not.toHaveBeenCalled();
  });

  it("submits all 5 answers and redirects to /business", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "assess_123", readinessScore: 80 }),
    });
    vi.stubGlobal("fetch", fetchMock);

    const { container } = render(<BusinessAssessmentWizard questions={questions} />);

    // Select answers for all 5 questions
    const q1Sudah = container.querySelector<HTMLInputElement>('[name="business-q1"][value="business-q1-2"]')!;
    const q2Sebagian = container.querySelector<HTMLInputElement>('[name="business-q2"][value="business-q2-1"]')!;
    const q3SangatSiap = container.querySelector<HTMLInputElement>('[name="business-q3"][value="business-q3-2"]')!;
    const q4Lengkap = container.querySelector<HTMLInputElement>('[name="business-q4"][value="business-q4-2"]')!;
    const q5Puas = container.querySelector<HTMLInputElement>('[name="business-q5"][value="business-q5-2"]')!;

    await user.click(q1Sudah);
    await user.click(q2Sebagian);
    await user.click(q3SangatSiap);
    await user.click(q4Lengkap);
    await user.click(q5Puas);

    const submitBtn = screen.getByRole("button", { name: /Selesaikan & Masuk ke Dashboard/i });
    await user.click(submitBtn);

    expect(fetchMock).toHaveBeenCalledWith("/api/business/assessment", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        answers: [
          { questionId: "business-q1", optionId: "business-q1-2" },
          { questionId: "business-q2", optionId: "business-q2-1" },
          { questionId: "business-q3", optionId: "business-q3-2" },
          { questionId: "business-q4", optionId: "business-q4-2" },
          { questionId: "business-q5", optionId: "business-q5-2" },
        ],
      }),
    });

    expect(mockPush).toHaveBeenCalledWith("/business");
  });
});
