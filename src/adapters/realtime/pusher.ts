import Pusher from "pusher";
import { getPusherServerConfig } from "./pusher-config";

const globalForPusher = global as unknown as { pusher?: Pusher };

export const pusherServer =
  globalForPusher.pusher ||
  new Pusher({ ...getPusherServerConfig(), useTLS: true });

if (process.env.NODE_ENV !== "production") {
  globalForPusher.pusher = pusherServer;
}
