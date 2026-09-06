import { useState, type ReactNode, type FormEvent, type ChangeEvent } from "react";
import type { Conversation, Message } from "../data/fallback";
import style from "../styles/components/CurrentConversation.module.css";

interface CurrentConversationProps {
  conversation: Conversation;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onToggleInfo?: () => void;
}

export default function CurrentConversation(props: CurrentConversationProps): ReactNode {
  const [inputText, setInputText] = useState<string>("");

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setInputText(event.target.value);
  };

  const handleFormSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    const trimmed: string = inputText.trim();
    if (trimmed.length === 0) {
      return;
    }
    props.onSendMessage(trimmed);
    setInputText("");
  };

  const subtitleText: string =
    props.conversation.type === "channel"
      ? `${props.conversation.memberCount} members in community`
      : props.conversation.presenceStatus === "online"
      ? "Online"
      : props.conversation.presenceStatus === "idle"
      ? "Away"
      : "Offline";

  return (
    <section id={style.current}>
      <header id={style.conversationHeader}>
        <div id={style.headerEntity}>
          <img
            id={style.headerAvatar}
            src={props.conversation.avatar}
            alt={props.conversation.title}
          />
          <div id={style.headerDetails}>
            <h2 id={style.headerTitle}>{props.conversation.title}</h2>
            <span id={style.headerSubtitle}>{subtitleText}</span>
          </div>
        </div>
        <div id={style.headerActions}>
          <button
            type="button"
            className={style.actionButton}
            aria-label="Start voice call"
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
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
          </button>
          <button
            type="button"
            className={style.actionButton}
            aria-label="Start video call"
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
              <polygon points="23 7 16 12 23 17 23 7" />
              <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
            </svg>
          </button>
          <button
            type="button"
            className={style.actionButton}
            aria-label="Search conversation"
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
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </button>
          {props.onToggleInfo ? (
            <button
              type="button"
              className={style.actionButton}
              onClick={props.onToggleInfo}
              aria-label="Conversation details"
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
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="16" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12.01" y2="8" />
              </svg>
            </button>
          ) : null}
        </div>
      </header>

      <section id={style.messageStream}>
        <div id={style.dateSeparator}>
          <time id={style.dateText}>Today</time>
        </div>
        <ol id={style.messageList}>
          {props.messages.map((msg: Message): ReactNode => {
            const isOutgoing: boolean = msg.isOutgoing;
            const itemClass: string = isOutgoing ? style.outgoing : style.incoming;

            return (
              <li key={msg.id} id={style.messageItem} className={itemClass}>
                {!isOutgoing ? (
                  <img
                    id={style.senderAvatar}
                    src={msg.senderAvatar}
                    alt={msg.senderName}
                  />
                ) : null}
                <article id={style.bubbleContainer}>
                  {!isOutgoing && props.conversation.type === "channel" ? (
                    <span id={style.senderName}>{msg.senderName}</span>
                  ) : null}
                  {msg.mediaUrl ? (
                    <div id={style.mediaAttachment}>
                      <img
                        id={style.mediaImage}
                        src={msg.mediaUrl}
                        alt={msg.mediaName ?? "Attachment"}
                      />
                      {msg.mediaName ? (
                        <span id={style.mediaName}>{msg.mediaName}</span>
                      ) : null}
                    </div>
                  ) : null}
                  <p id={style.messageText}>{msg.content}</p>
                  <div id={style.metaRow}>
                    <time id={style.messageTime}>{msg.timestamp}</time>
                    {isOutgoing ? (
                      <span id={style.receiptIcon}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      </span>
                    ) : null}
                  </div>
                </article>
              </li>
            );
          })}
        </ol>
      </section>

      <footer id={style.composer}>
        <form id={style.composerForm} onSubmit={handleFormSubmit}>
          <button
            type="button"
            className={style.toolButton}
            aria-label="Attach file"
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
              <path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48" />
            </svg>
          </button>
          <button
            type="button"
            className={style.toolButton}
            aria-label="Send image"
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
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </button>
          <input
            id={style.messageInput}
            type="text"
            placeholder="Type a message..."
            value={inputText}
            onChange={handleInputChange}
            aria-label="Message text"
          />
          <button
            type="button"
            className={style.toolButton}
            aria-label="Choose emoji"
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
              <circle cx="12" cy="12" r="10" />
              <path d="M8 14s1.5 2 4 2 4-2 4-2" />
              <line x1="9" y1="9" x2="9.01" y2="9" />
              <line x1="15" y1="9" x2="15.01" y2="9" />
            </svg>
          </button>
          <button
            type="submit"
            id={style.sendButton}
            disabled={inputText.trim().length === 0}
            aria-label="Send message"
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
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          </button>
        </form>
      </footer>
    </section>
  );
}
