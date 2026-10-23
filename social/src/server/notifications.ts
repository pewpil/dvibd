import { query } from "@solidjs/router";
import type { NotificationKind } from "./generated/client.mts";
import type { NotificationCard } from "../types/social";
import { prisma } from "./db";
import { relativeTime } from "./format";
import { readSessionUser } from "./session";

const KIND_ACTIONS: Record<NotificationKind, string> = {
  LIKED_POST: "liked your post",
  LIKED_COMMENT: "liked your comment",
  REPLIED: "replied to your post",
  FOLLOWED: "started following you",
  REPOSTED: "reposted your post",
  MENTIONED: "mentioned you in a post",
  MENTIONED_COMMUNITY: "mentioned you in a community post",
};

export const getNotifications = query(async (): Promise<NotificationCard[]> => {
  "use server";
  const user = await readSessionUser();
  if (user === null) {
    return [];
  }
  const rows = await prisma.notification.findMany({
    where: { recipientId: user.id },
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
