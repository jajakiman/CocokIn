import { prisma } from "@/src/adapters/database/prisma";
import { pusherServer } from "@/src/adapters/realtime/pusher";

export async function createNotification(userId: string, type: string, content: string) {
  // 1. Save to DB
  const notification = await prisma.notification.create({
    data: {
      userId,
      type,
      content,
    }
  });

  // 2. Broadcast via Pusher (we use a simple user-specific channel for notifications)
  try {
    await pusherServer.trigger(
      `user-${userId}`,
      "new-notification",
      notification
    );
  } catch (error) {
    console.error("Failed to broadcast notification via Pusher:", error);
    // We don't throw here so that the main business logic doesn't fail if Pusher is temporarily down
  }

  return notification;
}

export async function markNotificationAsRead(id: string, userId: string) {
  return prisma.notification.update({
    where: { id, userId },
    data: { isRead: true }
  });
}
