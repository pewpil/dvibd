import { For } from "solid-js";
import type { ParentProps } from "solid-js";
import { reveal } from "../../../../directives/reveal.ts";
import style from "../../../../../styles/components/dvibd/home/products/ProductChapter.module.css";

interface ProductChapterProps extends ParentProps {
  name: string;
  tagline: string;
  paragraph: string;
  points: string[];
  actionLabel: string;
  actionHref: string;
  reverse: boolean;
}

function ProductChapter(props: ProductChapterProps) {
  return (
    <section
      id={style.chapter}
      classList={{ [style.chapterReverse]: props.reverse }}
    >
      <div id={style.chapterText}>
        <h2 id={style.chapterName} ref={reveal()}>
          {props.name}
        </h2>
        <p id={style.chapterTagline} ref={reveal(1)}>
          {props.tagline}
        </p>
        <p id={style.chapterParagraph} ref={reveal(1)}>
          {props.paragraph}
        </p>
        <ul id={style.chapterPoints}>
          <For each={props.points}>
            {(point: string) => <li>{point}</li>}
          </For>
        </ul>
        <a id={style.chapterAction} href={props.actionHref}>
          {props.actionLabel}
        </a>
      </div>
      <div id={style.chapterFragment} ref={reveal(2)}>
        {props.children}
      </div>
    </section>
  );
}

export default ProductChapter;
