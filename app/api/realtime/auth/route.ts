import { NextRequest, NextResponse } from "next/server";
import { pusherServer } from "@/src/adapters/realtime/pusher";
import { getSession } from "@/src/lib/session"; // Note: Assumes standard auth setup, replace as needed.
import { prisma } from "@/src/adapters/database/prisma";
import { hasTalentFeatureAccess } from "@/src/modules/talent/feature-access";

export async function POST(req: NextRequest) {
  try {
    const data = await req.formData();
    const socketId = data.get("socket_id") as string;
    const channel = data.get("channel_name") as string;
    const session = await getSession();
    if (!session) return new NextResponse("Unauthorized", { status: 401 });
    if (session.role === "TALENT" && !(await hasTalentFeatureAccess(session.id))) {
      return new NextResponse("Onboarding required", { status: 403 });
    }

    const match = channel.match(/^presence-(.+)$/);
    if (!socketId || !match) return new NextResponse("Bad Request", { status: 400 });
    const participant = await prisma.conversationParticipant.findUnique({
      where: {
        projectConversationId_userId: {
          projectConversationId: match[1],
          userId: session.id,
        },
      },
    });
    if (!participant) return new NextResponse("Forbidden", { status: 403 });

    const presenceData = {
      user_id: session.id,
      user_info: {
        name: session.displayName,
      },
    };

    const authResponse = pusherServer.authorizeChannel(socketId, channel, presenceData);
    return NextResponse.json(authResponse);
  } catch (error) {
    return new NextResponse("Forbidden", { status: 403 });
  }
}
