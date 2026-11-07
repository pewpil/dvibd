import { query } from "@solidjs/router";
import type { PostCard, ProfilePage } from "../types/social";
import { prisma } from "./db";
import { likedPostIds } from "./likeState";
import { POST_INCLUDE, toPostCard, type PostRow } from "./posts";
import { readSessionUser } from "./session";
import type { SafeUser } from "./user";

export const getProfilePage = query(
  async (handle: string): Promise<ProfilePage | null> => {
    "use server";
    const username: string = handle.trim().replace(/^@/, "");
    if (username === "") {
      return null;
    }
    const user = await prisma.user.findFirst({
      where: { username: { equals: username, mode: "insensitive" } },
    });
    if (user === null) {
      return null;
    }
    const viewer: SafeUser | null = await readSessionUser();
    const existingFollow: Promise<{ followerId: string } | null> =
      viewer !== null && viewer.id !== user.id
        ? prisma.follow.findUnique({
            where: {
              followerId_followeeId: {
                followerId: viewer.id,
                followeeId: user.id,
              },
            },
            select: { followerId: true },
          })
        : Promise.resolve(null);
    const [following, followers, authored, authorLikes, existing] =
      await Promise.all([
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
        existingFollow,
      ]);
    const isFollowing: boolean = existing !== null;
    const authoredRows: PostRow[] = authored;
    const likedRows: { post: PostRow }[] = authorLikes;
    const viewerLikedIds: Set<string> = await likedPostIds(
      [
        ...authoredRows.map((row) => row.id),
        ...likedRows.map((row) => row.post.id),
      ],
      viewer === null ? null : viewer.id,
    );
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
        isFollowing: isFollowing,
      },
      posts: authoredRows.map((row) =>
        toPostCard(row, viewerLikedIds.has(row.id)),
      ),
      replies: authoredRows
        .filter((row) => row.parentId !== null)
        .map((row) => toPostCard(row, viewerLikedIds.has(row.id))),
      media: authoredRows
        .filter((row) => row._count.media > 0)
        .map((row) => toPostCard(row, viewerLikedIds.has(row.id))),
      likes: likedRows.map((row): PostCard =>
        toPostCard(row.post, viewerLikedIds.has(row.post.id)),
      ),
    };
  },
  "socialProfilePage",
);
