import { Hono } from "@hono/hono";
import { compare, genSalt, hash } from "jsr:@da/bcrypt@1.0.1";

type User = {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

type SignupBody = {
  username: string;
  email: string;
  password: string;
};

type LoginBody = {
  identifier: string;
  password: string;
};

const users = new Map<string, User>();

function isValidSignupBody(body: unknown): body is SignupBody {
  if (typeof body !== "object" || body === null) return false;
  const candidate = body as Record<string, unknown>;
  return (
    typeof candidate["username"] === "string" &&
    candidate["username"].length >= 3 &&
    typeof candidate["email"] === "string" &&
    candidate["email"].includes("@") &&
    typeof candidate["password"] === "string" &&
    candidate["password"].length >= 8
  );
}

function isValidLoginBody(body: unknown): body is LoginBody {
  if (typeof body !== "object" || body === null) return false;
  const candidate = body as Record<string, unknown>;
  return (
    typeof candidate["identifier"] === "string" &&
    candidate["identifier"].length > 0 &&
    typeof candidate["password"] === "string" &&
    candidate["password"].length > 0
  );
}

const router: Hono = new Hono();

router.post("/signup", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!isValidSignupBody(body)) {
    return c.json({ error: "Invalid signup payload." }, 400);
  }

  const username = body.username.toLowerCase();
  const email = body.email.toLowerCase();

  for (const user of users.values()) {
    if (user.username === username || user.email === email) {
      return c.json({ error: "Username or email already taken." }, 409);
    }
  }

  const salt = await genSalt();
  const passwordHash = await hash(body.password, salt);
  const user: User = {
    id: crypto.randomUUID(),
    username,
    email,
    passwordHash,
    createdAt: new Date().toISOString(),
  };
  users.set(user.id, user);

  return c.json(
    {
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt,
    },
    201,
  );
});

router.post("/login", async (c) => {
  const body = await c.req.json().catch(() => null);
  if (!isValidLoginBody(body)) {
    return c.json({ error: "Invalid login payload." }, 400);
  }

  const identifier = body.identifier.toLowerCase();
  let found: User | undefined;
  for (const user of users.values()) {
    if (user.username === identifier || user.email === identifier) {
      found = user;
      break;
    }
  }
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
