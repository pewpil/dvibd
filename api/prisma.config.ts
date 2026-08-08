import { z } from "zod";
import { defineConfig } from "prisma/config";

const databaseUrlSchema = z.string().url();

const databaseUrl = databaseUrlSchema.parse(
  Deno.env.get("DATABASE_URL") ?? "postgresql://dvibd:dvibd@localhost:3001/dvibd",
);

export default defineConfig({
  schema: "orm/prisma/schema.prisma",
  migrations: {
    path: "orm/prisma/migrations",
  },
  datasource: {
    url: databaseUrl,
  },
});
