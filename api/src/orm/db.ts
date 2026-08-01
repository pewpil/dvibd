import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/client.mts";

const adapter: PrismaPg = new PrismaPg({
  connectionString: Deno.env.get("DATABASE_URL"),
});

export default new PrismaClient({ adapter });
