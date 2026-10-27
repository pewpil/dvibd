export type PresenceStatus = "online" | "offline" | "idle";

export interface MessageUserDTO {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  headline: string;
  bio: string;
  status: PresenceStatus;
}

export interface CommunityDTO {
  id: string;
  name: string;
  avatar: string;
  description: string;
  channelCount: number;
  memberCount: number;
}

export interface ConversationDTO {
  id: string;
  type: "direct" | "channel";
  title: string;
  avatar: string;
  subtitle: string;
  communityId: string | null;
  communityName: string;
  lastMessage: string;
  lastSenderName: string;
  timestamp: string;
  unreadCount: number;
  presenceStatus: PresenceStatus;
  memberCount: number;
  isMuted: boolean;
  joined: boolean;
}

export interface MessageAttachmentDTO {
  id: string;
  kind: "image" | "file" | "link";
  url: string;
  name: string;
  mimeType: string | null;
  size: string;
  extension: string;
  domain: string;
  timestamp: string;
}

export interface MessageDTO {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  createdAt: string;
  isOutgoing: boolean;
  status: "sent" | "delivered" | "read";
  attachments: MessageAttachmentDTO[];
  mediaUrl?: string;
  mediaName?: string;
  mediaSize?: string;
}

export interface SharedFileDTO {
  id: string;
  url: string;
  name: string;
  size: string;
  extension: string;
  timestamp: string;
}

export interface SharedLinkDTO {
  id: string;
  title: string;
  url: string;
  domain: string;
}

export interface ConversationInfoDTO {
  participants: MessageUserDTO[];
  sharedFiles: SharedFileDTO[];
  sharedLinks: SharedLinkDTO[];
  directParticipant?: MessageUserDTO;
}

export interface WorkspaceDTO {
  communities: CommunityDTO[];
  conversations: ConversationDTO[];
}

export interface MessagesResponse {
  messages: MessageDTO[];
  hasMore: boolean;
}

export interface UploadDTO {
  id: string;
  url: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  extension: string | null;
}
