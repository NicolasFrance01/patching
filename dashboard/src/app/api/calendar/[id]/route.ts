import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAndDispatchNotification } from "@/lib/notifications";

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const order = await prisma.patchOrder.findUnique({
      where: { id },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    const existingOrder = await prisma.patchOrder.findUnique({
      where: { id },
    });
    
    if (!existingOrder) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const newStatus = body.status || existingOrder.status;
    const newLog = body.executionLog !== undefined ? body.executionLog : existingOrder.executionLog;

    const updated = await prisma.patchOrder.update({
      where: { id },
      data: {
        status: newStatus,
        executionLog: newLog,
      },
    });

    const now = new Date();
    const periodStr = `${now.toLocaleDateString("es-AR", { month: "short" }).toUpperCase()}-${String(now.getFullYear()).slice(2)}`;

    // Si cambió de PENDING a IN_PROGRESS, notificar inicio
    if (existingOrder.status === "PENDING" && newStatus === "IN_PROGRESS") {
      createAndDispatchNotification({
        type: "EXECUTION_STARTED",
        title: `Ejecución Iniciada: ${existingOrder.title}`,
        message: `La tarea programada '${existingOrder.title}' ha comenzado a ejecutarse.`,
        taskName: existingOrder.title,
        cliente: existingOrder.targetBanks || "Todos",
        periodo: periodStr,
        fechaHora: now.toLocaleString("es-AR"),
        grupo: existingOrder.targetGroups || "Fuera de inventario",
        servidores: existingOrder.targetServers ? existingOrder.targetServers.split(",").length : 0,
        orderId: existingOrder.id,
      }).catch((e) => console.warn("[Calendar PATCH] Error notificando inicio:", e));
    }

    // Si cambió a COMPLETED, notificar finalización
    if (existingOrder.status !== "COMPLETED" && newStatus === "COMPLETED") {
      createAndDispatchNotification({
        type: "EXECUTION_COMPLETED",
        title: `Ejecución Finalizada: ${existingOrder.title}`,
        message: `La tarea programada '${existingOrder.title}' ha concluido exitosamente.`,
        taskName: existingOrder.title,
        cliente: existingOrder.targetBanks || "Todos",
        periodo: periodStr,
        fechaHora: now.toLocaleString("es-AR"),
        grupo: existingOrder.targetGroups || "Fuera de inventario",
        servidores: existingOrder.targetServers ? existingOrder.targetServers.split(",").length : 0,
        orderId: existingOrder.id,
      }).catch((e) => console.warn("[Calendar PATCH] Error notificando fin:", e));
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Calendar PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update order", details: error.message }, { status: 500 });
  }
}
