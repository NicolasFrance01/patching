export async function sendEmail({ to, subject, htmlBody, pdfBase64, pdfFilename }: { to: string, subject: string, htmlBody: string, pdfBase64?: string, pdfFilename?: string }) {
  const { SMTP_USER, AZURE_CLIENT_ID, AZURE_TENANT_ID, AZURE_CLIENT_SECRET } = process.env;

  if (!SMTP_USER || !AZURE_CLIENT_ID || !AZURE_TENANT_ID || !AZURE_CLIENT_SECRET) {
    throw new Error("Faltan variables de entorno de Azure o SMTP_USER");
  }

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

  return true;
}
