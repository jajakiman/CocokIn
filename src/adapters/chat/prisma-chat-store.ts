import { Prisma, type PrismaClient } from "@/src/generated/prisma/client";
import { assertConversationAccess } from "@/src/modules/chat/service";
import type {
  ChatMessage,
  ChatStore,
  ConversationAccess,
  MessageWrite,
} from "@/src/modules/chat/types";

const accessSelect = {
  userId: true,
  lastReadSequence: true,
  user: { select: { status: true, emailVerified: true } },
  conversation: { select: { id: true, projectId: true, status: true } },
} as const;

function toAccess(participant: {
  userId: string;
  lastReadSequence: number;
  user: { status: "ACTIVE" | "SUSPENDED"; emailVerified: Date | null };
  conversation: {
    id: string;
    projectId: string;
    status: ConversationAccess["conversationStatus"];
  };
}): ConversationAccess {
  return {
    conversationId: participant.conversation.id,
    projectId: participant.conversation.projectId,
    conversationStatus: participant.conversation.status,
    userId: participant.userId,
    userStatus: participant.user.status,
    emailVerifiedAt: participant.user.emailVerified,
    lastReadSequence: participant.lastReadSequence,
  };
}

export class PrismaChatStore implements ChatStore {
  constructor(private readonly prisma: PrismaClient) {}

  async findConversationAccess(conversationId: string, userId: string) {
    const participant = await this.prisma.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
      select: accessSelect,
    });
    return participant ? toAccess(participant) : null;
  }

  async persistMessage(input: MessageWrite) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const participant = await tx.conversationParticipant.findUnique({
          where: {
            conversationId_userId: {
              conversationId: input.conversationId,
              userId: input.senderId,
            },
          },
          select: accessSelect,
        });
        assertConversationAccess(participant ? toAccess(participant) : null, true);

        const duplicate = await tx.chatMessage.findUnique({
          where: {
            conversationId_clientMessageId: {
              conversationId: input.conversationId,
              clientMessageId: input.clientMessageId,
            },
          },
        });
        if (duplicate) return { message: duplicate as ChatMessage, created: false };

        const conversation = await tx.projectConversation.update({
          where: { id: input.conversationId },
          data: { nextSequenceNumber: { increment: 1 } },
          select: { nextSequenceNumber: true },
        });
        const message = await tx.chatMessage.create({
          data: { ...input, sequenceNumber: conversation.nextSequenceNumber - 1 },
        });
        return { message: message as ChatMessage, created: true };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        const duplicate = await this.prisma.chatMessage.findUnique({
          where: {
            conversationId_clientMessageId: {
              conversationId: input.conversationId,
              clientMessageId: input.clientMessageId,
            },
          },
        });
        if (duplicate) return { message: duplicate as ChatMessage, created: false };
      }
      throw error;
    }
  }

  async listMessagesAfter(conversationId: string, afterSequence: number, limit: number) {
    return (await this.prisma.chatMessage.findMany({
      where: { conversationId, sequenceNumber: { gt: afterSequence } },
      orderBy: { sequenceNumber: "asc" },
      take: limit,
    })) as ChatMessage[];
  }

  async markRead(conversationId: string, userId: string, sequenceNumber: number) {
    return this.prisma.$transaction(async (tx) => {
      const participant = await tx.conversationParticipant.findUnique({
        where: { conversationId_userId: { conversationId, userId } },
        select: accessSelect,
      });
      const access = assertConversationAccess(participant ? toAccess(participant) : null);
      const conversation = await tx.projectConversation.findUniqueOrThrow({
        where: { id: conversationId },
        select: { nextSequenceNumber: true },
      });
      const latestSequence = conversation.nextSequenceNumber - 1;
      const requestedSequence = Math.max(
        access.lastReadSequence,
        Math.min(sequenceNumber, latestSequence),
      );
      await tx.conversationParticipant.updateMany({
        where: { conversationId, userId, lastReadSequence: { lt: requestedSequence } },
        data: { lastReadSequence: requestedSequence },
      });
      const { lastReadSequence } = await tx.conversationParticipant.findUniqueOrThrow({
        where: { conversationId_userId: { conversationId, userId } },
        select: { lastReadSequence: true },
      });
      return { lastReadSequence, latestSequence };
    });
  }
}
