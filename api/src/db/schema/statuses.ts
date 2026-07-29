// db/schema/statuses.ts
// The `statuses` table definition. Statuses are short-form text posts
// limited to 256 characters. Drizzle describes tables in TypeScript; from
// this single source of truth drizzle-kit generates SQL migrations and the
// query builder infers fully-typed rows.

import { pgTable, uuid, varchar, jsonb, timestamp, type AnyPgColumn } from "drizzle-orm/pg-core";
import { users } from "./users.ts";

export const statuses = pgTable("statuses", {
  // Primary key. `uuid()` maps to Postgres' native UUID type.
  // `.defaultRandom()` makes Postgres generate a random UUID (gen_random_uuid())
  // on insert, so the app never has to supply an id.
  id: uuid("id").primaryKey().defaultRandom(),

  // Foreign key to the users table. References the author of the status.
  authorId: uuid("author_id")
    .notNull()
    .references(() => users.id),

  // The short-form text content, limited to 256 characters.
  content: varchar("content", { length: 256 }).notNull(),

  // Optional array of media URLs (images, etc.). Stored as JSONB for flexibility.
  media: jsonb("media"),

  // Self-referencing foreign key for reply threading. NULL means this is a
  // top-level status, not a reply.
  replyToId: uuid("reply_to_id").references((): AnyPgColumn => statuses.id),

  // Creation timestamp. `withTimezone` stores it as timestamptz (UTC-aware).
  // `.defaultNow()` lets Postgres set it to the current time on insert.
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Inferred row types generated from the table above — no manual duplication.
// `Status` is a row you read back; `NewStatus` is the shape you pass to insert
// (columns with defaults become optional).
export type Status = typeof statuses.$inferSelect;
export type NewStatus = typeof statuses.$inferInsert;
