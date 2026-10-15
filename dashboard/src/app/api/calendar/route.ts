import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getBanksForGroups } from "@/lib/serverTypeMap";
import { createAndDispatchNotification } from "@/lib/notifications";

export async function GET(req: NextRequest) {
  try {
    const orders = await prisma.patchOrder.findMany({
      orderBy: { scheduledAt: "asc" },
    });

    const formatted = orders.map((o) => {
      let banks = o.targetBanks;
      if (!banks && o.targetGroups) {
        const deduced = getBanksForGroups(o.targetGroups.split(", "));
        if (deduced.length > 0) banks = deduced.join(", ");
      }
      return {
        ...o,
        targetBanks: banks || null,
        targetClient: banks || null,
        Cliente: banks || null,
      };
    });

    return NextResponse.json(formatted);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Compatibilidad con el payload nativo de WUU.ps1
    if (body.Action) {
      if (body.Action === "delete") {
        await prisma.patchOrder.deleteMany({
          where: {
            OR: [
              { title: body.TaskName },
              { id: body.Id || body.EventId || body.CalendarEventId || "" },
            ],
          },
        });
        return NextResponse.json({ success: true }, { status: 200 });
      }

      if (body.Action === "upsert") {
        let actionType = "CHECK";
        if (body.Kind === "PatchWindow") actionType = "INSTALL";
        if (body.Kind === "Reboot") actionType = "REBOOT";

        let targetGroups: string | null = null;
        let targetServers: string | null = null;
        let targetBanks: string | null = null;

        if (body.Details) {
          if (body.Details.TargetType === "Group") {
            targetGroups = body.Details.TargetValue || body.Details.Group || null;
          } else if (body.Details.TargetType === "Server") {
            targetServers = body.Details.TargetValue || null;
          }
          if (body.Details.Cliente) {
            targetBanks = body.Details.Cliente;
          }
        }

        if (!targetGroups && body.targetGroups) {
          targetGroups = body.targetGroups;
        }
        if (!targetBanks && (body.Cliente || body.targetClient)) {
          targetBanks = body.Cliente || body.targetClient;
        }

        // Si tenemos grupo pero no banco, deducir el banco correspondiente
        if (targetGroups && !targetBanks) {
          const deduced = getBanksForGroups(targetGroups.split(", "));
          if (deduced.length > 0) {
            targetBanks = deduced.join(", ");
          }
        }

        const upsertedOrder = await prisma.patchOrder.create({
          data: {
            title: body.TaskName || `${body.Kind} Task`,
            description: `Programado desde WUU local por ${body.Analyst || "Analista"}\nTipo: ${body.Kind}`,
            actionType,
            targetBanks,
            targetGroups,
            targetServers,
            scheduledAt: body.ScheduledAt ? new Date(body.ScheduledAt) : new Date(),
            status: "PENDING",
            createdBy: body.Analyst || body.SourceComputer,
          },
        });

        const dtWuu = body.ScheduledAt ? new Date(body.ScheduledAt) : new Date();
        const periodStrWuu = `${dtWuu.toLocaleDateString("es-AR", { month: "short" }).toUpperCase()}-${String(dtWuu.getFullYear()).slice(2)}`;
        createAndDispatchNotification({
          type: "CALENDAR_SCHEDULED",
          title: `Nueva Ejecución Programada: ${upsertedOrder.title}`,
          message: `Se programó una nueva ejecución desde WUU para el ${dtWuu.toLocaleString("es-AR")}.`,
          taskName: upsertedOrder.title,
          cliente: targetBanks || "Todos los bancos",
          periodo: periodStrWuu,
          fechaHora: dtWuu.toLocaleString("es-AR"),
          grupo: targetGroups || "Fuera de inventario",
          servidores: targetServers ? targetServers.split(",").length : "Según grupo",
          orderId: upsertedOrder.id,
        }).catch((e) => console.warn("[Calendar API] Error notificando programación:", e));

        return NextResponse.json(upsertedOrder, { status: 201 });
      }
    }

    // Formato del Dashboard
    const { title, description, actionType, targetBanks, targetGroups, targetServers, scheduledAt, status, createdBy } = body;

    let finalBanks = targetBanks || null;
    if (!finalBanks && targetGroups) {
      const deduced = getBanksForGroups(targetGroups.split(", "));
      if (deduced.length > 0) {
        finalBanks = deduced.join(", ");
      }
    }

    const newOrder = await prisma.patchOrder.create({
      data: {
        title,
        description,
        actionType,
        targetBanks: finalBanks,
        targetGroups: targetGroups || null,
        targetServers: targetServers || null,
        scheduledAt: new Date(scheduledAt),
        status: status || "PENDING",
        createdBy,
      },
    });

    const dtDash = new Date(scheduledAt);
    const periodStrDash = `${dtDash.toLocaleDateString("es-AR", { month: "short" }).toUpperCase()}-${String(dtDash.getFullYear()).slice(2)}`;
    createAndDispatchNotification({
      type: "CALENDAR_SCHEDULED",
      title: `Nueva Ejecución Programada: ${newOrder.title}`,
      message: `Se programó una nueva ejecución pendiente en el Calendario para el ${dtDash.toLocaleString("es-AR")}.`,
      taskName: newOrder.title,
      cliente: finalBanks || "Todos los bancos",
      periodo: periodStrDash,
      fechaHora: dtDash.toLocaleString("es-AR"),
      grupo: targetGroups || "Fuera de inventario",
      servidores: targetServers ? targetServers.split(",").length : "Según grupo",
      orderId: newOrder.id,
    }).catch((e) => console.warn("[Calendar API] Error notificando programación:", e));

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create order", details: error.message }, { status: 400 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

    await prisma.patchOrder.delete({
      where: { id },
    });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
