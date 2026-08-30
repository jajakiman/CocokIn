import { describe, expect, it } from "vitest";

import { parseRegistrationRequest } from "./server-adapter";

describe("registration trust boundary", () => {
  it("rejects privileged roles, short passwords, and missing consent", async () => {
    await expect(parseRegistrationRequest({ role: "ADMIN", fullName: "Admin", email: "admin@example.com", password: "password123", termsAccepted: true, privacyAccepted: true })).rejects.toThrow();
    await expect(parseRegistrationRequest({ role: "TALENT", fullName: "Talent", email: "talent@example.com", password: "short", termsAccepted: true, privacyAccepted: true })).rejects.toThrow();
    await expect(parseRegistrationRequest({ role: "BUSINESS", fullName: "Owner", email: "owner@example.com", password: "password123", termsAccepted: false, privacyAccepted: true })).rejects.toThrow();
  });

  it("accepts a valid public registration", async () => {
    await expect(parseRegistrationRequest({ role: "TALENT", fullName: " Talent Baru ", email: "talent@example.com", password: "password123", termsAccepted: true, privacyAccepted: true })).resolves.toMatchObject({
      role: "TALENT",
      fullName: "Talent Baru",
    });
  });
});
