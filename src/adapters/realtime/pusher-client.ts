import PusherClient from "pusher-js";

export type PusherClientConfig = {
  key: string;
  cluster: string;
};

export function getPusherClientConfig(): PusherClientConfig | null {
  const key = process.env.NEXT_PUBLIC_PUSHER_KEY;
  const cluster = process.env.NEXT_PUBLIC_PUSHER_CLUSTER;

  if (!key || !cluster) {
    return null;
  }

  return { key, cluster };
}

export function createPusherClient(
  config: PusherClientConfig,
  authEndpoint: string = "/api/realtime/auth"
): PusherClient {
  return new PusherClient(config.key, {
    cluster: config.cluster,
    channelAuthorization: {
      endpoint: authEndpoint,
      transport: "ajax",
    },
  });
}
