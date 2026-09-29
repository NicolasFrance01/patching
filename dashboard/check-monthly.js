const { PrismaClient } = require('./node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const counts = await prisma.monthlyServerStatus.groupBy({
    by: ['month'],
    _count: { month: true }
  });
  console.log(counts);
}

main().catch(console.error).finally(() => prisma.$disconnect());
