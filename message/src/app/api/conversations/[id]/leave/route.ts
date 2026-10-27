import { currentUser, forbidden, unauthorized } from "../../../../../server/api";
import { leaveChannel } from "../../../../../server/conversations";

// POST /api/conversations/[id]/leave
export async function POST(
  _request: Request,
  context: { params: Promise<{ id: string }> },
): Promise<Response> {
  const user = await currentUser();
  if (user === null) {
    return unauthorized();
  }
  const { id } = await context.params;

  const left: boolean = await leaveChannel(user.id, id);
  if (!left) {
    return forbidden();
  }
  return Response.json({ ok: true });
}
