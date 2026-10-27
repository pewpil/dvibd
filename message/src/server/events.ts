import { prisma } from "./db";

export async function touchPresence(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { lastSeenAt: new Date() },
  });
}
