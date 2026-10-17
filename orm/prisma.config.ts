import "dotenv/config";
import { existsSync } from "node:fs";
import { z } from "zod";
import { defineConfig } from "prisma/config";

const DEFAULT_DATABASE_URL = "postgresql://dvibd:dvibd@localhost:3001/dvibd";

const databaseUrlSchema = z.string().url();

function resolveDatabaseUrl(): string {
  const value: string | undefined = process.env.DATABASE_URL;
  if (value !== undefined) {
    return databaseUrlSchema.parse(value);
  }
  if (!existsSync(".env")) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("Environment variable DATABASE_URL is required in production");
    }
    return DEFAULT_DATABASE_URL;
  }
  throw new Error("Environment variable DATABASE_URL is missing from .env file");
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: resolveDatabaseUrl(),
  },
});
