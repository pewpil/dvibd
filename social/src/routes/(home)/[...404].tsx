import { A } from "@solidjs/router";
import type { JSX } from "solid-js";
import FeedHeader from "../../components/(home)/FeedHeader";
import style from "../../styles/pages/(home)/notFound.module.css";

export default function NotFound(): JSX.Element {
  return [
    <FeedHeader>
      <h1 id={style.notFoundTitle}>Page not found</h1>
    </FeedHeader>,
    <section id={style.notFound}>
      <h2 id={style.notFoundHeading}>This page doesn't exist</h2>
      <p id={style.notFoundText}>
        The link may be broken or the page may have moved.
      </p>
      <A href="/" id={style.notFoundLink}>
        Back to home
      </A>
    </section>,
  ];
}
