import { z } from "zod";

const DEFAULTS = {
  DATABASE_URL: "postgresql://dvibd:dvibd@localhost:3001/dvibd",
  PORT: "3002",
  CORS_ORIGIN: "http://localhost:3000",
  JWT_SECRET: "dvibd-dev-secret-change-me",
} as const;

const envSchema = z.object({
  DATABASE_URL: z.url(),
  PORT: z
    .string()
    .regex(/^\d+$/, "PORT must be a numeric string")
    .refine((value) => Number(value) >= 1 && Number(value) <= 65535, {
      message: "PORT must be between 1 and 65535",
    }),
  CORS_ORIGIN: z.url(),
  JWT_SECRET: z.string().min(16, "JWT_SECRET must be at least 16 characters"),
});

const isLocalRun: boolean = process.env["LOCAL_ENV"] === "1";

function warnAmbientOverride(name: keyof typeof DEFAULTS): void {
  const ambient: string | undefined = process.env[name];
  if (ambient === undefined || ambient === DEFAULTS[name]) {
    return;
  }
  console.warn(
    `LOCAL_ENV=1 locks this localhost run to the dev defaults and ignores ambient ${name}.`,
  );
}

type RequiredEnvName = "DATABASE_URL" | "CORS_ORIGIN" | "JWT_SECRET";

function resolveEnv(name: RequiredEnvName): string {
  if (isLocalRun) {
    warnAmbientOverride(name);
    return DEFAULTS[name];
  }
  const value: string | undefined = process.env[name];
  if (value === undefined) {
    throw new Error(`Environment variable ${name} is required when LOCAL_ENV is unset`);
  }
  return value;
}

function resolvePort(): string {
  if (isLocalRun) {
    warnAmbientOverride("PORT");
    return DEFAULTS.PORT;
  }
  return process.env["PORT"] ?? DEFAULTS.PORT;
}

const parsedEnv = envSchema.parse({
  DATABASE_URL: resolveEnv("DATABASE_URL"),
  PORT: resolvePort(),
  CORS_ORIGIN: resolveEnv("CORS_ORIGIN"),
  JWT_SECRET: resolveEnv("JWT_SECRET"),
});

type Config = {
  databaseUrl: string;
  port: number;
  corsOrigin: string;
  jwtSecret: string;
};

export const config: Config = {
  databaseUrl: parsedEnv.DATABASE_URL,
  port: Number(parsedEnv.PORT),
  corsOrigin: parsedEnv.CORS_ORIGIN,
  jwtSecret: parsedEnv.JWT_SECRET,
};
