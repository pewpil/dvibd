const MINUTE_MS: number = 60_000;
const HOUR_MS: number = 60 * MINUTE_MS;
const DAY_MS: number = 24 * HOUR_MS;

export function compactCount(value: number): string {
  if (value >= 1_000_000) {
    return `${trimDecimal(value / 1_000_000)}m`;
  }
  if (value >= 1_000) {
    return `${trimDecimal(value / 1_000)}k`;
  }
  return String(value);
}

function trimDecimal(value: number): string {
  const rounded: number = Math.round(value * 10) / 10;
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1);
}

export function relativeTime(date: Date, now: Date = new Date()): string {
  const minutes: number = Math.max(
    1,
    Math.round((now.getTime() - date.getTime()) / MINUTE_MS),
  );
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours: number = Math.round(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }
  const days: number = Math.round(hours / 24);
  if (days < 7) {
    return `${days}d`;
  }
  const weeks: number = Math.round(days / 7);
  if (weeks < 5) {
    return `${weeks}w`;
  }
  const months: number = Math.round(days / 30);
  if (months < 12) {
    return `${months}mo`;
  }
  return `${Math.round(days / 365)}y`;
}

export function hoursAgo(hours: number, now: Date = new Date()): Date {
  return new Date(now.getTime() - hours * HOUR_MS);
}

export function minutesAgo(minutes: number, now: Date = new Date()): Date {
  return new Date(now.getTime() - minutes * MINUTE_MS);
}

export function daysAgo(days: number, now: Date = new Date()): Date {
  return new Date(now.getTime() - days * DAY_MS);
}

export function parseHashtags(text: string): string[] {
  const names = new Set<string>();
  for (const match of text.matchAll(/#([\p{L}\p{N}_]+)/gu)) {
    names.add(match[1]);
  }
  return [...names];
}
