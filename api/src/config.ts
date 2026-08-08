import { z } from "@zod/zod";

const DEFAULTS = {
  PORT: "3002",
  CORS_ORIGIN: "http://localhost:3000",
} as const;

const envSchema = z.object({
  PORT: z
    .string()
    .regex(/^\d+$/, "PORT must be a numeric string")
    .refine((value) => Number(value) >= 1 && Number(value) <= 65535, {
      message: "PORT must be between 1 and 65535",
    }),
  CORS_ORIGIN: z.url(),
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
});

export const config = {
  port: Number(parsedEnv.PORT),
  corsOrigin: parsedEnv.CORS_ORIGIN,
};
