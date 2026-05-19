import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Payload must be an array" }, { status: 400 });
    }

    const validItems = data.filter((item) => item.Servidor);

    // 1. Compute all statuses in JS — no DB needed
    let success = 0, errors = 0, noData = 0;
    const items = validItems.map((item) => {
      const isError = !!(item.Descripcion_Error && item.Descripcion_Error !== "N/A");
      const isNoData = !isError && (!item.Sistema_Operativo || item.Sistema_Operativo === "N/A");
      const status = isError ? "error" : isNoData ? "nodata" : "ok";
      if (status === "ok") success++;
      else if (status === "error") errors++;
      else noData++;
      return {
        serverName: item.Servidor as string,
        domain: (item.Dominio as string) ?? null,
        ip: (item.IP as string) ?? null,
        os: (item.Sistema_Operativo as string) ?? null,
        installDate: (item.Fecha_Instalacion as string) ?? null,
        installedKBs: (item.KBs_Instaladas as string) ?? null,
        rebootDate: (item.Fecha_Reinicio as string) ?? null,
        errorDescription: (item.Descripcion_Error as string) ?? null,
        status,
      };
    });

    // 2. Create SyncRun with pre-computed counts — 1 query
    const syncRun = await prisma.syncRun.create({
      data: { total: items.length, success, errors, noData },
    });

    // 3. Batch insert SyncHistory + batch upsert ServerStatus in parallel — 2 queries total
    await Promise.all([
      prisma.syncHistory.createMany({
        data: items.map(({ status, serverName, domain, ip, os, installDate, installedKBs, rebootDate, errorDescription }) => ({
          syncRunId: syncRun.id,
          serverName, domain, ip, os, installDate, installedKBs, rebootDate, errorDescription, status,
        })),
      }),
      prisma.$executeRaw`
        INSERT INTO "ServerStatus"
          (id, "serverName", domain, ip, os, "installDate", "installedKBs", "rebootDate", "errorDescription", "updatedAt", "createdAt")
        VALUES
          ${Prisma.join(items.map((v) =>
            Prisma.sql`(gen_random_uuid(), ${v.serverName}, ${v.domain}, ${v.ip}, ${v.os}, ${v.installDate}, ${v.installedKBs}, ${v.rebootDate}, ${v.errorDescription}, NOW(), NOW())`
          ))}
        ON CONFLICT ("serverName") DO UPDATE SET
          domain            = EXCLUDED.domain,
          ip                = EXCLUDED.ip,
          os                = EXCLUDED.os,
          "installDate"     = EXCLUDED."installDate",
          "installedKBs"    = EXCLUDED."installedKBs",
          "rebootDate"      = EXCLUDED."rebootDate",
          "errorDescription"= EXCLUDED."errorDescription",
          "updatedAt"       = NOW()
      `,
    ]);

    return NextResponse.json({ success: true, count: items.length, syncRunId: syncRun.id });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
