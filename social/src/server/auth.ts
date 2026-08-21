"use server";

import { readSession, type SessionPayload } from "./session";

export async function fetchSession(): Promise<SessionPayload | null> {
  return await readSession();
}
