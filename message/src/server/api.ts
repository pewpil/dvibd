import { readSession, type SessionPayload } from "./session";
import type { SafeUser } from "./user";

export async function currentUser(): Promise<SafeUser | null> {
  const session: SessionPayload | null = await readSession();
  if (session === null) {
    return null;
  }
  return session.user;
}

export function unauthorized(): Response {
  return Response.json({ error: "Sign in required." }, { status: 401 });
}

export function forbidden(): Response {
  return Response.json(
    { error: "You do not have access to this conversation." },
    { status: 403 },
  );
}

export function notFound(): Response {
  return Response.json({ error: "Conversation not found." }, { status: 404 });
}
