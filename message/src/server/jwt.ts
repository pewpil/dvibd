import { SignJWT, jwtVerify, type JWTPayload } from "jose";
import { config } from "./config";

export const SESSION_COOKIE: string = "message.session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
} as const;

const ACCESS_TOKEN_TTL_SECONDS: number = 15 * 60;
const REFRESH_TOKEN_TTL_MS: number = 30 * 24 * 60 * 60 * 1000;

export interface VerifiedRefreshToken {
  userId: string;
  jti: string;
}

export interface SignedRefreshToken {
  token: string;
  jti: string;
  expiresAt: Date;
}

function secretKey(): Uint8Array {
  return new TextEncoder().encode(config.jwtSecret);
}

export async function verifyToken(rawToken: string): Promise<JWTPayload | null> {
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

export async function issueAccessToken(userId: string): Promise<string> {
  return await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(Math.floor(Date.now() / 1000) + ACCESS_TOKEN_TTL_SECONDS)
    .sign(secretKey());
}

export async function signRefreshToken(
  userId: string,
): Promise<SignedRefreshToken> {
  const jti: string = crypto.randomUUID();
  const expiresAt: Date = new Date(Date.now() + REFRESH_TOKEN_TTL_MS);
  const token: string = await new SignJWT({})
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(userId)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(Math.floor(expiresAt.getTime() / 1000))
    .sign(secretKey());
  return { token: token, jti: jti, expiresAt: expiresAt };
}
