import { describe, expect, it } from "vitest";

import { parsePusherBrowserConfig } from "./pusher-client";

describe("Pusher browser configuration", () => {
  it("accepts and trims browser-safe values", () => {
    expect(parsePusherBrowserConfig({ key: " app-key ", cluster: " ap1 " })).toEqual({
      key: "app-key",
      cluster: "ap1",
    });
  });

  it("rejects malformed endpoint payloads", () => {
    expect(() => parsePusherBrowserConfig({ key: "app-key" })).toThrow("Invalid Pusher configuration");
    expect(() => parsePusherBrowserConfig({ key: " ", cluster: "ap1" })).toThrow("Invalid Pusher configuration");
  });
});
