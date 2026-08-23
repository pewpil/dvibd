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

export async function readSession(): Promise<SessionPayload | null> {
  const event = getRequestEvent();
  if (!event) {
    throw new Error("Session must be read within a request");
  }
  const raw: string | undefined = getCookie(event.nativeEvent, SESSION_COOKIE);
  if (raw === undefined) {
    return null;
  }
  const verified: VerifiedRefreshToken | null = await validateRefreshToken(raw);
  if (verified === null) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { id: verified.userId },
    select: USER_SELECT,
  });
  if (!user) {
    return null;
  }
  const accessToken: string = await issueAccessToken(verified.userId);
  return { user: user, accessToken: accessToken };
}
