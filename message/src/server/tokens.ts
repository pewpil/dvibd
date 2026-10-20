import type { RefreshToken } from "./generated/client.mts";
import { prisma } from "./db";
import {
  signRefreshToken,
  verifyRefreshToken,
  type SignedRefreshToken,
  type VerifiedRefreshToken,
} from "./jwt";

export { SESSION_COOKIE, SESSION_COOKIE_OPTIONS, issueAccessToken } from "./jwt";
export type { VerifiedRefreshToken } from "./jwt";

export async function issueRefreshToken(userId: string): Promise<string> {
  const signed: SignedRefreshToken = await signRefreshToken(userId);
  await prisma.refreshToken.create({
    data: { jti: signed.jti, userId: userId, expiresAt: signed.expiresAt },
  });
  return signed.token;
}

export async function validateRefreshToken(
  rawToken: string,
): Promise<VerifiedRefreshToken | null> {
  const verified: VerifiedRefreshToken | null = await verifyRefreshToken(rawToken);
  if (verified === null) {
    return null;
  }
  const record: RefreshToken | null = await prisma.refreshToken.findUnique({
    where: { jti: verified.jti },
  });
  if (
    record === null ||
    record.userId !== verified.userId ||
    record.revokedAt !== null ||
    record.expiresAt <= new Date()
  ) {
    return null;
  }
  return { userId: record.userId, jti: record.jti };
}

export async function rotateRefreshToken(
  rawToken: string,
): Promise<string | null> {
  const verified: VerifiedRefreshToken | null = await validateRefreshToken(rawToken);
  if (verified === null) {
    return null;
  }
  await prisma.refreshToken.delete({ where: { jti: verified.jti } });
  return verified.userId;
}
