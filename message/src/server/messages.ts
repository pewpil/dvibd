import { Prisma, type ConversationKind } from "./generated/client.mts";
import type { MessageGetPayload, MessageInclude } from "./generated/models.mts";
import { prisma } from "./db";
import {
  fileExtension,
  formatFileSize,
  formatMessageTime,
} from "./format";
import type {
  MessageAttachmentDTO,
  MessageDTO,
  MessagesResponse,
} from "../types/message";

const MAX_TEXT_LENGTH: number = 4000;
const MAX_UPLOADS: number = 5;
const PAGE_SIZE: number = 50;
const EVENT_PAGE_SIZE: number = 100;
const MARK_READ_LIMIT: number = 500;

const SENDER_USER_SELECT = {
  id: true,
  username: true,
  displayName: true,
  avatarUrl: true,
} satisfies Prisma.UserSelect;

function messageInclude(userId: string): MessageInclude {
  return {
    sender: { select: SENDER_USER_SELECT },
    attachments: { orderBy: { createdAt: "asc" } },
    receipts: { where: { userId: { not: userId } } },
  } satisfies MessageInclude;
}

type MessageRow = MessageGetPayload<{
  include: ReturnType<typeof messageInclude>;
}>;

export type DeliveryStatus = "sent" | "delivered" | "read";

interface AttachmentInput {
  kind: "IMAGE" | "FILE";
  url: string;
  storageKey: string;
  uploadId: string;
  name: string;
  mimeType: string;
  sizeBytes: number;
  extension: string | null;
}

function displayNameOf(user: MessageRow["sender"]): string {
  return user.displayName ?? user.username;
}

function statusOf(
  message: MessageRow,
  userId: string,
  kind: ConversationKind,
): DeliveryStatus {
  if (message.senderId !== userId) {
    return "read";
  }
  const receipts: MessageRow["receipts"] = message.receipts;
  if (receipts.length === 0) {
    return "sent";
  }
  const read: boolean = receipts.every(
    (receipt) => receipt.readAt !== null,
  );
  const delivered: boolean = receipts.every(
    (receipt) => receipt.deliveredAt !== null,
  );
  if (kind === "CHANNEL") {
    if (read) {
      return "read";
    }
    return delivered ? "delivered" : "sent";
  }
  if (read) {
    return "read";
  }
  return delivered ? "delivered" : "sent";
}

function toMessageDTO(
  message: MessageRow,
  userId: string,
  kind: ConversationKind,
): MessageDTO {
  const attachments: MessageAttachmentDTO[] = message.attachments.map(
    (attachment): MessageAttachmentDTO => {
      const name: string = attachment.name ?? "Attachment";
      const kindValue: "image" | "file" | "link" =
        attachment.kind === "IMAGE"
          ? "image"
          : attachment.kind === "FILE"
            ? "file"
            : "link";
      return {
        id: attachment.id,
        kind: kindValue,
        url: attachment.url,
        name: name,
        mimeType: attachment.mimeType,
        size: formatFileSize(attachment.sizeBytes),
        extension: attachment.extension ?? fileExtension(name),
        domain: attachment.domain ?? "",
        timestamp: formatMessageTime(attachment.createdAt),
      };
    },
  );
  const dto: MessageDTO = {
    id: message.id,
    senderId: message.senderId,
    senderName: displayNameOf(message.sender),
    senderAvatar: message.sender.avatarUrl ?? "/profile-picture.svg",
    content: message.text ?? "",
    timestamp: formatMessageTime(message.createdAt),
    createdAt: message.createdAt.toISOString(),
    isOutgoing: message.senderId === userId,
    status: statusOf(message, userId, kind),
    attachments: attachments,
  };
  const image = message.attachments.find(
    (attachment) => attachment.kind === "IMAGE",
  );
  if (image !== undefined) {
    dto.mediaUrl = image.url;
    dto.mediaName = image.name ?? "Attachment";
    dto.mediaSize = formatFileSize(image.sizeBytes);
  }
  return dto;
}

async function readConversationKind(
  userId: string,
  conversationId: string,
): Promise<ConversationKind | null> {
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: {
      kind: true,
      participants: {
        where: { userId: userId, leftAt: null },
        select: { userId: true },
      },
    },
  });
  if (conversation === null || conversation.participants.length === 0) {
    return null;
  }
  return conversation.kind;
}

export async function getMessages(
  userId: string,
  conversationId: string,
  before?: Date,
): Promise<MessagesResponse | null> {
  const kind: ConversationKind | null = await readConversationKind(
    userId,
    conversationId,
  );
  if (kind === null) {
    return null;
  }
  const rows: MessageRow[] = await prisma.message.findMany({
    where: {
      conversationId: conversationId,
      deletedAt: null,
      ...(before === undefined ? {} : { createdAt: { lt: before } }),
    },
    orderBy: { createdAt: "desc" },
    take: PAGE_SIZE,
    include: messageInclude(userId),
  });
  const ordered: MessageRow[] = [...rows].reverse();
  return {
    messages: ordered.map(
      (row: MessageRow): MessageDTO => toMessageDTO(row, userId, kind),
    ),
    hasMore: rows.length === PAGE_SIZE,
  };
}

