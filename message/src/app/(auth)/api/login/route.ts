import { cookies } from "next/headers";
import { z } from "zod";
import { compare } from "bcrypt";
import { prisma } from "../../../../server/db";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  issueAccessToken,
  issueRefreshToken,
} from "../../../../server/tokens";
import { toSafeUser } from "../../../../server/user";

const loginSchema = z
  .object({
    identifier: z.string().min(1),
    password: z.string().min(1),
  })
  .strict();

function fail(message: string, status: number): Response {
  return Response.json({ error: message }, { status: status });
}

// POST /api/login
export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid login payload.", 400);
  }
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Invalid login payload.", 400);
  }

  const identifier: string = parsed.data.identifier.toLowerCase();
  const found = await prisma.user.findFirst({
    where: { OR: [{ username: identifier }, { email: identifier }] },
  });
  if (!found) {
    return fail("Invalid credentials.", 401);
  }

  const matches: boolean = await compare(parsed.data.password, found.passwordHash);
  if (!matches) {
    return fail("Invalid credentials.", 401);
  }

  const accessToken: string = await issueAccessToken(found.id);
  const refreshToken: string = await issueRefreshToken(found.id);
  const cookieStore: Awaited<ReturnType<typeof cookies>> = await cookies();
  cookieStore.set(SESSION_COOKIE, refreshToken, SESSION_COOKIE_OPTIONS);

  return Response.json({ user: toSafeUser(found), accessToken: accessToken });
}