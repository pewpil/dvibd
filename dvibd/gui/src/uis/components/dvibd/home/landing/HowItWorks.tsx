import { For, Show } from "solid-js";
import AccountCard from "../fragments/AccountCard.tsx";
import { reveal } from "../../../../directives/reveal.ts";
import style from "../../../../../styles/components/dvibd/home/landing/HowItWorks.module.css";

interface HowField {
  context: string;
  clause: string;
}

const FIELDS: HowField[] = [
  { context: "On Social and Message", clause: "Your profile, set once." },
  {
    context: "Member of Design Tokens and Indie Hacking",
    clause: "Your communities, carried over.",
  },
  {
    context: "Posted in Design Tokens",
    clause: "Your posts, signed the same way.",
  },
  {
    context: "In a group with Sofia Reyes and Marcus Lee",
    clause: "Your messages, from the same person.",
  },
];

function HowItWorks() {
  return (
    <section id={style.howItWorks}>
      <For each={FIELDS}>
        {(field: HowField, index) => (
          <article
            classList={{
              [style.fieldOne]: index() === 0,
              [style.fieldTwo]: index() === 1,
              [style.fieldThree]: index() === 2,
              [style.fieldFour]: index() === 3,
            }}
          >
            <Show when={index() === 0}>
              <h2 id={style.howItWorksTitle} ref={reveal()}>
                One account, four places
              </h2>
            </Show>
            <p ref={reveal(1)}>{field.clause}</p>
            <div>
              <AccountCard context={field.context} />
            </div>
          </article>
        )}
      </For>
    </section>
  );
}

export default HowItWorks;
