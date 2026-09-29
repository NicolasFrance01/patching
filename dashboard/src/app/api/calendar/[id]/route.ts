import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import nodemailer from "nodemailer";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.patchOrder.findUnique({
      where: { id: params.id },
    });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch order" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const existingOrder = await prisma.patchOrder.findUnique({
      where: { id: params.id },
    });
    
    if (!existingOrder) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    const newStatus = body.status || existingOrder.status;
    const newLog = body.executionLog !== undefined ? body.executionLog : existingOrder.executionLog;

    const updated = await prisma.patchOrder.update({
      where: { id: params.id },
      data: {
        status: newStatus,
        executionLog: newLog,
      },
    });

    // If status changed from PENDING to IN_PROGRESS, send START email
    if (existingOrder.status === "PENDING" && newStatus === "IN_PROGRESS") {
      // Find all users who should be notified (maybe the creator or all admins)
      // For now, let's just email the creator if they have an email, or a default email.
      // We will send to a generic address or we need to find the user's email based on createdBy.
      const user = await prisma.user.findFirst({ where: { username: existingOrder.createdBy } });
      const sendTo = user?.email || process.env.SMTP_USER;
      
      if (sendTo && process.env.SMTP_USER && process.env.SMTP_PASS) {
        const transporter = nodemailer.createTransport({
          host: "smtp.office365.com",
          port: 587,
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
        });

        const htmlBody = `
          <div style="font-family: Arial, sans-serif; color: #1e293b; max-width: 600px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden;">
            <div style="background-color: #4f46e5; color: white; padding: 20px 24px;">
              <h2 style="margin: 0; font-size: 18px;">Ejecución de Tarea Iniciada</h2>
            </div>
            <div style="padding: 24px;">
              <p>Hola,</p>
              <p>La siguiente tarea programada acaba de comenzar su ejecución:</p>
              <div style="background-color: #f1f5f9; padding: 12px; border-radius: 8px; margin: 16px 0;">
                <strong>Título:</strong> ${existingOrder.title}<br/>
                <strong>Acción:</strong> ${existingOrder.actionType}<br/>
                <strong>Iniciado a las:</strong> ${new Date().toLocaleString("es-AR")}
              </div>
              <p>Puedes seguir el avance en tiempo real desde el sistema:</p>
              <p>
                <a href="https://patching.algeiba.com/calendario?orderId=${existingOrder.id}" style="display: inline-block; padding: 10px 20px; background-color: #4f46e5; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
                  Ver Estado en Tiempo Real
                </a>
              </p>
            </div>
          </div>
        `;

        await transporter.sendMail({
          from: process.env.SMTP_USER,
          to: sendTo,
          subject: `[Inicio de Tarea] ${existingOrder.title}`,
          html: htmlBody,
        });
      }
    }

    return NextResponse.json(updated);
  } catch (error: any) {
    console.error("Calendar PATCH Error:", error);
    return NextResponse.json({ error: "Failed to update order", details: error.message }, { status: 500 });
  }
}
