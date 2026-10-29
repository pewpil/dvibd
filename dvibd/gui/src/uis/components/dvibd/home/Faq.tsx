import { createSignal, For, onCleanup, onMount, Show } from "solid-js";
import { reveal, staggerOrder } from "../../../directives/reveal.ts";
import style from "../../../../styles/components/dvibd/home/Faq.module.css";

export interface FaqItem {
  question: string;
  answer: string;
}

interface FaqProps {
  heading: string;
  items: FaqItem[];
}

function Faq(props: FaqProps) {
  const [selected, setSelected] = createSignal<number>(0);
  const [wide, setWide] = createSignal<boolean>(false);
  const questionButtons: HTMLButtonElement[] = [];

  onMount((): void => {
    const query: MediaQueryList = window.matchMedia("(min-width: 60rem)");
    const update = (): void => {
      setWide(query.matches);
    };
    update();
    query.addEventListener("change", update);
    onCleanup((): void => query.removeEventListener("change", update));
  });

  const focusQuestion = (index: number): void => {
    const target: HTMLButtonElement | undefined = questionButtons[index];
    if (target === undefined) {
      return;
    }
    target.focus();
    setSelected(index);
  };

  const handleKey = (event: KeyboardEvent, index: number): void => {
    const count: number = props.items.length;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      focusQuestion((index + 1) % count);
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      focusQuestion((index - 1 + count) % count);
    }
    if (event.key === "Home") {
      event.preventDefault();
      focusQuestion(0);
    }
    if (event.key === "End") {
      event.preventDefault();
      focusQuestion(count - 1);
    }
  };

  const answer = (): string => props.items[selected()]?.answer ?? "";

  return (
    <section id={style.faq}>
      <div id={style.faqIndex}>
        <h2 id={style.faqHeading} ref={reveal()}>
          {props.heading}
        </h2>
        <ul id={style.faqQuestions}>
          <For each={props.items}>
            {(item: FaqItem, index) => (
              <li ref={reveal(staggerOrder(index()))}>
                <button
                  classList={{
                    [style.faqQuestionActive]: selected() === index(),
                  }}
                  type="button"
                  aria-current={selected() === index() ? "true" : undefined}
                  aria-expanded={selected() === index()}
                  aria-controls={
                    wide() ? style.faqAnswer : style.faqInlineAnswer
                  }
                  ref={(element: HTMLButtonElement): void => {
                    questionButtons[index()] = element;
                  }}
                  onClick={() => setSelected(index())}
                  onMouseEnter={() => setSelected(index())}
                  onFocus={() => setSelected(index())}
                  onKeyDown={(event) => handleKey(event, index())}
                >
                  <span aria-hidden="true" />
                  <span>{item.question}</span>
                </button>
                <Show when={!wide() && selected() === index()}>
                  <p id={style.faqInlineAnswer}>{item.answer}</p>
                </Show>
              </li>
            )}
          </For>
        </ul>
      </div>
      <Show when={wide()}>
        <div id={style.faqAnswer} aria-live="polite">
          <p id={style.faqAnswerText}>{answer()}</p>
        </div>
      </Show>
    </section>
  );
}

export default Faq;
