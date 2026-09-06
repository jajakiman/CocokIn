import { describe, expect, it, vi } from "vitest";
import { createHash } from "node:crypto";

const mocks = vi.hoisted(() => ({
  cookieGet: vi.fn(),
  findUser: vi.fn(),
  decrypt: vi.fn(),
}));

vi.mock("next/headers", () => ({
  cookies: async () => ({ get: mocks.cookieGet, set: vi.fn() }),
}));
vi.mock("@/src/adapters/database/prisma", () => ({
  prisma: { user: { findUnique: mocks.findUser } },
}));
vi.mock("jose", () => ({
  SignJWT: class {},
  jwtVerify: async () => ({ payload: await mocks.decrypt() }),
}));

import { createSession, getSession } from "./session";

describe("getSession", () => {
  it("rejects a valid cookie when the persisted user is suspended", async () => {
    mocks.cookieGet.mockReturnValue({ value: "signed-cookie" });
    mocks.decrypt.mockResolvedValue({
      user: { id: "user-1", role: "TALENT", email: "talent@example.com", displayName: "Talent" },
      credentialFingerprint: createHash("sha256").update("hash").digest("hex"),
    });
    mocks.findUser.mockResolvedValue({ passwordHash: "hash", isSuspended: true });

    await expect(getSession()).resolves.toBeNull();
  });

  it("refuses to issue a new session for a suspended user", async () => {
    mocks.findUser.mockResolvedValue({ passwordHash: "hash", isSuspended: true });

    await expect(createSession({
      id: "user-1",
      role: "TALENT",
      email: "talent@example.com",
      displayName: "Talent",
    })).rejects.toThrow(/ditangguhkan/i);
  });
});
