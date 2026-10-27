import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifyRefreshToken } from "./server/jwt";

const AUTH_PAGES: string[] = ["/login", "/signup"];
const API_PREFIX: string = "/api/";

function isPublicPage(pathname: string): boolean {
  return AUTH_PAGES.includes(pathname);
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
  const pathname: string = request.nextUrl.pathname;

  if (pathname === "/api" || pathname.startsWith(API_PREFIX)) {
    return NextResponse.next();
  }

  const raw: string | undefined = request.cookies.get(SESSION_COOKIE)?.value;
  const authenticated: boolean =
    raw !== undefined && (await verifyRefreshToken(raw)) !== null;

  if (!authenticated && !isPublicPage(pathname)) {
    return redirectTo("/login", request);
  }
  if (authenticated && AUTH_PAGES.includes(pathname)) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|favicon.ico|icon.svg|profile-picture.svg|community-core.svg|community-design.svg|community-engineering.svg|community-lounge.svg|community-profile.svg|fonts).*)",
  ],
};
