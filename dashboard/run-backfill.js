const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function backfill() {
  console.log('Starting backfill...');
  const syncRuns = await prisma.syncRun.findMany({
    orderBy: { syncedAt: 'asc' },
  });
  console.log(`Found ${syncRuns.length} sync runs.`);
  
  for (const run of syncRuns) {
    const d = new Date(run.syncedAt);
    const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    
    const records = await prisma.syncHistory.findMany({ where: { syncRunId: run.id } });
    console.log(`Processing run ${run.id} (${month}) with ${records.length} records...`);
    
    let updated = 0;
    for (const r of records) {
      await prisma.monthlyServerStatus.upsert({
        where: { month_serverName: { month, serverName: r.serverName } },
        update: {
          grupo: r.grupo, ambiente: r.ambiente, domain: r.domain, ip: r.ip, os: r.os,
          osVersion: r.osVersion, analista: r.analista, sqlInstancia: r.sqlInstancia,
          sqlVersion: r.sqlVersion, sqlUltimaActualizacion: r.sqlUltimaActualizacion,
          fechaVentana: r.fechaVentana, installDate: r.installDate, installedKBs: r.installedKBs,
          rebootDate: r.rebootDate, runningTime: r.runningTime, diskSpace: r.diskSpace,
          errorDescription: r.errorDescription, comentarios: r.comentarios, snap: r.snap,
          confirmado: r.confirmado, status: r.status, updatedAt: r.createdAt
        },
        create: {
          month, serverName: r.serverName, grupo: r.grupo, ambiente: r.ambiente,
          domain: r.domain, ip: r.ip, os: r.os, osVersion: r.osVersion, analista: r.analista,
          sqlInstancia: r.sqlInstancia, sqlVersion: r.sqlVersion, sqlUltimaActualizacion: r.sqlUltimaActualizacion,
          fechaVentana: r.fechaVentana, installDate: r.installDate, installedKBs: r.installedKBs,
          rebootDate: r.rebootDate, runningTime: r.runningTime, diskSpace: r.diskSpace,
          errorDescription: r.errorDescription, comentarios: r.comentarios, snap: r.snap,
          confirmado: r.confirmado, status: r.status, updatedAt: r.createdAt, createdAt: r.createdAt
        }
      });
      updated++;
    }
    console.log(`Updated ${updated} records for ${month}`);
  }
  console.log('Backfill complete!');
}

backfill().catch(console.error).finally(() => prisma.$disconnect());
