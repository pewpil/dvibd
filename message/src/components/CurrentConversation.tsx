import {
  useState,
  useRef,
  useEffect,
  type ReactNode,
  type SubmitEvent,
  type ChangeEvent,
  type KeyboardEvent,
} from "react";
import { uploadFile } from "../lib/chatApi";
import type {
  ConversationDTO,
  MessageAttachmentDTO,
  MessageDTO,
  UploadDTO,
} from "../types/message";
import { useStuckScroll } from "../hooks/useStuckScroll";
import style from "../styles/components/CurrentConversation.module.css";

interface CurrentConversationProps {
  conversation: ConversationDTO;
  messages: MessageDTO[];
  onSendMessage: (text: string, uploadIds: string[]) => Promise<boolean>;
  onToggleInfo?: () => void;
}

function trimDecimal(value: number): string {
  const rounded: number = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

function formatSize(bytes: number): string {
  if (bytes <= 0) {
    return "0 B";
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1_048_576) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  return `${trimDecimal(bytes / 1_048_576)} MB`;
}

function receiptLabel(status: MessageDTO["status"]): string {
  if (status === "read") {
    return "Message read";
  }
  if (status === "delivered") {
    return "Message delivered";
  }
  return "Message sent";
}

function separatorLabel(messages: MessageDTO[]): string {
  const first: MessageDTO | undefined = messages[0];
  if (first === undefined) {
    return "";
  }
  const date: Date = new Date(first.createdAt);
  if (Number.isNaN(date.getTime())) {
    return "";
  }
  const now: Date = new Date();
  const isToday: boolean =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();
  if (isToday) {
    return "Today";
  }
  return new Intl.DateTimeFormat(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function renderAttachment(attachment: MessageAttachmentDTO): ReactNode {
  if (attachment.kind === "image") {
    return (
      <li key={attachment.id} id={style.imageAttachment}>
        <img
          id={style.attachmentImage}
          src={attachment.url}
          alt={attachment.name}
        />
        <span id={style.attachmentImageName}>{attachment.name}</span>
      </li>
    );
  }

  if (attachment.kind === "link") {
    return (
      <li key={attachment.id} id={style.linkAttachment}>
        <a
          id={style.attachmentLink}
          href={attachment.url}
          target="_blank"
          rel="noreferrer"
        >
          <span id={style.attachmentLinkTitle}>{attachment.name}</span>
          <span id={style.attachmentLinkDomain}>{attachment.domain}</span>
        </a>
      </li>
    );
  }

  return (
    <li key={attachment.id} id={style.fileAttachment}>
      <span id={style.attachmentExtension}>
        {attachment.extension.length > 0 ? attachment.extension : "FILE"}
      </span>
      <div id={style.attachmentFileMeta}>
        <span id={style.attachmentFileName}>{attachment.name}</span>
        <span id={style.attachmentFileSize}>{attachment.size}</span>
      </div>
      <a
        id={style.attachmentDownload}
        href={attachment.url}
        download={attachment.name}
        aria-label={`Download ${attachment.name}`}
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
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7 10 12 15 17 10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
      </a>
    </li>
  );
}

export default function CurrentConversation(
  props: CurrentConversationProps,
): ReactNode {
  const [inputText, setInputText] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);
  const [sendError, setSendError] = useState<string | null>(null);
  const [pendingUploads, setPendingUploads] = useState<UploadDTO[]>([]);
  const [uploading, setUploading] = useState<boolean>(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const rootRef = useRef<HTMLElement | null>(null);
  const headerRef = useRef<HTMLElement | null>(null);
  const stuck: boolean = useStuckScroll(rootRef, headerRef);

  useEffect((): void => {
    const element: HTMLTextAreaElement | null = inputRef.current;
    if (element === null) {
      return;
    }
    element.style.height = "auto";
    element.style.height = `${element.scrollHeight}px`;
  }, [inputText]);

  useEffect((): void => {
    const element: HTMLElement | null = rootRef.current;
    if (element === null) {
      return;
    }
    element.scrollTop = element.scrollHeight;
  }, [props.messages]);

  const handleInputChange = (
    event: ChangeEvent<HTMLTextAreaElement>,
  ): void => {
    setInputText(event.target.value);
    if (sendError !== null) {
      setSendError(null);
    }
  };

  const handleInputKeyDown = (
    event: KeyboardEvent<HTMLTextAreaElement>,
  ): void => {
    if (event.key !== "Enter" || event.shiftKey) {
      return;
    }
    if (event.nativeEvent.isComposing) {
      return;
    }
    event.preventDefault();
    event.currentTarget.form?.requestSubmit();
  };

  const handleFileSelected = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    const input: HTMLInputElement = event.currentTarget;
    const selected: File | undefined = input.files?.[0];
    input.value = "";
    if (selected === undefined) {
      return;
    }
    setUploading(true);
    setUploadError(null);
    try {
      const uploaded: UploadDTO = await uploadFile(selected);
      setPendingUploads((current: UploadDTO[]): UploadDTO[] => [
        ...current,
        uploaded,
      ]);
    } catch (cause: unknown) {
      setUploadError(
        cause instanceof Error && cause.message.length > 0
          ? cause.message
          : "The file could not be uploaded.",
      );
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveUpload = (id: string): void => {
    setPendingUploads((current: UploadDTO[]): UploadDTO[] =>
      current.filter((upload: UploadDTO): boolean => upload.id !== id),
    );
  };

  const handleFormSubmit = async (
    event: SubmitEvent<HTMLFormElement>,
  ): Promise<void> => {
    event.preventDefault();
    const trimmed: string = inputText.trim();
    if (trimmed.length === 0 && pendingUploads.length === 0) {
      return;
    }
    if (sending || uploading) {
      return;
    }
    const uploadIds: string[] = pendingUploads.map(
      (upload: UploadDTO): string => upload.id,
    );
    setSending(true);
    setSendError(null);
    const sent: boolean = await props.onSendMessage(trimmed, uploadIds);
    setSending(false);
    if (!sent) {
      setSendError("The message could not be sent.");
      return;
    }
    setInputText("");
    setPendingUploads([]);
    setSendError(null);
    setUploadError(null);
  };

  const canSubmit: boolean =
    (inputText.trim().length > 0 || pendingUploads.length > 0) &&
    !sending &&
    !uploading;

  const subtitleText: string =
    props.conversation.type === "channel"
      ? `${props.conversation.memberCount} members`
      : props.conversation.presenceStatus === "online"
        ? "Online"
        : props.conversation.presenceStatus === "idle"
          ? "Away"
          : "Offline";

  const separator: string = separatorLabel(props.messages);

  return (
    <section id={style.current} ref={rootRef}>
      <header
        id={style.conversationHeader}
        ref={headerRef}
        className={stuck ? style.stuck : undefined}
      >
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
              className={`${style.actionButton} ${style.infoAction}`}
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
        {separator.length > 0 ? (
          <div id={style.dateSeparator}>
            <time id={style.dateText}>{separator}</time>
          </div>
        ) : null}
        <ol id={style.messageList}>
          {props.messages.map((msg: MessageDTO): ReactNode => {
            const isOutgoing: boolean = msg.isOutgoing;
            const itemClass: string = isOutgoing
              ? style.outgoing
              : style.incoming;
            const label: string = receiptLabel(msg.status);

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
                  {msg.attachments.length > 0 ? (
                    <ul id={style.attachmentList}>
                      {msg.attachments.map(
                        (attachment: MessageAttachmentDTO): ReactNode =>
                          renderAttachment(attachment),
                      )}
                    </ul>
                  ) : msg.mediaUrl ? (
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
                  {msg.content.trim().length > 0 ? (
                    <p id={style.messageText}>{msg.content}</p>
                  ) : null}
                  <div id={style.metaRow}>
                    <time id={style.messageTime}>{msg.timestamp}</time>
                    {isOutgoing ? (
                      <span
                        id={style.receiptIcon}
                        className={
                          msg.status === "read" ? style.receiptRead : undefined
                        }
                        role="img"
                        aria-label={label}
                        title={label}
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
        {props.messages.length === 0 ? (
          <p id={style.emptyStream}>No messages yet. Say hello.</p>
        ) : null}
      </section>

      <footer id={style.composer}>
        {uploadError !== null ? (
          <p id={style.uploadError} role="alert">
            {uploadError}
          </p>
        ) : null}
        {pendingUploads.length > 0 ? (
          <ul id={style.pendingUploads}>
            {pendingUploads.map((upload: UploadDTO): ReactNode => {
              const isImage: boolean = upload.mimeType.startsWith("image/");
              return (
                <li key={upload.id} id={style.pendingUpload}>
                  {isImage ? (
                    <img
                      id={style.pendingThumbnail}
                      src={upload.url}
                      alt={upload.name}
                    />
                  ) : (
                    <span id={style.pendingExtension}>
                      {upload.extension ?? "FILE"}
                    </span>
                  )}
                  <div id={style.pendingMeta}>
                    <span id={style.pendingName}>{upload.name}</span>
                    <span id={style.pendingSize}>
                      {formatSize(upload.sizeBytes)}
                    </span>
                  </div>
                  <button
                    type="button"
                    id={style.pendingRemove}
                    onClick={(): void => handleRemoveUpload(upload.id)}
                    aria-label={`Remove ${upload.name}`}
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
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
        {sendError !== null ? (
          <p id={style.sendError} role="alert">
            {sendError}
          </p>
        ) : null}
        <form id={style.composerForm} onSubmit={handleFormSubmit}>
          <input
            ref={fileInputRef}
            id={style.fileInput}
            type="file"
            hidden
            onChange={handleFileSelected}
          />
          <input
            ref={imageInputRef}
            id={style.imageInput}
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileSelected}
          />
          <button
            type="button"
            className={style.toolButton}
            onClick={(): void => fileInputRef.current?.click()}
            disabled={uploading || sending}
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
            className={`${style.toolButton} ${style.secondaryTool}`}
            onClick={(): void => imageInputRef.current?.click()}
            disabled={uploading || sending}
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
          <textarea
            id={style.messageInput}
            ref={inputRef}
            rows={1}
            placeholder="Type a message..."
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            disabled={sending}
            aria-label="Message text"
          />
          <button
            type="button"
            className={`${style.toolButton} ${style.secondaryTool}`}
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
            disabled={!canSubmit}
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
