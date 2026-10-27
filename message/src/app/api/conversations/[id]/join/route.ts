import { currentUser, forbidden, unauthorized } from "../../../../../server/api";
import { joinChannel } from "../../../../../server/conversations";
import type { ConversationDTO } from "../../../../../types/message";

// POST /api/conversations/[id]/join
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await currentUser();
  if (user === null) {
    return unauthorized();
  }
  const { id } = await context.params;

  const conversation: ConversationDTO | null = await joinChannel(user.id, id);
  if (conversation === null) {
    return forbidden();
  }
  return Response.json({ conversation: conversation });
}
