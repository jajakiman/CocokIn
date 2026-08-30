import { prisma } from "../../adapters/database/prisma";

export async function createConversation(projectId: string, talentId: string, umkmId: string) {
  return prisma.projectConversation.create({
    data: {
      projectId,
      participants: {
        create: [
          { userId: talentId },
          { userId: umkmId }
        ]
      }
    }
  });
}

export async function getConversationByProjectId(projectId: string) {
  return prisma.projectConversation.findUnique({
    where: { projectId },
    include: {
      participants: true,
      messages: {
        orderBy: { sequenceNumber: 'asc' }
      }
    }
  });
}

export async function saveMessage(conversationId: string, senderId: string, content: string, sequenceNumber: number) {
  return prisma.chatMessage.create({
    data: {
      projectConversationId: conversationId,
      senderId,
      content,
      sequenceNumber,
    }
  });
}
