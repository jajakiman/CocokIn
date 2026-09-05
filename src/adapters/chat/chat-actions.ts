"use server";

import { prisma } from "@/src/adapters/database/prisma";
import { getSession } from "@/src/lib/session";

export type ActionState = {
  ok: boolean;
  message: string;
};

export async function reportMessageAction(
  prevState: ActionState | null,
  formData: FormData
): Promise<ActionState> {
  const session = await getSession();
  
  if (!session) {
    return { ok: false, message: "Akses ditolak. Silakan login." };
  }

  const messageId = String(formData.get("messageId"));
  const reason = String(formData.get("reason"));

  if (!messageId || !reason.trim()) {
    return { ok: false, message: "ID pesan dan alasan laporan wajib diisi." };
  }

  try {
    const message = await prisma.chatMessage.findUnique({
      where: { id: messageId }
    });

    if (!message) {
      return { ok: false, message: "Pesan tidak ditemukan." };
    }

    if (message.senderId === session.id) {
      return { ok: false, message: "Anda tidak dapat melaporkan pesan Anda sendiri." };
    }

    await prisma.messageReport.create({
      data: {
        messageId,
        reporterId: session.id,
        reason: reason.trim()
      }
    });

    return { ok: true, message: "Pesan berhasil dilaporkan. Tim kami akan meninjaunya." };
  } catch (error: unknown) {
    console.error(error);
    return { ok: false, message: "Terjadi kesalahan internal saat melaporkan pesan." };
  }
}
