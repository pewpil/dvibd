import { defineConfig } from "drizzle-kit";

// drizzle-kit reads this file for `db:generate`, `db:migrate`, and `db:studio`.
// - schema: where table definitions live (each *.ts under src/db/schema).
// - out: where generated SQL migrations are written.
// - dbCredentials.url: connection string; falls back to the defaults declared
//   in db/docker-compose.yml so a fresh clone works without a .env file.
export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema/*",
  out: "./drizzle",
  dbCredentials: {
    url:
      process.env.DATABASE_URL ??
      "postgres://dvibd:dvibd_dev_password@localhost:5432/dvibd",
  },
  verbose: true,
  strict: true,
});
