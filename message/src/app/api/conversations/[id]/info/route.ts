import { currentUser, forbidden, unauthorized } from "../../../../../server/api";
import { getConversationInfo } from "../../../../../server/conversations";
import type { ConversationInfoDTO } from "../../../../../types/message";

// GET /api/conversations/[id]/info
export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await currentUser();
  if (user === null) {
    return unauthorized();
  }
  const { id } = await context.params;
  const info: ConversationInfoDTO | null = await getConversationInfo(
    user.id,
    id,
  );
  if (info === null) {
    return forbidden();
  }
  return Response.json(info);
}
