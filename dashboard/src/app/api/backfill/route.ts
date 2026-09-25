import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const syncRuns = await prisma.syncRun.findMany({
      orderBy: { syncedAt: 'asc' },
    });
    
    for (const run of syncRuns) {
      const d = new Date(run.syncedAt);
      const month = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      
      const records = await prisma.syncHistory.findMany({ where: { syncRunId: run.id } });
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
      }
    }
    return NextResponse.json({ success: true, message: "Backfilled" });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
