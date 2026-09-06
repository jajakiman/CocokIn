import { describe, expect, it } from "vitest";

import { hashResetToken, isResetTokenExpired } from "./password-reset";

describe("password reset tokens", () => {
  it("stores a deterministic hash instead of the raw token", () => {
    expect(hashResetToken("raw-token")).toBe("34d328009b123fbbb0dc93f18b3e6de1ecf7b1a5783c33dff7ffe1926f09e943");
    expect(hashResetToken("raw-token")).not.toBe("raw-token");
  });

  it("rejects expired tokens", () => {
    expect(isResetTokenExpired(new Date("2026-01-01T00:00:00Z"), new Date("2026-01-01T00:00:01Z"))).toBe(true);
    expect(isResetTokenExpired(new Date("2026-01-01T01:00:00Z"), new Date("2026-01-01T00:00:00Z"))).toBe(false);
  });
});
