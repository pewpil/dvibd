import { prisma } from "./db";

export async function likedPostIds(
  postIds: string[],
  viewerId: string | null,
): Promise<Set<string>> {
  if (viewerId === null || postIds.length === 0) {
    return new Set<string>();
  }
  const uniqueIds: string[] = Array.from(new Set(postIds));
  const rows: { postId: string }[] = await prisma.like.findMany({
    where: { userId: viewerId, postId: { in: uniqueIds } },
    select: { postId: true },
  });
  return new Set<string>(rows.map((row) => row.postId));
}
