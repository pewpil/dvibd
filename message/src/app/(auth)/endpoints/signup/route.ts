import { cookies } from "next/headers";
import { z } from "zod";
import { genSalt, hash } from "bcrypt";
import { Prisma } from "../../../../server/generated/client.mts";
import { prisma } from "../../../../server/db";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  issueAccessToken,
  issueRefreshToken,
} from "../../../../server/tokens";
import { USER_SELECT, type SafeUser } from "../../../../server/user";

const signupSchema = z
  .object({
    displayName: z.string().min(1).max(64),
    username: z.string().min(3).max(32),
    email: z.email(),
    password: z.string().min(8),
  })
  .strict();

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function fail(message: string, status: number): Response {
  return Response.json({ error: message }, { status: status });
}

// POST /signup
export async function POST(request: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return fail("Invalid signup payload.", 400);
  }
  const parsed = signupSchema.safeParse(body);
  if (!parsed.success) {
    return fail("Invalid signup payload.", 400);
  }

  const username: string = parsed.data.username.toLowerCase();
  const email: string = parsed.data.email.toLowerCase();

  const salt: string = await genSalt();
  const passwordHash: string = await hash(parsed.data.password, salt);

  let user: SafeUser;
  try {
    user = await prisma.user.create({
      data: {
        displayName: parsed.data.displayName,
        username: username,
        email: email,
        passwordHash: passwordHash,
      },
      select: USER_SELECT,
    });
  } catch (error: unknown) {
    if (isUniqueViolation(error)) {
      return fail("Username or email already taken.", 409);
    }
    throw error;
  }

  const accessToken: string = await issueAccessToken(user.id);
  const refreshToken: string = await issueRefreshToken(user.id);
  const cookieStore: Awaited<ReturnType<typeof cookies>> = await cookies();
  cookieStore.set(SESSION_COOKIE, refreshToken, SESSION_COOKIE_OPTIONS);

  return Response.json({ user: user, accessToken: accessToken }, { status: 201 });
}