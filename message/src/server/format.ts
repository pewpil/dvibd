import type { PresenceStatus } from "../types/message";

const MINUTE_MS: number = 60_000;
const DAY_MS: number = 86_400_000;

const timeFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

const shortDateFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
});

const longDateFormatter: Intl.DateTimeFormat = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

function startOfDay(value: Date): number {
  return new Date(
    value.getFullYear(),
    value.getMonth(),
    value.getDate(),
  ).getTime();
}

function trimDecimal(value: number): string {
  const rounded: number = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function formatConversationTime(
  date: Date,
  now: Date = new Date(),
): string {
  const elapsedDays: number = Math.round(
    (startOfDay(now) - startOfDay(date)) / DAY_MS,
  );
  if (elapsedDays <= 0) {
    return timeFormatter.format(date);
  }
  if (elapsedDays === 1) {
    return "Yesterday";
  }
  if (elapsedDays < 7) {
    return `${elapsedDays}d ago`;
  }
  if (date.getFullYear() === now.getFullYear()) {
    return shortDateFormatter.format(date);
  }
  return longDateFormatter.format(date);
}

export function formatMessageTime(date: Date): string {
  return timeFormatter.format(date);
}

export function formatFileSize(bytes: number | null): string {
  if (bytes === null || bytes <= 0) {
    return "0 B";
  }
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1_048_576) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }
  if (bytes < 1_073_741_824) {
    return `${trimDecimal(bytes / 1_048_576)} MB`;
  }
  return `${trimDecimal(bytes / 1_073_741_824)} GB`;
}

export function fileExtension(name: string): string {
  const trimmed: string = name.trim();
  const dot: number = trimmed.lastIndexOf(".");
  if (dot <= 0 || dot === trimmed.length - 1) {
    return "FILE";
  }
  return trimmed.slice(dot + 1).toUpperCase();
}

export function derivePresence(
  lastSeenAt: Date | null,
  now: Date = new Date(),
): PresenceStatus {
  if (lastSeenAt === null) {
    return "offline";
  }
  const elapsed: number = now.getTime() - lastSeenAt.getTime();
  if (elapsed <= 2 * MINUTE_MS) {
    return "online";
  }
  if (elapsed <= 10 * MINUTE_MS) {
    return "idle";
  }
  return "offline";
}
