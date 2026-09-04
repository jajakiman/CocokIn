import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BusinessOnboardingWizard } from "./business-onboarding-wizard";

const mockPush = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: mockPush }),
}));

describe("BusinessOnboardingWizard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.unstubAllGlobals();
  });

  it("renders modal dialog with accessible title and required field indicators (*)", () => {
    render(<BusinessOnboardingWizard />);

    // Dialog accessibility
    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-biz-title");
    expect(screen.getByText("Profil Usaha UMKM")).toBeInTheDocument();

    // Required indicators (*)
    const asterisks = screen.getAllByTitle("Wajib diisi");
    expect(asterisks.length).toBeGreaterThanOrEqual(4);

    // Form inputs exist with proper labels
    expect(screen.getByLabelText(/Nama Bisnis/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kategori Industri/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Kota \/ Kabupaten/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Deskripsi Singkat Usaha/i)).toBeInTheDocument();
  });

  it("validates required fields before sending request", async () => {
    const user = userEvent.setup();
    render(<BusinessOnboardingWizard />);

    const submitBtn = screen.getByRole("button", { name: /Lanjutkan ke Asesmen Kesiapan/i });
    await user.click(submitBtn);

    // Shows validation error
    expect(await screen.findByRole("alert")).toHaveTextContent("Nama bisnis wajib diisi.");
  });

  it("submits valid form data and redirects to business assessment", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: "biz_123" }),
    });
    vi.stubGlobal("fetch", fetchMock);

    render(
      <BusinessOnboardingWizard
        initialBusinessName="Kedai Kopi Lestari"
        initialIndustry="F&B"
        initialCity="Bandung"
        initialDescription="Kedai kopi artisan lokal yang membutuhkan sistem POS dan katalog digital."
      />
    );

    const submitBtn = screen.getByRole("button", { name: /Lanjutkan ke Asesmen Kesiapan/i });
    await user.click(submitBtn);

    expect(fetchMock).toHaveBeenCalledWith("/api/business/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: "Kedai Kopi Lestari",
        industry: "F&B",
        city: "Bandung",
        description: "Kedai kopi artisan lokal yang membutuhkan sistem POS dan katalog digital.",
      }),
    });

    expect(mockPush).toHaveBeenCalledWith("/business/assessment");
  });
});
