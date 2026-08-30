import { afterEach, describe, expect, it } from "vitest";

import { POST as credentials } from "@/app/api/auth/credentials/route";
import { POST as logout } from "@/app/api/auth/logout/route";
import { POST as register } from "@/app/api/auth/register/route";
import { POST as verifyEmail } from "@/app/api/auth/verify-email/route";

const originalDatabaseUrl = process.env.DATABASE_URL;
const originalAuthSecret = process.env.AUTH_SECRET;

afterEach(() => {
  if (originalDatabaseUrl === undefined) delete process.env.DATABASE_URL;
  else process.env.DATABASE_URL = originalDatabaseUrl;
  if (originalAuthSecret === undefined) delete process.env.AUTH_SECRET;
  else process.env.AUTH_SECRET = originalAuthSecret;
});

function jsonRequest(path: string, body: unknown) {
  return new Request(`http://localhost${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("public auth routes", () => {
  it("rejects public ADMIN registration before configuration or database access", async () => {
    delete process.env.DATABASE_URL;
    delete process.env.AUTH_SECRET;

    const response = await register(jsonRequest("/api/auth/register", {
      role: "ADMIN",
      fullName: "Internal Admin",
      email: "admin@example.com",
      password: "amansekali",
      termsAccepted: true,
      privacyAccepted: true,
    }));

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      ok: false,
      code: "ROLE_REVOKED",
      message: "Pendaftaran publik hanya tersedia untuk Talent atau UMKM.",
    });
  });

  it.each([
    ["registration", register, "/api/auth/register", { role: "TALENT", fullName: "Nadia", email: "nadia@example.com", password: "amansekali", termsAccepted: true, privacyAccepted: true }],
    ["credentials", credentials, "/api/auth/credentials", { email: "nadia@example.com", password: "amansekali" }],
    ["verification", verifyEmail, "/api/auth/verify-email", { token: "opaque-token" }],
  ] as const)("returns AUTH_NOT_CONFIGURED for %s without environment secrets", async (_, handler, path, body) => {
    delete process.env.DATABASE_URL;
    delete process.env.AUTH_SECRET;

    const response = await handler(jsonRequest(path, body));

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      ok: false,
      code: "AUTH_NOT_CONFIGURED",
      message: "Autentikasi belum dikonfigurasi.",
    });
  });

  it("clears the shared Auth.js session cookie on logout", async () => {
    delete process.env.DATABASE_URL;
    delete process.env.AUTH_SECRET;
    const response = await logout();

    expect(response.status).toBe(503);
    expect(await response.json()).toEqual({
      ok: false,
      code: "AUTH_NOT_CONFIGURED",
      message: "Autentikasi belum dikonfigurasi.",
    });
    expect(response.headers.get("set-cookie")).toContain("authjs.session-token=");
    expect(response.headers.get("set-cookie")).toContain("HttpOnly");
    expect(response.headers.get("set-cookie")).toContain("Max-Age=0");
    expect(response.headers.get("set-cookie")).not.toContain("opaque-token");
  });
});
