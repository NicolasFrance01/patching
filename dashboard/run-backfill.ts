import { prisma } from './src/lib/prisma';

async function backfill() {
  console.log('Starting backfill of serverNames...');
  
  const servers = await prisma.serverStatus.findMany();
  let updated = 0;
  for (const s of servers) {
    if (s.domain && s.domain !== "N/A" && s.domain !== "null") {
      const expectedName = `${s.serverName.split(' (')[0]} (${s.domain})`;
      if (s.serverName !== expectedName) {
        await prisma.serverStatus.update({
          where: { id: s.id },
          data: { serverName: expectedName }
        });
        updated++;
      }
    }
  }

  const monthly = await prisma.monthlyServerStatus.findMany();
  let monthlyUpdated = 0;
  for (const s of monthly) {
    if (s.domain && s.domain !== "N/A" && s.domain !== "null") {
      const expectedName = `${s.serverName.split(' (')[0]} (${s.domain})`;
      if (s.serverName !== expectedName) {
        await prisma.monthlyServerStatus.update({
          where: { id: s.id },
          data: { serverName: expectedName }
        });
        monthlyUpdated++;
      }
    }
  }

  const syncs = await prisma.syncHistory.findMany();
  let syncsUpdated = 0;
  for (const s of syncs) {
    if (s.domain && s.domain !== "N/A" && s.domain !== "null") {
      const expectedName = `${s.serverName.split(' (')[0]} (${s.domain})`;
      if (s.serverName !== expectedName) {
        await prisma.syncHistory.update({
          where: { id: s.id },
          data: { serverName: expectedName }
        });
        syncsUpdated++;
      }
    }
  }

  console.log(`Updated ${updated} servers, ${monthlyUpdated} monthly, ${syncsUpdated} sync history.`);
}

backfill().catch(console.error).finally(() => prisma.$disconnect());
