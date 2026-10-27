import type { WorkspaceDTO } from "../../../types/message";
import { currentUser, unauthorized } from "../../../server/api";
import { getWorkspace } from "../../../server/conversations";

// GET /api/conversations
export async function GET(): Promise<Response> {
  const user = await currentUser();
  if (user === null) {
    return unauthorized();
  }
  const workspace: WorkspaceDTO = await getWorkspace(user.id);
  return Response.json(workspace);
}
