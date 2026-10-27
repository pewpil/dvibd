import { A } from "@solidjs/router";
import type { RouteDefinition } from "@solidjs/router";
import type { JSX } from "solid-js";
import { getRequestEvent, isServer } from "solid-js/web";
import style from "../styles/pages/notFound.module.css";

export const route: RouteDefinition = {
  preload: (): void => {
    if (!isServer) {
      return;
    }
    const event = getRequestEvent();
    if (event !== undefined) {
      event.response.status = 404;
    }
  },
};

export default function NotFound(): JSX.Element {
  return (
    <main id={style.notFoundPage}>
      <p id={style.notFoundKicker}>404</p>
      <h1 id={style.notFoundTitle}>Page not found</h1>
      <p id={style.notFoundText}>
        The link may be broken or the page may have moved.
      </p>
      <A href="/" id={style.notFoundLink}>
        Back to home
      </A>
    </main>
  );
}
