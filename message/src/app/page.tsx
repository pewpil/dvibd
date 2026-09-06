"use client";

import { useState, type ReactNode } from "react";
import ConversationsList from "../components/ConversationsList";
import CurrentConversation from "../components/CurrentConversation";
import {
  fallbackConversations,
  fallbackMessages,
  currentUser,
  type Conversation,
  type Message,
} from "../data/fallback";
import style from "./page.module.css";

export default function MessagePage(): ReactNode {
  const [conversations, setConversations] = useState<Conversation[]>(fallbackConversations);
  const [activeConversationId, setActiveConversationId] = useState<string>("conv-1");
  const [messages, setMessages] = useState<Message[]>(fallbackMessages);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<string>("All");

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
      <CurrentConversation
        conversation={activeConversation}
        messages={messages}
        onSendMessage={handleSendMessage}
      />
    </main>
  );
}
