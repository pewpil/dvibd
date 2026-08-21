import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client.mts";
import { config } from "./config";

const adapter: PrismaPg = new PrismaPg({ connectionString: config.databaseUrl });

export const prisma: PrismaClient = new PrismaClient({ adapter });
