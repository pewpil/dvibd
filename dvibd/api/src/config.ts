import { z } from "@zod/zod";

const DEFAULTS = {
  PORT: "3002",
  CORS_ORIGIN: "http://localhost:3000",
  JWT_SECRET: "dvibd-dev-secret-change-me",
} as const;

const envSchema = z.object({
  PORT: z
    .string()
    .regex(/^\d+$/, "PORT must be a numeric string")
    .refine((value) => Number(value) >= 1 && Number(value) <= 65535, {
      message: "PORT must be between 1 and 65535",
    }),
  CORS_ORIGIN: z.url(),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
});

function hasEnvFile(): boolean {
  try {
    Deno.statSync(new URL("../.env", import.meta.url));
    return true;
  } catch {
    return false;
  }
}

function resolveEnv(name: keyof typeof DEFAULTS): string {
  if (!hasEnvFile()) {
    return DEFAULTS[name];
  }
  const value = Deno.env.get(name);
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is missing from .env file`);
  }
  return value;
}

const parsedEnv = envSchema.parse({
  PORT: resolveEnv("PORT"),
  CORS_ORIGIN: resolveEnv("CORS_ORIGIN"),
  JWT_SECRET: resolveEnv("JWT_SECRET"),
});

export const config = {
  port: Number(parsedEnv.PORT),
  corsOrigin: parsedEnv.CORS_ORIGIN,
  jwtSecret: parsedEnv.JWT_SECRET,
};
