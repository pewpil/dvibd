// modules/status/status.service.ts
// Business logic for statuses: create, list, and retrieve.

import { eq, desc } from "drizzle-orm";

import { db } from "../../db/client.ts";
import { statuses, type Status } from "../../db/schema/statuses.ts";
import { users, type User } from "../../db/schema/users.ts";
import { HttpError } from "../../lib/http-error.ts";
import type { CreateStatusInput } from "./status.validation.ts";

type StatusAuthor = Pick<User, "id" | "email" | "username">;
export type StatusWithAuthor = Omit<Status, "authorId"> & { author: StatusAuthor | null };

export async function createStatus(
  input: CreateStatusInput,
  authorId: string,
): Promise<StatusWithAuthor> {
  const result: Status[] = await db
    .insert(statuses)
    .values({
      authorId,
      content: input.content,
      media: input.media ?? null,
      replyToId: input.replyToId ?? null,
    })
    .returning();

  if (result.length === 0) {
    throw new HttpError(500, "Failed to create status");
  }

  const status: Status = result[0]!;

  const authorResult: StatusAuthor[] = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
    })
    .from(users)
    .where(eq(users.id, authorId))
    .limit(1);

  return {
    ...status,
    author: authorResult[0] ?? null,
  };
}

export async function listStatuses(
  limit: number,
  offset: number,
): Promise<StatusWithAuthor[]> {
  const rows: StatusWithAuthor[] = await db
    .select({
      id: statuses.id,
      content: statuses.content,
      media: statuses.media,
      replyToId: statuses.replyToId,
      createdAt: statuses.createdAt,
      author: {
        id: users.id,
        email: users.email,
        username: users.username,
      },
    })
    .from(statuses)
    .leftJoin(users, eq(statuses.authorId, users.id))
    .orderBy(desc(statuses.createdAt))
    .limit(limit)
    .offset(offset);

  return rows;
}

export async function getStatusById(
  id: string,
): Promise<StatusWithAuthor> {
  const rows: StatusWithAuthor[] = await db
    .select({
      id: statuses.id,
      content: statuses.content,
      media: statuses.media,
      replyToId: statuses.replyToId,
      createdAt: statuses.createdAt,
      author: {
        id: users.id,
        email: users.email,
        username: users.username,
      },
    })
    .from(statuses)
    .leftJoin(users, eq(statuses.authorId, users.id))
    .where(eq(statuses.id, id))
    .limit(1);

  if (rows.length === 0) {
    throw new HttpError(404, "Status not found");
  }

  return rows[0]!;
}
