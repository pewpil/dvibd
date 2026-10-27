import { Prisma } from "./generated/client.mts";
import type {
  ConversationGetPayload,
  ConversationInclude,
} from "./generated/models.mts";
import { prisma } from "./db";
import {
  derivePresence,
  fileExtension,
  formatConversationTime,
  formatFileSize,
} from "./format";
import type {
  CommunityDTO,
  ConversationDTO,
  ConversationInfoDTO,
  MessageUserDTO,
  PresenceStatus,
  SharedFileDTO,
  SharedLinkDTO,
  WorkspaceDTO,
} from "../types/message";

const FALLBACK_USER_AVATAR: string = "/profile-picture.svg";
const FALLBACK_COMMUNITY_AVATAR: string = "/community-profile.svg";

const PARTICIPANT_USER_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
  bio: true,
  website: true,
  headline: true,
  lastSeenAt: true,
  createdAt: true,
} satisfies Prisma.UserSelect;

const CONVERSATION_INCLUDE = {
  community: {
    select: { id: true, name: true, avatarUrl: true },
  },
  participants: {
    where: { leftAt: null },
    include: { user: { select: PARTICIPANT_USER_SELECT } },
  },
  messages: {
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 1,
    include: {
      sender: { select: PARTICIPANT_USER_SELECT },
      attachments: { orderBy: { createdAt: "asc" } },
    },
  },
} satisfies ConversationInclude;

type WorkspaceConversation = ConversationGetPayload<{
  include: typeof CONVERSATION_INCLUDE;
}>;

type ParticipantUser = WorkspaceConversation["participants"][number]["user"];

interface CommunityRow {
  id: string;
  name: string;
  description: string | null;
  avatarUrl: string | null;
  _count: { members: number; conversations: number };
}

function displayNameOf(user: ParticipantUser): string {
  return user.displayName ?? user.username;
}

function avatarOf(user: ParticipantUser): string {
  return user.avatarUrl ?? FALLBACK_USER_AVATAR;
}

function toMessageUser(user: ParticipantUser): MessageUserDTO {
  return {
    id: user.id,
    name: displayNameOf(user),
    handle: user.username,
    avatar: avatarOf(user),
    headline: user.headline ?? "",
    bio: user.bio ?? "",
    status: derivePresence(user.lastSeenAt),
  };
}

function toCommunityDTO(row: CommunityRow): CommunityDTO {
  return {
    id: row.id,
    name: row.name,
    avatar: row.avatarUrl ?? FALLBACK_COMMUNITY_AVATAR,
    description: row.description ?? "",
    channelCount: row._count.conversations,
    memberCount: row._count.members,
  };
}

function unreadWhere(
  conversationId: string,
  userId: string,
  lastReadAt: Date | null,
): Prisma.MessageWhereInput {
  return {
    conversationId: conversationId,
    deletedAt: null,
    senderId: { not: userId },
    ...(lastReadAt === null ? {} : { createdAt: { gt: lastReadAt } }),
  };
}

function lastMessageFields(
  conversation: WorkspaceConversation,
  userId: string,
): { lastMessage: string; lastSenderName: string; timestamp: string } {
  const latest = conversation.messages[0];
  if (latest === undefined) {
    return { lastMessage: "No messages yet", lastSenderName: "", timestamp: "" };
  }
  const senderName: string = displayNameOf(latest.sender);
  const attachmentName: string | null = latest.attachments[0]?.name ?? null;
  const body: string =
    latest.text !== null && latest.text.trim().length > 0
      ? latest.text
      : attachmentName ?? "";
  const lastMessage: string =
    body.length === 0
      ? "No messages yet"
      : conversation.kind === "CHANNEL"
        ? `${senderName}: ${body}`
        : body;
  return {
    lastMessage: lastMessage,
    lastSenderName: latest.senderId === userId ? "You" : senderName,
    timestamp: formatConversationTime(latest.createdAt),
  };
}

