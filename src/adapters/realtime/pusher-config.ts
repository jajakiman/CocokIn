export type PusherServerConfig = {
  appId: string;
  key: string;
  secret: string;
  cluster: string;
};

export type PusherBrowserConfig = Pick<PusherServerConfig, "key" | "cluster">;

export function getPusherServerConfig(): PusherServerConfig {
  const { PUSHER_APP_ID: appId, PUSHER_KEY: key, PUSHER_SECRET: secret, PUSHER_CLUSTER: cluster } = process.env;
  if (![appId, key, secret, cluster].every((value) => value?.trim())) throw new Error("Pusher is not configured");
  return { appId: appId!.trim(), key: key!.trim(), secret: secret!.trim(), cluster: cluster!.trim() };
}

export function toPusherBrowserConfig({ key, cluster }: PusherServerConfig): PusherBrowserConfig {
  return { key, cluster };
}
