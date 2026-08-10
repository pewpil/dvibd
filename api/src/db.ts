import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client.mts";

const connectionString = Deno.env.get("DATABASE_URL") ??
  "postgresql://dvibd:dvibd@localhost:3001/dvibd";
const adapter = new PrismaPg({ connectionString });

export const prisma = new PrismaClient({ adapter });
