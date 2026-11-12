import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: any }) {
    const serverName = params.serverName;
  try {
    
    if (!serverName) {
      return NextResponse.json({ error: "Missing serverName" }, { status: 400 });
    }

    // Preserve frozen/closed historical months; only delete from open months and live status
    const closedMonths = await prisma.closedMonth.findMany({ select: { month: true } });
    const lockedList = closedMonths.map((c) => c.month);

    await prisma.serverStatus.deleteMany({
      where: { serverName }
    });
    
    await prisma.monthlyServerStatus.deleteMany({
      where: {
        serverName,
        ...(lockedList.length > 0 ? { month: { notIn: lockedList } } : {}),
      }
    });

    // Option: clean overrides too
    await prisma.serverMappingOverride.deleteMany({
      where: { serverName }
    });

    return NextResponse.json({ success: true, message: "Server deleted completely" });
  } catch (error) {
    console.error("Error deleting server:", error);
    return NextResponse.json({ error: "Failed to delete server" }, { status: 500 });
  }
}
