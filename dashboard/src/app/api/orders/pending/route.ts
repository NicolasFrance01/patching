import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET /api/orders/pending
// Called by WUU.ps1 to get orders that need to be executed now.
export async function GET(req: NextRequest) {
  try {
    const now = new Date();
    // Find all PENDING orders where the scheduled time is in the past or now
    const pendingOrders = await prisma.patchOrder.findMany({
      where: {
        status: "PENDING",
        scheduledAt: {
          lte: now,
        },
      },
      orderBy: { scheduledAt: "asc" },
    });

    return NextResponse.json(pendingOrders);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch pending orders" }, { status: 500 });
  }
}
