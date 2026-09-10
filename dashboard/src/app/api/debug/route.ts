import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const history = await prisma.syncHistory.findMany({
            orderBy: { id: 'desc' },
            take: 20
        });
        return NextResponse.json(history);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}
