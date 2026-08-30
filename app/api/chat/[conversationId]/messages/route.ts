import { z } from "zod";
import { auth } from "@/src/auth";
import { getPrisma } from "@/src/lib/db/prisma";
import { PrismaChatStore } from "@/src/adapters/chat/prisma-chat-store";
import {
  createPusherServerClient,
  getPusherServerConfig,
  PusherRealtimePublisher,
} from "@/src/adapters/realtime/pusher-server";
import {
  createMessage,
  listMessagesAfter,
  ChatAccessError,
  ChatValidationError,
} from "@/src/modules/chat";

const createMessageSchema = z.object({
  clientMessageId: z.string().min(1),
  content: z.string().min(1),
  type: z.enum(["TEXT", "SYSTEM"]).default("TEXT"),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return Response.json(
      { ok: false, code: "UNAUTHORIZED", message: "Sesi tidak valid." },
      { status: 401 }
    );
  }

  if (!session.user.verified) {
    return Response.json(
      { ok: false, code: "EMAIL_UNVERIFIED", message: "Email wajib diverifikasi sebelum akses chat." },
      { status: 403 }
    );
  }

  const { searchParams } = new URL(request.url);
  const afterSequence = searchParams.get("after") ? parseInt(searchParams.get("after")!, 10) : 0;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 50;

  try {
    const prisma = getPrisma();
    const chatStore = new PrismaChatStore(prisma);

    const messages = await listMessagesAfter(chatStore, {
      conversationId,
      userId: session.user.id,
      afterSequence,
      limit,
    });

    return Response.json({ ok: true, messages });
  } catch (error) {
    if (error instanceof ChatAccessError) {
      return Response.json(
        { ok: false, code: error.reason, message: "Akses ke percakapan ditolak." },
        { status: 403 }
      );
    }
    if (error instanceof ChatValidationError) {
      return Response.json(
        { ok: false, code: "VALIDATION_ERROR", message: `Parameter tidak valid: ${error.field}` },
        { status: 400 }
      );
    }
    return Response.json(
      { ok: false, code: "INTERNAL_ERROR", message: "Gagal mengambil pesan." },
      { status: 500 }
    );
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  const { conversationId } = await params;
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return Response.json(
      { ok: false, code: "UNAUTHORIZED", message: "Sesi tidak valid." },
      { status: 401 }
    );
  }

  if (!session.user.verified) {
    return Response.json(
      { ok: false, code: "EMAIL_UNVERIFIED", message: "Email wajib diverifikasi sebelum akses chat." },
      { status: 403 }
    );
  }

  const json = await request.json().catch(() => null);
  const parseResult = createMessageSchema.safeParse(json);
  if (!parseResult.success) {
    return Response.json(
      { ok: false, code: "VALIDATION_ERROR", message: "Data pesan tidak valid." },
      { status: 400 }
    );
  }

  try {
    const prisma = getPrisma();
    const chatStore = new PrismaChatStore(prisma);

    // Setup publisher (Pusher jika terkonfigurasi, no-op fallback jika tidak)
    const pusherConfig = getPusherServerConfig();
    const publisher = pusherConfig
      ? new PusherRealtimePublisher(createPusherServerClient(pusherConfig))
      : { publish: async () => {} };

    const result = await createMessage(chatStore, publisher, {
      conversationId,
      senderId: session.user.id,
      clientMessageId: parseResult.data.clientMessageId,
      type: parseResult.data.type,
      content: parseResult.data.content,
    });

    return Response.json({ ok: true, message: result.message, published: result.published });
  } catch (error) {
    if (error instanceof ChatAccessError) {
      return Response.json(
        { ok: false, code: error.reason, message: "Akses ke percakapan ditolak." },
        { status: 403 }
      );
    }
    if (error instanceof ChatValidationError) {
      return Response.json(
        { ok: false, code: "VALIDATION_ERROR", message: `Data tidak valid: ${error.field}` },
        { status: 400 }
      );
    }
    return Response.json(
      { ok: false, code: "INTERNAL_ERROR", message: "Gagal mengirim pesan." },
      { status: 500 }
    );
  }
}
