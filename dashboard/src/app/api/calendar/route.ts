import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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
