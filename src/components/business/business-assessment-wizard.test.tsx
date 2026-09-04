import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BusinessAssessmentWizard } from "./business-assessment-wizard";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("BusinessAssessmentWizard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders modal dialog with 5 questions and required field indicators (*)", () => {
    render(<BusinessAssessmentWizard />);

    // Dialog accessibility
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-assessment-title");
    expect(screen.getByText("Asesmen Kesiapan Digital")).toBeInTheDocument();

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
    render(<BusinessAssessmentWizard />);

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

    render(<BusinessAssessmentWizard />);

    // Select answers for all 5 questions
    const q1Sudah = screen.getByRole("radio", { name: (content, element) => element?.getAttribute("name") === "q1" && element?.getAttribute("value") === "Sudah" });
    const q2Sebagian = screen.getByRole("radio", { name: (content, element) => element?.getAttribute("name") === "q2" && element?.getAttribute("value") === "Sebagian" });
    const q3SangatSiap = screen.getByRole("radio", { name: (content, element) => element?.getAttribute("name") === "q3" && element?.getAttribute("value") === "Sangat Siap" });
    const q4Lengkap = screen.getByRole("radio", { name: (content, element) => element?.getAttribute("name") === "q4" && element?.getAttribute("value") === "Ada dan Lengkap" });
    const q5Puas = screen.getByRole("radio", { name: (content, element) => element?.getAttribute("name") === "q5" && element?.getAttribute("value") === "Pernah dan Puas" });

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
        answers: {
          q1: "Sudah",
          q2: "Sebagian",
          q3: "Sangat Siap",
          q4: "Ada dan Lengkap",
          q5: "Pernah dan Puas",
        },
      }),
    });

    expect(mockPush).toHaveBeenCalledWith("/business");
  });
});
