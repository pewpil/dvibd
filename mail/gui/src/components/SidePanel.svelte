<script lang="ts">
  import style from "../styles/components/SidePanel.module.css";
  import { mail } from "../lib/mailService.svelte.ts";
  import { currentUser, labelList } from "../lib/fallback.ts";
  import {
    FOLDERS,
    threadUnread,
    type FolderId,
    type Thread,
  } from "../lib/types.ts";

  interface SidePanelProps {
    activeFolder: string;
    panelMode: "navigation" | "account";
    onTogglePanelMode(): void;
    onSelectFolder(folderId: string): void;
    onCompose(): void;
  }

  let { activeFolder, panelMode, onTogglePanelMode, onSelectFolder, onCompose }:
    SidePanelProps = $props();

  interface AccountEntry {
    icon: string;
    label: string;
    danger: boolean;
  }

  const ACCOUNT_GROUPS: AccountEntry[][] = [
    [{ icon: "settings", label: "Settings", danger: false }],
    [
      { icon: "terms", label: "Terms", danger: false },
      { icon: "privacy", label: "Privacy", danger: false },
      { icon: "cookies", label: "Cookies", danger: false },
    ],
    [
      { icon: "about", label: "About", danger: false },
      { icon: "help", label: "Help", danger: false },
      { icon: "report", label: "Report a problem", danger: false },
    ],
    [{ icon: "logout", label: "Log out", danger: true }],
  ];

  let counts = $derived.by((): Partial<Record<FolderId, number>> => {
    const threads: Thread[] = mail.list();
    const next: Partial<Record<FolderId, number>> = {};
    const inbox = threads.filter(
      (thread: Thread): boolean =>
        thread.folder === "inbox" && threadUnread(thread) > 0,
    ).length;
    if (inbox > 0) {
      next.inbox = inbox;
    }
    const drafts = threads.filter(
      (thread: Thread): boolean => thread.folder === "drafts",
    ).length;
    if (drafts > 0) {
      next.drafts = drafts;
    }
    const starred = threads.filter(
      (thread: Thread): boolean =>
        thread.isStarred &&
        thread.folder !== "junk" &&
        thread.folder !== "trash" &&
        thread.folder !== "drafts",
    ).length;
    if (starred > 0) {
      next.starred = starred;
    }
    return next;
  });
</script>

{#snippet folderGlyph(folderId: string)}
  {#if folderId === "inbox"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M22 12h-6l-2 3h-4l-2-3H2" />
      <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
    </svg>
  {:else if folderId === "starred"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  {:else if folderId === "sent"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="m22 2-7 20-4-9-9-4Z" />
      <path d="M22 2 11 13" />
    </svg>
  {:else if folderId === "drafts"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  {:else if folderId === "archive"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <rect x="2" y="3" width="20" height="5" rx="1" />
      <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
      <path d="M10 12h4" />
    </svg>
  {:else if folderId === "junk"}
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

{#snippet accountGlyph(icon: string)}
  {#if icon === "settings"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 21v-7" />
      <path d="M4 10V3" />
      <path d="M12 21v-9" />
      <path d="M12 8V3" />
      <path d="M20 21v-5" />
      <path d="M20 12V3" />
      <path d="M1 14h6" />
      <path d="M9 8h6" />
      <path d="M17 16h6" />
    </svg>
  {:else if icon === "terms"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <path d="M14 2v6h6" />
      <path d="M16 13H8" />
      <path d="M16 17H8" />
    </svg>
  {:else if icon === "privacy"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  {:else if icon === "cookies"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M8 10h.01" />
      <path d="M12 8h.01" />
      <path d="M15 12h.01" />
      <path d="M10 15h.01" />
      <path d="M14 17h.01" />
    </svg>
  {:else if icon === "about"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  {:else if icon === "help"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
      <path d="M12 17h.01" />
    </svg>
  {:else if icon === "report"}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" />
      <path d="M4 22v-7" />
    </svg>
  {:else}
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="m16 17 5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  {/if}
{/snippet}

{#snippet composeGlyph()}
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
    <path d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.375 2.625a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4Z" />
  </svg>
{/snippet}

<nav id={style.sidePanel}>
  <button
    type="button"
    id={style.profileChip}    class={panelMode === "account" ? style.chipActive : ""}
    onclick={onTogglePanelMode}
    aria-pressed={panelMode === "account"}
    aria-label="Account"
    title="Account"
  >
    <img id={style.profileAvatar} src={currentUser.avatar} alt="" />
    <span id={style.chipMeta}>
      <span id={style.chipName}>{currentUser.name}</span>
      <span id={style.chipEmail}>{currentUser.email}</span>
    </span>
  </button>

  {#if panelMode === "navigation"}
    <button type="button" id={style.composeButton} onclick={onCompose}>
      {@render composeGlyph()}
      <span>Compose</span>
    </button>
    <ul id={style.folderList}>
      {#each FOLDERS as folder (folder.id)}
        <li>
          <button
            type="button"
            id={style.folderRow}
            class={activeFolder === folder.id ? style.rowActive : ""}
            aria-pressed={activeFolder === folder.id}
            onclick={() => onSelectFolder(folder.id)}
          >
            {@render folderGlyph(folder.id)}
            <span id={style.folderName}>{folder.name}</span>
            {#if counts[folder.id] !== undefined}
              <span id={style.folderCount} class={folder.id === "inbox" ? style.countAccent : ""}>
                {counts[folder.id]}
              </span>
            {/if}
          </button>
        </li>
      {/each}
    </ul>
    <h4 id={style.sideHeading}>Labels</h4>
    <ul id={style.labelList}>
      {#each labelList as label (label.id)}
        <li>
          <button
            type="button"
            id={style.labelRow}
            class={activeFolder === label.id ? style.rowActive : ""}
            aria-pressed={activeFolder === label.id}
            style:--label-color={label.color}
            onclick={() => onSelectFolder(label.id)}
          >
            <span id={style.labelDot}></span>
            <span id={style.labelName}>{label.name}</span>
          </button>
        </li>
      {/each}
    </ul>
  {:else}
    <header id={style.accountHead}>
      <img id={style.accountAvatar} src={currentUser.avatar} alt="Your profile" />
      <p id={style.accountName}>{currentUser.name}</p>
      <p id={style.accountEmail}>{currentUser.email}</p>
    </header>
    <ul id={style.accountGroups}>
      {#each ACCOUNT_GROUPS as group, groupIndex (groupIndex)}
        <li id={style.accountGroup}>
          <ul id={style.groupRows}>
            {#each group as entry (entry.label)}
              <li>
                <button type="button" id={style.accountRow} class={entry.danger ? style.rowDanger : ""}>
                  {@render accountGlyph(entry.icon)}
                  <span id={style.accountLabel}>{entry.label}</span>
                </button>
              </li>
            {/each}
          </ul>
        </li>
      {/each}
    </ul>
  {/if}
</nav>
