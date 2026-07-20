// db/schema/index.ts
// Barrel file that re-exports every table definition. Drizzle's client and
// drizzle-kit both consume the combined schema from here.

export * from "./users.ts";
