import type { APIEvent } from "@solidjs/start/server";
import { deleteCookie, getCookie } from "h3";
import {
  SESSION_COOKIE,
  verifyRefreshToken,
  type VerifiedRefreshToken,
} from "../../server/tokens";
import { prisma } from "../../server/db";

// POST /logout
export async function POST(event: APIEvent): Promise<Response> {
  const raw: string | undefined = getCookie(event.nativeEvent, SESSION_COOKIE);
  if (raw !== undefined) {
    const verified: VerifiedRefreshToken | null = await verifyRefreshToken(raw);
    if (verified !== null) {
      await prisma.refreshToken.deleteMany({ where: { jti: verified.jti } });
    }
  }
  deleteCookie(event.nativeEvent, SESSION_COOKIE, { path: "/" });

  return Response.json({ message: "Logged out." });
}
