import { describe, expect, expectTypeOf, it } from "vitest";

import { unavailableAuthAdapter } from "./adapter";
import {
  forgotPasswordSchema,
  loginSchema,
  registrationSchema,
  toRegistrationRequest,
} from "./schemas";
import type {
  AuthResult,
  AuthRole,
  AuthUiAdapter,
  PublicRegistrationRole,
  RegistrationRequest,
} from "./types";

const validRegistration = {
  role: "TALENT" as const,
  fullName: "Nadia Pratama",
  email: "nadia@example.com",
  password: "amansekali",
  confirmPassword: "amansekali",
  termsAccepted: true,
};

describe("auth presentation types", () => {
  it("keeps Admin internal while retaining all authenticated roles", () => {
    expectTypeOf<AuthRole>().toEqualTypeOf<"TALENT" | "BUSINESS" | "ADMIN">();
    expectTypeOf<PublicRegistrationRole>().toEqualTypeOf<
      "TALENT" | "BUSINESS"
    >();
    expectTypeOf(unavailableAuthAdapter).toEqualTypeOf<AuthUiAdapter>();
  });

  it("exposes only the specified authentication failure codes", () => {
    type FailureCode = Extract<AuthResult, { ok: false }>["code"];

    expectTypeOf<FailureCode>().toEqualTypeOf<
      | "INVALID_CREDENTIALS"
      | "ACCOUNT_SUSPENDED"
      | "ROLE_REVOKED"
      | "AUTH_NOT_CONFIGURED"
      | "PROVIDER_UNAVAILABLE"
      | "EMAIL_NOT_VERIFIED"
    >();
  });

  it("pins every adapter method to the provider-neutral spec", () => {
    expectTypeOf<AuthUiAdapter["loginWithCredentials"]>().toEqualTypeOf<
      (input: { email: string; password: string }) => Promise<AuthResult>
    >();
    expectTypeOf<AuthUiAdapter["loginWithGoogle"]>().toEqualTypeOf<
      (role?: PublicRegistrationRole) => Promise<AuthResult>
    >();
    expectTypeOf<AuthUiAdapter["register"]>().toEqualTypeOf<
      (input: RegistrationRequest) => Promise<AuthResult>
    >();
    expectTypeOf<AuthUiAdapter["requestPasswordReset"]>().toEqualTypeOf<
      (email: string) => Promise<{ ok: boolean; message: string }>
    >();
    expectTypeOf<AuthUiAdapter["logout"]>().toEqualTypeOf<
      () => Promise<{ ok: boolean; message?: string }>
    >();
  });
});

describe("registrationSchema", () => {
  it("rejects Admin registration", () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      role: "ADMIN",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toBe(
      "Pilih peran Talent atau UMKM.",
    );
  });

  it.each([
    ["termsAccepted", "Anda harus menyetujui Syarat dan Ketentuan."],
  ] as const)("requires %s consent", (field, message) => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      [field]: false,
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toContainEqual(
      expect.objectContaining({ path: [field], message }),
    );
  });

  it("rejects a password confirmation mismatch", () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      confirmPassword: "berbedasekali",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues).toContainEqual(
      expect.objectContaining({
        path: ["confirmPassword"],
        message: "Konfirmasi kata sandi tidak cocok.",
      }),
    );
  });

  it("accepts complete Talent and UMKM registration input", () => {
    expect(registrationSchema.safeParse(validRegistration).success).toBe(true);
    expect(
      registrationSchema.safeParse({
        ...validRegistration,
        role: "BUSINESS",
      }).success,
    ).toBe(true);
  });

  it("projects parsed form data to the exact adapter request", () => {
    const parsed = registrationSchema.parse(validRegistration);

    expect(toRegistrationRequest(parsed)).toEqual({
      role: "TALENT",
      fullName: "Nadia Pratama",
      email: "nadia@example.com",
      password: "amansekali",
      termsAccepted: true,
    });
    expect(toRegistrationRequest(parsed)).not.toHaveProperty("confirmPassword");
  });

  it("requires a name, valid email, and an eight-character password", () => {
    const result = registrationSchema.safeParse({
      ...validRegistration,
      fullName: "",
      email: "bukan-email",
      password: "pendek",
      confirmPassword: "pendek",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map(({ path }) => path[0])).toEqual(
      expect.arrayContaining(["fullName", "email", "password"]),
    );
  });
});

