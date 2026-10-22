export type FolderId =
  | "inbox"
  | "starred"
  | "sent"
  | "drafts"
  | "archive"
  | "junk"
  | "trash";

export interface FolderMeta {
  id: FolderId;
  name: string;
}

export type EmailTab = "all" | "unread" | "starred" | "attachments";

export interface Contact {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface Label {
  id: string;
  name: string;
  color: string;
}

export interface Attachment {
  id: string;
  name: string;
  ext: string;
  size: string;
}

export interface EmailMessage {
  id: string;
  threadId: string;
  sender: Contact;
  to: Contact[];
  cc: Contact[];
  timestamp: string;
  body: string[];
  quoted: string | null;
  attachments: Attachment[];
  isRead: boolean;
  isDraft: boolean;
  isOutgoing: boolean;
}

export interface Thread {
  id: string;
  subject: string;
  folder: FolderId;
  labels: Label[];
  isStarred: boolean;
  snippet: string;
  messages: EmailMessage[];
}

export type ComposeMode = "new" | "reply" | "replyAll" | "forward";

export interface ComposeFields {
  to: string;
  cc: string;
  subject: string;
  body: string;
  quoted: string | null;
}

export const FOLDERS: FolderMeta[] = [
  { id: "inbox", name: "Inbox" },
  { id: "starred", name: "Starred" },
  { id: "sent", name: "Sent" },
  { id: "drafts", name: "Drafts" },
  { id: "archive", name: "Archive" },
  { id: "junk", name: "Junk" },
  { id: "trash", name: "Trash" },
];

export const TABS: Array<{ id: EmailTab; name: string }> = [
  { id: "all", name: "All" },
  { id: "unread", name: "Unread" },
  { id: "starred", name: "Starred" },
  { id: "attachments", name: "Attachments" },
];

export function threadUnread(thread: Thread): number {
  return thread.messages.filter(
    (message: EmailMessage): boolean => !message.isRead && !message.isDraft,
  ).length;
}

export function threadHasAttachments(thread: Thread): boolean {
  return thread.messages.some(
    (message: EmailMessage): boolean => message.attachments.length > 0,
  );
}

export function threadTouchesLabel(thread: Thread, labelId: string): boolean {
  return thread.labels.some((label: Label): boolean => label.id === labelId);
}

export function folderName(id: string): string {
  return FOLDERS.find((folder: FolderMeta): boolean => folder.id === id)?.name ?? "";
}
