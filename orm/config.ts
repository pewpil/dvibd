import { z } from "zod";

export const LOCAL_DATABASE_URL: string =
  "postgresql://dvibd:dvibd@localhost:3001/dvibd";

const databaseUrlSchema: z.ZodType<string> = z.url();

const isLocalRun: boolean = process.env.LOCAL_ENV === "1";

const warnedAmbient: Set<string> = new Set();

type DatabaseUrlEnvName = "DIRECT_URL" | "DATABASE_URL";

function readEnv(name: DatabaseUrlEnvName): string | undefined {
  const value: string | undefined = process.env[name];
  if (value === undefined || value.trim() === "") {
    return undefined;
  }
  return value;
}

function warnAmbientOverride(name: DatabaseUrlEnvName): void {
  const ambient: string | undefined = readEnv(name);
  if (
    ambient === undefined ||
    ambient === LOCAL_DATABASE_URL ||
    warnedAmbient.has(name)
  ) {
    return;
  }
  warnedAmbient.add(name);
  console.warn(
    `LOCAL_ENV=1 locks this localhost run to the dev defaults and ignores ambient ${name}.`,
  );
}

export function resolveDatabaseUrl(): string {
  if (isLocalRun) {
    warnAmbientOverride("DIRECT_URL");
    warnAmbientOverride("DATABASE_URL");
    return databaseUrlSchema.parse(LOCAL_DATABASE_URL);
  }
  const directUrl: string | undefined = readEnv("DIRECT_URL");
  if (directUrl !== undefined) {
    return databaseUrlSchema.parse(directUrl);
  }
  const databaseUrl: string | undefined = readEnv("DATABASE_URL");
  if (databaseUrl !== undefined) {
    return databaseUrlSchema.parse(databaseUrl);
  }
  return databaseUrlSchema.parse(LOCAL_DATABASE_URL);
}
