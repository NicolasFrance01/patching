import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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
