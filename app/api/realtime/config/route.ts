import { getPusherServerConfig, toPusherBrowserConfig } from "@/src/adapters/realtime/pusher-config";
import { getSession } from "@/src/lib/session";

export async function GET() {
  if (!(await getSession())) return Response.json({ message: "Unauthorized" }, { status: 401 });

  try {
    return Response.json(toPusherBrowserConfig(getPusherServerConfig()));
  } catch {
    return Response.json({ message: "Realtime is not configured" }, { status: 503 });
  }
}
