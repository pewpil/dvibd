import { action, json, type CustomResponse } from "@solidjs/router";
import type { Prisma } from "./generated/client.mts";
import type { LikeResult } from "../types/social";
import { prisma } from "./db";
import { readSessionUser } from "./session";
import type { SafeUser } from "./user";

const MAX_POST_ID_LENGTH: number = 64;

export const setLike = action(async (
  postId: string,
  intent: string,
): Promise<CustomResponse<LikeResult>> => {
  "use server";
  const viewer: SafeUser | null = await readSessionUser();
  if (viewer === null) {
    return json<LikeResult>(
      { ok: false, error: "You need to be signed in to like posts." },
      { revalidate: [] },
    );
  }
  const id: string = postId.trim();
  if (id === "" || id.length > MAX_POST_ID_LENGTH) {
    return json<LikeResult>(
      { ok: false, error: "That post is no longer available." },
      { revalidate: [] },
    );
  }
  if (intent !== "like" && intent !== "unlike") {
    return json<LikeResult>(
      { ok: false, error: "That like action is not supported." },
      { revalidate: [] },
    );
  }
  const result: LikeResult = await prisma.$transaction(
    async (tx: Prisma.TransactionClient): Promise<LikeResult> => {
      const post: { id: string; likeCount: number } | null =
        await tx.post.findUnique({
          where: { id: id },
          select: { id: true, likeCount: true },
        });
      if (post === null) {
        return { ok: false, error: "That post is no longer available." };
      }
      if (intent === "like") {
        const created: { count: number } = await tx.like.createMany({
          data: [{ userId: viewer.id, postId: post.id }],
          skipDuplicates: true,
        });
        if (created.count === 0) {
          return { ok: true, liked: true, likes: post.likeCount };
        }
        const updated: { likeCount: number } = await tx.post.update({
          where: { id: post.id },
          data: { likeCount: { increment: 1 } },
          select: { likeCount: true },
        });
        return { ok: true, liked: true, likes: updated.likeCount };
      }
      const removed: { count: number } = await tx.like.deleteMany({
        where: { userId: viewer.id, postId: post.id },
      });
      if (removed.count === 0) {
        return { ok: true, liked: false, likes: post.likeCount };
      }
      if (post.likeCount <= 0) {
        return { ok: true, liked: false, likes: 0 };
      }
      const updated: { likeCount: number } = await tx.post.update({
        where: { id: post.id },
        data: { likeCount: { decrement: 1 } },
        select: { likeCount: true },
      });
      return { ok: true, liked: false, likes: updated.likeCount };
    },
  );
  if (!result.ok) {
    return json<LikeResult>(result, { revalidate: [] });
  }
  return json<LikeResult>(result, {
    revalidate: [
      "socialFeed",
      "socialProfilePage",
      "socialBookmarks",
      "socialPostThread",
    ],
  });
}, "socialSetLike");
