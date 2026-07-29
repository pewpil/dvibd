// lib/jwt.ts
// JWT token creation and verification utilities.

import { SignJWT, jwtVerify, type JWTPayload } from "jose";

import { env } from "../config/env.ts";

const secret: Uint8Array = new TextEncoder().encode(
  env.JWT_SECRET ?? "dev-secret-change-in-production",
);
const issuer: string = "dvibd-api";
const audience: string = "dvibd-gui";

export interface TokenPayload extends JWTPayload {
  id: string;
  email: string;
  username: string;
}

export async function createToken(user: TokenPayload): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setIssuer(issuer)
    .setAudience(audience)
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<TokenPayload> {
  const { payload }: { payload: JWTPayload } = await jwtVerify(token, secret, {
    issuer,
    audience,
  });
  return payload as TokenPayload;
}
