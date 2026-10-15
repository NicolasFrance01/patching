import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAndDispatchNotification, NotificationType } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit") || "30", 10);

    const [notifications, unreadCount] = await Promise.all([
      prisma.notification.findMany({
        orderBy: { createdAt: "desc" },
        take: limit,
      }),
      prisma.notification.count({
        where: { isRead: false },
      }),
    ]);

    return NextResponse.json({ notifications, unreadCount });
  } catch (error: any) {
    console.error("[API Notifications] GET Error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Soporte para tarjetas enviadas directamente desde WUU.ps1 (Send-WindowCard)
    if (body.Tipo === "Tarjeta" || body.Fase) {
      const fase = String(body.Fase || "Inicio").toLowerCase();
      const isStart = fase === "inicio";
      const taskName = body.Tarea || body.TaskName || "Tarea de parcheo";
      const cliente = body.Cliente || "Sin cliente";
      const periodo = body.Periodo || "Periodo actual";
      const fechaHora = body.FechaHora || new Date().toLocaleString("es-AR");
      const grupo = body.Grupo || "Fuera de inventario";
      const servidores = body.Servidores !== undefined ? body.Servidores : 0;
      const equipo = body.Equipo || "";

      const type: NotificationType = isStart ? "EXECUTION_STARTED" : "EXECUTION_COMPLETED";
      const title = isStart
        ? `Ejecución Iniciada: ${taskName}`
        : `Ejecución Finalizada: ${taskName}`;

      const message = isStart
        ? `Ha comenzado la ejecución de la tarea '${taskName}' para el cliente ${cliente}.`
        : `La tarea '${taskName}' ha concluido su ejecución para ${servidores} servidor(es).`;

      // Intentar vincular y actualizar la PatchOrder correspondiente en el calendario
      let orderId: string | undefined;
      try {
        const order = await prisma.patchOrder.findFirst({
          where: {
            OR: [
              { title: { equals: taskName, mode: "insensitive" } },
              { title: { contains: taskName, mode: "insensitive" } },
            ],
          },
          orderBy: { scheduledAt: "desc" },
        });

        if (order) {
          orderId = order.id;
          await prisma.patchOrder.update({
            where: { id: order.id },
            data: {
              status: isStart ? "IN_PROGRESS" : "COMPLETED",
            },
          });
        }
      } catch (orderErr) {
        console.warn("[API Notifications] No se pudo actualizar estado de orden:", orderErr);
      }

      const notif = await createAndDispatchNotification({
        type,
        title,
        message,
        taskName,
        cliente,
        periodo,
        fechaHora,
        grupo,
        servidores,
        equipo,
        orderId,
      });

      return NextResponse.json({ success: true, notification: notif }, { status: 201 });
    }

    // Soporte para formato nativo de notificación
    const { type, title, message, taskName, cliente, periodo, fechaHora, grupo, servidores, equipo, orderId, metadata } = body;

    const notif = await createAndDispatchNotification({
      type: type || "SYNC_NEW",
      title: title || "Notificación del Sistema",
      message: message || "",
      taskName,
      cliente,
      periodo,
      fechaHora,
      grupo,
      servidores,
      equipo,
      orderId,
      metadata,
    });

    return NextResponse.json({ success: true, notification: notif }, { status: 201 });
  } catch (error: any) {
    console.error("[API Notifications] POST Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, id } = body;

    if (action === "mark-all-read") {
      await prisma.notification.updateMany({
        where: { isRead: false },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    if (action === "mark-read" && id) {
      await prisma.notification.update({
        where: { id },
        data: { isRead: true },
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    console.error("[API Notifications] PATCH Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (id) {
      await prisma.notification.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    // Limpiar todas las notificaciones leídas si no se pasa ID
    await prisma.notification.deleteMany({
      where: { isRead: true },
    });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("[API Notifications] DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
