import { describe, expect, it } from "vitest";

import { parseRegistrationRequest } from "./server-adapter";
import { registrationConsentRecords } from "@/src/modules/identity/registration-consent";

describe("registration trust boundary", () => {
  it("rejects privileged roles, short passwords, and missing consent", async () => {
    await expect(parseRegistrationRequest({ role: "ADMIN", fullName: "Admin", email: "admin@example.com", password: "password123", termsAccepted: true })).rejects.toThrow();
    await expect(parseRegistrationRequest({ role: "TALENT", fullName: "Talent", email: "talent@example.com", password: "short", termsAccepted: true })).rejects.toThrow();
    await expect(parseRegistrationRequest({ role: "BUSINESS", fullName: "Owner", email: "owner@example.com", password: "password123", termsAccepted: false })).rejects.toThrow();
  });

  it("accepts a valid public registration", async () => {
    await expect(parseRegistrationRequest({ role: "TALENT", fullName: " Talent Baru ", email: "talent@example.com", password: "password123", termsAccepted: true })).resolves.toMatchObject({
      role: "TALENT",
      fullName: "Talent Baru",
    });
  });

  it("maps one legal acceptance to separate terms and privacy audit records", () => {
    expect(registrationConsentRecords("user-id")).toEqual([
      { userId: "user-id", purpose: "TERMS_ACCEPTANCE", status: "GRANTED", source: "REGISTRATION" },
      { userId: "user-id", purpose: "PRIVACY_PROCESSING", status: "GRANTED", source: "REGISTRATION" },
    ]);
  });
});
