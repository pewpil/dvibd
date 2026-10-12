import { readSession } from "../../../../server/session";

// GET /api/session
export async function GET(): Promise<Response> {
  const session = await readSession();
  return Response.json({ user: session?.user ?? null });
}