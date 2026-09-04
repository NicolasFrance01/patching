import { PrismaClient } from "./prisma/generated/client/index.js";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({ 
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 10000
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await prisma.user.updateMany({
    data: {
      isConfirmed: true,
      mustChangePassword: false,
    },
  });
  console.log(`Updated ${result.count} existing users.`);
}
main().catch(console.error).finally(() => prisma.$disconnect());
