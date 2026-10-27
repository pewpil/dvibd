"use client";

import { useEffect, useState, type ReactNode } from "react";
import AppRail from "../components/AppRail";
import ConversationsList from "../components/ConversationsList";
import AccountPanel from "../components/AccountPanel";
import CurrentConversation from "../components/CurrentConversation";
import ConversationInfo from "../components/ConversationInfo";
import {
  fetchInfo,
  fetchMessages,
  fetchWorkspace,
  joinConversation,
  leaveConversation,
  markRead,
  sendMessage,
  setMute,
} from "../lib/chatApi";
import {
  useConversationEvents,
  type ReceiptUpdate,
} from "../hooks/useConversationEvents";
import type {
  CommunityDTO,
  ConversationDTO,
  ConversationInfoDTO,
  MessageDTO,
  MessagesResponse,
  WorkspaceDTO,
} from "../types/message";
import style from "./page.module.css";

const ACCOUNT_SOURCE: string = "account";
const DIRECT_SOURCE: string = "direct";

function errorMessage(cause: unknown): string {
  if (cause instanceof Error && cause.message.length > 0) {
    return cause.message;
  }
  return "Something went wrong.";
}

function findConversation(
  workspace: WorkspaceDTO | null,
  id: string | null,
): ConversationDTO | null {
  if (workspace === null || id === null) {
    return null;
  }
  return (
    workspace.conversations.find(
      (conversation: ConversationDTO): boolean => conversation.id === id,
    ) ?? null
  );
}

function conversationsOf(
  workspace: WorkspaceDTO | null,
  source: string,
): ConversationDTO[] {
  if (workspace === null) {
    return [];
  }
  if (source === DIRECT_SOURCE) {
    return workspace.conversations.filter(
      (conversation: ConversationDTO): boolean =>
        conversation.type === "direct",
    );
  }
  return workspace.conversations.filter(
    (conversation: ConversationDTO): boolean =>
      conversation.communityId === source,
  );
}

function pickConversation(
  workspace: WorkspaceDTO | null,
  source: string,
  excludeId?: string,
): string | null {
  const candidates: ConversationDTO[] = conversationsOf(
    workspace,
    source,
  ).filter(
    (conversation: ConversationDTO): boolean => conversation.id !== excludeId,
  );
  if (source === DIRECT_SOURCE) {
    return candidates[0]?.id ?? null;
  }
  const joined: ConversationDTO | undefined = candidates.find(
    (conversation: ConversationDTO): boolean => conversation.joined,
  );
  return joined?.id ?? candidates[0]?.id ?? null;
}

function clearUnread(
  workspace: WorkspaceDTO | null,
  id: string,
): WorkspaceDTO | null {
  if (workspace === null) {
    return null;
  }
  return {
    communities: workspace.communities,
    conversations: workspace.conversations.map(
      (conversation: ConversationDTO): ConversationDTO =>
        conversation.id === id
          ? { ...conversation, unreadCount: 0 }
          : conversation,
    ),
  };
}

function applyMute(
  workspace: WorkspaceDTO | null,
  id: string,
  isMuted: boolean,
): WorkspaceDTO | null {
  if (workspace === null) {
    return null;
  }
  return {
    communities: workspace.communities,
    conversations: workspace.conversations.map(
      (conversation: ConversationDTO): ConversationDTO =>
        conversation.id === id
          ? { ...conversation, isMuted: isMuted }
          : conversation,
    ),
  };
}

