// modules/users/users.service.ts
// Business logic for the users domain. This is the ONLY layer that talks to the
// database (via Drizzle). It returns plain data to the controller and throws
// HttpError for domain failures the controller/error-handler can map to a
// response. Each query below is explained inline.

import { eq } from "drizzle-orm";

import { db } from "../../db/client.ts";
import { users, type NewUser, type User } from "../../db/schema/users.ts";
import { HttpError } from "../../lib/http-error.ts";

// The public shape we return to callers. We deliberately OMIT passwordHash so a
// secret never leaks out of the service into a response.
export type PublicUser = Omit<User, "passwordHash">;

// Reusable column selection: exactly the fields that are safe to expose. Passing
// this to `.select()` means the SQL only ever asks Postgres for these columns.
const publicColumns = {
  id: users.id,
  email: users.email,
  username: users.username,
  createdAt: users.createdAt,
} as const;

// Return every user (public columns only).
// Drizzle reads as: SELECT id, email, username, created_at FROM users;
export async function listUsers(): Promise<PublicUser[]> {
  const rows: PublicUser[] = await db.select(publicColumns).from(users);
  return rows;
}

// Find one user by primary key. Returns null when not found (no throw) so the
// controller decides how a "missing" case maps to HTTP.
// SQL: SELECT ... FROM users WHERE id = $1 LIMIT 1;
export async function findUserById(id: string): Promise<PublicUser | null> {
  const rows: PublicUser[] = await db
    .select(publicColumns)
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  // `.select()` always returns an array; take the first row or null.
  return rows[0] ?? null;
}

// Lookup by email. This one includes passwordHash because it's what auth will
// need later to verify a login. Kept separate from the public lookups on
// purpose so secrets are opt-in.
// SQL: SELECT * FROM users WHERE email = $1 LIMIT 1;
export async function findUserByEmail(email: string): Promise<User | null> {
  const rows: User[] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return rows[0] ?? null;
}

// Insert a new user and return the created row (public columns).
// `.returning(...)` asks Postgres to hand back the inserted row in the same
// round-trip — including DB-generated values (id, created_at).
// SQL: INSERT INTO users (...) VALUES (...) RETURNING id, email, username, created_at;
export async function createUser(input: NewUser): Promise<PublicUser> {
  // Guard against duplicates up front so we can return a clean 409 instead of a
  // raw Postgres unique-constraint error. (There's still a small race window;
  // the DB unique constraints remain the ultimate source of truth.)
  const existing: User | null = await findUserByEmail(input.email);
  if (existing !== null) {
    throw new HttpError(409, "A user with this email already exists");
  }

  const rows: PublicUser[] = await db
    .insert(users)
    .values(input)
    .returning(publicColumns);

  // Insert of a single row returns exactly one row; if not, something is wrong.
  const created: PublicUser | undefined = rows[0];
  if (created === undefined) {
    throw new HttpError(500, "Failed to create user");
  }

  return created;
}
