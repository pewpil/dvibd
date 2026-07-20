// db/client.ts
// Creates a single PostgreSQL connection pool (node-postgres) and wraps it with
// Drizzle. Everything that touches the database imports `db` from here so we
// share one pool across the process. No queries live here.

import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

import { env } from "../config/env.ts";
import * as schema from "./schema/index.ts";

const pool = new Pool({ connectionString: env.DATABASE_URL });

export const db = drizzle(pool, { schema });
