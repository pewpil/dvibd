import { z } from "zod";

const DEFAULTS = {
  DATABASE_URL: "postgresql://dvibd:dvibd@localhost:3001/dvibd",
  JWT_SECRET: "message-dev-secret-change-me",
} as const;

const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
});

const isLocalRun: boolean = process.env.LOCAL_ENV === "1";

function resolveEnv(name: keyof typeof DEFAULTS): string {
  if (isLocalRun) {
    return DEFAULTS[name];
  }
  const value: string | undefined = process.env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is required when LOCAL_ENV is unset`);
  }
  return value;
}

const parsedEnv = envSchema.parse({
  DATABASE_URL: resolveEnv("DATABASE_URL"),
  JWT_SECRET: resolveEnv("JWT_SECRET"),
});

export const config = {
  databaseUrl: parsedEnv.DATABASE_URL,
  jwtSecret: parsedEnv.JWT_SECRET,
};
