const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const prisma = new PrismaClient();

async function run() {
  const servers = await prisma.serverStatus.findMany();
  let count = 0;
  for (const s of servers) {
    console.log(`DB Server: ${s.serverName} | Domain: ${s.domain}`);
    count++;
    if (count > 20) break;
  }
}
run().catch(console.error).finally(() => prisma.$disconnect());
