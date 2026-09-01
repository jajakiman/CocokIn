import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { ResetPasswordForm } from "./reset-password-form";

describe("ResetPasswordForm", () => {
  it("replaces the form with a standalone success state", async () => {
    const user = userEvent.setup();
    const onSuccess = vi.fn();
    render(
      <ResetPasswordForm
        action={async () => ({ ok: true, message: "Kata sandi berhasil diperbarui." })}
        onSuccess={onSuccess}
        token="valid-token-value-that-is-long-enough"
      />,
    );

    await user.type(screen.getByLabelText("Kata sandi baru"), "Password!123");
    await user.type(screen.getByLabelText("Konfirmasi kata sandi baru"), "Password!123");
    await user.click(screen.getByRole("button", { name: "Perbarui kata sandi" }));

    expect(await screen.findByRole("heading", { name: "Kata sandi berhasil diperbarui" })).toHaveFocus();
    expect(screen.queryByLabelText("Kata sandi baru")).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Masuk ke akun" })).toHaveAttribute("href", "/login");
    expect(onSuccess).toHaveBeenCalledOnce();
  });
});
