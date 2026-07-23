import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log("Testing DB connection...");
    const start = Date.now();
    const user = await prisma.user.findUnique({ where: { username: "admin" } });
    if (!user) return NextResponse.json({ status: "error", message: "admin user not found" });
    
    const valid = await bcrypt.compare("Ndf41847034@", user.password);
    
    const end = Date.now();
    return NextResponse.json({ status: "ok", found: !!user, passwordValid: valid, time: end - start });
  } catch (error: any) {
    console.error("Test DB error:", error);
    return NextResponse.json({ status: "error", message: error.message, stack: error.stack }, { status: 500 });
  }
}
