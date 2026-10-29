import { createSignal } from "solid-js";
import PreviewMessage from "../fragments/PreviewMessage.tsx";
import { reveal } from "../../../../directives/reveal.ts";
import style from "../../../../../styles/components/dvibd/home/landing/Handoff.module.css";

const DEFAULT_DRAFT: string =
  "Just shipped the new feed layout and it feels so much calmer. Slow social done right. #dvibd";

function Handoff() {
  const [draft, setDraft] = createSignal<string>(DEFAULT_DRAFT);
  const [sent, setSent] = createSignal<boolean>(false);

  return (
    <section id={style.handoff}>
      <h2 id={style.handoffTitle} ref={reveal()}>
        <span id={style.handoffTitleStart}>A post becomes</span>
        <span id={style.handoffTitleEnd}>a message</span>
      </h2>
      <div id={style.draftField}>
        <label id={style.draftLabel} for={style.draftInput}>
          Your post
        </label>
        <p id={style.draftAuthor}>Aria Chen in Design Tokens</p>
        <textarea
          id={style.draftInput}
          rows={5}
          spellcheck={false}
          value={draft()}
          onInput={(event) => setDraft(event.currentTarget.value)}
        />
      </div>
      <div id={style.messageField}>
        <p id={style.messageLabel}>Message to Sofia Reyes</p>
        <div id={style.messagePanel} ref={reveal(1)}>
          <PreviewMessage
            text={draft()}
            sent={sent()}
            onSend={() => setSent(true)}
          />
        </div>
      </div>
    </section>
  );
}

export default Handoff;
