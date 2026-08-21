import { getCookie, setCookie } from "h3";
import { getRequestEvent } from "solid-js/web";
import { prisma } from "./db";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  issueAccessToken,
  issueRefreshToken,
  rotateRefreshToken,
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
  const userId: string | null = await rotateRefreshToken(raw);
  if (userId === null) {
    return null;
  }
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: USER_SELECT,
  });
  if (!user) {
    return null;
  }
  const accessToken: string = await issueAccessToken(userId);
  const refreshToken: string = await issueRefreshToken(userId);
  setCookie(
    event.nativeEvent,
    SESSION_COOKIE,
    refreshToken,
    SESSION_COOKIE_OPTIONS,
  );
  return { user: user, accessToken: accessToken };
}
