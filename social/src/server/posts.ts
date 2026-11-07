import { action, json, query, type CustomResponse } from "@solidjs/router";
import { z } from "zod";
import type { PostKind, Prisma } from "./generated/client.mts";
import {
  MAX_STAT_LENGTH,
  type CreatePostResult,
  type FeedMode,
  type PostCard,
  type PostThreadPage,
  type RecordViewResult,
} from "../types/social";
import { prisma } from "./db";
import { relativeTime } from "./format";
import { readSessionUser } from "./session";
import { syncPostTags } from "./postTags";
import type { SafeUser } from "./user";

const createPostSchema = z.object({
  text: z.string().trim().min(1).max(MAX_STAT_LENGTH),
});

const THREAD_REPLY_LIMIT: number = 50;

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
    views: post.viewCount,
  };
}

export const createPost = action(async (
  payload: URLSearchParams,
): Promise<CustomResponse<CreatePostResult>> => {
  "use server";
  const user: SafeUser | null = await readSessionUser();
  if (user === null) {
    return json<CreatePostResult>(
      { ok: false, error: "You need to be signed in to post." },
      { revalidate: [] },
    );
  }
  const raw: string | null = payload.get("text");
  const parsed = createPostSchema.safeParse({ text: raw ?? "" });
  if (!parsed.success) {
    return json<CreatePostResult>(
      { ok: false, error: `Posts must be 1 to ${MAX_STAT_LENGTH} characters.` },
      { revalidate: [] },
    );
  }
  const post = await prisma.post.create({
    data: {
      authorId: user.id,
      kind: "STAT",
      text: parsed.data.text,
      isFallback: false,
    },
  });
  try {
    await syncPostTags(post.id, parsed.data.text);
  } catch (error: unknown) {
    console.error("Post tag sync failed.", error);
  }
  return json<CreatePostResult>(
    { ok: true },
    {
      revalidate: [
        "socialFeed",
        "socialProfilePage",
        "socialTrending",
        "socialTagNames",
        "socialHappenings",
      ],
    },
  );
}, "socialCreatePost");

export const createReply = action(async (
  payload: URLSearchParams,
): Promise<CustomResponse<CreatePostResult>> => {
  "use server";
  const user: SafeUser | null = await readSessionUser();
  if (user === null) {
    return json<CreatePostResult>(
      { ok: false, error: "You need to be signed in to reply." },
      { revalidate: [] },
    );
  }
  const rawText: string | null = payload.get("text");
  const parsed = createPostSchema.safeParse({ text: rawText ?? "" });
  if (!parsed.success) {
    return json<CreatePostResult>(
      { ok: false, error: `Replies must be 1 to ${MAX_STAT_LENGTH} characters.` },
      { revalidate: [] },
    );
  }
  const rawParentId: string | null = payload.get("parentId");
  const parentId: string = (rawParentId ?? "").trim();
  if (parentId === "" || parentId.length > 64) {
    return json<CreatePostResult>(
      { ok: false, error: "That post is no longer available." },
      { revalidate: [] },
    );
  }
  const parent: { id: string } | null = await prisma.post.findFirst({
    where: { id: parentId, kind: "STAT" },
    select: { id: true },
  });
  if (parent === null) {
    return json<CreatePostResult>(
      { ok: false, error: "That post is no longer available." },
      { revalidate: [] },
    );
  }
  const [reply] = await prisma.$transaction([
    prisma.post.create({
      data: {
        authorId: user.id,
        kind: "STAT",
        text: parsed.data.text,
        parentId: parent.id,
        isFallback: false,
      },
      select: { id: true },
    }),
    prisma.post.update({
      where: { id: parent.id },
      data: { replyCount: { increment: 1 } },
    }),
  ]);
  try {
    await syncPostTags(reply.id, parsed.data.text);
  } catch (error: unknown) {
    console.error("Reply tag sync failed.", error);
  }
  return json<CreatePostResult>(
    { ok: true },
    {
      revalidate: [
        "socialFeed",
        "socialProfilePage",
        "socialBookmarks",
        "socialTrending",
        "socialTagNames",
        "socialHappenings",
      ],
    },
  );
}, "socialCreateReply");

export const recordView = action(async (
  handle: string,
  type: string,
  postId: string,
): Promise<CustomResponse<RecordViewResult>> => {
  "use server";
  const username: string = handle.trim().replace(/^@/, "");
  if (username === "" || username.length > 64) {
    return json<RecordViewResult>({ ok: false }, { revalidate: [] });
  }
  const normalizedType: string = type.trim().toLowerCase();
  if (normalizedType !== "status") {
    return json<RecordViewResult>({ ok: false }, { revalidate: [] });
  }
  const id: string = postId.trim();
  if (id === "" || id.length > 64) {
    return json<RecordViewResult>({ ok: false }, { revalidate: [] });
  }
  const row: {
    id: string;
    kind: PostKind;
    author: { username: string };
  } | null = await prisma.post.findUnique({
    where: { id: id },
    select: {
      id: true,
      kind: true,
      author: { select: { username: true } },
    },
  });
  if (
    row === null ||
    row.kind !== "STAT" ||
    row.author.username.toLowerCase() !== username.toLowerCase()
  ) {
    return json<RecordViewResult>({ ok: false }, { revalidate: [] });
  }
  const updated: { viewCount: number } = await prisma.post.update({
    where: { id: row.id },
    data: { viewCount: { increment: 1 } },
    select: { viewCount: true },
  });
  return json<RecordViewResult>(
    { ok: true, views: updated.viewCount },
    {
      revalidate: [
        "socialFeed",
        "socialProfilePage",
        "socialBookmarks",
      ],
    },
  );
}, "socialViewPost");

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

export const getPostThread = query(async (
  handle: string,
  type: string,
  id: string,
): Promise<PostThreadPage | null> => {
  "use server";
  const username: string = handle.trim().replace(/^@/, "");
  if (username === "") {
    return null;
  }
  const normalizedType: string = type.trim().toLowerCase();
  if (normalizedType !== "status") {
    return null;
  }
  if (id === "") {
    return null;
  }
  const row: PostRow | null = await prisma.post.findUnique({
    where: { id: id },
    include: POST_INCLUDE,
  });
  if (row === null) {
    return null;
  }
  const post: PostCard = toPostCard(row);
  if (normalizedType === "status" && post.type !== "stat") {
    return null;
  }
  if (row.author.username.toLowerCase() !== username.toLowerCase()) {
    return null;
  }
  const replyRows: PostRow[] = await prisma.post.findMany({
    where: { parentId: row.id },
    include: POST_INCLUDE,
    orderBy: { createdAt: "desc" },
    take: THREAD_REPLY_LIMIT,
  });
  return { post: post, replies: replyRows.reverse().map(toPostCard) };
}, "socialPostThread");
