import { defineConfig } from "prisma/config";
import { resolveDatabaseUrl } from "./config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: resolveDatabaseUrl(),
  },
});
