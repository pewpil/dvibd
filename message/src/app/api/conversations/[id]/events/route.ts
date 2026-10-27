import {
  currentUser,
  forbidden,
  notFound,
  unauthorized,
} from "../../../../../server/api";
import { canAccessConversation } from "../../../../../server/conversations";
import { prisma } from "../../../../../server/db";
import { touchPresence } from "../../../../../server/events";
import {
  getMessageEvents,
  getReceiptStatusUpdates,
  type DeliveryStatus,
} from "../../../../../server/messages";
import type { ConversationKind } from "../../../../../server/generated/client.mts";
import type { MessageDTO } from "../../../../../types/message";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const POLL_INTERVAL_MS: number = 2000;
const PRESENCE_INTERVAL_MS: number = 10000;
const STREAM_LIFETIME_MS: number = 25000;

const TEXT_ENCODER: TextEncoder = new TextEncoder();

function sseFrame(event: string, data: string): Uint8Array {
  return TEXT_ENCODER.encode(`event: ${event}\ndata: ${data}\n\n`);
}

// GET /api/conversations/[id]/events
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await currentUser();
  if (user === null) {
    return unauthorized();
  }
  const userId: string = user.id;
  const { id } = await context.params;

  const allowed: boolean = await canAccessConversation(userId, id);
  if (!allowed) {
    return forbidden();
  }

  const url: URL = new URL(request.url);
  let after: Date = new Date();
  const afterRaw: string | null = url.searchParams.get("after");
  if (afterRaw !== null) {
    const parsed: Date = new Date(afterRaw);
    if (Number.isNaN(parsed.getTime())) {
      return Response.json({ error: "Invalid after cursor." }, { status: 400 });
    }
    after = parsed;
  }
  let receiptAfter: Date = new Date();
  const receiptAfterRaw: string | null = url.searchParams.get("receiptAfter");
  if (receiptAfterRaw !== null) {
    const parsed: Date = new Date(receiptAfterRaw);
    if (Number.isNaN(parsed.getTime())) {
      return Response.json(
        { error: "Invalid receiptAfter cursor." },
        { status: 400 },
      );
    }
    receiptAfter = parsed;
  }

  const conversation = await prisma.conversation.findUnique({
    where: { id: id },
    select: { kind: true },
  });
  if (conversation === null) {
    return notFound();
  }
  const kind: ConversationKind = conversation.kind;

  let closed: boolean = false;
  let pollTimer: ReturnType<typeof setTimeout> | null = null;
  let presenceTimer: ReturnType<typeof setTimeout> | null = null;
  let lifetimeTimer: ReturnType<typeof setTimeout> | null = null;
  let controllerRef: ReadableStreamDefaultController<Uint8Array> | null = null;

  function clearTimers(): void {
    if (pollTimer !== null) {
      clearTimeout(pollTimer);
      pollTimer = null;
    }
    if (presenceTimer !== null) {
      clearTimeout(presenceTimer);
      presenceTimer = null;
    }
    if (lifetimeTimer !== null) {
      clearTimeout(lifetimeTimer);
      lifetimeTimer = null;
    }
  }

  function close(): void {
    if (closed) {
      return;
    }
    closed = true;
    clearTimers();
    request.signal.removeEventListener("abort", onAbort);
    const controller: ReadableStreamDefaultController<Uint8Array> | null =
      controllerRef;
    controllerRef = null;
    if (controller === null) {
      return;
    }
    try {
      controller.close();
    } catch {
      return;
    }
  }

  function enqueue(event: string, data: string): void {
    if (closed) {
      return;
    }
    const controller: ReadableStreamDefaultController<Uint8Array> | null =
      controllerRef;
    if (controller === null) {
      return;
    }
    try {
      controller.enqueue(sseFrame(event, data));
    } catch {
      close();
    }
  }

  function onAbort(): void {
    close();
  }

  function schedulePoll(): void {
    pollTimer = setTimeout((): void => {
      void poll();
    }, POLL_INTERVAL_MS);
  }

  function schedulePresence(): void {
    presenceTimer = setTimeout((): void => {
      void pingPresence();
    }, PRESENCE_INTERVAL_MS);
  }

  async function pingPresence(): Promise<void> {
    if (closed) {
      return;
    }
    await touchPresence(userId).catch((): void => undefined);
    if (closed) {
      return;
    }
    schedulePresence();
  }

  async function poll(): Promise<void> {
    if (closed) {
      return;
    }
    try {
      const messages: MessageDTO[] = await getMessageEvents(
        userId,
        id,
        kind,
        after,
      );
      for (const message of messages) {
        enqueue("message", JSON.stringify(message));
      }
      if (messages.length > 0) {
        const latest: MessageDTO = messages[messages.length - 1];
        after = new Date(latest.createdAt);
      }

      const receiptCursor: Date = new Date();
      const updates: { messageId: string; status: DeliveryStatus }[] =
        await getReceiptStatusUpdates(userId, id, receiptAfter);
      for (const update of updates) {
        enqueue("receipt", JSON.stringify(update));
      }
      if (updates.length > 0) {
        receiptAfter = receiptCursor;
      }
    } catch {
      enqueue(
        "error",
        JSON.stringify({ message: "The stream could not be updated." }),
      );
      close();
      return;
    }
    if (closed) {
      return;
    }
    schedulePoll();
  }

  const stream: ReadableStream<Uint8Array> = new ReadableStream<Uint8Array>({
    start(controller: ReadableStreamDefaultController<Uint8Array>): void {
      controllerRef = controller;
      request.signal.addEventListener("abort", onAbort);
      enqueue("ready", JSON.stringify({}));
      lifetimeTimer = setTimeout((): void => {
        close();
      }, STREAM_LIFETIME_MS);
      schedulePoll();
      schedulePresence();
    },
    cancel(): void {
      close();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    },
  });
}
