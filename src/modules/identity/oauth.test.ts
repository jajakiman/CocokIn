import { describe, expect, it } from "vitest";

import { buildGoogleAuthorizationUrl, validateOAuthState } from "./oauth";

describe("Google OAuth", () => {
  it("builds an authorization URL with callback, scopes, and anti-CSRF state", () => {
    const url = new URL(buildGoogleAuthorizationUrl({
      clientId: "client-id",
      origin: "https://cocokin.example",
      state: "random-state",
    }));

    expect(url.origin + url.pathname).toBe("https://accounts.google.com/o/oauth2/v2/auth");
    expect(url.searchParams.get("redirect_uri")).toBe("https://cocokin.example/api/auth/callback/google");
    expect(url.searchParams.get("state")).toBe("random-state");
    expect(url.searchParams.get("scope")).toContain("email");
  });

  it("rejects a callback with a different state", () => {
    expect(() => validateOAuthState("expected", "different")).toThrow("Invalid OAuth state");
    expect(() => validateOAuthState("expected", "expected")).not.toThrow();
  });
});