function toConversationDTO(
  conversation: WorkspaceConversation,
  userId: string,
  unreadCount: number,
): ConversationDTO {
  const participant = conversation.participants.find(
    (row) => row.userId === userId,
  );
  const other: ParticipantUser | null =
    conversation.kind === "DIRECT"
      ? conversation.participants.find((row) => row.userId !== userId)?.user ??
        null
      : null;
  const joined: boolean =
    conversation.kind === "DIRECT" ? true : participant !== undefined;
  const presenceStatus: PresenceStatus =
    conversation.kind === "DIRECT"
      ? derivePresence(other?.lastSeenAt ?? null)
      : conversation.participants.some(
            (row) =>
              row.userId !== userId &&
              derivePresence(row.user.lastSeenAt) !== "offline",
          )
        ? "online"
        : "offline";
  const lastMessage: {
    lastMessage: string;
    lastSenderName: string;
    timestamp: string;
  } = lastMessageFields(conversation, userId);

  return {
    id: conversation.id,
    type: conversation.kind === "DIRECT" ? "direct" : "channel",
    title:
      conversation.kind === "DIRECT"
        ? other === null
          ? "Direct message"
          : displayNameOf(other)
        : `#${conversation.title ?? conversation.slug ?? "channel"}`,
    avatar:
      conversation.kind === "DIRECT"
        ? other === null
          ? FALLBACK_USER_AVATAR
          : avatarOf(other)
        : conversation.avatarUrl ??
          conversation.community?.avatarUrl ??
          FALLBACK_COMMUNITY_AVATAR,
    subtitle:
      conversation.kind === "DIRECT"
        ? other?.headline ?? other?.bio ?? ""
        : conversation.description ?? "",
    communityId: conversation.communityId,
    communityName: conversation.community?.name ?? "",
    lastMessage: lastMessage.lastMessage,
    lastSenderName: lastMessage.lastSenderName,
    timestamp: lastMessage.timestamp,
    unreadCount: unreadCount,
    presenceStatus: presenceStatus,
    memberCount: conversation.participants.length,
    isMuted: participant?.isMuted ?? false,
    joined: joined,
  };
}

export async function getWorkspace(userId: string): Promise<WorkspaceDTO> {
  const [communityRows, conversationRows]: [
    CommunityRow[],
    WorkspaceConversation[],
  ] = await Promise.all([
    prisma.community.findMany({
      where: { members: { some: { userId: userId } } },
      include: { _count: { select: { members: true, conversations: true } } },
      orderBy: { name: "asc" },
    }),
    prisma.conversation.findMany({
      where: {
        OR: [
          {
            kind: "DIRECT",
            participants: { some: { userId: userId, leftAt: null } },
          },
          {
            kind: "CHANNEL",
            community: { members: { some: { userId: userId } } },
          },
        ],
      },
      include: CONVERSATION_INCLUDE,
      orderBy: [{ lastMessageAt: "desc" }, { createdAt: "desc" }],
    }),
  ]);

  conversationRows.sort(
    (left: WorkspaceConversation, right: WorkspaceConversation): number => {
      const leftTime: number = left.lastMessageAt?.getTime() ?? 0;
      const rightTime: number = right.lastMessageAt?.getTime() ?? 0;
      if (leftTime !== rightTime) {
        return rightTime - leftTime;
      }
      return right.createdAt.getTime() - left.createdAt.getTime();
    },
  );

  const unreadCounts: number[] = await Promise.all(
    conversationRows.map(
      async (conversation: WorkspaceConversation): Promise<number> => {
        const participant = conversation.participants.find(
          (row) => row.userId === userId,
        );
        const joined: boolean =
          conversation.kind === "DIRECT" ? true : participant !== undefined;
        if (!joined) {
          return 0;
        }
        return await prisma.message.count({
          where: unreadWhere(
            conversation.id,
            userId,
            participant?.lastReadAt ?? null,
          ),
        });
      },
    ),
  );

  return {
    communities: communityRows.map(
      (row: CommunityRow): CommunityDTO => toCommunityDTO(row),
    ),
    conversations: conversationRows.map(
      (conversation: WorkspaceConversation, index: number): ConversationDTO =>
        toConversationDTO(conversation, userId, unreadCounts[index] ?? 0),
    ),
  };
}

export async function getConversationInfo(
  userId: string,
  conversationId: string,
): Promise<ConversationInfoDTO | null> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    include: {
      participants: {
        where: { leftAt: null },
        include: { user: { select: PARTICIPANT_USER_SELECT } },
      },
    },
  });
  if (conversation === null) {
    return null;
  }
  const participant = conversation.participants.find(
    (row) => row.userId === userId,
  );
  if (participant === undefined) {
    return null;
  }

  const [fileAttachments, linkAttachments] = await Promise.all([
    prisma.messageAttachment.findMany({
      where: {
        kind: { in: ["IMAGE", "FILE"] },
        message: { conversationId: conversationId, deletedAt: null },
      },
      orderBy: { createdAt: "desc" },
      take: 40,
    }),
    prisma.messageAttachment.findMany({
      where: {
        kind: "LINK",
        message: { conversationId: conversationId, deletedAt: null },
      },
      orderBy: { createdAt: "desc" },
      take: 40,
    }),
  ]);

  const sharedFiles: SharedFileDTO[] = fileAttachments.map(
    (attachment): SharedFileDTO => {
      const name: string = attachment.name ?? "Untitled file";
      return {
        id: attachment.id,
        url: attachment.url,
        name: name,
        size: formatFileSize(attachment.sizeBytes),
        extension: attachment.extension ?? fileExtension(name),
        timestamp: formatConversationTime(attachment.createdAt),
      };
    },
  );

  const sharedLinks: SharedLinkDTO[] = linkAttachments.map(
    (attachment): SharedLinkDTO => ({
      id: attachment.id,
      title: attachment.name ?? attachment.url,
      url: attachment.url,
      domain: attachment.domain ?? "",
    }),
  );

  const info: ConversationInfoDTO = {
    participants: conversation.participants.map(
      (row): MessageUserDTO => toMessageUser(row.user),
    ),
    sharedFiles: sharedFiles,
    sharedLinks: sharedLinks,
  };

  if (conversation.kind === "DIRECT") {
    const other = conversation.participants.find(
      (row) => row.userId !== userId,
    );
    if (other !== undefined) {
      info.directParticipant = toMessageUser(other.user);
    }
  }

  return info;
}

