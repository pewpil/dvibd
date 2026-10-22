<script lang="ts">
  import style from "./styles/components/App.module.css";
  import SidePanel from "./components/SidePanel.svelte";
  import EmailList from "./components/EmailList.svelte";
  import EmailView from "./components/EmailView.svelte";
  import Composer from "./components/Composer.svelte";
  import { mail } from "./lib/mailService.svelte.ts";
  import { resetScroll } from "./lib/listScroll.ts";
  import type { EmailMessage, Thread } from "./lib/types.ts";

  let activeFolder = $state<string>("inbox");
  let activeView = $state<string>("list");
  let panelMode = $state<"navigation" | "account">("navigation");
  let composeDraftId = $state<string | null>(null);

  let composeDraft: Thread | null = $derived(
    composeDraftId === null ? null : (mail.thread(composeDraftId) ?? null),
  );

  function selectFolder(folderId: string): void {
    activeFolder = folderId;
    activeView = "list";
    composeDraftId = null;
    resetScroll();
  }

  function openThread(threadId: string): void {
    const thread: Thread | undefined = mail.thread(threadId);
    if (thread === undefined) {
      return;
    }
    if (
      thread.messages.some(
        (message: EmailMessage): boolean => message.isDraft,
      )
    ) {
      composeDraftId = threadId;
      activeView = "compose";
      return;
    }
    composeDraftId = null;
    mail.markRead(threadId);
    activeView = threadId;
  }

  function openCompose(): void {
    composeDraftId = null;
    activeView = "compose";
  }

  function backToList(): void {
    activeView = "list";
  }

  function afterSend(): void {
    selectFolder("sent");
  }

  function afterSave(): void {
    selectFolder("drafts");
  }
</script>

<main id={style.mailApp}>
  <SidePanel
    activeFolder={activeFolder}
    panelMode={panelMode}
    onTogglePanelMode={() =>
      (panelMode = panelMode === "navigation" ? "account" : "navigation")}
    onSelectFolder={selectFolder}
    onCompose={openCompose}
  />
  <div id={style.mailColumn}>
    {#if activeView === "list"}
      {#key activeFolder}
        <EmailList
          activeFolder={activeFolder}
          onOpenThread={openThread}
          onSelectFolder={selectFolder}
        />
      {/key}
    {:else if activeView === "compose"}
      <Composer
        mode="new"
        thread={null}
        draft={composeDraft}
        onSent={afterSend}
        onSaved={afterSave}
        onDiscard={backToList}
      />
    {:else}
      <EmailView threadId={activeView} onBack={backToList} />
    {/if}
  </div>
</main>
