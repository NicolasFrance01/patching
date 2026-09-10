import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function run() {
    const s = await prisma.syncHistory.findMany({ orderBy: { id: 'desc' }, take: 5 });
    console.log(JSON.stringify(s, null, 2));
}

run().finally(() => prisma.$disconnect());
