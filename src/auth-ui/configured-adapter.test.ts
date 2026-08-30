import { describe, expect, it, vi } from "vitest";

import { createConfiguredAuthAdapter } from "./configured-adapter";

const user = {
  id: "user-1",
  displayName: "Nadia Pratama",
  email: "nadia@example.com",
  role: "TALENT" as const,
};

function response(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

describe("configuredAuthAdapter", () => {
  it("sends the exact credentials payload and returns the authenticated user", async () => {
    const fetch = vi.fn().mockResolvedValue(response({ ok: true, user }));
    const redirect = vi.fn();
    const adapter = createConfiguredAuthAdapter({ fetch, redirect });

    await expect(
      adapter.loginWithCredentials({ email: "nadia@example.com", password: "amansekali" }),
    ).resolves.toEqual({ ok: true, user });
    expect(fetch).toHaveBeenCalledWith("/api/auth/credentials", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ email: "nadia@example.com", password: "amansekali" }),
    });
    expect(redirect).toHaveBeenCalledWith("/talent");
  });

  it("sends only the public registration contract", async () => {
    const fetch = vi.fn().mockResolvedValue(response({ ok: true, user }));
    const redirect = vi.fn();
    const adapter = createConfiguredAuthAdapter({ fetch, redirect });
    const input = {
      role: "TALENT" as const,
      fullName: "Nadia Pratama",
      email: "nadia@example.com",
      password: "amansekali",
      termsAccepted: true,
      privacyAccepted: true,
    };

    await expect(adapter.register(input)).resolves.toEqual({ ok: true, user });
    expect(fetch).toHaveBeenCalledWith("/api/auth/register", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(input),
    });
    expect(redirect).toHaveBeenCalledWith("/talent");
  });

  it("preserves an honest server failure instead of claiming success", async () => {
    const failure = {
      ok: false,
      code: "AUTH_NOT_CONFIGURED",
      message: "Autentikasi belum dikonfigurasi.",
    } as const;
    const adapter = createConfiguredAuthAdapter({
      fetch: vi.fn().mockResolvedValue(response(failure, 503)),
      redirect: vi.fn(),
    });

    await expect(
      adapter.loginWithCredentials({ email: "nadia@example.com", password: "wrong" }),
    ).resolves.toEqual(failure);
  });

  it("maps malformed and unreachable responses to provider unavailability", async () => {
    const malformed = createConfiguredAuthAdapter({
      fetch: vi.fn().mockResolvedValue(response({ ok: true, user: {} })),
      redirect: vi.fn(),
    });
    const unreachable = createConfiguredAuthAdapter({
      fetch: vi.fn().mockRejectedValue(new Error("offline")),
      redirect: vi.fn(),
    });

    const expected = {
      ok: false,
      code: "PROVIDER_UNAVAILABLE",
      message: "Layanan autentikasi sedang tidak tersedia.",
    };
    await expect(malformed.loginWithCredentials({ email: "a@b.co", password: "x" })).resolves.toEqual(expected);
    await expect(unreachable.loginWithCredentials({ email: "a@b.co", password: "x" })).resolves.toEqual(expected);
  });

  it("starts Google OAuth through the Auth.js provider route", async () => {
    const redirect = vi.fn();
    const adapter = createConfiguredAuthAdapter({ fetch: vi.fn(), redirect });

    void adapter.loginWithGoogle();

    expect(redirect).toHaveBeenCalledWith("/api/auth/signin/google?callbackUrl=%2F");
  });

  it("posts logout and reports only a confirmed revocation", async () => {
    const fetch = vi.fn().mockResolvedValue(response({ ok: true }));
    const adapter = createConfiguredAuthAdapter({ fetch, redirect: vi.fn() });

    await expect(adapter.logout()).resolves.toEqual({ ok: true });
    expect(fetch).toHaveBeenCalledWith("/api/auth/logout", { method: "POST" });
  });
});
