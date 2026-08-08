const DEFAULTS = {
  PORT: "3002",
  CORS_ORIGIN: "http://localhost:3000",
} as const;

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

export const config = {
  port: Number(resolveEnv("PORT")),
  corsOrigin: resolveEnv("CORS_ORIGIN"),
};
