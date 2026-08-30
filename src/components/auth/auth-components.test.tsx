import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

import { unavailableAuthAdapter } from "@/src/auth-ui/adapter";
import type { AuthUiAdapter } from "@/src/auth-ui/types";

import { AuthShell } from "./auth-shell";
import { ForgotPasswordForm } from "./forgot-password-form";
import { LoginForm } from "./login-form";
import { PasswordField } from "./password-field";
import { RegistrationForm } from "./registration-form";
import { RoleChoice } from "./role-choice";

function adapterWith(
  overrides: Partial<AuthUiAdapter> = {},
): AuthUiAdapter {
  return { ...unavailableAuthAdapter, ...overrides };
}

function deferred<T>() {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((next) => {
    resolve = next;
  });
  return { promise, resolve };
}

describe("AuthShell", () => {
  it("keeps the form first and exposes focused auth content without dashboard navigation", () => {
    const { container } = render(
      <AuthShell
        title="Masuk ke CocokIn"
        description="Lanjutkan perjalanan Anda."
        contextTitle="Bertumbuh bersama"
        context={<p>Konteks produk</p>}
      >
        <button type="button">Form action</button>
      </AuthShell>,
    );

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(screen.getByRole("main")).toHaveAttribute("id", "main-content");
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Masuk ke CocokIn",
    );
    expect(container.querySelector(".auth-shell__form")).toContainElement(
      screen.getByRole("button", { name: "Form action" }),
    );
    expect(container.querySelector(".auth-shell")?.firstElementChild).toHaveClass(
      "auth-shell__form",
    );
  });

  it("uses the official wordmark and plain-language protection message", () => {
    const { container } = render(
      <AuthShell
        title="Masuk ke CocokIn"
        description="Lanjutkan perjalanan Anda."
        contextTitle="Bertumbuh bersama"
        context={<p>Konteks produk</p>}
      >
        <button type="button">Form action</button>
      </AuthShell>,
    );

    expect(screen.getByRole("link", { name: "CocokIn beranda" })).toBeVisible();
    expect(container.querySelector(".auth-shell__brand img")).toHaveAttribute(
      "src",
      "/brand/cocokin/logo-wordmark.webp",
    );
    expect(container.querySelector(".brand-dot")).not.toBeInTheDocument();
    expect(screen.getByText(/Dana proyek terlindungi dan hasil kerja bergaransi 30 hari/i)).toBeInTheDocument();
    expect(screen.queryByText(/100% Liability Reserve/i)).not.toBeInTheDocument();
  });
});

describe("PasswordField", () => {
  it("supports password managers, paste, linked help, and an accessible visibility toggle", async () => {
    const user = userEvent.setup();
    render(
      <PasswordField
        name="password"
        label="Kata sandi"
        autoComplete="new-password"
        helper="Minimal 8 karakter."
        error="Kata sandi terlalu pendek."
      />,
    );

    const input = screen.getByLabelText("Kata sandi");
    const helper = screen.getByText("Minimal 8 karakter.");
    const error = screen.getByText("Kata sandi terlalu pendek.");
    const describedBy = input.getAttribute("aria-describedby")?.split(" ");

    expect(input).toHaveAttribute("type", "password");
    expect(input).toHaveAttribute("autocomplete", "new-password");
    expect(describedBy).toEqual(
      expect.arrayContaining([helper.id, error.id]),
    );
    expect(
      fireEvent(
        input,
        new Event("paste", { bubbles: true, cancelable: true }),
      ),
    ).toBe(true);

    await user.click(
      screen.getByRole("button", { name: "Tampilkan kata sandi" }),
    );
    expect(input).toHaveAttribute("type", "text");
    expect(
      screen.getByRole("button", { name: "Sembunyikan kata sandi" }),
    ).toBeVisible();
  });
});

