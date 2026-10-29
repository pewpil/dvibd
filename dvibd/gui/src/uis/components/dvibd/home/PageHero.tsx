import { For } from "solid-js";
import { reveal } from "../../../directives/reveal.ts";
import style from "../../../../styles/components/dvibd/home/PageHero.module.css";

interface PageHeroProps {
  lines: string[];
  lead: string;
  compact: boolean;
}

function PageHero(props: PageHeroProps) {
  return (
    <header
      id={style.pageHero}
      classList={{ [style.pageHeroCompact]: props.compact }}
    >
      <h1 id={style.pageHeroTitle} ref={reveal()}>
        <For each={props.lines}>
          {(line: string) => <span>{line}</span>}
        </For>
      </h1>
      <p id={style.pageHeroLead} ref={reveal(1)}>
        {props.lead}
      </p>
    </header>
  );
}

export default PageHero;
