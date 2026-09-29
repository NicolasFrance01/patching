const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfill() {
  console.log('Starting backfill of serverNames...');
  
  // Find all servers that need updating
  const servers = await prisma.serverStatus.findMany();
  let updated = 0;
  
  for (const s of servers) {
    if (s.domain && s.domain !== "N/A" && s.domain !== "null") {
      const expectedName = `${s.serverName.split(' (')[0]} (${s.domain})`;
      if (s.serverName !== expectedName) {
        try {
          await prisma.serverStatus.update({
            where: { id: s.id },
            data: { serverName: expectedName }
          });
          updated++;
        } catch (e) {
          console.error(`Failed to update ${s.serverName}:`, e);
        }
      }
    }
  }
  
  console.log(`Updated ${updated} servers in ServerStatus.`);
  
  const monthly = await prisma.monthlyServerStatus.findMany();
  let monthlyUpdated = 0;
  for (const s of monthly) {
    if (s.domain && s.domain !== "N/A" && s.domain !== "null") {
      const expectedName = `${s.serverName.split(' (')[0]} (${s.domain})`;
      if (s.serverName !== expectedName) {
        try {
          await prisma.monthlyServerStatus.update({
            where: { id: s.id },
            data: { serverName: expectedName }
          });
          monthlyUpdated++;
        } catch (e) {
           console.error(`Failed to update monthly ${s.serverName}:`, e);
        }
      }
    }
  }
  
  console.log(`Updated ${monthlyUpdated} servers in MonthlyServerStatus.`);
  
  const syncs = await prisma.syncHistory.findMany();
  let syncsUpdated = 0;
  for (const s of syncs) {
    if (s.domain && s.domain !== "N/A" && s.domain !== "null") {
      const expectedName = `${s.serverName.split(' (')[0]} (${s.domain})`;
      if (s.serverName !== expectedName) {
        try {
          await prisma.syncHistory.update({
            where: { id: s.id },
            data: { serverName: expectedName }
          });
          syncsUpdated++;
        } catch (e) {
           console.error(`Failed to update sync history ${s.serverName}:`, e);
        }
      }
    }
  }
  console.log(`Updated ${syncsUpdated} servers in SyncHistory.`);
}

backfill().catch(console.error).finally(() => prisma.$disconnect());
