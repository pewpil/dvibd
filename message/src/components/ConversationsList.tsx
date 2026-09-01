import type { ReactNode, ChangeEvent, FormEvent } from "react";
import type { Conversation } from "../data/fallback";
import style from "../styles/components/ConversationsList.module.css";

interface ConversationsListProps {
  conversations: Conversation[];
  activeId: string;
  onSelectConversation: (id: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function ConversationsList(props: ConversationsListProps): ReactNode {
  const tabs: string[] = ["All", "Direct", "Channels", "Unread"];

  const handleSearchInput = (event: ChangeEvent<HTMLInputElement>): void => {
    props.onSearchChange(event.target.value);
  };

  const handleSearchSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  const filteredConversations: Conversation[] = props.conversations.filter(
    (conv: Conversation): boolean => {
      const matchesSearch: boolean =
        props.searchQuery.trim() === "" ||
        conv.title.toLowerCase().includes(props.searchQuery.toLowerCase()) ||
        conv.lastMessage.toLowerCase().includes(props.searchQuery.toLowerCase());

      if (!matchesSearch) {
        return false;
      }

      if (props.activeTab === "Direct") {
        return conv.type === "direct";
      }
      if (props.activeTab === "Channels") {
        return conv.type === "channel";
      }
      if (props.activeTab === "Unread") {
        return conv.unreadCount > 0;
      }
      return true;
    }
  );

  return (
    <section id={style.conversations}>
      <header id={style.conversationsHeader}>
        <div id={style.titleRow}>
          <h1 id={style.conversationsTitle}>Conversations</h1>
          <button
            type="button"
            id={style.newConversationButton}
            aria-label="New conversation"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
        <form id={style.searchForm} onSubmit={handleSearchSubmit} role="search">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            id={style.searchInput}
            type="search"
            placeholder="Search conversations..."
            value={props.searchQuery}
            onChange={handleSearchInput}
            aria-label="Search conversations"
          />
        </form>
        <div id={style.filterTabs} role="tablist">
          {tabs.map((tab: string): ReactNode => {
            const isSelected: boolean = props.activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={isSelected}
                className={isSelected ? style.activeTab : style.tabItem}
                onClick={(): void => props.onTabChange(tab)}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </header>
      <ul id={style.conversationsList}>
        {filteredConversations.map((conv: Conversation): ReactNode => {
          const isActive: boolean = props.activeId === conv.id;
          const presenceClass: string =
            conv.presenceStatus === "online"
              ? style.online
              : conv.presenceStatus === "idle"
              ? style.idle
              : style.offline;

          return (
            <li key={conv.id} id={style.conversationItem}>
              <button
                type="button"
                id={style.conversationButton}
                className={isActive ? style.activeConversation : undefined}
                onClick={(): void => props.onSelectConversation(conv.id)}
              >
                <div id={style.avatarContainer}>
                  <img
                    id={style.avatarImage}
                    src={conv.avatar}
                    alt={conv.title}
                  />
                  <span id={style.presenceDot} className={presenceClass} />
                </div>
                <div id={style.conversationContent}>
                  <div id={style.conversationTopLine}>
                    <span id={style.conversationTitle}>{conv.title}</span>
                    <time id={style.conversationTimestamp}>{conv.timestamp}</time>
                  </div>
                  <div id={style.conversationBottomLine}>
                    <p id={style.lastMessageSnippet}>{conv.lastMessage}</p>
                    {conv.unreadCount > 0 ? (
                      <span id={style.unreadBadge}>{conv.unreadCount}</span>
                    ) : null}
                  </div>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
