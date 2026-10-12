import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, validateRefreshToken } from "./server/tokens";

const AUTH_PAGES: string[] = ["/login", "/signup"];
const AUTH_ENDPOINTS: string[] = [
  "/api/login",
  "/api/signup",
  "/api/session",
  "/api/logout",
];

function isPublic(pathname: string): boolean {
  return AUTH_PAGES.includes(pathname) || AUTH_ENDPOINTS.includes(pathname);
}

function redirectTo(pathname: string, request: NextRequest): NextResponse {
  const target: URL = new URL(pathname, request.url);
  if (pathname === "/login") {
    const from: string = request.nextUrl.pathname;
    if (from !== "/" && !AUTH_PAGES.includes(from)) {
      target.searchParams.set("from", from);
    }
  }
  return NextResponse.redirect(target);
}

export async function proxy(request: NextRequest): Promise<NextResponse> {
  const raw: string | undefined = request.cookies.get(SESSION_COOKIE)?.value;
  const authenticated: boolean =
    raw !== undefined && (await validateRefreshToken(raw)) !== null;

  const pathname: string = request.nextUrl.pathname;

  if (!authenticated && !isPublic(pathname)) {
    return redirectTo("/login", request);
  }
  if (authenticated && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next|favicon.ico|profile-picture.svg|fonts).*)"],
};