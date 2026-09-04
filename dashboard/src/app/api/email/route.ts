import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { to, subject, message, attachmentType, payload, pdfBase64, pdfFilename } = await req.json();

    if (!to || !subject) {
      return NextResponse.json({ error: "Faltan campos requeridos (to, subject)" }, { status: 400 });
    }

    let htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.5; max-width: 850px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #1e1b4b; color: white; padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 18px;">Centro de Control de Parcheo - Reporte Integrado</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #c7d2fe;">${message || "Se adjunta la información solicitada desde el Dashboard."}</p>
        </div>
        <div style="padding: 24px;">
        </div>
        <div style="background-color: #f8fafc; padding: 12px 20px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
          Enviado automáticamente desde el Dashboard de Parcheo.
        </div>
      </div>
    `;

    await sendEmail({ to, subject, htmlBody, pdfBase64, pdfFilename });

    return NextResponse.json({ success: true, message: "Email enviado correctamente vía Graph API" });
  } catch (error: any) {
    console.error("Email API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
