import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client.ts';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter: PrismaPg = new PrismaPg({ connectionString: process.env.DATABASE_URL });
export const prisma: PrismaClient = new PrismaClient({ adapter });
