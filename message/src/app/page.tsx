"use client";

import { useState, type ReactNode } from "react";
import ConversationsList from "../components/ConversationsList";
import CurrentConversation from "../components/CurrentConversation";
import ConversationInfo from "../components/ConversationInfo";
import {
  fallbackConversations,
  fallbackMessages,
  fallbackParticipants,
  fallbackSharedFiles,
  fallbackSharedLinks,
  currentUser,
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

  const activeConversation: Conversation =
    conversations.find((c: Conversation): boolean => c.id === activeConversationId) ??
    conversations[0];

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

  return (
    <main id={style.messageLayout}>
      <ConversationsList
        conversations={conversations}
        activeId={activeConversationId}
        onSelectConversation={handleSelectConversation}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
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
