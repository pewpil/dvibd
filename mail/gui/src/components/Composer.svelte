<script lang="ts">
  import style from "../styles/components/Composer.module.css";
  import { mail } from "../lib/mailService.svelte.ts";
  import { currentUser } from "../lib/fallback.ts";
  import type {
    ComposeFields,
    ComposeMode,
    Contact,
    EmailMessage,
    Thread,
  } from "../lib/types.ts";

  interface ComposerProps {
    mode: ComposeMode;
    thread?: Thread | null;
    draft?: Thread | null;
    inline?: boolean;
    onSent(): void;
    onSaved?(): void;
    onDiscard?(): void;
  }

  let { mode, thread = null, draft = null, inline = false, onSent, onSaved, onDiscard }:
    ComposerProps = $props();

  let fields = $state<ComposeFields>(initialFields());

  let error = $state<string | null>(null);

  let heading: string = $derived(draft !== null ? "Draft" : "New email");

  function joinAddresses(contacts: Contact[]): string {
    return contacts.map((contact: Contact): string => contact.email).join(", ");
  }

  function dedupe(contacts: Contact[]): Contact[] {
    const seen: string[] = [];
    return contacts.filter((contact: Contact): boolean => {
      if (seen.includes(contact.email)) {
        return false;
      }
      seen.push(contact.email);
      return true;
    });
  }

  function quoteOf(message: EmailMessage): string {
    const author: string = message.isOutgoing ? "you" : message.sender.name;
    const lines: string = message.body
      .filter((line: string): boolean => line.trim().length > 0)
      .join("\n");
    return `On ${message.timestamp}, ${author} wrote:\n${lines}`;
  }

  function initialFields(): ComposeFields {
    if (draft !== null) {
      const draftMessage: EmailMessage | undefined = draft.messages[0];
      if (draftMessage !== undefined) {
        return {
          to: joinAddresses(draftMessage.to),
          cc: joinAddresses(draftMessage.cc),
          subject: draft.subject,
          body: draftMessage.body.join("\n"),
          quoted: null,
        };
      }
    }
    if (thread === null || mode === "new") {
      return { to: "", cc: "", subject: "", body: "", quoted: null };
    }
    const last: EmailMessage | undefined = thread.messages[thread.messages.length - 1];
    if (last === undefined) {
      return { to: "", cc: "", subject: "", body: "", quoted: null };
    }
    if (mode === "forward") {
      return {
        to: "",
        cc: "",
        subject: `Fwd: ${thread.subject}`,
        body: "",
        quoted: quoteOf(last),
      };
    }
    const self: string = currentUser.email;
    if (mode === "reply") {
      return {
        to: last.isOutgoing ? joinAddresses(dedupe(last.to)) : last.sender.email,
        cc: "",
        subject: `Re: ${thread.subject}`,
        body: "",
        quoted: quoteOf(last),
      };
    }
    return {
      to: joinAddresses(dedupe([last.sender, ...last.to].filter(
        (contact: Contact): boolean => contact.email !== self,
      ))),
      cc: joinAddresses(dedupe(last.cc.filter(
        (contact: Contact): boolean => contact.email !== self,
      ))),
      subject: `Re: ${thread.subject}`,
      body: "",
      quoted: quoteOf(last),
    };
  }

  function handleSubmit(event: SubmitEvent): void {
    event.preventDefault();
    const to: string = fields.to.trim();
    if (to.length === 0) {
      error = "Add at least one recipient.";
      return;
    }
    if (fields.body.trim().length === 0) {
      error = "Write something before sending.";
      return;
    }
    error = null;
    const payload: ComposeFields = {
      to,
      cc: fields.cc.trim(),
      subject: fields.subject.trim(),
      body: fields.body,
      quoted: fields.quoted,
    };
    if (mode === "new") {
      if (draft !== null) {
        mail.deleteThread(draft.id);
      }
      mail.sendNew(payload);
    } else if (thread !== null) {
      mail.sendReply(thread.id, payload);
    }
    onSent();
  }

  function handleSave(): void {
    mail.saveDraft(
      {
        to: fields.to.trim(),
        cc: fields.cc.trim(),
        subject: fields.subject.trim(),
        body: fields.body,
        quoted: fields.quoted,
      },
      draft?.id ?? null,
    );
    onSaved?.();
  }

  function handleDiscard(): void {
    onDiscard?.();
  }
</script>

<form id={style.composer} class={inline ? style.inline : ""} onsubmit={handleSubmit}>
  {#if !inline}
    <h3 id={style.composeTitle}>{heading}</h3>
  {/if}
  <label id={style.fieldRow}>
    <span id={style.fieldLabel}>To</span>
    <input
      id={style.fieldInput}
      type="text"
      bind:value={fields.to}
      placeholder="name@example.com"
      autocomplete="off"
      spellcheck="false"
    />
  </label>
  <label id={style.fieldRow}>
    <span id={style.fieldLabel}>Cc</span>
    <input
      id={style.fieldInput}
      type="text"
      bind:value={fields.cc}
      placeholder="name@example.com"
      autocomplete="off"
      spellcheck="false"
    />
  </label>
  <label id={style.fieldRow}>
    <span id={style.fieldLabel}>Subject</span>
    <input
      id={style.fieldInput}
      type="text"
      bind:value={fields.subject}
      placeholder="Subject"
    />
  </label>
  {#if fields.quoted !== null}
    <blockquote id={style.quoteBlock}>{fields.quoted}</blockquote>
  {/if}
  <textarea
    id={style.bodyInput}
    bind:value={fields.body}
    placeholder="Write your message"
    aria-label="Message body"
    rows="6"
  ></textarea>
  {#if error !== null}
    <p id={style.composeError} role="alert">{error}</p>
  {/if}
  <div id={style.actionRow}>
    <button type="submit" id={style.sendButton}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m22 2-7 20-4-9-9-4Z" />
        <path d="M22 2 11 13" />
      </svg>
      <span>Send</span>
    </button>
    {#if mode === "new"}
      <button type="button" id={style.ghostButton} onclick={handleSave}>
        <span>Save draft</span>
      </button>
    {/if}
    <button type="button" id={style.discardButton} onclick={handleDiscard}>
      <span>Discard</span>
    </button>
  </div>
</form>
