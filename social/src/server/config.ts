import { existsSync } from "node:fs";
import { z } from "zod";

const DEFAULTS = {
  DATABASE_URL: "postgresql://dvibd:dvibd@localhost:3001/dvibd",
  JWT_SECRET: "social-dev-secret-change-me",
} as const;

const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
});

function hasEnvFile(): boolean {
  return existsSync(".env");
}

function resolveEnv(name: keyof typeof DEFAULTS): string {
  if (!hasEnvFile()) {
    return DEFAULTS[name];
  }
  const value = process.env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is missing from .env file`);
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
