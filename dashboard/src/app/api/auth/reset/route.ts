import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { sendEmail } from "@/lib/email";

function generateRandomPassword(length = 10) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
  return Array.from(crypto.getRandomValues(new Uint32Array(length)))
    .map((x) => chars[x % chars.length])
    .join("");
}

export async function POST(req: Request) {
  const body = await req.json();
  const { action } = body;

  if (action === "change_own_password") {
    // Authenticated user changing their own temporary password
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { newPassword } = body;
    if (!newPassword || newPassword.length < 6) {
      return NextResponse.json({ error: "Contraseña demasiado corta" }, { status: 400 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);
    
    // session.user.email is actually the username in our auth.ts setup
    const username = (session.user as any).name;

    await prisma.user.update({
      where: { username },
      data: {
        password: hashed,
        mustChangePassword: false,
        isConfirmed: true,
        passwordExpiry: null,
      },
    });

    return NextResponse.json({ success: true });
  }

  if (action === "forgot_password") {
    // Unauthenticated user requesting a password reset via email
    const { email } = body;
    if (!email) return NextResponse.json({ error: "Correo requerido" }, { status: 400 });

    const user = await prisma.user.findFirst({ where: { email } });
    
    // Always return success to prevent email enumeration attacks
    if (!user) {
      return NextResponse.json({ success: true });
    }

    const newPassword = generateRandomPassword(10);
    const hashed = await bcrypt.hash(newPassword, 10);
    const passwordExpiry = new Date(Date.now() + 48 * 60 * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
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
          <h2 style="margin: 0; font-size: 18px;">Recuperación de Contraseña</h2>
        </div>
        <div style="padding: 24px;">
          <p>Hola <strong>${user.username}</strong>,</p>
          <p>Hemos recibido una solicitud para restablecer tu contraseña. Tus nuevas credenciales temporales son:</p>
          <div style="background-color: #f1f5f9; padding: 12px; border-radius: 8px; font-family: monospace; font-size: 14px; margin: 16px 0;">
            Contraseña: <strong>${newPassword}</strong>
          </div>
          <p style="color: #ef4444; font-size: 12px; font-weight: bold;">
            Importante: Esta contraseña caducará en 48 horas. Deberás cambiarla al iniciar sesión.
          </p>
        </div>
      </div>
    `;

    try {
      await sendEmail({ to: user.email!, subject: "Recuperación de Contraseña - Centro de Parcheo", htmlBody });
    } catch (e) {
      console.error("Failed to send reset email", e);
    }

    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
}
