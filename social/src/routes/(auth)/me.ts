import type { APIEvent } from "@solidjs/start/server";
import { verifyAccessToken } from "../../server/tokens";
import { prisma } from "../../server/db";
import { USER_SELECT } from "../../server/user";

// GET /me
export async function GET(event: APIEvent): Promise<Response> {
  const authorization: string | null = event.request.headers.get("authorization");
  if (authorization === null || !authorization.startsWith("Bearer ")) {
    return Response.json({ error: "Invalid token." }, { status: 401 });
  }
  const userId: string | null = await verifyAccessToken(authorization.slice(7));
  if (userId === null) {
    return Response.json({ error: "Invalid token." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_SELECT,
  });
  if (!user) {
    return Response.json({ error: "User not found." }, { status: 404 });
  }

  return Response.json(user);
}