export async function sendMessage(
  userId: string,
  conversationId: string,
  text: string,
  uploadIds: string[],
): Promise<MessageDTO | null> {
  const kind: ConversationKind | null = await readConversationKind(
    userId,
    conversationId,
  );
  if (kind === null) {
    return null;
  }
  const trimmed: string = text.trim();
  const ids: string[] = [...new Set(uploadIds)];
  if (ids.length > MAX_UPLOADS || trimmed.length > MAX_TEXT_LENGTH) {
    return null;
  }
  if (trimmed.length === 0 && ids.length === 0) {
    return null;
  }

  const uploads =
    ids.length === 0
      ? []
      : await prisma.upload.findMany({
          where: { id: { in: ids }, userId: userId },
          select: {
            id: true,
            name: true,
            mimeType: true,
            sizeBytes: true,
            extension: true,
            storageKey: true,
          },
        });
  if (uploads.length !== ids.length) {
    return null;
  }
  if (ids.length > 0) {
    const alreadyAttached: number = await prisma.messageAttachment.count({
      where: { uploadId: { in: ids } },
    });
    if (alreadyAttached > 0) {
      return null;
    }
  }

  const recipients = await prisma.conversationParticipant.findMany({
    where: {
      conversationId: conversationId,
      leftAt: null,
      userId: { not: userId },
    },
    select: { userId: true },
  });

  const now: Date = new Date();
  const include: ReturnType<typeof messageInclude> = messageInclude(userId);
  let created: MessageRow;
  try {
    created = await prisma.$transaction(
      async (tx: Prisma.TransactionClient): Promise<MessageRow> => {
        const attachments: AttachmentInput[] = uploads.map(
          (upload): AttachmentInput => ({
            kind: upload.mimeType.startsWith("image/") ? "IMAGE" : "FILE",
            url: `/api/uploads/${upload.id}`,
            storageKey: upload.storageKey,
            uploadId: upload.id,
            name: upload.name,
            mimeType: upload.mimeType,
            sizeBytes: upload.sizeBytes,
            extension: upload.extension,
          }),
        );
        const message: MessageRow = await tx.message.create({
          data: {
            conversationId: conversationId,
            senderId: userId,
            text: trimmed.length === 0 ? null : trimmed,
            createdAt: now,
            ...(attachments.length === 0
              ? {}
              : { attachments: { create: attachments } }),
            ...(recipients.length === 0
              ? {}
              : {
                  receipts: {
                    create: recipients.map((recipient) => ({
                      userId: recipient.userId,
                      deliveredAt: now,
                    })),
                  },
                }),
          },
          include: include,
        });
        await tx.conversation.update({
          where: { id: conversationId },
          data: { lastMessageAt: now },
        });
        return message;
      },
    );
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return null;
    }
    throw error;
  }

  return toMessageDTO(created, userId, kind);
}

export async function markRead(
  userId: string,
  conversationId: string,
): Promise<boolean> {
  const participant = await prisma.conversationParticipant.findUnique({
    where: {
      conversationId_userId: { conversationId: conversationId, userId: userId },
    },
    select: { leftAt: true, lastReadAt: true },
  });
  if (participant === null || participant.leftAt !== null) {
    return false;
  }
  const messages: { id: string }[] = await prisma.message.findMany({
    where: {
      conversationId: conversationId,
      deletedAt: null,
      senderId: { not: userId },
      ...(participant.lastReadAt === null
        ? {}
        : { createdAt: { gt: participant.lastReadAt } }),
    },
    orderBy: { createdAt: "asc" },
    take: MARK_READ_LIMIT,
    select: { id: true },
  });
  const messageIds: string[] = messages.map((message) => message.id);
  const now: Date = new Date();
  await prisma.$transaction(
    async (tx: Prisma.TransactionClient): Promise<void> => {
      if (messageIds.length > 0) {
        await tx.messageReceipt.createMany({
          data: messageIds.map(
            (messageId: string): {
              messageId: string;
              userId: string;
              deliveredAt: Date;
              readAt: Date;
            } => ({
              messageId: messageId,
              userId: userId,
              deliveredAt: now,
              readAt: now,
            }),
          ),
          skipDuplicates: true,
        });
        await tx.messageReceipt.updateMany({
          where: { userId: userId, messageId: { in: messageIds } },
          data: { deliveredAt: now, readAt: now },
        });
      }
      await tx.conversationParticipant.update({
        where: {
          conversationId_userId: {
            conversationId: conversationId,
            userId: userId,
          },
        },
        data: { lastReadAt: now },
      });
    },
  );
  return true;
}

export async function getMessageEvents(
  userId: string,
  conversationId: string,
  kind: ConversationKind,
  after: Date,
): Promise<MessageDTO[]> {
  const rows: MessageRow[] = await prisma.message.findMany({
    where: {
      conversationId: conversationId,
      deletedAt: null,
      createdAt: { gt: after },
    },
    orderBy: { createdAt: "asc" },
    take: EVENT_PAGE_SIZE,
    include: messageInclude(userId),
  });
  return rows.map(
    (row: MessageRow): MessageDTO => toMessageDTO(row, userId, kind),
  );
}

export async function getReceiptStatusUpdates(
  userId: string,
  conversationId: string,
  after: Date,
): Promise<{ messageId: string; status: DeliveryStatus }[]> {
  const rows: MessageRow[] = await prisma.message.findMany({
    where: {
      conversationId: conversationId,
      senderId: userId,
      deletedAt: null,
      receipts: { some: { updatedAt: { gt: after } } },
    },
    orderBy: { createdAt: "desc" },
    take: EVENT_PAGE_SIZE,
    include: messageInclude(userId),
  });
  if (rows.length === 0) {
    return [];
  }
  const conversation = await prisma.conversation.findUnique({
    where: { id: conversationId },
    select: { kind: true },
  });
  const kind: ConversationKind = conversation?.kind ?? "DIRECT";
  const seen: Set<string> = new Set<string>();
  const updates: { messageId: string; status: DeliveryStatus }[] = [];
  for (const row of rows) {
    if (seen.has(row.id)) {
      continue;
    }
    seen.add(row.id);
    updates.push({ messageId: row.id, status: statusOf(row, userId, kind) });
  }
  return updates;
}