export async function canAccessConversation(
  userId: string,
  conversationId: string,
): Promise<boolean> {
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId: conversationId, userId: userId },
    },
    select: { leftAt: true },
  });
  return participant !== null && participant.leftAt === null;
}

export async function joinChannel(
  userId: string,
  conversationId: string,
): Promise<ConversationDTO | null> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { kind: true, communityId: true },
  });
  if (
    conversation === null ||
    conversation.kind !== "CHANNEL" ||
    conversation.communityId === null
  ) {
    return null;
  }
  const membership = await prisma.communityMember.findUnique({
    where: {
      userId_communityId: {
        userId: userId,
        communityId: conversation.communityId,
      },
    },
    select: { userId: true },
  });
  if (membership === null) {
    return null;
  }
  const now: Date = new Date();
  await prisma.conversationParticipant.upsert({
    where: {
      conversationId_userId: { conversationId: conversationId, userId: userId },
    },
    create: {
      conversationId: conversationId,
      userId: userId,
      role: "MEMBER",
      joinedAt: now,
      lastReadAt: now,
      isMuted: false,
    },
    update: {
      role: "MEMBER",
      joinedAt: now,
      lastReadAt: now,
      leftAt: null,
    },
  });
  const workspace: WorkspaceDTO = await getWorkspace(userId);
  return (
    workspace.conversations.find(
      (row: ConversationDTO) => row.id === conversationId,
    ) ?? null
  );
}

export async function leaveChannel(
  userId: string,
  conversationId: string,
): Promise<boolean> {
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId: conversationId, userId: userId },
    },
    select: { leftAt: true, conversation: { select: { kind: true } } },
  });
  if (
    participant === null ||
    participant.leftAt !== null ||
    participant.conversation.kind !== "CHANNEL"
  ) {
    return false;
  }
  await prisma.conversationParticipant.update({
    where: {
      conversationId_userId: { conversationId: conversationId, userId: userId },
    },
    data: { leftAt: new Date() },
  });
  return true;
}

export async function setMute(
  userId: string,
  conversationId: string,
  isMuted: boolean,
): Promise<boolean> {
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId: conversationId, userId: userId },
    },
    select: { leftAt: true },
  });
  if (participant === null || participant.leftAt !== null) {
    return false;
  }
  await prisma.conversationParticipant.update({
    where: {
      conversationId_userId: { conversationId: conversationId, userId: userId },
    },
    data: { isMuted: isMuted },
  });
  return true;
}

export async function createDirectConversation(
  userId: string,
  username: string,
): Promise<string | null> {
  const handle: string = username.trim().toLowerCase();
  if (handle.length === 0) {
    return null;
  }
  const target = await prisma.user.findFirst({
    where: { username: { equals: handle, mode: "insensitive" } },
    select: { id: true },
  });
  if (target === null || target.id === userId) {
    return null;
  }
  const block = await prisma.userBlock.findFirst({
    where: {
      OR: [
        { blockerId: userId, blockedId: target.id },
        { blockerId: target.id, blockedId: userId },
      ],
    },
    select: { blockerId: true },
  });
  if (block !== null) {
    return null;
  }
  const directKey: string = [userId, target.id].sort().join(":");
  const conversation = await prisma.conversation.upsert({
    where: { directKey: directKey },
    create: {
      kind: "DIRECT",
      directKey: directKey,
      createdById: userId,
      participants: {
        create: [{ userId: userId }, { userId: target.id }],
      },
    },
    update: {},
    select: { id: true },
  });
  await Promise.all(
    [userId, target.id].map(
      async (participantId: string): Promise<void> => {
        await prisma.conversationParticipant.upsert({
          where: {
            conversationId_userId: {
              conversationId: conversation.id,
              userId: participantId,
            },
          },
          create: {
            conversationId: conversation.id,
            userId: participantId,
            role: "MEMBER",
          },
          update: { leftAt: null },
        });
      },
    ),
  );
  return conversation.id;
}
