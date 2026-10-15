import { prisma } from "@/lib/prisma";
import { sendEmail } from "@/lib/email";

export type NotificationType =
  | "SYNC_NEW"
  | "CALENDAR_SCHEDULED"
  | "EXECUTION_STARTED"
  | "EXECUTION_COMPLETED";

export interface NotificationPayload {
  type: NotificationType;
  title: string;
  message: string;
  taskName?: string;
  cliente?: string;
  periodo?: string;
  fechaHora?: string;
  grupo?: string;
  servidores?: number | string;
  equipo?: string;
  orderId?: string;
  metadata?: Record<string, any>;
}

// Resuelve la lista de destinatarios para correos de notificación
export async function getNotificationRecipients(): Promise<string> {
  if (process.env.NOTIFICATION_EMAILS) {
    return process.env.NOTIFICATION_EMAILS;
  }
  try {
    const users = await prisma.user.findMany({
      where: {
        email: { not: null },
        role: { in: ["admin", "Base", "base", "user"] },
      },
      select: { email: true },
    });
    const emails = users
      .map((u) => u.email?.trim())
      .filter((e): e is string => !!e && e.includes("@"));

    if (emails.length > 0) {
      // Remover duplicados
      return Array.from(new Set(emails)).join(", ");
    }
  } catch (err) {
    console.warn("[Notifications] Error al obtener destinatarios de la BD:", err);
  }
  return process.env.SMTP_USER || "patching@algeiba.com";
}

function buildEmailHtml({
  badge,
  badgeBg,
  badgeText,
  title,
  taskName,
  cliente,
  periodo,
  fechaHora,
  grupo,
  servidores,
  equipo,
  linkUrl,
  linkText,
  extraMessage,
}: {
  badge: string;
  badgeBg: string;
  badgeText: string;
  title: string;
  taskName?: string;
  cliente?: string;
  periodo?: string;
  fechaHora?: string;
  grupo?: string;
  servidores?: number | string;
  equipo?: string;
  linkUrl?: string;
  linkText?: string;
  extraMessage?: string;
}) {
  const fields = [
    taskName ? { label: "Nombre de la tarea", value: taskName } : null,
    cliente ? { label: "Cliente", value: cliente } : null,
    periodo ? { label: "Periodo", value: periodo } : null,
    fechaHora ? { label: "Fecha y hora de ejecución", value: fechaHora } : null,
    grupo ? { label: "Grupo", value: grupo } : null,
    servidores !== undefined && servidores !== null ? { label: "Cantidad de Servidores", value: String(servidores) } : null,
    equipo ? { label: "Equipo de origen", value: equipo } : null,
  ].filter(Boolean) as Array<{ label: string; value: string }>;

  const rowsHtml = fields
    .map(
      (f, idx) => `
      <tr style="background-color: ${idx % 2 === 0 ? "#f8fafc" : "#ffffff"};">
        <td style="padding: 10px 14px; font-weight: 600; color: #475569; width: 38%; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${f.label}</td>
        <td style="padding: 10px 14px; color: #0f172a; font-weight: 500; border-bottom: 1px solid #e2e8f0; font-size: 13px;">${f.value}</td>
      </tr>`
    )
    .join("");

  return `
  <!DOCTYPE html>
  <html>
    <head>
      <meta charset="utf-8" />
      <title>${title}</title>
    </head>
    <body style="margin: 0; padding: 24px; background-color: #0b0f17; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.3);">
        <!-- Header -->
        <tr>
          <td style="background: linear-gradient(135deg, #4338ca 0%, #312e81 100%); padding: 24px 30px; color: #ffffff;">
            <table width="100%" border="0" cellspacing="0" cellpadding="0">
              <tr>
                <td>
                  <span style="display: inline-block; padding: 4px 10px; border-radius: 9999px; background-color: ${badgeBg}; color: ${badgeText}; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                    ${badge}
                  </span>
                  <h1 style="margin: 0; font-size: 20px; font-weight: 700; color: #ffffff; line-height: 1.3;">
                    ${title}
                  </h1>
                  <p style="margin: 4px 0 0; font-size: 12px; color: #c7d2fe;">Centro de Control de Parcheo • Algeiba</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding: 24px 30px;">
            ${extraMessage ? `<p style="margin: 0 0 18px; font-size: 14px; color: #334155; line-height: 1.5;">${extraMessage}</p>` : ""}
            
            <table width="100%" border="0" cellspacing="0" cellpadding="0" style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden; margin-bottom: 24px;">
              ${rowsHtml}
            </table>

            ${linkUrl ? `
            <div style="text-align: center; margin-top: 10px; margin-bottom: 10px;">
              <a href="${linkUrl}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; text-decoration: none; font-size: 13px; font-weight: 600; padding: 12px 28px; border-radius: 8px; box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);">
                ${linkText || "Ver en el Centro de Parcheo"}
              </a>
            </div>` : ""}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background-color: #f8fafc; border-top: 1px solid #e2e8f0; padding: 16px 30px; text-align: center; font-size: 11px; color: #94a3b8;">
            Notificación automática enviada por el Centro de Control de Parcheo (WUU). Por favor no responder a este correo.
          </td>
        </tr>
      </table>
    </body>
  </html>
  `;
}

