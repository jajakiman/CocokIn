import { afterEach, describe, expect, it } from "vitest";

import { getPusherServerConfig, toPusherBrowserConfig } from "./pusher-config";

const originalEnv = { ...process.env };

afterEach(() => {
  process.env = { ...originalEnv };
});

describe("Pusher configuration", () => {
  it("reads four server-only variables and exposes only browser-safe values", () => {
    process.env.PUSHER_APP_ID = "app-id";
    process.env.PUSHER_KEY = "app-key";
    process.env.PUSHER_SECRET = "secret";
    process.env.PUSHER_CLUSTER = "ap1";

    const serverConfig = getPusherServerConfig();

    expect(serverConfig).toEqual({
      appId: "app-id",
      key: "app-key",
      secret: "secret",
      cluster: "ap1",
    });
    expect(toPusherBrowserConfig(serverConfig)).toEqual({ key: "app-key", cluster: "ap1" });
  });

  it("fails closed when any server variable is missing", () => {
    delete process.env.PUSHER_KEY;

    expect(() => getPusherServerConfig()).toThrow("Pusher is not configured");
  });

  it("rejects whitespace-only server values", () => {
    process.env.PUSHER_APP_ID = "app-id";
    process.env.PUSHER_KEY = "   ";
    process.env.PUSHER_SECRET = "secret";
    process.env.PUSHER_CLUSTER = "ap1";

    expect(() => getPusherServerConfig()).toThrow("Pusher is not configured");
  });
});
