import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TalentSkillManager } from "./talent-skill-manager";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

describe("TalentSkillManager", () => {
  it("allows removing only self-declared skills", () => {
    render(
      <TalentSkillManager
        skills={[
          { id: "self", name: "React", category: "Frontend", evidenceLevel: "SELF_DECLARED" },
          { id: "verified", name: "Figma", category: "Design", evidenceLevel: "PROJECT_VERIFIED" },
        ]}
      />,
    );

    expect(screen.getByRole("button", { name: "Hapus React" })).toBeVisible();
    expect(screen.queryByRole("button", { name: "Hapus Figma" })).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Klaim keahlian baru" })).toBeVisible();
  });

  it("keeps self-declared removal available in compact profile mode", () => {
    render(
      <TalentSkillManager
        compact
        skills={[{ id: "self", name: "React", category: "Frontend", evidenceLevel: "SELF_DECLARED" }]}
      />,
    );

    expect(screen.getByRole("button", { name: "Hapus React" })).toBeVisible();
  });

  it("focuses the skill input and closes the dialog with Escape", async () => {
    const user = userEvent.setup();
    render(<TalentSkillManager skills={[]} />);

    const trigger = screen.getByRole("button", { name: "Klaim keahlian baru" });
    await user.click(trigger);

    expect(screen.getByRole("dialog", { name: "Klaim keahlian" })).toBeVisible();
    expect(screen.getByLabelText("Nama keahlian")).toHaveFocus();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("keeps keyboard focus inside the open dialog", async () => {
    const user = userEvent.setup();
    render(<TalentSkillManager skills={[]} />);

    await user.click(screen.getByRole("button", { name: "Klaim keahlian baru" }));
    const close = screen.getByRole("button", { name: "Tutup dialog" });

    close.focus();
    await user.keyboard("{Shift>}{Tab}{/Shift}");

    expect(screen.getByRole("button", { name: "Klaim keahlian" })).toHaveFocus();
  });
});
