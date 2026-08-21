import { createMiddleware } from "@solidjs/start/middleware";
import { getCookie } from "h3";
import { getRequestEvent } from "solid-js/web";
import { SESSION_COOKIE, verifyRefreshToken } from "./server/tokens";

const PROTECTED_PATHS: string[] = [
  "/notifications",
  "/bookmarks",
  "/settings",
  "/profile",
];

const AUTH_PAGES: string[] = ["/login", "/signup"];

function redirectTo(path: string): Response {
  return new Response(null, { status: 302, headers: { Location: path } });
}

export default createMiddleware([
  async (event) => {
    const requestEvent = getRequestEvent();
    if (!requestEvent) {
      return;
    }
    const raw: string | undefined = getCookie(event, SESSION_COOKIE);
    const verified = raw === undefined ? null : await verifyRefreshToken(raw);
    requestEvent.locals.loggedIn = verified !== null;

    if (requestEvent.request.method !== "GET") {
      return;
    }
    const pathname: string = new URL(requestEvent.request.url).pathname;
    if (verified === null && PROTECTED_PATHS.includes(pathname)) {
      return redirectTo("/login");
    }
    if (verified !== null && AUTH_PAGES.includes(pathname)) {
      return redirectTo("/");
    }
  },
]);
