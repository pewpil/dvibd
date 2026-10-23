import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client.mts";
import { config } from "./config.ts";

const adapter: PrismaPg = new PrismaPg({
  connectionString: config.databaseUrl,
  max: 1,
});

export const prisma: PrismaClient = new PrismaClient({ adapter });
