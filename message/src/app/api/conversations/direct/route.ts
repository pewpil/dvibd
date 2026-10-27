import { z } from "zod";
import { currentUser, unauthorized } from "../../../../server/api";
import { createDirectConversation } from "../../../../server/conversations";

const directSchema = z
  .object({
    username: z.string().min(1).max(32),
  })
  .strict();

// POST /api/conversations/direct
export async function POST(request: Request): Promise<Response> {
  const user = await currentUser();
  if (user === null) {
    return unauthorized();
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json(
      { error: "Invalid direct conversation payload." },
      { status: 400 },
    );
  }
  const parsed = directSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: "Invalid direct conversation payload." },
      { status: 400 },
    );
  }

  const conversationId: string | null = await createDirectConversation(
    user.id,
    parsed.data.username,
  );
  if (conversationId === null) {
    return Response.json(
      { error: "This conversation cannot be started." },
      { status: 400 },
    );
  }
  return Response.json({ conversationId: conversationId }, { status: 201 });
}
