// db/schema/users.ts
// The `users` table definition. Drizzle describes tables in TypeScript; from
// this single source of truth drizzle-kit generates SQL migrations and the
// query builder infers fully-typed rows.

import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  // Primary key. `uuid()` maps to Postgres' native UUID type.
  // `.defaultRandom()` makes Postgres generate a random UUID (gen_random_uuid())
  // on insert, so the app never has to supply an id.
  id: uuid("id").primaryKey().defaultRandom(),

  // Login identifier. `varchar` has a max length; `.notNull()` forbids NULL and
  // `.unique()` adds a UNIQUE constraint so two users can't share an email.
  email: varchar("email", { length: 255 }).notNull().unique(),

  // Public handle. Also unique and required.
  username: varchar("username", { length: 50 }).notNull().unique(),

  // The hashed password (never the plaintext). `text` has no length limit,
  // which suits hash outputs like bcrypt/argon2.
  passwordHash: text("password_hash").notNull(),

  // Creation timestamp. `withTimezone` stores it as timestamptz (UTC-aware).
  // `.defaultNow()` lets Postgres set it to the current time on insert.
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

// Inferred row types generated from the table above — no manual duplication.
// `User` is a row you read back; `NewUser` is the shape you pass to insert
// (columns with defaults become optional).
export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
