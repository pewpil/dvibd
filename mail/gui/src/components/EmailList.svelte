<script lang="ts">
  import style from "../styles/components/EmailList.module.css";
  import { mail } from "../lib/mailService.svelte.ts";
  import { readScroll, writeScroll } from "../lib/listScroll.ts";
  import { stuckHeader } from "../lib/stuckHeader.ts";
  import { labelList } from "../lib/fallback.ts";
  import {
    FOLDERS,
    TABS,
    threadHasAttachments,
    threadTouchesLabel,
    threadUnread,
    type EmailMessage,
    type EmailTab,
    type Thread,
  } from "../lib/types.ts";

  interface EmailListProps {
    activeFolder: string;
    onOpenThread(threadId: string): void;
    onSelectFolder(folderId: string): void;
  }

  let { activeFolder, onOpenThread, onSelectFolder }: EmailListProps = $props();

  let query = $state("");
  let activeTab = $state<EmailTab>("all");
  let stuck = $state(false);

  let title = $derived.by((): string => {
    const folder = FOLDERS.find(
      (item): boolean => item.id === activeFolder,
    );
    if (folder !== undefined) {
      return folder.name;
    }
    const label = labelList.find((item): boolean => item.id === activeFolder);
    return label?.name ?? "Mail";
  });

  let labelColor = $derived.by((): string | null => {
    const label = labelList.find((item): boolean => item.id === activeFolder);
    return label?.color ?? null;
  });

  let scope = $derived.by((): Thread[] => {
    const threads: Thread[] = mail.list();
    const isFolder: boolean = FOLDERS.some(
      (item): boolean => item.id === activeFolder,
    );
    if (!isFolder) {
      return threads.filter((thread: Thread): boolean =>
        threadTouchesLabel(thread, activeFolder),
      );
    }
    if (activeFolder === "starred") {
      return threads.filter(
        (thread: Thread): boolean =>
          thread.isStarred &&
          thread.folder !== "junk" &&
          thread.folder !== "trash" &&
          thread.folder !== "drafts",
      );
    }
    return threads.filter(
      (thread: Thread): boolean => thread.folder === activeFolder,
    );
  });

  let filtering = $derived(query.trim().length > 0 || activeTab !== "all");

  let visible = $derived.by((): Thread[] => {
    const needle: string = query.trim().toLowerCase();
    return scope.filter((thread: Thread): boolean => {
      if (activeTab === "unread" && threadUnread(thread) === 0) {
        return false;
      }
      if (activeTab === "starred" && !thread.isStarred) {
        return false;
      }
      if (activeTab === "attachments" && !threadHasAttachments(thread)) {
        return false;
      }
      if (needle.length > 0 && !matches(thread, needle)) {
        return false;
      }
      return true;
    });
  });

  function applyStuck(value: boolean): void {
    stuck = value;
  }

  function snapshot(scrollTop: number): void {
    writeScroll(scrollTop);
  }

  function matches(thread: Thread, needle: string): boolean {
    const haystack: string = [
      thread.subject,
      thread.snippet,
      ...thread.messages.map((message: EmailMessage): string =>
        [message.sender.name, ...message.to.map((to) => to.name), ...message.body].join(" "),
      ),
    ]
      .join(" ")
      .toLowerCase();
    return haystack.includes(needle);
  }

  function lastMessage(thread: Thread): EmailMessage | undefined {
    return thread.messages[thread.messages.length - 1];
  }

  function senderOf(thread: Thread): string {
    const last: EmailMessage | undefined = lastMessage(thread);
    if (last === undefined) {
      return "Unknown";
    }
    return last.isOutgoing ? "You" : last.sender.name;
  }

  function avatarOf(thread: Thread): string {
    const last: EmailMessage | undefined = lastMessage(thread);
    return last?.sender.avatar ?? "";
  }

  function timeOf(thread: Thread): string {
    return lastMessage(thread)?.timestamp ?? "";
  }

  function handleSearchKey(event: KeyboardEvent): void {
    if (event.key === "Escape") {
      query = "";
    }
  }

  function handleSearchSubmit(event: SubmitEvent): void {
    event.preventDefault();
  }

  function handleFolderSelect(event: Event): void {
    onSelectFolder((event.currentTarget as HTMLSelectElement).value);
  }
</script>

<section id={style.emails}>
  <header
    id={style.listHeader}
    class={stuck ? style.stuck : ""}
    {@attach stuckHeader(applyStuck, snapshot, readScroll)}
  >
    <div id={style.titleRow}>
      <h2 id={style.folderTitle}>{title}</h2>
      {#if labelColor !== null}
        <span id={style.titleDot} style:--label-color={labelColor}></span>
      {/if}
      <select id={style.folderSelect} value={activeFolder} onchange={handleFolderSelect} aria-label="Folder">
        {#each FOLDERS as folder (folder.id)}
          <option value={folder.id}>{folder.name}</option>
        {/each}
      </select>
    </div>
    <form id={style.searchForm} onsubmit={handleSearchSubmit}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        id={style.searchInput}
        type="search"
        placeholder={`Search ${title.toLowerCase()}`}
        aria-label={`Search ${title.toLowerCase()}`}
        bind:value={query}
        onkeydown={handleSearchKey}
      />
    </form>
    <nav id={style.filterTabs} aria-label="Filter emails">
      {#each TABS as tab (tab.id)}
        <button
          type="button"
          class={activeTab === tab.id ? style.activeTab : style.tabItem}
          aria-pressed={activeTab === tab.id}
          onclick={() => (activeTab = tab.id)}
        >
          {tab.name}
        </button>
      {/each}
    </nav>
    {#if filtering}
      <p id={style.resultCount}>{visible.length} of {scope.length} emails</p>
    {/if}
  </header>
  {#if visible.length === 0}
    <div id={style.emptyState}>
      <p id={style.emptyTitle}>Nothing here</p>
      <p id={style.emptyDetail}>Try another folder, tab, or search term.</p>
    </div>
  {:else}
    <ul id={style.emailRows}>
      {#each visible as thread (thread.id)}
        <li id={style.emailRow} class={threadUnread(thread) === 0 ? style.isRead : ""}>
          <button type="button" id={style.rowButton} onclick={() => onOpenThread(thread.id)}>
            <img id={style.rowAvatar} src={avatarOf(thread)} alt="" />
            <span id={style.rowMain}>
              <span id={style.rowTop}>
                {#if threadUnread(thread) > 0}
                  <span id={style.unreadDot}></span>
                {/if}
                <span id={style.rowSender}>{senderOf(thread)}</span>
                <time id={style.rowTime}>{timeOf(thread)}</time>
              </span>
              <span id={style.rowBottom}>
                <span id={style.rowSubject}>{thread.subject}</span>
                <span id={style.rowSnippet}>{thread.snippet}</span>
                {#if threadHasAttachments(thread)}
                  <svg id={style.rowClip} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                    <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
                  </svg>
                {/if}
              </span>
            </span>
          </button>
          <button
            type="button"
            id={style.starButton}
            class={thread.isStarred ? style.starred : ""}
            aria-pressed={thread.isStarred}
            aria-label={thread.isStarred ? "Remove star" : "Add star"}
            title={thread.isStarred ? "Remove star" : "Add star"}
            onclick={() => mail.toggleStar(thread.id)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          </button>
        </li>
      {/each}
    </ul>
  {/if}
</section>
