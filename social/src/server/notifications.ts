import { query } from "@solidjs/router";
import type { NotificationKind } from "./generated/client.mts";
import type { NotificationCard, NotificationPreferences } from "../types/social";
import { prisma } from "./db";
import { relativeTime } from "./format";
import { readNotificationPreferences } from "./notificationPreferences";
import { readSessionUser } from "./session";
import type { SafeUser } from "./user";

const KIND_ACTIONS: Record<NotificationKind, string> = {
  LIKED_POST: "liked your post",
  LIKED_COMMENT: "liked your comment",
  REPLIED: "replied to your post",
  FOLLOWED: "started following you",
  REPOSTED: "reposted your post",
  MENTIONED: "mentioned you in a post",
  MENTIONED_COMMUNITY: "mentioned you in a community post",
};

const KIND_PREFERENCES: Record<NotificationKind, keyof NotificationPreferences> = {
  LIKED_POST: "likes",
  LIKED_COMMENT: "likes",
  REPLIED: "replies",
  FOLLOWED: "follows",
  REPOSTED: "reposts",
  MENTIONED: "mentions",
  MENTIONED_COMMUNITY: "mentions",
};

const NOTIFICATION_KINDS: NotificationKind[] = Object.keys(
  KIND_PREFERENCES,
) as NotificationKind[];

function enabledKinds(preferences: NotificationPreferences): NotificationKind[] {
  return NOTIFICATION_KINDS.filter(
    (kind: NotificationKind): boolean => preferences[KIND_PREFERENCES[kind]],
  );
}

export const getNotifications = query(async (): Promise<NotificationCard[]> => {
  "use server";
  const user: SafeUser | null = await readSessionUser();
  if (user === null) {
    return [];
  }
  const preferences: NotificationPreferences = await readNotificationPreferences(
    user.id,
  );
  const kinds: NotificationKind[] = enabledKinds(preferences);
  if (kinds.length === 0) {
    return [];
  }
  const rows = await prisma.notification.findMany({
    where: { recipientId: user.id, kind: { in: kinds } },
    orderBy: { createdAt: "desc" },
    include: {
      actor: {
        select: { username: true, displayName: true, avatarUrl: true },
      },
    },
  });
  return rows.map((row) => ({
    id: row.id,
    actor: row.actor.displayName ?? row.actor.username,
    handle: row.actor.username,
    avatar: row.actor.avatarUrl ?? undefined,
    action: KIND_ACTIONS[row.kind],
    time: relativeTime(row.createdAt),
    kind: row.kind,
    isFallback: row.isFallback,
  }));
}, "socialNotifications");
