import { Hono } from "@hono/hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "@zod/zod";
import { compare, genSalt, hash } from "jsr:@da/bcrypt@1.0.1";
import { Prisma } from "../../orm/generated/prisma/client.mts";
import { prisma } from "../db.ts";

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

function isUniqueViolation(error: unknown): boolean {
  return (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === "P2002"
  );
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

const router: Hono = new Hono();

// POST /auth/signup
router.post("/signup", signupValidator, async (c) => {
  const body = c.req.valid("json");

  const username = body.username.toLowerCase();
  const email = body.email.toLowerCase();

  const salt = await genSalt();
  const passwordHash = await hash(body.password, salt);

  try {
    const user = await prisma.user.create({
      data: { username, email, passwordHash },
      select: { id: true, username: true, email: true, createdAt: true },
    });
    return c.json(user, 201);
  } catch (error) {
    if (isUniqueViolation(error)) {
      return c.json({ error: "Username or email already taken." }, 409);
    }
    throw error;
  }
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

  return c.json({
    id: found.id,
    username: found.username,
    email: found.email,
  });
});

export default router;