describe("LoginForm", () => {
  it("provides Google and credential login with correct autocomplete and links", () => {
    render(<LoginForm adapter={unavailableAuthAdapter} />);

    expect(screen.getByRole("button", { name: "Masuk dengan Google" })).toBeVisible();
    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email");
    expect(screen.getByLabelText("Kata sandi")).toHaveAttribute(
      "autocomplete",
      "current-password",
    );
    expect(screen.getByRole("link", { name: "Lupa kata sandi?" })).toHaveAttribute(
      "href",
      "/forgot-password",
    );
    expect(screen.getByRole("link", { name: "Daftar sekarang" })).toHaveAttribute(
      "href",
      "/register",
    );
  });

  it("links inline errors and focuses a focusable summary after invalid submit", async () => {
    const user = userEvent.setup();
    render(<LoginForm adapter={unavailableAuthAdapter} />);

    await user.click(screen.getByRole("button", { name: "Masuk" }));

    const summary = screen.getByRole("alert", { name: "Periksa kembali formulir" });
    const email = screen.getByLabelText("Email");
    const password = screen.getByLabelText("Kata sandi");
    const emailError = document.getElementById("login-email-error");
    const passwordError = document.getElementById("login-password-error");

    expect(summary).toHaveAttribute("tabindex", "-1");
    expect(summary).toHaveFocus();
    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(password).toHaveAttribute("aria-invalid", "true");
    expect(emailError).toHaveTextContent("Masukkan alamat email yang valid.");
    expect(passwordError).toHaveTextContent("Kata sandi wajib diisi.");
    expect(email).toHaveAttribute("aria-describedby", emailError?.id);
    expect(password.getAttribute("aria-describedby")).toContain(passwordError?.id);
    expect(within(summary).getByRole("link", { name: /email/i })).toHaveAttribute(
      "href",
      `#${email.id}`,
    );
  });

  it("disables every auth action while the adapter request is pending", async () => {
    const user = userEvent.setup();
    const pending = deferred<Awaited<ReturnType<AuthUiAdapter["loginWithGoogle"]>>>();
    render(
      <LoginForm
        adapter={adapterWith({ loginWithGoogle: () => pending.promise })}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Masuk dengan Google" }));

    expect(screen.getByRole("button", { name: "Menghubungkan Google..." })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Masuk" })).toBeDisabled();
    expect(screen.getByLabelText("Email")).toBeDisabled();
    expect(screen.getByLabelText("Kata sandi")).toBeDisabled();

    pending.resolve({
      ok: false,
      code: "PROVIDER_UNAVAILABLE",
      message: "Google sedang tidak tersedia.",
    });
    expect(await screen.findByText("Google sedang tidak tersedia.")).toBeVisible();
  });

  it("keeps an unavailable adapter failure visible after field edits", async () => {
    const user = userEvent.setup();
    render(<LoginForm adapter={unavailableAuthAdapter} />);

    await user.click(screen.getByRole("button", { name: "Masuk dengan Google" }));
    const failure = await screen.findByText("Autentikasi belum dikonfigurasi.");
    await user.type(screen.getByLabelText("Email"), "nadia@example.com");

    expect(failure).toBeVisible();
  });
});

describe("RoleChoice", () => {
  it("offers only Talent and UMKM registration routes", () => {
    render(<RoleChoice />);

    expect(screen.getByRole("link", { name: /daftar sebagai talent/i })).toHaveAttribute(
      "href",
      "/register/talent",
    );
    expect(screen.getByRole("link", { name: /daftar sebagai umkm/i })).toHaveAttribute(
      "href",
      "/register/business",
    );
    expect(screen.queryByText(/admin/i)).not.toBeInTheDocument();
  });
});

describe("RegistrationForm", () => {
  it("shows live password strength and confirmation feedback", async () => {
    const user = userEvent.setup();
    render(<RegistrationForm role="TALENT" adapter={unavailableAuthAdapter} />);

    const password = screen.getByLabelText("Kata sandi");
    const confirmation = screen.getByLabelText("Konfirmasi kata sandi");

    await user.type(password, "aman1234");
    expect(screen.getByRole("progressbar", { name: "Kekuatan kata sandi" })).toHaveAttribute("aria-valuenow", "3");
    expect(screen.getByText("Bagus")).toBeVisible();

    await user.type(confirmation, "beda123");
    expect(screen.getByText("Kata sandi belum cocok")).toBeVisible();
    expect(screen.getByRole("button", { name: "Daftar sebagai Talent" })).toBeDisabled();

    await user.clear(confirmation);
    await user.type(confirmation, "aman1234");
    expect(screen.getByText("Kata sandi cocok")).toBeVisible();
    expect(screen.getByRole("button", { name: "Daftar sebagai Talent" })).toBeEnabled();
  });

  it("keeps required Terms and Privacy consent separate with no optional consent", () => {
    render(<RegistrationForm role="TALENT" adapter={unavailableAuthAdapter} />);

    expect(screen.getByRole("checkbox", { name: /syarat dan ketentuan/i })).toBeRequired();
    expect(screen.getByRole("checkbox", { name: /pemrosesan data pribadi/i })).toBeRequired();
    expect(screen.getAllByRole("checkbox")).toHaveLength(2);
    expect(screen.queryByText(/marketing|publikasi|riset|demo/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText("Kata sandi")).toHaveAttribute(
      "autocomplete",
      "new-password",
    );
    expect(screen.getByLabelText("Konfirmasi kata sandi")).toHaveAttribute(
      "autocomplete",
      "new-password",
    );
  });

  it("validates consent separately and keeps registration unavailability persistent", async () => {
    const user = userEvent.setup();
    render(<RegistrationForm role="BUSINESS" adapter={unavailableAuthAdapter} />);

    await user.type(screen.getByLabelText("Nama lengkap"), "Nadia Pratama");
    await user.type(screen.getByLabelText("Email"), "nadia@example.com");
    await user.type(screen.getByLabelText("Kata sandi"), "amansekali");
    await user.type(screen.getByLabelText("Konfirmasi kata sandi"), "amansekali");
    await user.click(screen.getByRole("button", { name: "Daftar sebagai UMKM" }));

    const summary = screen.getByRole("alert", { name: "Periksa kembali formulir" });
    expect(summary).toHaveFocus();
    expect(screen.getByText("Anda harus menyetujui Syarat dan Ketentuan.")).toBeVisible();
    expect(screen.getByText("Anda harus menyetujui pemrosesan data pribadi.")).toBeVisible();

    await user.click(screen.getByRole("checkbox", { name: /syarat dan ketentuan/i }));
    await user.click(screen.getByRole("checkbox", { name: /pemrosesan data pribadi/i }));
    await user.click(screen.getByRole("button", { name: "Daftar sebagai UMKM" }));
    const failure = await screen.findByText("Autentikasi belum dikonfigurasi.");
    await user.clear(screen.getByLabelText("Nama lengkap"));

    expect(failure).toBeVisible();
  });
});

describe("ForgotPasswordForm", () => {
  it("validates email and honestly retains the unavailable reset state", async () => {
    const user = userEvent.setup();
    render(<ForgotPasswordForm adapter={unavailableAuthAdapter} />);

    expect(screen.getByLabelText("Email")).toHaveAttribute("autocomplete", "email");
    await user.click(screen.getByRole("button", { name: "Kirim instruksi reset" }));
    expect(screen.getByRole("alert", { name: "Periksa kembali formulir" })).toHaveFocus();

    await user.type(screen.getByLabelText("Email"), "nadia@example.com");
    await user.click(screen.getByRole("button", { name: "Kirim instruksi reset" }));
    const failure = await screen.findByText(
      "Layanan reset kata sandi belum dikonfigurasi.",
    );
    await user.type(screen.getByLabelText("Email"), ".id");

    expect(failure).toBeVisible();
    expect(screen.queryByText(/email (telah|sudah) dikirim/i)).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Kembali ke halaman masuk" })).toHaveAttribute(
      "href",
      "/login",
    );
  });
});
