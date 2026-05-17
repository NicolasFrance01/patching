import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json({ error: "Payload must be an array" }, { status: 400 });
    }

    const validItems = data.filter((item) => item.Servidor);

    // Create a SyncRun to group all records from this sync
    const syncRun = await prisma.syncRun.create({ data: { total: validItems.length } });

    let success = 0, errors = 0, noData = 0;
    const results = [];

    for (const item of validItems) {
      const isError = item.Descripcion_Error && item.Descripcion_Error !== "N/A";
      const isNoData = !item.Sistema_Operativo || item.Sistema_Operativo === "N/A";
      const status = isError ? "error" : isNoData ? "nodata" : "ok";

      if (status === "ok") success++;
      else if (status === "error") errors++;
      else noData++;

      const payload = {
        domain: item.Dominio ?? null,
        ip: item.IP ?? null,
        os: item.Sistema_Operativo ?? null,
        installDate: item.Fecha_Instalacion ?? null,
        installedKBs: item.KBs_Instaladas ?? null,
        errorDescription: item.Descripcion_Error ?? null,
      };

      const [serverStatus] = await Promise.all([
        prisma.serverStatus.upsert({
          where: { serverName: item.Servidor },
          update: payload,
          create: { serverName: item.Servidor, ...payload },
        }),
        prisma.syncHistory.create({
          data: {
            syncRunId: syncRun.id,
            serverName: item.Servidor,
            status,
            ...payload,
          },
        }),
      ]);

      results.push(serverStatus);
    }

    // Update SyncRun counters
    await prisma.syncRun.update({
      where: { id: syncRun.id },
      data: { success, errors, noData },
    });

    return NextResponse.json({ success: true, count: results.length, syncRunId: syncRun.id });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
