import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createAndDispatchNotification } from "@/lib/notifications";
import {
  extractMonthFromFechaVentana,
  getArgentinaDateParts,
  resolveFrozenMonths,
} from "@/lib/monthlyPeriod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const data = Array.isArray(body)
      ? body
      : Array.isArray(body?.servers)
        ? body.servers
        : null;

    if (!data) {
      return NextResponse.json(
        { error: "Payload must be an array of objects (or { servers: [...] })" },
        { status: 400 }
      );
    }

    const seen = new Set<string>();
    const validItems = data.filter((item: any) => {
      const rawName = String(item.Servidor ?? "").trim();
      const rawDomain = item.Dominio ? String(item.Dominio).trim() : null;
      const name = (rawDomain && rawDomain !== "N/A" && rawDomain !== "null") 
        ? `${rawName} (${rawDomain})` 
        : rawName;
        
      if (!rawName || seen.has(name)) return false;
      seen.add(name);
      return true;
    });

    const now = new Date();
    const { year: currentYear, month: currentMonthNum, yearMonth: defaultTargetMonth } = getArgentinaDateParts(now);
    const currentMonthStr = `M${currentMonthNum} ${currentYear}`;

    let success = 0, errors = 0, noData = 0;
    const items = validItems.map((item: any) => {
      let fechaVentana = String(item.Fecha_Ventana || "").trim();
      if (fechaVentana === "null" || fechaVentana === "undefined") fechaVentana = "";
      
      const isCurrentMonth = 
        !fechaVentana || 
        fechaVentana === "N/A" || 
        fechaVentana.includes(currentMonthStr) ||
        fechaVentana.includes(`/${currentMonthNum}/${currentYear}`) ||
        fechaVentana.includes(`${currentYear}-${currentMonthNum}-`);
      
      let status = String(item.Estado || "").trim();
      
      if (!status) {
        if (!isCurrentMonth) {
          status = "Sin Datos";
        } else {
          const isError = !!(item.Descripcion_Error && item.Descripcion_Error !== "N/A");
          const isNoData = !isError && (!item.Sistema_Operativo || item.Sistema_Operativo === "N/A");
          status = isError ? "Error" : isNoData ? "Sin Datos" : "Actualizado";
        }
      }

      const statusLower = status.toLowerCase();
      if (statusLower === "ok" || statusLower === "actualizado") success++;
      else if (statusLower === "error" || statusLower === "no actualizado") errors++;
      else if (statusLower !== "sin datos" && statusLower !== "nodata") success++; // Other statuses like Pendiente, etc. are counted as sync data
      else noData++;
      const rawServerName = String(item.Servidor).trim();
      const rawDomain = item.Dominio ? String(item.Dominio).trim() : null;
      const finalServerName = (rawDomain && rawDomain !== "N/A" && rawDomain !== "null") 
        ? `${rawServerName} (${rawDomain})` 
        : rawServerName;

      const rawTipo = String(
        item.Tipo_Reporte || item["Tipo reporte"] || item.tipoReporte || item.tipo_reporte || body?.tipoReporte || ""
      ).trim();
      const isMensual = rawTipo.toLowerCase() === "mensual";

      const explicitMonth = extractMonthFromFechaVentana(
        item.Mes || item.Periodo || item.Month || item.Target_Month || item.targetMonth || body?.month || body?.targetMonth
      );
      const targetMonth = explicitMonth ?? extractMonthFromFechaVentana(fechaVentana) ?? defaultTargetMonth;

      return {
        serverName: finalServerName,
        grupo: item.Grupo ? String(item.Grupo) : null,
        ambiente: item.Ambiente ? String(item.Ambiente) : null,
        domain: item.Dominio ? String(item.Dominio) : null,
        ip: item.IP ? String(item.IP) : null,
        os: item.Sistema_Operativo ? String(item.Sistema_Operativo) : null,
        osVersion: item.Version_Sistema_Operativo ? String(item.Version_Sistema_Operativo) : null,
        analista: item.Analista ? String(item.Analista) : null,
        sqlInstancia: item.SQL_Instancia ? String(item.SQL_Instancia) : null,
        sqlVersion: item.SQL_Version ? String(item.SQL_Version) : null,
        sqlUltimaActualizacion: item.SQL_Ultima_Actualizacion ? String(item.SQL_Ultima_Actualizacion) : null,
        fechaVentana: item.Fecha_Ventana ? String(item.Fecha_Ventana) : null,
        installDate: item.Fecha_Instalacion ? String(item.Fecha_Instalacion) : null,
        installedKBs: item.KBs_Instaladas ? String(item.KBs_Instaladas) : null,
        rebootDate: item.Fecha_Reinicio ? String(item.Fecha_Reinicio) : null,
        runningTime: item.Running_Time ? String(item.Running_Time) : null,
        diskSpace: item.Disk_Space ? String(item.Disk_Space) : null,
        errorDescription: item.Descripcion_Error ? String(item.Descripcion_Error) : null,
        comentarios: item.Comentarios ? String(item.Comentarios) : null,
        snap: item.Snap ? String(item.Snap) : null,
        confirmado: item.Confirmado ? String(item.Confirmado) : null,
        status,
        tipoReporte: rawTipo,
        isMensual,
        targetMonth,
      };
    });

    // Filtro para parcheo diario: NO sumar registros mensuales al contador de parcheo diario
    const dailyItems = items.filter((item: any) => !item.isMensual);

    let syncRun: any = null;
    if (dailyItems.length > 0) {
      let dailySuccess = 0, dailyErrors = 0, dailyNoData = 0;
      for (const d of dailyItems) {
        const st = d.status.toLowerCase();
        if (st === "ok" || st === "actualizado") dailySuccess++;
        else if (st === "error" || st === "no actualizado") dailyErrors++;
        else if (st !== "sin datos" && st !== "nodata") dailySuccess++;
        else dailyNoData++;
      }

      syncRun = await prisma.syncRun.create({
        data: {
          total: dailyItems.length,
          success: dailySuccess,
          errors: dailyErrors,
          noData: dailyNoData,
        },
      });

      await prisma.syncHistory.createMany({
        data: dailyItems.map((item: any) => ({
          syncRunId: syncRun.id,
          serverName: item.serverName,
          grupo: item.grupo,
          ambiente: item.ambiente,
          domain: item.domain,
          ip: item.ip,
          os: item.os,
          osVersion: item.osVersion,
          analista: item.analista,
          sqlInstancia: item.sqlInstancia,
          sqlVersion: item.sqlVersion,
          sqlUltimaActualizacion: item.sqlUltimaActualizacion,
          fechaVentana: item.fechaVentana,
          installDate: item.installDate,
          installedKBs: item.installedKBs,
          rebootDate: item.rebootDate,
          runningTime: item.runningTime,
          diskSpace: item.diskSpace,
          errorDescription: item.errorDescription,
          comentarios: item.comentarios,
          snap: item.snap,
          confirmado: item.confirmado,
          status: item.status,
        })),
      });
    }

    const frozenMonths = await resolveFrozenMonths(
      prisma,
      items.map((item: any) => item.targetMonth),
      now
    );

    for (const item of items) {
      const payload = {
        grupo: item.grupo,
        ambiente: item.ambiente,
        domain: item.domain,
        ip: item.ip,
        os: item.os,
        osVersion: item.osVersion,
        analista: item.analista,
        sqlInstancia: item.sqlInstancia,
        sqlVersion: item.sqlVersion,
        sqlUltimaActualizacion: item.sqlUltimaActualizacion,
        fechaVentana: item.fechaVentana,
        installDate: item.installDate,
        installedKBs: item.installedKBs,
        rebootDate: item.rebootDate,
        runningTime: item.runningTime,
        diskSpace: item.diskSpace,
        errorDescription: item.errorDescription,
        comentarios: item.comentarios,
        snap: item.snap,
        confirmado: item.confirmado,
        status: item.status,
      };

      await prisma.serverStatus.upsert({
        where: { serverName: item.serverName },
        update: payload,
        create: { serverName: item.serverName, ...payload },
      });

      // Update MonthlyServerStatus if target month is open OR if this is an explicit monthly report
      if (!frozenMonths.has(item.targetMonth) || item.isMensual) {
        await prisma.monthlyServerStatus.upsert({
          where: {
            month_serverName: {
              month: item.targetMonth,
              serverName: item.serverName,
            },
          },
          update: { ...payload, status: item.status },
          create: {
            month: item.targetMonth,
            serverName: item.serverName,
            ...payload,
            status: item.status,
          },
        });
      }
    }

    // Despachar notificación
    const analistaStr = items.find((i: any) => i.analista)?.analista || "WUU";
    if (dailyItems.length > 0 && syncRun) {
      createAndDispatchNotification({
        type: "SYNC_NEW",
        title: "Nueva sincronización en Historial",
        message: `Se sincronizaron exitosamente ${dailyItems.length} servidores en el Centro de Control de Parcheo.`,
        taskName: `Sincronización por ${analistaStr}`,
        cliente: "Todos los bancos",
        periodo: currentMonthStr,
        fechaHora: now.toLocaleString("es-AR"),
        grupo: "Inventario General",
        servidores: dailyItems.length,
        metadata: {
          syncRunId: syncRun.id,
          total: dailyItems.length,
          success: dailyItems.filter((i: any) => i.status.toLowerCase() === "actualizado" || i.status.toLowerCase() === "ok").length,
          errors: dailyItems.filter((i: any) => i.status.toLowerCase() === "error" || i.status.toLowerCase() === "no actualizado").length,
        },
      }).catch((e) => console.warn("[Upload] Error al enviar notificación:", e));
    } else if (items.length > 0) {
      createAndDispatchNotification({
        type: "SYNC_NEW",
        title: "Reporte Mensual consolidado",
        message: `Se consolidó el reporte mensual de ${items.length} servidores en el Centro de Control de Parcheo (no computado en parcheos diarios).`,
        taskName: `Reporte Mensual por ${analistaStr}`,
        cliente: "Todos los bancos",
        periodo: currentMonthStr,
        fechaHora: now.toLocaleString("es-AR"),
        grupo: "Reporte Mensual",
        servidores: items.length,
        metadata: {
          tipo: "Mensual",
          total: items.length,
          success,
          errors,
          noData,
        },
      }).catch((e) => console.warn("[Upload] Error al enviar notificación:", e));
    }

    return NextResponse.json({
      success: true,
      count: items.length,
      dailySyncCount: dailyItems.length,
      syncRunId: syncRun?.id ?? null,
      tipoReporte: items[0]?.tipoReporte || "Ventana",
    });
  } catch (error: any) {
    console.error("Upload API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
