import { z } from "zod";
import { auth } from "@/src/auth";
import { getPrisma } from "@/src/lib/db/prisma";
import { PrismaChatStore } from "@/src/adapters/chat/prisma-chat-store";
import {
  markConversationRead,
  ChatAccessError,
  ChatValidationError,
} from "@/src/modules/chat";

const markReadSchema = z.object({
  sequenceNumber: z.number().int().nonnegative(),
});

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
  const parseResult = markReadSchema.safeParse(json);
  if (!parseResult.success) {
    return Response.json(
      { ok: false, code: "VALIDATION_ERROR", message: "Sequence number tidak valid." },
      { status: 400 }
    );
  }

  try {
    const prisma = getPrisma();
    const chatStore = new PrismaChatStore(prisma);

    const result = await markConversationRead(chatStore, {
      conversationId,
      userId: session.user.id,
      sequenceNumber: parseResult.data.sequenceNumber,
    });

    return Response.json({ ok: true, ...result });
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
      { ok: false, code: "INTERNAL_ERROR", message: "Gagal memperbarui status baca." },
      { status: 500 }
    );
  }
}
