import type { APIEvent } from "@solidjs/start/server";
import { getCookie, setCookie } from "h3";
import {
  SESSION_COOKIE,
  SESSION_COOKIE_OPTIONS,
  issueAccessToken,
  issueRefreshToken,
  rotateRefreshToken,
} from "../../server/tokens";

// POST /refresh
export async function POST(event: APIEvent): Promise<Response> {
  const raw: string | undefined = getCookie(event.nativeEvent, SESSION_COOKIE);
  if (raw === undefined) {
    return Response.json(
      { error: "Invalid or expired refresh token." },
      { status: 401 },
    );
  }
  const userId: string | null = await rotateRefreshToken(raw);
  if (userId === null) {
    return Response.json(
      { error: "Invalid or expired refresh token." },
      { status: 401 },
    );
  }

  const accessToken: string = await issueAccessToken(userId);
  const refreshToken: string = await issueRefreshToken(userId);
  setCookie(event.nativeEvent, SESSION_COOKIE, refreshToken, SESSION_COOKIE_OPTIONS);

  return Response.json({ accessToken: accessToken });
}
