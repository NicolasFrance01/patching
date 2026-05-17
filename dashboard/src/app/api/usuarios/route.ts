import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") return null;
  return session;
}

export async function POST(req: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  const { username, password, role } = await req.json();
  if (!username || !password) {
    return NextResponse.json({ error: "Usuario y contraseña son requeridos" }, { status: 400 });
  }
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await prisma.user.create({
      data: { username, password: hashed, role: role ?? "user" },
      select: { id: true, username: true, role: true, createdAt: true },
    });
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ error: "El usuario ya existe" }, { status: 409 });
  }
}

export async function DELETE(req: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  const { id } = await req.json();
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
