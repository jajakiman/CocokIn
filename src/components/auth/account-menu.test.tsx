import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { AccountMenu } from "./account-menu";
import type { AuthUser } from "@/src/auth-ui/types";

describe("AccountMenu", () => {
  const mockUser: AuthUser = {
    id: "usr-001",
    displayName: "Nadia Putri",
    email: "nadia@example.com",
    role: "TALENT",
  };

  it("renders user information and visually separated logout", async () => {
    const user = userEvent.setup();
    const handleLogout = vi.fn().mockResolvedValue(undefined);

    render(<AccountMenu user={mockUser} onLogout={handleLogout} />);

    // Toggle menu
    const trigger = screen.getByRole("button", { name: /Menu Akun: Nadia Putri/i });
    expect(trigger).toBeInTheDocument();

    await user.click(trigger);

    expect(screen.getAllByText("Nadia Putri").length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText("nadia@example.com")).toBeInTheDocument();
    expect(screen.getByText("Talent")).toBeInTheDocument();

    const logoutBtn = screen.getByRole("button", { name: /Keluar dari Akun/i });
    expect(logoutBtn).toBeInTheDocument();

    await user.click(logoutBtn);
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  it("displays persistent error message if logout fails", async () => {
    const user = userEvent.setup();
    const handleLogout = vi.fn().mockRejectedValue(new Error("Network failure"));

    render(<AccountMenu user={mockUser} onLogout={handleLogout} />);

    const trigger = screen.getByRole("button", { name: /Menu Akun: Nadia Putri/i });
    await user.click(trigger);

    const logoutBtn = screen.getByRole("button", { name: /Keluar dari Akun/i });
    await user.click(logoutBtn);

    expect(
      screen.getByText(/Gagal mengakhiri sesi/i),
    ).toBeInTheDocument();
  });
});
