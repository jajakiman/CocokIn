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
        orderBy: { sequenceNumber: 'asc' },
        include: {
          attachments: true
        }
      }
    }
  });
}

export async function saveMessage(
  conversationId: string, 
  senderId: string, 
  content: string, 
  attachment?: { url: string; type: string }
) {
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await prisma.$transaction(async (tx) => {
        const latest = await tx.chatMessage.findFirst({
          where: { projectConversationId: conversationId },
          orderBy: { sequenceNumber: "desc" },
          select: { sequenceNumber: true },
        });
        
        const message = await tx.chatMessage.create({
          data: {
            projectConversationId: conversationId,
            senderId,
            content,
            sequenceNumber: (latest?.sequenceNumber ?? 0) + 1,
            attachments: attachment ? {
              create: {
                fileUrl: attachment.url,
                fileType: attachment.type
              }
            } : undefined
          },
          include: {
            attachments: true
          }
        });
        return message;
      });
    } catch (error: any) {
      if ((error.code !== "P2034" && error.code !== "P2002") || attempt === 2) throw error;
    }
  }
  throw new Error("Unable to allocate message sequence");
}
