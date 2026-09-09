import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const month = url.searchParams.get("month"); // e.g., "2026-08"

    if (!month) {
      return NextResponse.json({ error: "Month parameter is required (YYYY-MM)" }, { status: 400 });
    }

    const currentMonth = new Date().toISOString().slice(0, 7);

    let servers;

    if (month === currentMonth) {
      // For the current month, returning from the main table is faster and real-time.
      // But we can also use MonthlyServerStatus if it represents the same.
      servers = await prisma.serverStatus.findMany({
        orderBy: { updatedAt: 'desc' },
      });
    } else {
      // Historical data from MonthlyServerStatus
      const monthlyServers = await prisma.monthlyServerStatus.findMany({
        where: { month },
        orderBy: { updatedAt: 'desc' },
      });
      // Map to the same structure as ServerStatus so the dashboard doesn't need to change much
      servers = monthlyServers.map(s => ({
        ...s,
        updatedAt: s.updatedAt,
        createdAt: s.createdAt,
      }));
    }

    return NextResponse.json(servers);
  } catch (error: any) {
    console.error("API /servers error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
