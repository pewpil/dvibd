import { query } from "@solidjs/router";
import type { Prisma } from "./generated/client.mts";
import type { FeedMode, PostCard } from "../types/social";
import { prisma } from "./db";
import { relativeTime } from "./format";
import { readSessionUser } from "./session";

export const POST_INCLUDE = {
  author: {
    select: { username: true, displayName: true, avatarUrl: true },
  },
  _count: { select: { media: true } },
} satisfies Prisma.PostInclude;

export type PostRow = Prisma.PostGetPayload<{ include: typeof POST_INCLUDE }>;

export function toPostCard(post: PostRow): PostCard {
  return {
    id: post.id,
    name: post.author.displayName ?? post.author.username,
    handle: post.author.username,
    time: relativeTime(post.createdAt),
    avatar: post.author.avatarUrl ?? undefined,
    text: post.text,
    type: post.kind === "ARTICLE" ? "article" : "stat",
    media: post._count.media > 0 ? { count: post._count.media } : undefined,
    reply: post.replyCount,
    repost: post.repostCount,
    like: post.likeCount,
    save: post.saveCount,
  };
}

export const getFeed = query(async (mode: FeedMode): Promise<PostCard[]> => {
  "use server";
  if (mode === "following") {
    const user = await readSessionUser();
    if (user === null) {
      return [];
    }
    const rows: PostRow[] = await prisma.post.findMany({
      where: {
        OR: [
          { authorId: user.id },
          { author: { followers: { some: { followerId: user.id } } } },
        ],
      },
      include: POST_INCLUDE,
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    return rows.map(toPostCard);
  }
  const rows: PostRow[] = await prisma.post.findMany({
    include: POST_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return rows.map(toPostCard);
}, "socialFeed");

export const getBookmarks = query(async (): Promise<PostCard[]> => {
  "use server";
  const user = await readSessionUser();
  if (user === null) {
    return [];
  }
  const rows = await prisma.bookmark.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { post: { include: POST_INCLUDE } },
  });
  return rows.map((row) => toPostCard(row.post));
}, "socialBookmarks");
