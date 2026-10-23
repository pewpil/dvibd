import { query } from "@solidjs/router";
import type { PostCard, ProfilePage } from "../types/social";
import { prisma } from "./db";
import { POST_INCLUDE, toPostCard, type PostRow } from "./posts";
import { readSessionUser } from "./session";
import type { SafeUser } from "./user";

export const getProfilePage = query(async (): Promise<ProfilePage | null> => {
  "use server";
  const user: SafeUser | null = await readSessionUser();
  if (user === null) {
    return null;
  }
  const [following, followers, authored, liked] = await Promise.all([
    prisma.follow.count({ where: { followerId: user.id } }),
    prisma.follow.count({ where: { followeeId: user.id } }),
    prisma.post.findMany({
      where: { authorId: user.id },
      include: POST_INCLUDE,
      orderBy: { createdAt: "desc" },
    }),
    prisma.like.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: { post: { include: POST_INCLUDE } },
    }),
  ]);
  const authoredRows: PostRow[] = authored;
  return {
    profile: {
      name: user.displayName ?? user.username,
      handle: user.username,
      avatar: user.avatarUrl ?? "/profile-picture.svg",
      cover: user.coverUrl ?? "/profile-cover.svg",
      bio: user.bio ?? "",
      website: user.website ?? "",
      following: following,
      followers: followers,
    },
    posts: authoredRows.map(toPostCard),
    replies: authoredRows
      .filter((row) => row.parentId !== null)
      .map(toPostCard),
    media: authoredRows
      .filter((row) => row._count.media > 0)
      .map(toPostCard),
    likes: liked.map((row): PostCard => toPostCard(row.post)),
  };
}, "socialProfilePage");
