import "dotenv/config";
import { existsSync } from "node:fs";
import { z } from "zod";
import { defineConfig } from "prisma/config";

const DEFAULT_DATABASE_URL = "postgresql://dvibd:dvibd@localhost:3001/dvibd";

const databaseUrlSchema = z.string().url();

function resolveDatabaseUrl(): string {
  if (!existsSync(".env")) {
    return DEFAULT_DATABASE_URL;
  }
  const value = process.env.DATABASE_URL;
  if (value === undefined) {
    throw new Error(
      "Environment variable DATABASE_URL is missing from .env file",
    );
  }
  return databaseUrlSchema.parse(value);
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
