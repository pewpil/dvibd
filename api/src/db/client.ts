// db/client.ts
// Creates a single PostgreSQL connection pool (node-postgres) and wraps it with
// Drizzle. Everything that touches the database imports `db` from here so we
// share one pool across the process. No queries live here.

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import * as schema from "./schema/index.ts";

// TODO: build the Pool from env.DATABASE_URL and pass it to drizzle() along with
// the imported schema so queries are fully typed.
// const pool = new Pool({ connectionString: env.DATABASE_URL });
// export const db = drizzle(pool, { schema });

void drizzle;
void Pool;
void schema;

export {};
