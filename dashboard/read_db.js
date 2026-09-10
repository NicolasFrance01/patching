const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function run() {
    const s = await prisma.syncHistory.findFirst({ orderBy: { id: 'desc' } });
    console.log(JSON.stringify(s, null, 2));
}

run().finally(() => prisma.$disconnect());
