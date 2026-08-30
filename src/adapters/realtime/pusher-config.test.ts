import { describe, expect, it } from "vitest";
import {
  getPusherServerConfig,
  getPusherClientConfig,
} from "@/src/adapters/realtime";

describe("realtime pusher adapter config", () => {
  it("returns null when server pusher envs are missing", () => {
    const orig = { ...process.env };
    delete process.env.PUSHER_APP_ID;
    delete process.env.PUSHER_KEY;
    delete process.env.PUSHER_SECRET;
    delete process.env.PUSHER_CLUSTER;

    expect(getPusherServerConfig()).toBeNull();
    process.env = orig;
  });

  it("returns null when client pusher envs are missing", () => {
    const orig = { ...process.env };
    delete process.env.NEXT_PUBLIC_PUSHER_KEY;
    delete process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

    expect(getPusherClientConfig()).toBeNull();
    process.env = orig;
  });

  it("reads server config properly when envs exist", () => {
    const orig = { ...process.env };
    process.env.PUSHER_APP_ID = "app-id";
    process.env.PUSHER_KEY = "key";
    process.env.PUSHER_SECRET = "secret";
    process.env.PUSHER_CLUSTER = "ap1";

    expect(getPusherServerConfig()).toEqual({
      appId: "app-id",
      key: "key",
      secret: "secret",
      cluster: "ap1",
    });
    process.env = orig;
  });
});
