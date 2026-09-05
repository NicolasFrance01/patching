import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") return null;
  return session;
}

function generateRandomPassword(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => chars[x % chars.length])
    .join("");
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  if (searchParams.get("action") === "list") {
    const users = await prisma.user.findMany({
      select: { id: true, username: true, email: true }
    });
    return NextResponse.json(users);
  }
  return NextResponse.json({ error: "Acción no válida" }, { status: 400 });
}

export async function POST(req: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const body = await req.json();
  const { email, password, role } = body;
  let { username } = body;

  if (!email && (!username || !password)) {
    return NextResponse.json({ error: "Debe proveer correo o (usuario y contraseña)" }, { status: 400 });
  }

  let finalUsername = username;
  let finalPassword = password;
  let isConfirmed = true;
  let mustChangePassword = false;
  let passwordExpiry = null;
  let sentEmail = false;

  if (email) {
    if (!finalUsername) {
      finalUsername = email.split("@")[0];
    }
    finalPassword = generateRandomPassword(10);
    isConfirmed = false;
    mustChangePassword = true;
    passwordExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours from now
  }

  const hashed = await bcrypt.hash(finalPassword, 10);

  try {
    const user = await prisma.user.create({
      data: {
        username: finalUsername,
        password: hashed,
        role: role ?? "user",
        email: email || null,
        isConfirmed,
        mustChangePassword,
        passwordExpiry
      },
      select: { id: true, username: true, role: true, email: true, isConfirmed: true, createdAt: true },
    });

    if (email) {
      const htmlBody = `
        <div style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.5; max-width: 600px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
          <div style="background-color: #1e1b4b; color: white; padding: 20px 24px;">
            <h2 style="margin: 0; font-size: 18px;">Bienvenido al Centro de Control de Parcheo</h2>
          </div>
          <div style="padding: 24px;">
            <p>Hola <strong>${finalUsername}</strong>,</p>
            <p>Se ha creado tu cuenta. Tus credenciales de acceso temporal son:</p>
            <div style="background-color: #f1f5f9; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 14px; margin: 16px 0;">
              Usuario: <strong>${finalUsername}</strong><br/>
              Contraseña: <strong>${finalPassword}</strong>
            </div>
            <p style="color: #ef4444; font-size: 12px; font-weight: bold;">
              Importante: Esta contraseña caducará en 48 horas. Se te requerirá cambiarla en tu primer inicio de sesión.
            </p>
          </div>
        </div>
      `;
      await sendEmail({ to: email, subject: "Credenciales de Acceso - Centro de Parcheo", htmlBody });
      sentEmail = true;
    }

    return NextResponse.json({ ...user, sentEmail });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error al crear usuario. Posible usuario duplicado." }, { status: 409 });
  }
}

export async function PATCH(req: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }

  const { id, username, role, email, action } = await req.json();

  if (action === "resend" && id) {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || !user.email) return NextResponse.json({ error: "Usuario sin correo" }, { status: 400 });

    const newPassword = generateRandomPassword(10);
    const hashed = await bcrypt.hash(newPassword, 10);
    const passwordExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id },
      data: {
        password: hashed,
        isConfirmed: false,
        mustChangePassword: true,
        passwordExpiry
      }
    });

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.5; max-width: 600px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #1e1b4b; color: white; padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 18px;">Restablecimiento de Contraseña</h2>
        </div>
        <div style="padding: 24px;">
          <p>Hola <strong>${user.username}</strong>,</p>
          <p>Se ha generado una nueva contraseña temporal para tu cuenta:</p>
          <div style="background-color: #f1f5f9; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 14px; margin: 16px 0;">
            Contraseña: <strong>${newPassword}</strong>
          </div>
          <p style="color: #ef4444; font-size: 12px; font-weight: bold;">
            Importante: Esta contraseña caducará en 48 horas. Se te requerirá cambiarla en tu primer inicio de sesión.
          </p>
        </div>
      </div>
    `;
    await sendEmail({ to: user.email, subject: "Restablecimiento de Contraseña - Centro de Parcheo", htmlBody });
    
    return NextResponse.json({ success: true });
  }

  if (id && username && role) {
    // Edit User
    try {
      const updated = await prisma.user.update({
        where: { id },
        data: { username, role, email: email || null },
        select: { id: true, username: true, role: true, email: true, isConfirmed: true, createdAt: true },
      });
      return NextResponse.json(updated);
    } catch {
      return NextResponse.json({ error: "Error al actualizar" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Petición inválida" }, { status: 400 });
}

export async function DELETE(req: Request) {
  if (!await requireAdmin()) {
    return NextResponse.json({ error: "No autorizado" }, { status: 403 });
  }
  const { id } = await req.json();
  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
