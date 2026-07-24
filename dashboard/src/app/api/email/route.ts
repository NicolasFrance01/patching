import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { to, subject, message, attachmentType, payload } = await req.json();

    if (!to || !subject) {
      return NextResponse.json({ error: "Faltan campos requeridos (to, subject)" }, { status: 400 });
    }

    const { SMTP_USER, SMTP_PASS } = process.env;

    if (!SMTP_USER || !SMTP_PASS) {
      return NextResponse.json({ error: "Las credenciales SMTP no están configuradas en el servidor" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: "smtp.office365.com",
      port: 587,
      secure: false, // TLS
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
      tls: {
        ciphers: "SSLv3",
      },
    });

    let htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5; max-width: 800px; margin: 0 auto; border: 1px solid #ddd; border-radius: 8px; overflow: hidden;">
        <div style="background-color: #4f46e5; color: white; padding: 16px 20px;">
          <h2 style="margin: 0;">Centro de Control de Parcheo</h2>
        </div>
        <div style="padding: 20px;">
          <p style="white-space: pre-wrap;">${message || "Se adjunta la información solicitada desde el Dashboard."}</p>
    `;

    // Añadir tabla según el payload
    if (payload && Array.isArray(payload) && payload.length > 0) {
      if (attachmentType === "history" || attachmentType === "report") {
        htmlBody += `
          <h3 style="margin-top: 30px; border-bottom: 2px solid #4f46e5; padding-bottom: 5px;">Detalle de Servidores</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 15px;">
            <thead>
              <tr style="background-color: #f3f4f6; text-align: left;">
                <th style="padding: 8px; border: 1px solid #e5e7eb;">Servidor</th>
                <th style="padding: 8px; border: 1px solid #e5e7eb;">IP</th>
                <th style="padding: 8px; border: 1px solid #e5e7eb;">Estado</th>
                <th style="padding: 8px; border: 1px solid #e5e7eb;">OS</th>
                <th style="padding: 8px; border: 1px solid #e5e7eb;">Error</th>
              </tr>
            </thead>
            <tbody>
        `;
        payload.forEach((item) => {
          let estadoColor = item.status === "ok" ? "#10b981" : item.status === "error" ? "#ef4444" : "#6b7280";
          let estadoTexto = item.status === "ok" ? "OK" : item.status === "error" ? "Error" : "Sin Datos";
          htmlBody += `
              <tr>
                <td style="padding: 8px; border: 1px solid #e5e7eb; font-weight: bold;">${item.serverName || "—"}</td>
                <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.ip || "—"}</td>
                <td style="padding: 8px; border: 1px solid #e5e7eb; color: ${estadoColor}; font-weight: bold;">${estadoTexto}</td>
                <td style="padding: 8px; border: 1px solid #e5e7eb;">${item.os || "—"}</td>
                <td style="padding: 8px; border: 1px solid #e5e7eb; color: #ef4444;">${item.errorDescription || "—"}</td>
              </tr>
          `;
        });
        htmlBody += `
            </tbody>
          </table>
        `;
      }
    }

    htmlBody += `
        </div>
        <div style="background-color: #f9fafb; padding: 12px 20px; font-size: 11px; color: #6b7280; text-align: center; border-top: 1px solid #ddd;">
          Enviado automáticamente desde el Dashboard de Parcheo.
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: `"Dashboard Parcheo" <${SMTP_USER}>`,
      to,
      subject,
      html: htmlBody,
    });

    return NextResponse.json({ success: true, messageId: info.messageId });
  } catch (error: any) {
    console.error("Email API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
