import { currentUser, forbidden, unauthorized } from "../../../../../server/api";
import { canAccessConversation } from "../../../../../server/conversations";
import { markRead } from "../../../../../server/messages";

// POST /api/conversations/[id]/read
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await currentUser();
  if (user === null) {
    return unauthorized();
  }
  const { id } = await context.params;

  const allowed: boolean = await canAccessConversation(user.id, id);
  if (!allowed) {
    return forbidden();
  }
  const marked: boolean = await markRead(user.id, id);
  if (!marked) {
    return forbidden();
  }
  return Response.json({ ok: true });
}
