import "dotenv/config";
import { z } from "zod";
import { defineConfig } from "prisma/config";

const databaseUrlSchema = z.string().url();

const databaseUrl = databaseUrlSchema.parse(
  process.env.DATABASE_URL ?? "postgresql://dvibd:dvibd@localhost:3001/dvibd",
);

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});