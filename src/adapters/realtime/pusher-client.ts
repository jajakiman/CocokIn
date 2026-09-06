import PusherClient from "pusher-js";
import type { PusherBrowserConfig } from "./pusher-config";

export function parsePusherBrowserConfig(value: unknown): PusherBrowserConfig {
  if (!value || typeof value !== "object") throw new Error("Invalid Pusher configuration");
  const { key, cluster } = value as Record<string, unknown>;
  if (typeof key !== "string" || !key.trim() || typeof cluster !== "string" || !cluster.trim()) {
    throw new Error("Invalid Pusher configuration");
  }
  return { key: key.trim(), cluster: cluster.trim() };
}

export function createPusherClient({ key, cluster }: PusherBrowserConfig) {
  return new PusherClient(key, {
    cluster,
    authEndpoint: "/api/realtime/auth",
  });
}
