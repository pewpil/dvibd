import type { NotificationPreferences } from "../types/social";
import { prisma } from "./db";
import type { NotificationPreference } from "./generated/client.mts";

export async function readNotificationPreferences(
  userId: string,
): Promise<NotificationPreferences> {
  const row: NotificationPreference | null =
    await prisma.notificationPreference.findUnique({ where: { userId } });
  if (row === null) {
    return {
      likes: true,
      replies: true,
      follows: true,
      reposts: true,
      mentions: true,
    };
  }
  return {
    likes: row.likes,
    replies: row.replies,
    follows: row.follows,
    reposts: row.reposts,
    mentions: row.mentions,
  };
}
