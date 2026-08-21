import type { APIEvent } from "@solidjs/start/server";
import { readSession } from "../../server/session";

// GET /session
export async function GET(_event: APIEvent): Promise<Response> {
  const session = await readSession();
  if (session === null) {
    return Response.json({ error: "Not authenticated." }, { status: 401 });
  }
  return Response.json(session);
}
