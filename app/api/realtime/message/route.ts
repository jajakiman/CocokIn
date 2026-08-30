import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/src/adapters/realtime/pusher";

export async function POST(req: NextRequest) {
  try {
    const { conversationId, content, senderId, sequenceNumber } = await req.json();

    // 1. Authorize user (Assuming senderId is valid for MVP)
    // 2. Persist to DB before broadcasting as per BUSINESS_FLOW.md
    const savedMessage = await saveMessage(
      conversationId,
      senderId,
      content,
      sequenceNumber
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
