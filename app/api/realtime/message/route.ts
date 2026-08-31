import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/src/adapters/realtime/pusher";
import { saveMessage } from "@/src/modules/chat/chat.service";
import { getSession } from "@/src/lib/session";
import { prisma } from "@/src/adapters/database/prisma";
import { hasTalentFeatureAccess } from "@/src/modules/talent/feature-access";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    if (session.role === "TALENT" && !(await hasTalentFeatureAccess(session.id))) {
      return new NextResponse("Onboarding required", { status: 403 });
    }
    const { conversationId, content } = await req.json();
    if (typeof conversationId !== "string" || typeof content !== "string" || !content.trim() || content.length > 10_000) {
      return new NextResponse("Bad Request", { status: 400 });
    }
    const participant = await prisma.conversationParticipant.findUnique({
      where: { projectConversationId_userId: { projectConversationId: conversationId, userId: session.id } },
      include: { conversation: { select: { status: true } } },
    });
    if (!participant || !["ACTIVE", "SUPPORT_ACTIVE"].includes(participant.conversation.status)) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // 1. Authorize user (Assuming senderId is valid for MVP)
    // 2. Persist to DB before broadcasting as per BUSINESS_FLOW.md
    const savedMessage = await saveMessage(
      conversationId,
      session.id,
      content.trim()
    );

    // 3. Broadcast to Pusher presence channel
    await pusherServer.trigger(
      `presence-${conversationId}`,
      "new-message",
      savedMessage
    );

    return NextResponse.json(savedMessage);
  } catch (error) {
    console.error("Failed to broadcast message:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
