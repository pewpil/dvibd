// config/env.ts
// Loads process environment variables and validates them into a typed, frozen
// config object the rest of the app imports. Using zod means a missing/invalid
// var fails fast at startup with a clear message instead of surfacing later.
//
// Defaults are environment-aware: in development and test we provide sensible
// fallbacks (matching db/docker-compose.yml) so the app runs with zero config.
// In production every value is required — no defaults — so a misconfigured
// deployment fails loudly at startup instead of silently using dev values.

import "dotenv/config";
import { z, type ZodCoercedNumber, type ZodString, type ZodSafeParseResult } from "zod";

type DevDefaults = {
  readonly PORT: number;
  readonly DATABASE_URL: string;
  readonly CORS_ORIGIN: string;
};

const NODE_ENV: string = process.env.NODE_ENV ?? "development";
const isProd: boolean = NODE_ENV === "production";

const devDefaults: DevDefaults = {
  PORT: 4000,
  DATABASE_URL: "postgres://dvibd:dvibd_dev_password@localhost:5432/dvibd",
  CORS_ORIGIN: "http://localhost:3000",
};

// In production every value is required (no defaults). In dev/test we attach
// fallbacks so the app runs with zero configuration.
const port: ZodCoercedNumber<unknown> = z.coerce.number().int().positive();
const databaseUrl: ZodString = z.string().url();
const corsOrigin: ZodString = z.string();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: isProd ? port : port.default(devDefaults.PORT),
  DATABASE_URL: isProd ? databaseUrl : databaseUrl.default(devDefaults.DATABASE_URL),
  CORS_ORIGIN: isProd ? corsOrigin : corsOrigin.default(devDefaults.CORS_ORIGIN),
});

export type Env = z.infer<typeof envSchema>;

const parsed: ZodSafeParseResult<Env> = envSchema.safeParse(process.env);

if (!parsed.success) {
  const issues: string = parsed.error.issues
    .map(function (issue: z.core.$ZodIssue): string {
      return `  - ${issue.path.join(".")}: ${issue.message}`;
    })
    .join("\n");
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env: Env = Object.freeze(parsed.data);
