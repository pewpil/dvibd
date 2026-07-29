// db/schema/likes.ts
// The `likes` join table. Records which users have liked which statuses.
// A unique constraint on (user_id, status_id) prevents duplicate likes.

import { pgTable, uuid, timestamp, uniqueIndex } from "drizzle-orm/pg-core";
import { users } from "./users.ts";
import { statuses } from "./statuses.ts";

export const likes = pgTable(
  "likes",
  {
    id: uuid("id").primaryKey().defaultRandom(),

    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),

    statusId: uuid("status_id")
      .notNull()
      .references(() => statuses.id),

    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    // Prevent a user from liking the same status more than once.
    uniqueIndex("unique_like").on(table.userId, table.statusId),
  ],
);

export type Like = typeof likes.$inferSelect;
export type NewLike = typeof likes.$inferInsert;
