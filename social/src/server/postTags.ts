import { prisma } from "./db";
import { parseHashtags } from "./format";

export async function syncPostTags(postId: string, text: string): Promise<void> {
  const names: string[] = parseHashtags(text);
  await prisma.postTag.deleteMany({ where: { postId: postId } });
  for (const name of names) {
    const tag = await prisma.tag.upsert({
      where: { name: name },
      create: { name: name },
      update: {},
    });
    await prisma.postTag.create({
      data: { postId: postId, tagId: tag.id },
    });
  }
}
