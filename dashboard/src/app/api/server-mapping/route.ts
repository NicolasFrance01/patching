import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const overrides = await prisma.serverMappingOverride.findMany();
    return NextResponse.json(overrides);
  } catch (error) {
    console.error("Error fetching overrides:", error);
    return NextResponse.json({ error: "Failed to fetch overrides" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { serverName, bank } = body;

    if (!serverName || !bank) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    if (bank === "DELETE") {
      // Just an idea: if they want to remove an override
      await prisma.serverMappingOverride.deleteMany({
        where: { serverName }
      });
      return NextResponse.json({ success: true, message: "Override removed" });
    }

    const override = await prisma.serverMappingOverride.upsert({
      where: { serverName },
      update: { bank },
      create: { serverName, bank }
    });

    return NextResponse.json({ success: true, override });
  } catch (error) {
    console.error("Error saving override:", error);
    return NextResponse.json({ error: "Failed to save override" }, { status: 500 });
  }
}
