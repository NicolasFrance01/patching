import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const start = Date.now();
    const users = await prisma.user.findMany({ select: { username: true } });
    const end = Date.now();
    return NextResponse.json({ status: "ok", users, time: end - start });
  } catch (error: any) {
    return NextResponse.json({ status: "error", message: error.message, stack: error.stack }, { status: 500 });
  }
}
