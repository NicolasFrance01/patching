import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";

dotenv.config({ path: ".env" });

const adapter = new PrismaNeon({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  const hashed = await bcrypt.hash("Ndf41847034@", 10);
  const user = await prisma.user.upsert({
    where: { username: "admin" },
    update: { password: hashed, role: "admin" },
    create: { username: "admin", password: hashed, role: "admin" },
  });
  console.log("Admin created:", user.username, "role:", user.role);
}

main().catch(console.error).finally(() => prisma.$disconnect());
