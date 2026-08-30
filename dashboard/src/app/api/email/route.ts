import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { to, subject, message, attachmentType, payload, pdfBase64, pdfFilename } = await req.json();

    if (!to || !subject) {
      return NextResponse.json({ error: "Faltan campos requeridos (to, subject)" }, { status: 400 });
    }

    const { SMTP_USER, AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_CLIENT_SECRET } = process.env;

    if (!SMTP_USER || !AZURE_CLIENT_ID || !AZURE_TENANT_ID || !AZURE_CLIENT_SECRET) {
      return NextResponse.json({ error: "Faltan variables de entorno de Azure o SMTP_USER" }, { status: 500 });
    }

    let htmlBody = `
      <div style="font-family: Arial, sans-serif; color: #1e293b; line-height: 1.5; max-width: 850px; margin: 0 auto; border: 1px solid #cbd5e1; border-radius: 10px; overflow: hidden; background-color: #ffffff;">
        <div style="background-color: #1e1b4b; color: white; padding: 20px 24px;">
          <h2 style="margin: 0; font-size: 18px;">Centro de Control de Parcheo - Reporte Integrado</h2>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #c7d2fe;">${message || "Se adjunta la información solicitada desde el Dashboard."}</p>
        </div>
        <div style="padding: 24px;">
    `;

    // The user requested that ONLY the message should be in the body.
    // The data tables are omitted from the HTML body, as they will be in the attached PDF.

    htmlBody += `
        </div>
        <div style="background-color: #f8fafc; padding: 12px 20px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #e2e8f0;">
          Enviado automáticamente desde el Dashboard de Parcheo.
        </div>
      </div>
    `;

    // 1. Obtener Token OAuth2 de Microsoft Entra ID
    const tokenResponse = await fetch(`https://login.microsoftonline.com/${AZURE_TENANT_ID}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: AZURE_CLIENT_ID,
        scope: 'https://graph.microsoft.com/.default',
        client_secret: AZURE_CLIENT_SECRET,
        grant_type: 'client_credentials',
      })
    });

    if (!tokenResponse.ok) {
      const err = await tokenResponse.text();
      throw new Error("Error al obtener token de Azure: " + err);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Preparar destinatarios (Graph API espera array de objetos)
    const recipientList = to.split(',').map((email: string) => ({
      emailAddress: { address: email.trim() }
    }));

    const requestBody: any = {
      message: {
        subject: subject,
        body: {
          contentType: 'HTML',
          content: htmlBody
        },
        toRecipients: recipientList,
      },
      saveToSentItems: 'true'
    };

    if (pdfBase64) {
      requestBody.message.attachments = [
        {
          "@odata.type": "#microsoft.graph.fileAttachment",
          name: pdfFilename || "Reporte.pdf",
          contentType: "application/pdf",
          contentBytes: pdfBase64
        }
      ];
    }

    // 3. Enviar email vía Microsoft Graph API
    const sendMailResponse = await fetch(`https://graph.microsoft.com/v1.0/users/${SMTP_USER}/sendMail`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    if (!sendMailResponse.ok) {
      const err = await sendMailResponse.text();
      throw new Error("Error al enviar email vía Graph API: " + err);
    }

    return NextResponse.json({ success: true, message: "Email enviado correctamente vía Graph API" });
  } catch (error: any) {
    console.error("Email API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