export default function MessagePage(): ReactNode {
  const [workspace, setWorkspace] = useState<WorkspaceDTO | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null,
  );
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [info, setInfo] = useState<ConversationInfoDTO | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const [activeSource, setActiveSource] = useState<string>(DIRECT_SOURCE);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState<number>(0);
  const [threadLoaded, setThreadLoaded] = useState<boolean>(false);

  const accountActive: boolean = activeSource === ACCOUNT_SOURCE;
  const activeConversation: ConversationDTO | null = findConversation(
    workspace,
    activeConversationId,
  );
  const activeJoined: boolean = activeConversation?.joined ?? false;
  const lastMessageCreatedAt: string | null =
    messages.length > 0 ? messages[messages.length - 1].createdAt : null;
  const communities: CommunityDTO[] = workspace?.communities ?? [];
  const activeCommunity: CommunityDTO | undefined = communities.find(
    (community: CommunityDTO): boolean => community.id === activeSource,
  );
  const visibleConversations: ConversationDTO[] = conversationsOf(
    workspace,
    activeSource,
  );
  const listTitle: string =
    activeSource === DIRECT_SOURCE
      ? "Messages"
      : (activeCommunity?.name ?? "Channels");
  const listTabs: string[] = ["All", "Unread"];

  useEffect((): (() => void) => {
    let cancelled: boolean = false;
    setLoading(true);
    setError(null);
    void (async (): Promise<void> => {
      try {
        const next: WorkspaceDTO = await fetchWorkspace();
        if (cancelled) {
          return;
        }
        setWorkspace(next);
        setActiveConversationId(
          (current: string | null): string | null => {
            if (
              current !== null &&
              next.conversations.some(
                (conversation: ConversationDTO): boolean =>
                  conversation.id === current,
              )
            ) {
              return current;
            }
            return pickConversation(next, DIRECT_SOURCE);
          },
        );
      } catch (cause: unknown) {
        if (cancelled) {
          return;
        }
        setError(errorMessage(cause));
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();
    return (): void => {
      cancelled = true;
    };
  }, [reloadKey]);

  useEffect((): (() => void) => {
    const id: string | null = activeConversationId;
    setThreadLoaded(false);
    if (id === null || !activeJoined) {
      setMessages([]);
      setInfo(null);
      return (): void => {};
    }
    setMessages([]);
    setInfo(null);
    setThreadLoaded(false);
    let cancelled: boolean = false;
    void (async (): Promise<void> => {
      try {
        const infoRequest: Promise<ConversationInfoDTO | null> = fetchInfo(
          id,
        ).catch((): null => null);
        const [thread, details]: [MessagesResponse, ConversationInfoDTO | null] =
          await Promise.all([fetchMessages(id), infoRequest]);
        if (cancelled) {
          return;
        }
        setMessages(thread.messages);
        setInfo(details);
        setThreadLoaded(true);
        await markRead(id).catch((): void => undefined);
        if (cancelled) {
          return;
        }
        setWorkspace(
          (current: WorkspaceDTO | null): WorkspaceDTO | null =>
            clearUnread(current, id),
        );
      } catch (cause: unknown) {
        if (cancelled) {
          return;
        }
        setError(errorMessage(cause));
        setMessages([]);
        setInfo(null);
      }
    })();
    return (): void => {
      cancelled = true;
    };
  }, [activeConversationId, activeJoined]);

  const refreshWorkspace = async (): Promise<void> => {
    const next: WorkspaceDTO | null = await fetchWorkspace().catch(
      (): null => null,
    );
    if (next !== null) {
      setWorkspace(next);
    }
  };

  const handleSelectConversation = async (id: string): Promise<void> => {
    setError(null);
    const conversation: ConversationDTO | null = findConversation(workspace, id);
    if (conversation === null) {
      return;
    }
    if (conversation.type === "channel" && !conversation.joined) {
      try {
        await joinConversation(id);
        const next: WorkspaceDTO = await fetchWorkspace();
        setWorkspace(next);
      } catch (cause: unknown) {
        setError(errorMessage(cause));
        return;
      }
    }
    setActiveConversationId(id);
  };

  const handleSendMessage = async (
    text: string,
    uploadIds: string[],
  ): Promise<boolean> => {
    const id: string | null = activeConversationId;
    if (id === null) {
      return false;
    }
    let created: MessageDTO;
    try {
      created = await sendMessage(id, text, uploadIds);
    } catch {
      return false;
    }
    setMessages((current: MessageDTO[]): MessageDTO[] =>
      current.some((message: MessageDTO): boolean => message.id === created.id)
        ? current
        : [...current, created],
    );
    await refreshWorkspace();
    return true;
  };

  const handleIncomingMessage = (message: MessageDTO): void => {
    const id: string | null = activeConversationId;
    if (id === null) {
      return;
    }
    setMessages((current: MessageDTO[]): MessageDTO[] =>
      current.some(
        (existing: MessageDTO): boolean => existing.id === message.id,
      )
        ? current
        : [...current, message],
    );
    if (message.isOutgoing) {
      void refreshWorkspace();
      return;
    }
    setWorkspace(
      (current: WorkspaceDTO | null): WorkspaceDTO | null =>
        clearUnread(current, id),
    );
    void (async (): Promise<void> => {
      await markRead(id).catch((): void => undefined);
      await refreshWorkspace();
    })();
  };

  const handleReceipt = (receipt: ReceiptUpdate): void => {
    setMessages((current: MessageDTO[]): MessageDTO[] =>
      current.map(
        (message: MessageDTO): MessageDTO =>
          message.id === receipt.messageId
            ? { ...message, status: receipt.status }
            : message,
      ),
    );
  };

  useConversationEvents({
    conversationId: activeConversationId,
    enabled: threadLoaded && activeJoined && !accountActive,
    after: lastMessageCreatedAt,
    onMessage: handleIncomingMessage,
    onReceipt: handleReceipt,
  });

  const handleToggleMute = async (): Promise<void> => {
    const conversation: ConversationDTO | null = activeConversation;
    if (conversation === null) {
      return;
    }
    const nextMuted: boolean = !conversation.isMuted;
    try {
      await setMute(conversation.id, nextMuted);
    } catch (cause: unknown) {
      setError(errorMessage(cause));
      return;
    }
    setWorkspace(
      (current: WorkspaceDTO | null): WorkspaceDTO | null =>
        applyMute(current, conversation.id, nextMuted),
    );
  };

  const handleLeaveChannel = async (): Promise<void> => {
    const conversation: ConversationDTO | null = activeConversation;
    if (conversation === null || conversation.type !== "channel") {
      return;
    }
    try {
      await leaveConversation(conversation.id);
    } catch (cause: unknown) {
      setError(errorMessage(cause));
      return;
    }
    setInfoOpen(false);
    let next: WorkspaceDTO;
    try {
      next = await fetchWorkspace();
    } catch (cause: unknown) {
      setError(errorMessage(cause));
      return;
    }
    setWorkspace(next);
    setActiveConversationId(
      pickConversation(next, activeSource, conversation.id),
    );
  };

  const handleRetry = (): void => {
    setReloadKey((current: number): number => current + 1);
  };

  const handleToggleInfo = (): void => {
    setInfoOpen((current: boolean): boolean => !current);
  };

  const handleCloseInfo = (): void => {
    setInfoOpen(false);
  };

  const handleSelectAccount = (): void => {
    if (activeSource === ACCOUNT_SOURCE) {
      return;
    }
    setError(null);
    setActiveSource(ACCOUNT_SOURCE);
    setActiveTab("All");
    setInfoOpen(false);
    setActiveConversationId(null);
  };

  const handleSelectDirect = (): void => {
    if (activeSource === DIRECT_SOURCE) {
      return;
    }
    setError(null);
    setActiveSource(DIRECT_SOURCE);
    setActiveTab("All");
    setInfoOpen(false);
    setActiveConversationId(pickConversation(workspace, DIRECT_SOURCE));
  };

  const handleSelectCommunity = (id: string): void => {
    if (activeSource === id) {
      return;
    }
    setError(null);
    setActiveSource(id);
    setActiveTab("All");
    setInfoOpen(false);
    setActiveConversationId(pickConversation(workspace, id));
  };

  const renderConversationArea = (): ReactNode => {
    if (accountActive) {
      return null;
    }
    if (loading) {
      return (
        <section id={style.statePanel}>
          <p id={style.stateText}>Loading conversations...</p>
        </section>
      );
    }
    if (error !== null) {
      return (
        <section id={style.statePanel} role="alert">
          <p id={style.stateText}>{error}</p>
          <button type="button" id={style.stateAction} onClick={handleRetry}>
            Try again
          </button>
        </section>
      );
    }
    if (activeConversation === null) {
      return (
        <section id={style.statePanel}>
          <p id={style.stateText}>No conversation selected.</p>
          <p id={style.stateHint}>
            Choose a conversation from the list to start reading.
          </p>
        </section>
      );
    }
    if (!activeConversation.joined) {
      const channelId: string = activeConversation.id;
      return (
        <section id={style.statePanel}>
          <p id={style.stateText}>
            {activeConversation.title} is not joined yet.
          </p>
          <p id={style.stateHint}>
            Join the channel to read its messages and take part.
          </p>
          <button
            type="button"
            id={style.stateAction}
            onClick={(): void => {
              void handleSelectConversation(channelId);
            }}
          >
            Join channel
          </button>
        </section>
      );
    }
    return (
      <CurrentConversation
        conversation={activeConversation}
        messages={messages}
        onSendMessage={handleSendMessage}
        onToggleInfo={handleToggleInfo}
      />
    );
  };

  const renderInfo = (): ReactNode => {
    if (
      !infoOpen ||
      accountActive ||
      activeConversation === null ||
      info === null
    ) {
      return null;
    }
    return (
      <ConversationInfo
        conversation={activeConversation}
        participants={info.participants}
        sharedFiles={info.sharedFiles}
        sharedLinks={info.sharedLinks}
        directParticipant={info.directParticipant}
        muted={activeConversation.isMuted}
        onToggleMute={(): void => {
          void handleToggleMute();
        }}
        onLeave={
          activeConversation.type === "channel"
            ? (): void => {
                void handleLeaveChannel();
              }
            : undefined
        }
        onClose={handleCloseInfo}
      />
    );
  };

  return (
    <main id={style.messageLayout}>
      <AppRail
        communities={communities}
        activeSource={activeSource}
        onSelectAccount={handleSelectAccount}
        onSelectDirect={handleSelectDirect}
        onSelectCommunity={handleSelectCommunity}
      />
      {accountActive ? (
        <AccountPanel />
      ) : workspace === null ? null : (
        <ConversationsList
          conversations={visibleConversations}
          activeId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          title={listTitle}
          tabs={listTabs}
        />
      )}
      <div
        id={style.conversationArea}
        className={infoOpen ? style.infoOpen : undefined}
      >
        {renderConversationArea()}
        {renderInfo()}
      </div>
    </main>
  );
}
