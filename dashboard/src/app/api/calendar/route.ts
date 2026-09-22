import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const orders = await prisma.patchOrder.findMany({
      orderBy: { scheduledAt: "asc" },
    });
    return NextResponse.json(orders);
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
          where: { title: body.TaskName },
        });
        return NextResponse.json({ success: true }, { status: 200 });
      }

      if (body.Action === "upsert") {
        let actionType = "CHECK";
        if (body.Kind === "PatchWindow") actionType = "INSTALL";
        if (body.Kind === "Reboot") actionType = "REBOOT";
        
        let targetGroups = null;
        let targetServers = null;

        if (body.Details) {
          if (body.Details.TargetType === "Group") {
            targetGroups = body.Details.TargetValue;
          } else if (body.Details.TargetType === "Server") {
            targetServers = body.Details.TargetValue;
          }
        }

        const upsertedOrder = await prisma.patchOrder.create({
          data: {
            title: body.TaskName || `${body.Kind} Task`,
            description: `Programado desde WUU local por ${body.Analyst || 'Analista'}\nTipo: ${body.Kind}`,
            actionType,
            targetGroups,
            targetServers,
            scheduledAt: body.ScheduledAt ? new Date(body.ScheduledAt) : new Date(),
            status: "PENDING",
            createdBy: body.Analyst || body.SourceComputer,
          },
        });
        return NextResponse.json(upsertedOrder, { status: 201 });
      }
    }

    // Formato normal del Dashboard
    const { title, description, actionType, targetGroups, targetServers, scheduledAt, status, createdBy } = body;

    const newOrder = await prisma.patchOrder.create({
      data: {
        title,
        description,
        actionType,
        targetGroups,
        targetServers,
        scheduledAt: new Date(scheduledAt),
        status: status || "PENDING",
        createdBy,
      },
    });

    return NextResponse.json(newOrder, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to create order", details: error.message }, { status: 400 });
  }
}
