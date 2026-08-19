import { createMiddleware } from "@solidjs/start/middleware";
import { getCookie } from "h3";
import { getRequestEvent } from "solid-js/web";

const SESSION_COOKIE = "social.session";

export default createMiddleware([
  (event) => {
    const requestEvent = getRequestEvent();
    if (!requestEvent) {
      return;
    }
    requestEvent.locals.loggedIn = Boolean(getCookie(event, SESSION_COOKIE));
  },
]);
