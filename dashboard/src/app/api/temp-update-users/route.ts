import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const result = await prisma.user.updateMany({
    data: { isConfirmed: true, mustChangePassword: false },
  });
  return NextResponse.json({ success: true, count: result.count });
}
