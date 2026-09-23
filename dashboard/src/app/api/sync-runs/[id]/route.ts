import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const id = params.id;
    if (!id) {
      return NextResponse.json({ error: "Missing sync run ID" }, { status: 400 });
    }

    // Prisma's onDelete: Cascade should handle related SyncHistory records
    // if configured in schema. If not, delete them manually first.
    await prisma.syncHistory.deleteMany({
      where: { syncRunId: id }
    });

    await prisma.syncRun.delete({
      where: { id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting sync run:", error);
    return NextResponse.json({ error: "Failed to delete sync run" }, { status: 500 });
  }
}
