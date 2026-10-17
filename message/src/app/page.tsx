"use client";

import { useState, type ReactNode } from "react";
import AppRail from "../components/AppRail";
import ConversationsList from "../components/ConversationsList";
import CurrentConversation from "../components/CurrentConversation";
import ConversationInfo from "../components/ConversationInfo";
import {
  fallbackCommunities,
  fallbackConversations,
  fallbackMessages,
  fallbackParticipants,
  fallbackSharedFiles,
  fallbackSharedLinks,
  currentUser,
  type Community,
  type Conversation,
  type Message,
  type Participant,
} from "../data/fallback";
import style from "./page.module.css";

function getOtherParticipant(conversation: Conversation): Participant {
  const known: Participant | undefined = fallbackParticipants.find(
    (p: Participant): boolean => p.name === conversation.title
  );
  if (known !== undefined) {
    return known;
  }
  return {
    id: `user-${conversation.id}`,
    name: conversation.title,
    handle: conversation.title.toLowerCase().replace(/\s+/g, ""),
    avatar: conversation.avatar,
    role: conversation.subtitle,
    bio: conversation.subtitle,
    status: conversation.presenceStatus,
  };
}

function getParticipants(conversation: Conversation): Participant[] {
  if (conversation.type === "channel") {
    return fallbackParticipants;
  }
  return [getOtherParticipant(conversation), currentUserAsParticipant()];
}

function currentUserAsParticipant(): Participant {
  return {
    id: currentUser.id,
    name: currentUser.name,
    handle: currentUser.handle,
    avatar: currentUser.avatar,
    role: currentUser.role,
    bio: currentUser.bio,
    status: currentUser.status,
  };
}

export default function MessagePage(): ReactNode {
  const [conversations, setConversations] = useState<Conversation[]>(fallbackConversations);
  const [activeConversationId, setActiveConversationId] = useState<string>("conv-1");
  const [messages, setMessages] = useState<Message[]>(fallbackMessages);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("All");
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const [activeCommunityId, setActiveCommunityId] = useState<string | null>(null);

  const activeConversation: Conversation =
    conversations.find((c: Conversation): boolean => c.id === activeConversationId) ??
    conversations[0];

  const activeCommunity: Community | undefined = fallbackCommunities.find(
    (community: Community): boolean => community.id === activeCommunityId,
  );

  const visibleConversations: Conversation[] =
    activeCommunity === undefined
      ? conversations.filter((c: Conversation): boolean => c.type === "direct")
      : conversations.filter(
          (c: Conversation): boolean => c.communityName === activeCommunity.name,
        );

  const listTitle: string =
    activeCommunity === undefined ? "Messages" : activeCommunity.name;

  const listTabs: string[] = ["All", "Unread"];

  const handleSelectConversation = (id: string): void => {
    setActiveConversationId(id);
    setConversations((prev: Conversation[]): Conversation[] =>
      prev.map((c: Conversation): Conversation => {
        if (c.id === id) {
          return { ...c, unreadCount: 0 };
        }
        return c;
      })
    );
  };

  const handleSendMessage = (text: string): void => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      content: text,
      timestamp: "Just now",
      isOutgoing: true,
      status: "sent",
    };

    setMessages((prev: Message[]): Message[] => [...prev, newMessage]);

    setConversations((prev: Conversation[]): Conversation[] =>
      prev.map((c: Conversation): Conversation => {
        if (c.id === activeConversationId) {
          return {
            ...c,
            lastMessage: text,
            lastSenderName: "You",
            timestamp: "Just now",
          };
        }
        return c;
      })
    );
  };

  const handleToggleInfo = (): void => {
    setInfoOpen((prev: boolean): boolean => !prev);
  };

  const handleCloseInfo = (): void => {
    setInfoOpen(false);
  };

  const handleSelectDirect = (): void => {
    if (activeCommunityId !== null) {
      setActiveCommunityId(null);
      setActiveTab("All");
    }
  };

  const handleSelectCommunity = (id: string): void => {
    if (activeCommunityId !== id) {
      setActiveCommunityId(id);
      setActiveTab("All");
    }
  };

  return (
    <main id={style.messageLayout}>
      <AppRail
        communities={fallbackCommunities}
        activeCommunityId={activeCommunityId}
        onSelectCommunity={handleSelectCommunity}
        directActive={activeCommunity === undefined}
        onSelectDirect={handleSelectDirect}
      />
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
      <div id={style.conversationArea} className={infoOpen ? style.infoOpen : undefined}>
        <CurrentConversation
          conversation={activeConversation}
          messages={messages}
          onSendMessage={handleSendMessage}
          onToggleInfo={handleToggleInfo}
        />
        {infoOpen ? (
          <ConversationInfo
            conversation={activeConversation}
            participants={getParticipants(activeConversation)}
            sharedFiles={fallbackSharedFiles}
            sharedLinks={fallbackSharedLinks}
            participant={
              activeConversation.type === "direct"
                ? getOtherParticipant(activeConversation)
                : undefined
            }
            onClose={handleCloseInfo}
          />
        ) : null}
      </div>
    </main>
  );
}
