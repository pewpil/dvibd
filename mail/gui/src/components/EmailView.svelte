<script lang="ts">
  import style from "../styles/components/EmailView.module.css";
  import Composer from "./Composer.svelte";
  import ThemeToggle from "./ThemeToggle.svelte";
  import { mail } from "../lib/mailService.svelte.ts";
  import { stuckHeader } from "../lib/stuckHeader.ts";
  import { currentUser } from "../lib/fallback.ts";
  import type { Contact, EmailMessage, Thread } from "../lib/types.ts";

  interface EmailViewProps {
    threadId: string;
    onBack(): void;
  }

  let { threadId, onBack }: EmailViewProps = $props();

  let thread: Thread | undefined = $derived(mail.thread(threadId));

  let stuck = $state(false);
  let inlineMode = $state<"reply" | "replyAll" | "forward" | null>(null);

  function applyStuck(value: boolean): void {
    stuck = value;
  }

  function handleStar(): void {
    mail.toggleStar(threadId);
  }

  function handleMove(folder: "archive" | "junk" | "trash"): void {
    mail.setFolder(threadId, folder);
    onBack();
  }

  function closeInline(): void {
    inlineMode = null;
  }

  function contactName(contact: Contact): string {
    return contact.id === currentUser.id ? "you" : contact.name;
  }

  function recipientsLine(message: EmailMessage): string {
    const to: string = message.to.map(contactName).join(", ");
    const cc: string = message.cc.map(contactName).join(", ");
    const base: string = `to ${to.length > 0 ? to : "no one"}`;
    return cc.length > 0 ? `${base}, cc ${cc}` : base;
  }
</script>

{#snippet actionGlyph(icon: string)}
  {#if icon === "star"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  {:else if icon === "reply"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M9 14 4 9l5-5" />
      <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
    </svg>
  {:else if icon === "replyAll"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m7 14-5-5 5-5" />
      <path d="m14 14-5-5 5-5" />
      <path d="M20 20v-7a4 4 0 0 0-4-4H2" />
    </svg>
  {:else if icon === "forward"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m15 14 5-5-5-5" />
      <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
    </svg>
  {:else if icon === "archive"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="5" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
    </svg>
  {:else if icon === "junk"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
      <path d="M12 9v4" />
      <path d="M12 17h.01" />
    </svg>
  {:else}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M3 6h18" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
    </svg>
  {/if}
{/snippet}

<section id={style.reading}>
  <header
    id={style.readBar}
    class={stuck ? style.stuck : ""}
    {@attach stuckHeader(applyStuck)}
  >
    <button type="button" id={style.backButton} onclick={onBack} aria-label="Back to list" title="Back to list">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <path d="m15 18-6-6 6-6" />
      </svg>
    </button>
    <button
      type="button"
      id={style.barAction}
      class={thread?.isStarred === true ? style.starred : ""}
      aria-pressed={thread?.isStarred === true}
      aria-label={thread?.isStarred === true ? "Remove star" : "Add star"}
      title={thread?.isStarred === true ? "Remove star" : "Add star"}
      onclick={handleStar}
    >
      {@render actionGlyph("star")}
    </button>
    <button type="button" id={style.barAction} aria-label="Reply" title="Reply" onclick={() => (inlineMode = "reply")}>
      {@render actionGlyph("reply")}
    </button>
    <button type="button" id={style.barAction} aria-label="Reply all" title="Reply all" onclick={() => (inlineMode = "replyAll")}>
      {@render actionGlyph("replyAll")}
    </button>
    <button type="button" id={style.barAction} aria-label="Forward" title="Forward" onclick={() => (inlineMode = "forward")}>
      {@render actionGlyph("forward")}
    </button>
    <span id={style.barSpacer}></span>
    <button type="button" id={style.barAction} aria-label="Archive" title="Archive" onclick={() => handleMove("archive")}>
      {@render actionGlyph("archive")}
    </button>
    <button type="button" id={style.barAction} aria-label="Mark as junk" title="Mark as junk" onclick={() => handleMove("junk")}>
      {@render actionGlyph("junk")}
    </button>
    <button type="button" id={style.barAction} class={style.danger} aria-label="Delete" title="Delete" onclick={() => handleMove("trash")}>
      {@render actionGlyph("delete")}
    </button>
    <ThemeToggle />
  </header>

  {#if thread !== undefined}
    <article id={style.threadCanvas}>
      <header id={style.subjectBlock}>
        <h3 id={style.mailSubject}>{thread.subject}</h3>
        {#if thread.labels.length > 0}
          <div id={style.labelChips}>
            {#each thread.labels as label (label.id)}
              <span id={style.labelChip} style:--label-color={label.color}>{label.name}</span>
            {/each}
          </div>
        {/if}
      </header>
      {#each thread.messages as message (message.id)}
        <article id={style.messageRow} class={`${message.isOutgoing ? `${style.outgoing} ` : ""}${message.isDraft ? style.draft : ""}`}>
          <header id={style.messageHead}>
            <img id={style.messageAvatar} src={message.sender.avatar} alt="" />
            <span id={style.messageWho}>
              {#if message.isDraft}
                <span id={style.draftChip}>Draft</span>
              {/if}
              <p id={style.messageFrom} class={message.isOutgoing ? style.own : ""}>
                {message.isOutgoing ? "You" : message.sender.name}
              </p>
              <p id={style.messageTo}>{recipientsLine(message)}</p>
            </span>
            <time id={style.messageTime}>{message.timestamp}</time>
          </header>
          <div id={style.messageBody}>
            {#each message.body as paragraph, index (index)}
              {#if paragraph.trim().length > 0}
                <p>{paragraph}</p>
              {/if}
            {/each}
            {#if message.quoted !== null}
              <blockquote id={style.messageQuote}>{message.quoted}</blockquote>
            {/if}
          </div>
          {#if message.attachments.length > 0}
            <div id={style.attachRow}>
              {#each message.attachments as file (file.id)}
                <span id={style.attachChip}>
                  <span id={style.attachExt}>{file.ext}</span>
                  <span id={style.attachName}>{file.name}</span>
                  <span id={style.attachSize}>{file.size}</span>
                </span>
              {/each}
            </div>
          {/if}
        </article>
      {/each}
      <footer id={style.replyRow}>
        {#if inlineMode === null}
          <button type="button" id={style.replyPrimary} onclick={() => (inlineMode = "reply")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M9 14 4 9l5-5" />
              <path d="M20 20v-7a4 4 0 0 0-4-4H4" />
            </svg>
            <span>Reply</span>
          </button>
          <button type="button" id={style.replyGhost} onclick={() => (inlineMode = "replyAll")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m7 14-5-5 5-5" />
              <path d="m14 14-5-5 5-5" />
              <path d="M20 20v-7a4 4 0 0 0-4-4H2" />
            </svg>
            <span>Reply all</span>
          </button>
          <button type="button" id={style.replyGhost} onclick={() => (inlineMode = "forward")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="m15 14 5-5-5-5" />
              <path d="M4 20v-7a4 4 0 0 1 4-4h12" />
            </svg>
            <span>Forward</span>
          </button>
        {:else}
          {#key inlineMode}
            <Composer
              mode={inlineMode}
              thread={thread}
              inline={true}
              onSent={closeInline}
              onDiscard={closeInline}
            />
          {/key}
        {/if}
      </footer>
    </article>
  {/if}
</section>
