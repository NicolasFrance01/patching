import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    if (!Array.isArray(data)) {
      return NextResponse.json(
        { error: "Payload must be an array of objects" },
        { status: 400 }
      );
    }

    const results = [];

    for (const item of data) {
      if (!item.Servidor) continue;

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
