"use server";

import { deleteCookie, getCookie, setCookie } from "h3";
import { getRequestEvent } from "solid-js/web";

const SESSION_COOKIE = "social.session";

function getEvent() {
  const event = getRequestEvent();
  if (!event) {
    throw new Error("Session functions must run within a request");
  }
  return event.nativeEvent;
}

export function getAuthState(_key?: number): boolean {
  return Boolean(getCookie(getEvent(), SESSION_COOKIE));
}

export function login(): void {
  setCookie(getEvent(), SESSION_COOKIE, "mock-session-token", {
    httpOnly: true,
    sameSite: "lax",
    secure: import.meta.env.PROD,
    path: "/",
  });
}

export function logout(): void {
  deleteCookie(getEvent(), SESSION_COOKIE, { path: "/" });
}
