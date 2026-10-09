import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const res = await prisma.$executeRawUnsafe(`
      UPDATE "ServerStatus" s 
      SET "status" = h."status" 
      FROM (
        SELECT DISTINCT ON ("serverName") "serverName", "status" 
        FROM "SyncHistory" 
        ORDER BY "serverName", "createdAt" DESC
      ) h 
      WHERE s."serverName" = h."serverName" AND s."status" IS NULL;
    `);
    
    // Also backfill MonthlyServerStatus
    const res2 = await prisma.$executeRawUnsafe(`
      UPDATE "MonthlyServerStatus" s 
      SET "status" = h."status" 
      FROM (
        SELECT DISTINCT ON ("serverName") "serverName", "status" 
        FROM "SyncHistory" 
        ORDER BY "serverName", "createdAt" DESC
      ) h 
      WHERE s."serverName" = h."serverName" AND s."status" IS NULL;
    `);
    
    return NextResponse.json({ success: true, updatedServerStatus: res, updatedMonthly: res2 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
