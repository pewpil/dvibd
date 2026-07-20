// config/env.ts
// Loads process environment variables and validates them into a typed, frozen
// config object the rest of the app imports. Using zod means a missing/invalid
// var fails fast at startup with a clear message instead of surfacing later.

import "dotenv/config";
import { z } from "zod";

// TODO: define the schema (NODE_ENV, PORT, DATABASE_URL, CORS_ORIGIN) and parse
// process.env against it, then export the parsed result as `env`.
const envSchema = z.object({
  // NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  // PORT: z.coerce.number().default(4000),
  // DATABASE_URL: z.string().url(),
  // CORS_ORIGIN: z.string().default("http://localhost:3000"),
});

export type Env = z.infer<typeof envSchema>;

// export const env: Env = envSchema.parse(process.env);
export {};
