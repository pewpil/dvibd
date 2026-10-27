import { z } from "zod";
import { currentUser, forbidden, unauthorized } from "../../../../server/api";
import { setMute } from "../../../../server/conversations";

const muteSchema = z
  .object({
    isMuted: z.boolean(),
  })
  .strict();

// PATCH /api/conversations/[id]
export async function PATCH(
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
    return Response.json({ error: "Invalid mute payload." }, { status: 400 });
  }
  const parsed = muteSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: "Invalid mute payload." }, { status: 400 });
  }

  const updated: boolean = await setMute(user.id, id, parsed.data.isMuted);
  if (!updated) {
    return forbidden();
  }
  return Response.json({ ok: true });
}
