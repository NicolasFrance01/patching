import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
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

    return NextResponse.json({ success: true, updated, monthlyUpdated, syncsUpdated });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
