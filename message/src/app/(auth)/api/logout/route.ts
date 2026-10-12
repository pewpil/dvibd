import { cookies } from "next/headers";
import { prisma } from "../../../../server/db";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  rotateRefreshToken,
} from "../../../../server/tokens";

// POST /api/logout
export async function POST(): Promise<Response> {
  const cookieStore: Awaited<ReturnType<typeof cookies>> = await cookies();
  const raw: string | undefined = cookieStore.get(SESSION_COOKIE)?.value;

  if (raw !== undefined) {
    const userId: string | null = await rotateRefreshToken(raw);
    if (userId !== null) {
      await prisma.refreshToken.deleteMany({ where: { userId: userId } });
    }
  }

  cookieStore.set(SESSION_COOKIE, "", { ...SESSION_COOKIE_OPTIONS, maxAge: 0 });
  return Response.json({ ok: true });
}