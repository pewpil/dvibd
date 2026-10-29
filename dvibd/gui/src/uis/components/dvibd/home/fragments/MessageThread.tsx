import { For, Show } from "solid-js";
import messageMark from "../../../../../assets/components/dvibd/home/landing/product/message.svg";
import style from "../../../../../styles/components/dvibd/home/fragments/MessageThread.module.css";

interface ThreadMessage {
  from: string;
  body: string;
  direction: "in" | "out";
}

interface MessageThreadProps {
  title: string;
  handle: string;
  subtitle: string;
  messages: ThreadMessage[];
  composerPlaceholder: string;
  showSender: boolean;
}

function MessageThread(props: MessageThreadProps) {
  return (
    <article id={style.thread} data-ui="true">
      <header id={style.header}>
        <img src={messageMark} alt="" width="64" height="64" />
        <span id={style.headings}>
          <span id={style.titleRow}>
            <span id={style.title}>{props.title}</span>
            <span id={style.handle}>{props.handle}</span>
          </span>
          <span id={style.subtitle}>{props.subtitle}</span>
        </span>
      </header>
      <ul id={style.messages}>
        <For each={props.messages}>
          {(message: ThreadMessage) => (
            <li
              classList={{
                [style.received]: message.direction === "in",
                [style.sent]: message.direction === "out",
              }}
            >
              <Show when={props.showSender && message.direction === "in"}>
                <span>{message.from}</span>
              </Show>
              <p>{message.body}</p>
            </li>
          )}
        </For>
      </ul>
      <div id={style.composer}>
        <p id={style.composerPlaceholder}>{props.composerPlaceholder}</p>
        <span id={style.send} role="img" aria-label="Send message">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M4 12h13M12 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
    </article>
  );
}

export default MessageThread;
