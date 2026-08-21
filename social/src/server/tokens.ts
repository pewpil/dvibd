import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import type { RefreshToken } from "./generated/client.mts";
import { config } from "./config";
import { prisma } from "./db";

export const SESSION_COOKIE: string = "social.session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: import.meta.env.PROD,
  path: "/",
} as const;

const ACCESS_TOKEN_TTL_SECONDS: number = 15 * 60;
const REFRESH_TOKEN_TTL_MS: number = 30 * 24 * 60 * 60 * 1000;

export interface VerifiedRefreshToken {
  userId: string;
  jti: string;
}

function secretKey(): Uint8Array {
  return new TextEncoder().encode(config.jwtSecret);
}

async function verifyToken(rawToken: string): Promise<JWTPayload | null> {
  try {
    const { payload }: { payload: JWTPayload } = await jwtVerify(
      rawToken,
      secretKey(),
      { algorithms: ["HS256"] },
    );
    return payload;
  } catch {
    return null;
  }
}

export async function issueAccessToken(userId: string): Promise<string> {
  return await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS)
    .sign(secretKey());
}

export async function issueRefreshToken(userId: string): Promise<string> {
  const jti: string = crypto.randomUUID();
  const expiresAt: Date = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  const token: string = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(secretKey());
  await prisma.refreshToken.create({
    data: { jti: jti, userId: userId, expiresAt: expiresAt },
  });
  return token;
}

export async function verifyRefreshToken(
  rawToken: string,
): Promise<VerifiedRefreshToken | null> {
  const payload: JWTPayload | null = await verifyToken(rawToken);
  if (
    payload === null ||
    typeof payload.sub !== "string" ||
    typeof payload.jti !== "string"
  ) {
    return null;
  }
  return { userId: payload.sub, jti: payload.jti };
}

export async function verifyAccessToken(rawToken: string): Promise<string | null> {
  const payload: JWTPayload | null = await verifyToken(rawToken);
  if (payload === null || typeof payload.sub !== "string") {
    return null;
  }
  return payload.sub;
}

export async function rotateRefreshToken(rawToken: string): Promise<string | null> {
  const payload: JWTPayload | null = await verifyToken(rawToken);
  if (
    payload === null ||
    typeof payload.sub !== "string" ||
    typeof payload.jti !== "string"
  ) {
    return null;
  }
  const record: RefreshToken | null = await prisma.refreshToken.findUnique({
    where: { jti: payload.jti },
  });
  if (
    record === null ||
    record.userId !== payload.sub ||
    record.revokedAt !== null ||
    record.expiresAt <= new Date()
  ) {
    return null;
  }
  await prisma.refreshToken.delete({ where: { id: record.id } });
  return record.userId;
}
