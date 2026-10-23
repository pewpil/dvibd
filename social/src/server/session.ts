import { getCookie } from "h3";
import { getRequestEvent } from "solid-js/web";
import { prisma } from "./db";
import {
  SESSION_COOKIE,
  issueAccessToken,
  validateRefreshToken,
  type VerifiedRefreshToken,
} from "./tokens";
import { USER_SELECT, type SafeUser } from "./user";

export interface SessionPayload {
  user: SafeUser;
  accessToken: string;
}

function sessionCookie(): string | undefined {
  const event = getRequestEvent();
  if (!event) {
    throw new Error("Session must be read within a request");
  }
  return getCookie(event.nativeEvent, SESSION_COOKIE);
}

export async function readSessionUser(): Promise<SafeUser | null> {
  const raw: string | undefined = sessionCookie();
  if (raw === undefined) {
    return null;
  }
  const verified: VerifiedRefreshToken | null = await validateRefreshToken(raw);
  if (verified === null) {
    return null;
  }
  return await prisma.user.findUnique({
    where: { id: verified.userId },
    select: USER_SELECT,
  });
}

export async function readSession(): Promise<SessionPayload | null> {
  const user: SafeUser | null = await readSessionUser();
  if (user === null) {
    return null;
  }
  const accessToken: string = await issueAccessToken(user.id);
  return { user: user, accessToken: accessToken };
}
