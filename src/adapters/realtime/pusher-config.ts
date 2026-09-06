export type PusherServerConfig = {
  appId: string;
  key: string;
  secret: string;
  cluster: string;
};

export type PusherBrowserConfig = Pick<PusherServerConfig, "key" | "cluster">;

export function getPusherServerConfig(): PusherServerConfig {
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.NEXT_PUBLIC_PUSHER_APP_KEY || process.env.PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER || process.env.PUSHER_CLUSTER;
  if (![appId, key, secret, cluster].every((value) => value?.trim())) throw new Error("Pusher is not configured");
  return { appId: appId!.trim(), key: key!.trim(), secret: secret!.trim(), cluster: cluster!.trim() };
}

export function toPusherBrowserConfig({ key, cluster }: PusherServerConfig): PusherBrowserConfig {
  return { key, cluster };
}
