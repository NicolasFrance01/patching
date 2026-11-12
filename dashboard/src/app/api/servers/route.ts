import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const month = url.searchParams.get("month"); // e.g., "2026-08"

    if (!month) {
      return NextResponse.json({ error: "Month parameter is required (YYYY-MM)" }, { status: 400 });
    }

    const [monthlyServers, lock] = await Promise.all([
      prisma.monthlyServerStatus.findMany({
        where: { month },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.closedMonth.findUnique({
        where: { month },
        select: { month: true },
      }),
    ]);

    // Map to the same structure as ServerStatus so the dashboard doesn't need to change much
    const servers = monthlyServers.map((s: any) => ({
      ...s,
      updatedAt: s.updatedAt,
      createdAt: s.createdAt,
    }));

    return NextResponse.json(servers, {
      headers: {
        "X-Month-Locked": lock ? "true" : "false",
      },
    });
  } catch (error: any) {
    console.error("API /servers error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
