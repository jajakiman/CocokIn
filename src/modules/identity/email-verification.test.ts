import { describe, expect, it } from "vitest";

import { hashEmailVerificationToken, isEmailVerificationExpired } from "./email-verification";

describe("email verification tokens", () => {
  it("hashes the token before persistence", () => {
    expect(hashEmailVerificationToken("verification-token")).not.toBe("verification-token");
    expect(hashEmailVerificationToken("verification-token")).toHaveLength(64);
  });

  it("recognizes an expired verification token", () => {
    expect(isEmailVerificationExpired(new Date("2026-01-01T00:00:00Z"), new Date("2026-01-01T00:00:01Z"))).toBe(true);
  });
});
