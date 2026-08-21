import type { APIEvent } from "@solidjs/start/server";
import { setCookie } from "h3";
import { z } from "zod";
import { compare } from "bcrypt";
import { prisma } from "../../../server/db";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  issueAccessToken,
  issueRefreshToken,
} from "../../../server/tokens";
import { USER_SELECT, toSafeUser } from "../../../server/user";

const loginSchema = z
  .object({
    identifier: z.string().min(1),
    password: z.string().min(1),
  })
  .strict();

// POST /login
export async function POST(event: APIEvent): Promise<Response> {
  let body: unknown;
  try {
    body = await event.request.json();
  } catch {
    return Response.json({ error: "Invalid login payload." }, { status: 400 });
  }
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid login payload." }, { status: 400 });
  }

  const identifier: string = parsed.data.identifier.toLowerCase();
  const found = await prisma.user.findFirst({
    where: { OR: [{ username: identifier }, { email: identifier }] },
  });
  if (!found) {
    return Response.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const matches: boolean = await compare(parsed.data.password, found.passwordHash);
  if (!matches) {
    return Response.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const accessToken: string = await issueAccessToken(found.id);
  const refreshToken: string = await issueRefreshToken(found.id);
  setCookie(event.nativeEvent, SESSION_COOKIE, refreshToken, SESSION_COOKIE_OPTIONS);

  return Response.json({ user: toSafeUser(found), accessToken: accessToken });
}