describe("loginSchema and forgotPasswordSchema", () => {
  it("accepts valid login input", () => {
    expect(
      loginSchema.safeParse({
        email: "nadia@example.com",
        password: "amansekali",
      }).success,
    ).toBe(true);
  });

  it("requires a valid email and non-empty login password", () => {
    const result = loginSchema.safeParse({ email: "salah", password: "" });

    expect(result.success).toBe(false);
    expect(result.error?.issues.map(({ path }) => path[0])).toEqual([
      "email",
      "password",
    ]);
  });

  it("requires a valid password-reset email", () => {
    const result = forgotPasswordSchema.safeParse({ email: "salah" });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]).toEqual(
      expect.objectContaining({
        path: ["email"],
        message: "Masukkan alamat email yang valid.",
      }),
    );
  });

  it("accepts a valid password-reset email", () => {
    expect(
      forgotPasswordSchema.safeParse({ email: "nadia@example.com" }).success,
    ).toBe(true);
  });
});

describe("unavailableAuthAdapter", () => {
  it.each([
    ["loginWithCredentials", () => unavailableAuthAdapter.loginWithCredentials({ email: "nadia@example.com", password: "amansekali" })],
    ["loginWithGoogle", () => unavailableAuthAdapter.loginWithGoogle()],
    ["register", () => unavailableAuthAdapter.register({ role: "TALENT", fullName: "Nadia Pratama", email: "nadia@example.com", password: "amansekali", termsAccepted: true })],
  ] as const)("fails %s honestly without returning a user", async (_, invoke) => {
    await expect(invoke()).resolves.toEqual({
      ok: false,
      code: "AUTH_NOT_CONFIGURED",
      message: "Autentikasi belum dikonfigurasi.",
    });
  });

  it("does not claim that a password-reset email was sent", async () => {
    await expect(
      unavailableAuthAdapter.requestPasswordReset("nadia@example.com"),
    ).resolves.toEqual({
      ok: false,
      message: "Layanan reset kata sandi belum dikonfigurasi.",
    });
  });

  it("does not claim that a server session was invalidated", async () => {
    await expect(unavailableAuthAdapter.logout()).resolves.toEqual({
      ok: false,
      message: "Autentikasi belum dikonfigurasi; tidak ada sesi untuk diakhiri.",
    });
  });

  it("leaves browser session stores and cookies unchanged", async () => {
    localStorage.setItem("existing-local", "local-value");
    sessionStorage.setItem("existing-session", "session-value");
    document.cookie = "existing-cookie=cookie-value; path=/";

    const localBefore = { ...localStorage };
    const sessionBefore = { ...sessionStorage };
    const cookieBefore = document.cookie;

    try {
      await unavailableAuthAdapter.loginWithCredentials({
        email: "nadia@example.com",
        password: "amansekali",
      });
      await unavailableAuthAdapter.loginWithGoogle();
      await unavailableAuthAdapter.register({
        role: "TALENT",
        fullName: "Nadia Pratama",
        email: "nadia@example.com",
        password: "amansekali",
        termsAccepted: true,
      });
      await unavailableAuthAdapter.requestPasswordReset("nadia@example.com");
      await unavailableAuthAdapter.logout();

      expect({ ...localStorage }).toEqual(localBefore);
      expect({ ...sessionStorage }).toEqual(sessionBefore);
      expect(document.cookie).toBe(cookieBefore);
    } finally {
      localStorage.removeItem("existing-local");
      sessionStorage.removeItem("existing-session");
      document.cookie = "existing-cookie=; max-age=0; path=/";
    }
  });
});
