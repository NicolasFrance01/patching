import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST /api/orders/status
// Called by WUU.ps1 to report progress or completion of an order.
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { orderId, status, executionLog } = body;

    if (!orderId) {
      return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
    }

    const currentOrder = await prisma.patchOrder.findUnique({ where: { id: orderId } });
    if (!currentOrder) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Append to execution log if provided
    let newLog = currentOrder.executionLog || "";
    if (executionLog) {
      const timestamp = new Date().toISOString();
      newLog = newLog ? `${newLog}\n[${timestamp}] ${executionLog}` : `[${timestamp}] ${executionLog}`;
    }

    const updatedOrder = await prisma.patchOrder.update({
      where: { id: orderId },
      data: {
        status: status || currentOrder.status,
        executionLog: newLog,
      },
    });

    return NextResponse.json(updatedOrder);
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update order status", details: error.message }, { status: 500 });
  }
}
