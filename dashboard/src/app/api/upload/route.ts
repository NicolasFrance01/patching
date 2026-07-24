import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = Array.isArray(body)
      ? body
      : Array.isArray(body?.servers)
        ? body.servers
        : null;

    if (!data) {
      return NextResponse.json(
        { error: "Payload must be an array of objects (or { servers: [...] })" },
        { status: 400 }
      );
    }

    const seen = new Set<string>();
    const validItems = data.filter((item: any) => {
      const name = String(item.Servidor ?? "").trim();
      if (!name || seen.has(name)) return false;
      seen.add(name);
      return true;
    });

    let success = 0, errors = 0, noData = 0;
    const items = validItems.map((item: any) => {
      const isError = !!(item.Descripcion_Error && item.Descripcion_Error !== "N/A");
      const isNoData = !isError && (!item.Sistema_Operativo || item.Sistema_Operativo === "N/A");
      const status = isError ? "error" : isNoData ? "nodata" : "ok";
      if (status === "ok") success++;
      else if (status === "error") errors++;
      else noData++;
      return {
        serverName: String(item.Servidor).trim(),
        domain: item.Dominio ? String(item.Dominio) : null,
        ip: item.IP ? String(item.IP) : null,
        os: item.Sistema_Operativo ? String(item.Sistema_Operativo) : null,
        installDate: item.Fecha_Instalacion ? String(item.Fecha_Instalacion) : null,
        installedKBs: item.KBs_Instaladas ? String(item.KBs_Instaladas) : null,
        rebootDate: item.Fecha_Reinicio ? String(item.Fecha_Reinicio) : null,
        errorDescription: item.Descripcion_Error ? String(item.Descripcion_Error) : null,
        status,
      };
    });

    const syncRun = await prisma.syncRun.create({
      data: { total: items.length, success, errors, noData },
    });

    for (const item of items) {
      const payload = {
        domain: item.domain,
        ip: item.ip,
        os: item.os,
        installDate: item.installDate,
        installedKBs: item.installedKBs,
        rebootDate: item.rebootDate,
        errorDescription: item.errorDescription,
      };

      await prisma.serverStatus.upsert({
        where: { serverName: item.serverName },
        update: payload,
        create: { serverName: item.serverName, ...payload },
      });
    }

    if (items.length > 0) {
      await prisma.syncHistory.createMany({
        data: items.map((item) => ({
          syncRunId: syncRun.id,
          serverName: item.serverName,
          domain: item.domain,
          ip: item.ip,
          os: item.os,
          installDate: item.installDate,
          installedKBs: item.installedKBs,
          rebootDate: item.rebootDate,
          errorDescription: item.errorDescription,
          status: item.status,
        })),
      });
    }

    return NextResponse.json({ success: true, count: items.length, syncRunId: syncRun.id });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
