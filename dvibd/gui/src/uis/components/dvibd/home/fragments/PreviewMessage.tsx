import { Show } from "solid-js";
import messageMark from "../../../../../assets/components/dvibd/home/landing/product/message.svg";
import style from "../../../../../styles/components/dvibd/home/fragments/PreviewMessage.module.css";

interface PreviewMessageProps {
  text: string;
  sent: boolean;
  onSend(): void;
}

function PreviewMessage(props: PreviewMessageProps) {
  return (
    <div id={style.panel} data-ui="true">
      <header id={style.header}>
        <img src={messageMark} alt="" width="64" height="64" />
        <span id={style.headings}>
          <span id={style.title}>Sofia Reyes</span>
          <span id={style.subtitle}>Direct message</span>
        </span>
      </header>
      <p id={style.bubble}>{props.text}</p>
      <Show when={props.sent}>
        <p id={style.reply}>Sending this to the team.</p>
      </Show>
      <button
        id={style.send}
        type="button"
        disabled={props.sent}
        onClick={props.onSend}
      >
        Send to Sofia
      </button>
      <p id={style.status} role="status">
        {props.sent ? "Sent in this preview" : "Ready to send"}
      </p>
      <p id={style.note}>This is a preview. Nothing is sent from this page.</p>
    </div>
  );
}

export default PreviewMessage;
