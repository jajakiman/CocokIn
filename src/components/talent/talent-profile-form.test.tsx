import { render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import userEvent from "@testing-library/user-event";

import { TalentProfileForm } from "@/app/(dashboard)/talent/profile/talent-profile-form";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

const user = {
  id: "user-1",
  name: "Nadia Arina",
  email: "nadia@example.com",
  emailVerified: new Date(),
  image: null,
  passwordHash: "hash",
  role: "TALENT" as const,
  identityStatus: "CONTACT_VERIFIED" as const,
  isSuspended: false,
  suspendedAt: null,
  suspensionReason: null,
  isSynthetic: false,
  isDemoAccount: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  talentProfile: {
    id: "profile-1",
    userId: "user-1",
    bio: "Fullstack Developer",
    university: "Universitas Indonesia",
    major: "Sistem Informasi",
    workModePreference: "REMOTE",
    timeAvailability: "PART_TIME",
    careerTarget: "Fullstack Developer",
    portfolioUrl: null,
    hasNoPortfolio: true,
    onboardingCompletedAt: new Date(),
    createdAt: new Date(),
    updatedAt: new Date(),
  },
};

describe("TalentProfileForm", () => {
  it("uses the same separate name fields as onboarding and removes work preferences", () => {
    render(<TalentProfileForm user={user} skills={[]} />);

    expect(screen.getByLabelText("Nama Depan")).toHaveValue("Nadia");
    expect(screen.getByLabelText("Nama Belakang")).toHaveValue("Arina");
    expect(screen.getByLabelText("Universitas")).toBeRequired();
    expect(screen.getByLabelText("Jurusan")).toBeRequired();
    expect(screen.queryByText("Preferensi Mode Kerja")).not.toBeInTheDocument();
    expect(screen.queryByText("Ketersediaan Waktu")).not.toBeInTheDocument();
  });

  it("places skill management inside the form before the save action", () => {
    render(<TalentProfileForm user={user} skills={[]} />);

    const form = screen.getByRole("form", { name: "Edit profil Talent" });
    const skills = within(form).getByRole("heading", { name: "Keahlian" });
    const save = within(form).getByRole("button", { name: "Simpan Perubahan" });

    expect(skills.compareDocumentPosition(save) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });

  it("announces successful profile updates", async () => {
    const actor = userEvent.setup();
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
    render(<TalentProfileForm user={user} skills={[]} />);

    await actor.click(screen.getByRole("button", { name: "Simpan Perubahan" }));

    expect(await screen.findByRole("status")).toHaveTextContent("Profil berhasil diperbarui!");
    vi.unstubAllGlobals();
  });
});
