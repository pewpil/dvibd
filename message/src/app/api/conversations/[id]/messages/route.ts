import { z } from "zod";
import {
  currentUser,
  forbidden,
  unauthorized,
} from "../../../../../server/api";
import { canAccessConversation } from "../../../../../server/conversations";
import { getMessages, sendMessage } from "../../../../../server/messages";
import type { MessageDTO, MessagesResponse } from "../../../../../types/message";

const sendSchema = z
  .object({
    text: z.string().optional(),
    uploadIds: z.array(z.string().min(1)).max(5).optional(),
  })
  .strict();

// GET /api/conversations/[id]/messages
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await currentUser();
  if (user === null) {
    return unauthorized();
  }
  const { id } = await context.params;

  const url: URL = new URL(request.url);
  const beforeRaw: string | null = url.searchParams.get("before");
  let before: Date | undefined = undefined;
  if (beforeRaw !== null) {
    const parsedDate: Date = new Date(beforeRaw);
    if (Number.isNaN(parsedDate.getTime())) {
      return Response.json({ error: "Invalid before cursor." }, { status: 400 });
    }
    before = parsedDate;
  }

  const response: MessagesResponse | null = await getMessages(user.id, id, before);
  if (response === null) {
    return forbidden();
  }
  return Response.json(response);
}

// POST /api/conversations/[id]/messages
export async function POST(
  request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await currentUser();
  if (user === null) {
    return unauthorized();
  }
  const { id } = await context.params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid message payload." }, { status: 400 });
  }
  const parsed = sendSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid message payload." }, { status: 400 });
  }

  const allowed: boolean = await canAccessConversation(user.id, id);
  if (!allowed) {
    return forbidden();
  }

  const message: MessageDTO | null = await sendMessage(
    user.id,
    id,
    parsed.data.text ?? "",
    parsed.data.uploadIds ?? [],
  );
  if (message === null) {
    return Response.json(
      { error: "Message could not be sent. Check the text and attachments." },
      { status: 400 },
    );
  }
  return Response.json({ message: message }, { status: 201 });
}
