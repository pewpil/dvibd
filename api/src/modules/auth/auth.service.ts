// modules/auth/auth.service.ts
// Business logic for authentication: password hashing, verification, and JWT tokens.

import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { db } from "../../db/client.ts";
import { users, type User } from "../../db/schema/users.ts";
import { eq } from "drizzle-orm";
import { HttpError } from "../../lib/http-error.ts";
import { env } from "../../config/env.ts";

const BCRYPT_ROUNDS: number = 12;

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, BCRYPT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hash: string,
): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

function generateAccessToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: "15m" });
}

function generateRefreshToken(userId: string): string {
  return jwt.sign({ sub: userId, type: "refresh" }, env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export async function register(
  email: string,
  username: string,
  password: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; username: string };
}> {
  const existing: User[] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    throw new HttpError(409, "A user with this email already exists");
  }

  const existingUsername: User[] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (existingUsername.length > 0) {
    throw new HttpError(409, "This username is already taken");
  }

  const passwordHash: string = await hashPassword(password);

  const result: { id: string; email: string; username: string }[] = await db
    .insert(users)
    .values({ email, username, passwordHash })
    .returning({ id: users.id, email: users.email, username: users.username });

  if (result.length === 0) {
    throw new HttpError(500, "Failed to create user");
  }

  const created: { id: string; email: string; username: string } = result[0]!;
  const accessToken: string = generateAccessToken(created.id);
  const refreshToken: string = generateRefreshToken(created.id);

  return { accessToken, refreshToken, user: created };
}

export async function login(
  email: string,
  password: string,
): Promise<{
  accessToken: string;
  refreshToken: string;
  user: { id: string; email: string; username: string };
}> {
  const result: User[] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  const user: User | undefined = result[0];
  if (!user) {
    throw new HttpError(401, "Invalid email or password");
  }

  const valid: boolean = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    throw new HttpError(401, "Invalid email or password");
  }

  const accessToken: string = generateAccessToken(user.id);
  const refreshToken: string = generateRefreshToken(user.id);

  return {
    accessToken,
    refreshToken,
    user: { id: user.id, email: user.email, username: user.username },
  };
}

export function verifyAccessToken(token: string): { sub: string } | null {
  try {
    return jwt.verify(token, env.JWT_SECRET) as { sub: string };
  } catch {
    return null;
  }
}

export function verifyRefreshToken(
  token: string,
): { sub: string; type: string } | null {
  try {
    const payload: { sub: string; type: string } = jwt.verify(
      token,
      env.JWT_SECRET,
    ) as { sub: string; type: string };
    if (payload.type !== "refresh") {
      return null;
    }
    return payload;
  } catch {
    return null;
  }
}