export async function createAndDispatchNotification(payload: NotificationPayload) {
  try {
    // 1. Guardar en Base de Datos
    const notification = await prisma.notification.create({
      data: {
        type: payload.type,
        title: payload.title,
        message: payload.message,
        metadata: {
          taskName: payload.taskName,
          cliente: payload.cliente,
          periodo: payload.periodo,
          fechaHora: payload.fechaHora,
          grupo: payload.grupo,
          servidores: payload.servidores,
          equipo: payload.equipo,
          orderId: payload.orderId,
          ...(payload.metadata || {}),
        },
      },
    });

    // 2. Preparar correo según tipo
    let subject = "";
    let badge = "Notificación";
    let badgeBg = "#e0e7ff";
    let badgeText = "#3730a3";
    let linkUrl = "https://patching.algeiba.com";
    let linkText = "Abrir Centro de Parcheo";

    const baseUrl = process.env.NEXTAUTH_URL || "https://patching.algeiba.com";

    switch (payload.type) {
      case "SYNC_NEW":
        subject = `[Sincronización] Nueva sincronización de servidores completada`;
        badge = "Sincronización";
        badgeBg = "#dcfce7";
        badgeText = "#166534";
        linkUrl = `${baseUrl}/historial`;
        linkText = "Ver Historial de Sincronizaciones";
        break;

      case "CALENDAR_SCHEDULED":
        subject = `[Programación] Nueva ejecución programada: ${payload.taskName || payload.title}`;
        badge = "Pendiente";
        badgeBg = "#fef3c7";
        badgeText = "#92400e";
        linkUrl = payload.orderId ? `${baseUrl}/calendario?orderId=${payload.orderId}` : `${baseUrl}/calendario`;
        linkText = "Ver en Calendario";
        break;

      case "EXECUTION_STARTED":
        subject = `[Inicio de Ejecución] ${payload.taskName || "Tarea programada"}${payload.cliente ? ` - ${payload.cliente}` : ""}`;
        badge = "En Ejecución";
        badgeBg = "#dbeafe";
        badgeText = "#1e40af";
        linkUrl = payload.orderId ? `${baseUrl}/calendario?orderId=${payload.orderId}` : `${baseUrl}/calendario`;
        linkText = "Seguir Ejecución en Tiempo Real";
        break;

      case "EXECUTION_COMPLETED":
        subject = `[Finalizada] ${payload.taskName || "Tarea programada"}${payload.cliente ? ` - ${payload.cliente}` : ""}`;
        badge = "Finalizada";
        badgeBg = "#dcfce7";
        badgeText = "#166534";
        linkUrl = `${baseUrl}/historial`;
        linkText = "Ver Resultados en Historial";
        break;
    }

    const htmlBody = buildEmailHtml({
      badge,
      badgeBg,
      badgeText,
      title: payload.title,
      taskName: payload.taskName,
      cliente: payload.cliente,
      periodo: payload.periodo,
      fechaHora: payload.fechaHora,
      grupo: payload.grupo,
      servidores: payload.servidores,
      equipo: payload.equipo,
      linkUrl,
      linkText,
      extraMessage: payload.message,
    });

    const recipients = await getNotificationRecipients();
    if (recipients) {
      try {
        await sendEmail({
          to: recipients,
          subject,
          htmlBody,
        });
        console.log(`[Notifications] Correo enviado exitosamente a: ${recipients} (${subject})`);
      } catch (mailErr) {
        console.warn(`[Notifications] No se pudo enviar el correo:`, mailErr);
      }
    }

    return notification;
  } catch (error) {
    console.error("[Notifications] Error al crear y despachar notificación:", error);
    return null;
  }
}
