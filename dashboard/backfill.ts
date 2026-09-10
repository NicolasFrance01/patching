import { prisma } from './src/lib/prisma';

async function main() {
  console.log('Starting backfill of MonthlyServerStatus from SyncHistory...');
  
  // Get all SyncHistory records, ordered by creation date ascending
  // This way, the latest record for a server in a month will overwrite previous ones for that month.
  const historyRecords = await prisma.syncHistory.findMany({
    orderBy: { createdAt: 'asc' },
  });

  console.log(`Found ${historyRecords.length} historical records.`);

  let inserted = 0;
  let updated = 0;

  for (const record of historyRecords) {
    const month = record.createdAt.toISOString().slice(0, 7); // YYYY-MM
    
    const payload = {
      grupo: record.grupo,
      ambiente: record.ambiente,
      domain: record.domain,
      ip: record.ip,
      os: record.os,
      osVersion: record.osVersion,
      installDate: record.installDate,
      installedKBs: record.installedKBs,
      rebootDate: record.rebootDate,
      runningTime: record.runningTime,
      diskSpace: record.diskSpace,
      errorDescription: record.errorDescription,
      comentarios: record.comentarios,
      snap: record.snap,
      confirmado: record.confirmado,
      status: record.status,
    };

    try {
      const existing = await prisma.monthlyServerStatus.findUnique({
        where: {
          month_serverName: {
            month,
            serverName: record.serverName,
          }
        }
      });

      if (existing) {
        await prisma.monthlyServerStatus.update({
          where: { id: existing.id },
          data: payload,
        });
        updated++;
      } else {
        await prisma.monthlyServerStatus.create({
          data: {
            month,
            serverName: record.serverName,
            ...payload,
          }
        });
        inserted++;
      }
    } catch (err) {
      console.error(`Error processing record for ${record.serverName} in month ${month}:`, err);
    }
  }

  console.log(`Backfill complete! Inserted: ${inserted}, Updated: ${updated}.`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
