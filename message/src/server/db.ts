import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client.mts";
import { config } from "./config";

const globalForPrisma: { prisma?: PrismaClient } = globalThis as unknown as {
  prisma?: PrismaClient;
};

function createClient(): PrismaClient {
  const adapter: PrismaPg = new PrismaPg({ connectionString: config.databaseUrl });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}