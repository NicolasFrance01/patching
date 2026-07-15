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
    const unique = data.filter((item) => {
      const name = String(item.Servidor ?? "").trim();
      if (!name || seen.has(name)) return false;
      seen.add(name);
      return true;
    });

    const results = [];

    for (const item of unique) {

      const serverStatus = await prisma.serverStatus.upsert({
        where: { serverName: item.Servidor },
        update: {
          domain: item.Dominio,
          ip: item.IP,
          os: item.Sistema_Operativo,
          installDate: item.Fecha_Instalacion,
          installedKBs: item.KBs_Instaladas,
          errorDescription: item.Descripcion_Error,
        },
        create: {
          serverName: item.Servidor,
          domain: item.Dominio,
          ip: item.IP,
          os: item.Sistema_Operativo,
          installDate: item.Fecha_Instalacion,
          installedKBs: item.KBs_Instaladas,
          errorDescription: item.Descripcion_Error,
        },
      });

      results.push(serverStatus);
    }

    return NextResponse.json({ success: true, count: results.length });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
