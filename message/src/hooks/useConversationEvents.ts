"use client";

import { useEffect, useRef } from "react";
import type { MessageDTO } from "../types/message";

export interface ReceiptUpdate {
  messageId: string;
  status: MessageDTO["status"];
}

interface UseConversationEventsOptions {
  conversationId: string | null;
  enabled: boolean;
  after: string | null;
  onMessage: (message: MessageDTO) => void;
  onReceipt: (receipt: ReceiptUpdate) => void;
}

interface MessageFields {
  id?: string;
  createdAt?: string;
}

interface ReceiptFields {
  messageId?: string;
  status?: unknown;
}

const RECONNECT_DELAY_MS: number = 2000;

function isMessageStatus(value: unknown): value is MessageDTO["status"] {
  return value === "sent" || value === "delivered" || value === "read";
}

function eventData(event: Event): string | null {
  if (event instanceof MessageEvent && typeof event.data === "string") {
    return event.data;
  }
  return null;
}

function parseMessage(data: string | null): MessageDTO | null {
  if (data === null) {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(data);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) {
    return null;
  }
  const fields: MessageFields = parsed as MessageFields;
  if (typeof fields.id !== "string" || typeof fields.createdAt !== "string") {
    return null;
  }
  return parsed as MessageDTO;
}

function parseReceipt(data: string | null): ReceiptUpdate | null {
  if (data === null) {
    return null;
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(data);
  } catch {
    return null;
  }
  if (typeof parsed !== "object" || parsed === null) {
    return null;
  }
  const fields: ReceiptFields = parsed as ReceiptFields;
  if (
    typeof fields.messageId !== "string" ||
    !isMessageStatus(fields.status)
  ) {
    return null;
  }
  return { messageId: fields.messageId, status: fields.status };
}

export function useConversationEvents(
  options: UseConversationEventsOptions,
): void {
  const messageRef = useRef(options.onMessage);
  const receiptRef = useRef(options.onReceipt);
  const afterRef = useRef(options.after);
  const conversationId: string | null = options.conversationId;
  const enabled: boolean = options.enabled;

  useEffect((): void => {
    messageRef.current = options.onMessage;
    receiptRef.current = options.onReceipt;
    afterRef.current = options.after;
  }, [options.onMessage, options.onReceipt, options.after]);

  useEffect((): (() => void) => {
    if (conversationId === null || !enabled) {
      return (): void => {};
    }

    let source: EventSource | null = null;
    let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
    let stopped: boolean = false;
    let receiptCursor: string = new Date().toISOString();

    const closeSource = (): void => {
      if (source === null) {
        return;
      }
      source.onerror = null;
      source.close();
      source = null;
    };

    const scheduleReconnect = (): void => {
      if (stopped || reconnectTimer !== null) {
        return;
      }
      reconnectTimer = setTimeout((): void => {
        reconnectTimer = null;
        if (!stopped) {
          connect();
        }
      }, RECONNECT_DELAY_MS);
    };

    const fail = (): void => {
      closeSource();
      scheduleReconnect();
    };

    const handleMessage = (event: Event): void => {
      const message: MessageDTO | null = parseMessage(eventData(event));
      if (message === null) {
        return;
      }
      afterRef.current = message.createdAt;
      messageRef.current(message);
    };

    const handleReceipt = (event: Event): void => {
      const receipt: ReceiptUpdate | null = parseReceipt(eventData(event));
      if (receipt === null) {
        return;
      }
      receiptCursor = new Date().toISOString();
      receiptRef.current(receipt);
    };

    const handleStreamError = (): void => {
      fail();
    };

    const handleTransportError = (): void => {
      fail();
    };

    const connect = (): void => {
      if (stopped) {
        return;
      }
      closeSource();
      const afterCursor: string = afterRef.current ?? new Date().toISOString();
      const query: string = `after=${encodeURIComponent(
        afterCursor,
      )}&receiptAfter=${encodeURIComponent(receiptCursor)}`;
      const url: string = `/api/conversations/${encodeURIComponent(
        conversationId,
      )}/events?${query}`;
      const next: EventSource = new EventSource(url);
      next.addEventListener("message", handleMessage);
      next.addEventListener("receipt", handleReceipt);
      next.addEventListener("error", handleStreamError);
      next.onerror = handleTransportError;
      source = next;
    };

    connect();

    return (): void => {
      stopped = true;
      if (reconnectTimer !== null) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }
      closeSource();
    };
  }, [conversationId, enabled]);
}
