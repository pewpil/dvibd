import { cookies } from "next/headers";
import { prisma } from "./db";
import { SESSION_COOKIE, validateRefreshToken } from "./tokens";

export async function isAuthenticated(): Promise<boolean> {
  const cookieStore: Awaited<ReturnType<typeof cookies>> = await cookies();
  const raw: string | undefined = cookieStore.get(SESSION_COOKIE)?.value;
  if (raw === undefined) {
    return false;
  }
  return (await validateRefreshToken(raw)) !== null;
}