import Pusher from "pusher";
import type { RealtimeEvent, RealtimePublisher } from "@/src/modules/chat/types";

export type PusherServerConfig = {
  appId: string;
  key: string;
  secret: string;
  cluster: string;
};

export function getPusherServerConfig(): PusherServerConfig | null {
  const appId = process.env.PUSHER_APP_ID;
  const key = process.env.PUSHER_KEY;
  const secret = process.env.PUSHER_SECRET;
  const cluster = process.env.PUSHER_CLUSTER;

  if (!appId || !key || !secret || !cluster) {
    return null;
  }

  return { appId, key, secret, cluster };
}

export function createPusherServerClient(config: PusherServerConfig): Pusher {
  return new Pusher({
    appId: config.appId,
    key: config.key,
    secret: config.secret,
    cluster: config.cluster,
    useTLS: true,
  });
}

export class PusherRealtimePublisher implements RealtimePublisher {
  constructor(private readonly pusher: Pusher) {}

  async publish(event: RealtimeEvent): Promise<void> {
    if (event.type === "message.created") {
      // Channel: presence-project-{projectId} or conversation-{id}
      // Kita broadcast ke conversation-scoped channel
      await this.pusher.trigger(
        `presence-conversation-${event.message.conversationId}`,
        "message.created",
        event.message
      );
    }
  }
}
