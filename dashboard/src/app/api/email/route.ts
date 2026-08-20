import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { to, subject, message, attachmentType, payload } = await req.json();

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

    // Full Report Email Formatting
    if (attachmentType === "report" && payload && (Array.isArray(payload) ? payload[0] : payload)) {
      const rep = Array.isArray(payload) ? payload[0] : payload;
      
      htmlBody += `
        <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; padding: 12px 16px; border-radius: 8px; font-size: 12px; margin-bottom: 20px;">
          <strong>Bancos Seleccionados:</strong> ${rep.selectedBanksText || "Todos"}<br/>
          <strong>Filtro de Tiempo:</strong> ${rep.timeFilterText || "Todo"}<br/>
          <strong>Umbral Inactividad:</strong> ${rep.inactivityThresholdText || "15 días"}<br/>
          <strong>Emisión:</strong> ${rep.generatedAt || new Date().toLocaleString("es-AR")}
        </div>
      `;

      if (rep.byType && rep.byType.length > 0) {
        htmlBody += `
          <h3 style="margin-top: 20px; color: #4f46e5; border-bottom: 2px solid #4f46e5; padding-bottom: 4px; font-size: 14px;">1. Resumen por Tipo / Banco</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px;">
            <thead>
              <tr style="background-color: #312e81; color: white; text-align: left;">
                <th style="padding: 6px; border: 1px solid #cbd5e1;">Banco</th>
                <th style="padding: 6px; border: 1px solid #cbd5e1;">Total</th>
                <th style="padding: 6px; border: 1px solid #cbd5e1;">OK</th>
                <th style="padding: 6px; border: 1px solid #cbd5e1;">Errores</th>
                <th style="padding: 6px; border: 1px solid #cbd5e1;">Sin Datos</th>
                <th style="padding: 6px; border: 1px solid #cbd5e1;">Tasa Éxito %</th>
              </tr>
            </thead>
            <tbody>
        `;
        rep.byType.forEach((b: any) => {
          htmlBody += `
            <tr>
              <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: bold;">${b.name}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0;">${b.total}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0; color: #10b981; font-weight: bold;">${b.ok}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0; color: #ef4444; font-weight: bold;">${b.error}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0; color: #64748b;">${b.nodata}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: bold;">${b.successRate}%</td>
            </tr>
          `;
        });
        htmlBody += `</tbody></table>`;
      }

      if (rep.topErrors && rep.topErrors.length > 0) {
        htmlBody += `
          <h3 style="margin-top: 25px; color: #e11d48; border-bottom: 2px solid #e11d48; padding-bottom: 4px; font-size: 14px;">2. Top Errores Más Frecuentes</h3>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px;">
            <thead>
              <tr style="background-color: #9f1239; color: white; text-align: left;">
                <th style="padding: 6px; border: 1px solid #cbd5e1; width: 30px;">#</th>
                <th style="padding: 6px; border: 1px solid #cbd5e1;">Mensaje de Error</th>
                <th style="padding: 6px; border: 1px solid #cbd5e1; width: 70px;">Cantidad</th>
                <th style="padding: 6px; border: 1px solid #cbd5e1;">Servidores Afectados</th>
              </tr>
            </thead>
            <tbody>
        `;
        rep.topErrors.slice(0, 10).forEach((err: any) => {
          htmlBody += `
            <tr>
              <td style="padding: 6px; border: 1px solid #e2e8f0; text-align: center;">${err.rank}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0; color: #9f1239; font-weight: bold;">${err.message}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: bold;">${err.count}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0; font-size: 10px;">${err.serversText}</td>
            </tr>
          `;
        });
        htmlBody += `</tbody></table>`;
      }

      if (rep.evoluciones) {
        htmlBody += `
          <h3 style="margin-top: 25px; color: #7c3aed; border-bottom: 2px solid #7c3aed; padding-bottom: 4px; font-size: 14px;">3. Resumen de Evoluciones e Histórico</h3>
          <p style="font-size: 11px; color: #475569;">
            <strong>Baseline (${rep.evoluciones.baselineTitle}):</strong> Total ${rep.evoluciones.baselineTotal} | OK: ${rep.evoluciones.baselineOk} | Errores: ${rep.evoluciones.baselineErrors} | Sin datos: ${rep.evoluciones.baselineNoData}<br/>
            <strong>Target (${rep.evoluciones.targetTitle}):</strong> Total ${rep.evoluciones.targetTotal} | OK: ${rep.evoluciones.targetOk} | Errores: ${rep.evoluciones.targetErrors} | Sin datos: ${rep.evoluciones.targetNoData}
          </p>
        `;
      }

      if (rep.inactiveServersByBank && rep.inactiveServersByBank.length > 0) {
        htmlBody += `
          <h3 style="margin-top: 25px; color: #e11d48; border-bottom: 2px solid #e11d48; padding-bottom: 4px; font-size: 14px;">4. Servidores Inactivos (Umbral: ${rep.inactivityThresholdText || "15 días"})</h3>
        `;
        rep.inactiveServersByBank.forEach((g: any) => {
          htmlBody += `
            <h4 style="margin-top: 12px; margin-bottom: 6px; font-size: 12px; color: #334155;">Banco ${g.bank} (${g.count} servidores inactivos)</h4>
            <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
              <thead>
                <tr style="background-color: #f1f5f9; text-align: left;">
                  <th style="padding: 6px; border: 1px solid #e2e8f0;">Servidor</th>
                  <th style="padding: 6px; border: 1px solid #e2e8f0;">IP</th>
                  <th style="padding: 6px; border: 1px solid #e2e8f0;">Último Reporte</th>
                  <th style="padding: 6px; border: 1px solid #e2e8f0;">Inactividad</th>
                </tr>
              </thead>
              <tbody>
          `;
          g.servers.forEach((s: any) => {
            htmlBody += `
              <tr>
                <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: bold;">${s.serverName}</td>
                <td style="padding: 6px; border: 1px solid #e2e8f0;">${s.ip}</td>
                <td style="padding: 6px; border: 1px solid #e2e8f0;">${s.lastSeenDate}</td>
                <td style="padding: 6px; border: 1px solid #e2e8f0; color: #e11d48; font-weight: bold;">${s.elapsedDaysText}</td>
              </tr>
            `;
          });
          htmlBody += `</tbody></table>`;
        });
      }
    } else if (payload && Array.isArray(payload) && payload.length > 0) {
      // Standard history table
      htmlBody += `
        <h3 style="margin-top: 15px; border-bottom: 2px solid #4f46e5; padding-bottom: 5px;">Detalle de Servidores</h3>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-top: 10px;">
          <thead>
            <tr style="background-color: #f1f5f9; text-align: left;">
              <th style="padding: 6px; border: 1px solid #e2e8f0;">Servidor</th>
              <th style="padding: 6px; border: 1px solid #e2e8f0;">IP</th>
              <th style="padding: 6px; border: 1px solid #e2e8f0;">Estado</th>
              <th style="padding: 6px; border: 1px solid #e2e8f0;">OS</th>
              <th style="padding: 6px; border: 1px solid #e2e8f0;">Error</th>
            </tr>
          </thead>
          <tbody>
      `;
      payload.forEach((item) => {
        let estadoColor = item.status === "ok" ? "#10b981" : item.status === "error" ? "#ef4444" : "#6b7280";
        let estadoTexto = item.status === "ok" ? "OK" : item.status === "error" ? "Error" : "Sin Datos";
        htmlBody += `
            <tr>
              <td style="padding: 6px; border: 1px solid #e2e8f0; font-weight: bold;">${item.serverName || "—"}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0;">${item.ip || "—"}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0; color: ${estadoColor}; font-weight: bold;">${estadoTexto}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0;">${item.os || "—"}</td>
              <td style="padding: 6px; border: 1px solid #e2e8f0; color: #ef4444;">${item.errorDescription || "—"}</td>
            </tr>
        `;
      });
      htmlBody += `</tbody></table>`;
    }

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

    // 3. Enviar email vía Microsoft Graph API
    const sendMailResponse = await fetch(`https://graph.microsoft.com/v1.0/users/${SMTP_USER}/sendMail`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        message: {
          subject: subject,
          body: {
            contentType: 'HTML',
            content: htmlBody
          },
          toRecipients: recipientList
        },
        saveToSentItems: 'true'
      })
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
