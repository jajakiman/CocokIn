import { auth } from "@/src/auth";
import { getPrisma } from "@/src/lib/db/prisma";
import { PrismaChatStore } from "@/src/adapters/chat/prisma-chat-store";
import {
  createPusherServerClient,
  getPusherServerConfig,
} from "@/src/adapters/realtime/pusher-server";

export async function POST(request: Request) {
  const session = await auth();
  if (!session || !session.user || !session.user.id) {
    return Response.json(
      { ok: false, code: "UNAUTHORIZED", message: "Sesi tidak valid." },
      { status: 401 }
    );
  }

  // Wajib email verified untuk chat
  if (!session.user.verified) {
    return Response.json(
      { ok: false, code: "EMAIL_UNVERIFIED", message: "Email wajib diverifikasi sebelum akses chat." },
      { status: 403 }
    );
  }

  if (session.user.status === "SUSPENDED") {
    return Response.json(
      { ok: false, code: "ACCOUNT_SUSPENDED", message: "Akun ditangguhkan." },
      { status: 403 }
    );
  }

  const pusherConfig = getPusherServerConfig();
  if (!pusherConfig) {
    return Response.json(
      { ok: false, code: "PUSHER_NOT_CONFIGURED", message: "Pusher realtime belum dikonfigurasi." },
      { status: 503 }
    );
  }

  // Pusher auth mengirim form urlencoded atau json: socket_id, channel_name
  let socketId: string | null = null;
  let channelName: string | null = null;

  const contentType = request.headers.get("content-type") || "";
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const formData = await request.formData();
    socketId = formData.get("socket_id") as string;
    channelName = formData.get("channel_name") as string;
  } else {
    const body = await request.json().catch(() => ({}));
    socketId = body.socket_id;
    channelName = body.channel_name;
  }

  if (!socketId || !channelName) {
    return Response.json(
      { ok: false, code: "INVALID_REQUEST", message: "socket_id dan channel_name diperlukan." },
      { status: 400 }
    );
  }

  // Format channel: presence-conversation-{conversationId}
  const match = channelName.match(/^presence-conversation-(.+)$/);
  if (!match) {
    return Response.json(
      { ok: false, code: "INVALID_CHANNEL", message: "Format nama channel tidak valid." },
      { status: 400 }
    );
  }

  const conversationId = match[1];
  const prisma = getPrisma();
  const chatStore = new PrismaChatStore(prisma);

  // Authorize participant
  const access = await chatStore.findConversationAccess(conversationId, session.user.id);
  if (!access) {
    return Response.json(
      { ok: false, code: "ACCESS_DENIED", message: "Anda bukan partisipan dalam percakapan ini." },
      { status: 403 }
    );
  }

  const pusher = createPusherServerClient(pusherConfig);

  // Channel data untuk presence
  const presenceData = {
    user_id: session.user.id,
    user_info: {
      name: session.user.name || "User",
      role: session.user.role,
    },
  };

  const authResponse = pusher.authorizeChannel(socketId, channelName, presenceData);
  return Response.json(authResponse);
}
