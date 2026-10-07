import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(req: Request, { params }: { params: any }) {
    const serverName = params.serverName;
  try {
    
    if (!serverName) {
      return NextResponse.json({ error: "Missing serverName" }, { status: 400 });
    }

    // Delete from MonthlyServerStatus first if there are foreign keys or anything, but here it's just normal tables
    // Also from ServerStatus
    await prisma.serverStatus.deleteMany({
      where: { serverName }
    });
    
    await prisma.monthlyServerStatus.deleteMany({
      where: { serverName }
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
