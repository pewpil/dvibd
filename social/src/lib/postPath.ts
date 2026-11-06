import type { PostCard } from "../types/social";

export function postPath(
  post: Pick<PostCard, "id" | "handle" | "type">,
): string {
  const segment: string = post.type === "stat" ? "status" : "article";
  return `/@${encodeURIComponent(post.handle)}/${segment}/${encodeURIComponent(post.id)}`;
}
