import { Hono } from "@hono/hono";
import { jwt, sign, verify } from "@hono/hono/jwt";
import { zValidator } from "@hono/zod-validator";
import { z } from "@zod/zod";
import { compare, genSalt, hash } from "jsr:@da/bcrypt@1.0.1";
import { Prisma } from "../../orm/generated/prisma/client.mts";
import { config } from "../config.ts";
import { prisma } from "../db.ts";

const ACCESS_TOKEN_TTL_SECONDS = 15 * 60;
const REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

const signupSchema = z
  .object({
    username: z.string().min(3),
    email: z.email(),
    password: z.string().min(8),
  })
  .strict();

const loginSchema = z
  .object({
    identifier: z.string().min(1),
    password: z.string().min(1),
  })
  .strict();

const refreshSchema = z
  .object({
    refreshToken: z.string().min(1),
  })
  .strict();

const logoutSchema = z
  .object({
    refreshToken: z.string().min(1),
  })
  .strict();

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
}

function issueAccessToken(userId: string): Promise<string> {
  return sign(
    {
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS,
    },
    config.jwtSecret,
  );
}

async function issueRefreshToken(userId: string): Promise<string> {
  const jti = crypto.randomUUID();
  const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  const token = await sign(
    {
      sub: userId,
      jti,
      exp: Math.floor(expiresAt.getTime() / 1000),
    },
    config.jwtSecret,
  );
  await prisma.refreshToken.create({
    data: { jti, userId, expiresAt },
  });
  return token;
}

async function rotateRefreshToken(rawToken: string): Promise<string | null> {
  let payload: { sub?: string; jti?: string };
  try {
    payload = (await verify(rawToken, config.jwtSecret, "HS256")) as {
      sub?: string;
      jti?: string;
    };
  } catch {
    return null;
  }
  if (!payload.sub || !payload.jti) {
    return null;
  }
  const record = await prisma.refreshToken.findUnique({
    where: { jti: payload.jti },
  });
  if (
    !record ||
    record.userId !== payload.sub ||
    record.revokedAt !== null ||
    record.expiresAt <= new Date()
  ) {
    return null;
  }
  await prisma.refreshToken.delete({ where: { id: record.id } });
  return record.userId;
}

const signupValidator = zValidator("json", signupSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: "Invalid signup payload." }, 400);
  }
});

const loginValidator = zValidator("json", loginSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: "Invalid login payload." }, 400);
  }
});

const refreshValidator = zValidator("json", refreshSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: "Invalid refresh token." }, 400);
  }
});

const logoutValidator = zValidator("json", logoutSchema, (result, c) => {
  if (!result.success) {
    return c.json({ error: "Invalid refresh token." }, 400);
  }
});

const router: Hono<{ Variables: { jwtPayload: { sub?: string } } }> = new Hono();

// POST /auth/signup
router.post("/signup", signupValidator, async (c) => {
  const body = c.req.valid("json");

  const username = body.username.toLowerCase();
  const email = body.email.toLowerCase();

  const salt = await genSalt();
  const passwordHash = await hash(body.password, salt);

  let user: { id: string; username: string; email: string; createdAt: Date };
  try {
    user = await prisma.user.create({
      data: { username, email, passwordHash },
      select: { id: true, username: true, email: true, createdAt: true },
    });
  } catch (error) {
    if (isUniqueViolation(error)) {
      return c.json({ error: "Username or email already taken." }, 409);
    }
    throw error;
  }

  const accessToken = await issueAccessToken(user.id);

  return c.json(
    {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt,
      },
      accessToken,
      refreshToken: await issueRefreshToken(user.id),
    },
    201,
  );
});

// POST /auth/login
router.post("/login", loginValidator, async (c) => {
  const body = c.req.valid("json");

  const identifier = body.identifier.toLowerCase();

  const found = await prisma.user.findFirst({
    where: { OR: [{ username: identifier }, { email: identifier }] },
  });
  if (!found) {
    return c.json({ error: "Invalid credentials." }, 401);
  }

  const matches = await compare(body.password, found.passwordHash);
  if (!matches) {
    return c.json({ error: "Invalid credentials." }, 401);
  }

  const accessToken = await issueAccessToken(found.id);
  const refreshToken = await issueRefreshToken(found.id);

  return c.json({
    user: {
      id: found.id,
      username: found.username,
      email: found.email,
    },
    accessToken,
    refreshToken,
  });
});

// POST /auth/refresh
router.post("/refresh", refreshValidator, async (c) => {
  const body = c.req.valid("json");

  const userId = await rotateRefreshToken(body.refreshToken);
  if (userId === null) {
    return c.json({ error: "Invalid or expired refresh token." }, 401);
  }

  const accessToken = await issueAccessToken(userId);
  const refreshToken = await issueRefreshToken(userId);

  return c.json({
    accessToken,
    refreshToken,
  });
});

// POST /auth/logout
router.post("/logout", logoutValidator, async (c) => {
  const body = c.req.valid("json");

  let payload: { jti?: string };
  try {
    payload = (await verify(body.refreshToken, config.jwtSecret, "HS256")) as {
      jti?: string;
    };
  } catch {
    return c.json({ message: "Logged out." });
  }
  if (payload.jti) {
    await prisma.refreshToken.deleteMany({ where: { jti: payload.jti } });
  }

  return c.json({ message: "Logged out." });
});

// GET /auth/me
router.get(
  "/me",
  jwt({ secret: config.jwtSecret, alg: "HS256" }),
  async (c) => {
    const payload = c.get("jwtPayload") as { sub?: string };
    if (!payload.sub) {
      return c.json({ error: "Invalid token." }, 401);
    }
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, username: true, email: true, createdAt: true },
    });
    if (!user) {
      return c.json({ error: "User not found." }, 404);
    }
    return c.json({ user });
  },
);

export default router;
