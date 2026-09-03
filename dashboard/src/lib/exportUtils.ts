import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { HEADER_IMAGE_BASE64, FOOTER_IMAGE_BASE64 } from "./pdfAssets";

export interface ExportRow {
  servidor: string;
  dominio: string;
  ip: string;
  tipo: string;
  ambiente: string;
  os: string;
  fechaInstalacion: string;
  kbsInstaladas: string;
  fechaReinicio: string;
  estado: string;
  error: string;
  comentarios: string;
  snap: string;
  confirmado: string;
}

export interface InactiveServerItem {
  serverName: string;
  bank: string;
  ip: string;
  lastSeenDate: string;
  elapsedDaysText: string;
  lastOS: string;
  lastStatus: string;
}

export interface InactiveBankGroup {
  bank: string;
  count: number;
  servers: InactiveServerItem[];
}

export interface FullReportPDFPayload {
  selectedBanksText: string;
  timeFilterText: string;
  generatedAt: string;
  inactivityThresholdText?: string;
  inactiveServersByBank?: InactiveBankGroup[];
  byType: Array<{ name: string; total: number; ok: number; error: number; nodata: number; successRate: number }>;
  errorTrend: Array<{ label: string; ok: number; errores: number; total: number }>;
  syncList: Array<{ day: string; serverCount: number; totalSuccess: number; totalErrors: number; successRate: number }>;
  topErrors: Array<{ rank: number; message: string; count: number; serversText: string }>;
  evoluciones: {
    baselineTitle: string;
    baselineTotal: number; baselineOk: number; baselineErrors: number; baselineNoData: number;
    targetTitle: string;
    targetTotal: number; targetOk: number; targetErrors: number; targetNoData: number;
    solucionados: Array<{ serverName: string; bank: string; ip: string; pastError: string }>;
    nuevosErrores: Array<{ serverName: string; bank: string; ip: string; currentError: string; badge: string }>;
    nuevosServidores: Array<{ serverName: string; bank: string; ip: string; status: string }>;
    servidoresInactivos: Array<{ serverName: string; bank: string; ip: string }>;
  };
}

const BANK_RGB: Record<string, [number, number, number]> = {
  ASJ: [99, 102, 241],
  BSC: [6, 182, 212],
  BSJ: [16, 185, 129],
  Corp: [245, 158, 11],
  NBERSA: [239, 68, 68],
  NBSF: [139, 92, 246],
  QUALIA: [236, 72, 153],
  "Sin clasificar": [113, 113, 122],
};

const HEADERS = [
  "Servidor", "Dominio", "IP", "Tipo", "Ambiente",
  "OS", "Fecha Instalación", "KBs Instaladas", "Fecha Reinicio", "Estado", "Error",
  "Comentarios", "Snap", "Confirmado"
];

function toRow(r: ExportRow): string[] {
  return [
    r.servidor, r.dominio, r.ip, r.tipo, r.ambiente,
    r.os, r.fechaInstalacion, r.kbsInstaladas, r.fechaReinicio, r.estado, r.error,
    r.comentarios, r.snap, r.confirmado
  ];
}

export function downloadCSV(rows: ExportRow[], filename: string) {
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
  const lines = [
    HEADERS.map(escape).join(","),
    ...rows.map((r) => toRow(r).map(escape).join(",")),
  ];
  const blob = new Blob(["\uFEFF" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

// ── STANDARD LIST PDF GENERATION (LANDSCAPE) ──
export function generatePDFDoc(rows: ExportRow[], title: string) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const drawPageHeaderAndFooter = () => {
    if (HEADER_IMAGE_BASE64) {
      const hW = 110;
      const hH = hW / 3.688;
      const hX = (297 - hW) / 2;
      doc.addImage(HEADER_IMAGE_BASE64, "PNG", hX, 4, hW, hH);
    }
    if (FOOTER_IMAGE_BASE64) {
      const fW = 160;
      const fH = fW / 4.4466;
      const fX = (297 - fW) / 2;
      doc.addImage(FOOTER_IMAGE_BASE64, "PNG", fX, 210 - fH - 3, fW, fH);
    }
  };

  drawPageHeaderAndFooter();

  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 27, 75);
  doc.text(title.toUpperCase(), 14, 38);

  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 116, 139);
  doc.text(`Generado: ${new Date().toLocaleString("es-AR")}  |  Total: ${rows.length} servidores`, 14, 43);

  autoTable(doc, {
    startY: 46,
    head: [HEADERS],
    body: rows.map(toRow),
    styles: { fontSize: 6.5, cellPadding: 1.5, overflow: "linebreak" },
    headStyles: { fillColor: [30, 27, 75], textColor: 255, fontSize: 7, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 250] },
    margin: { top: 46, bottom: 42, left: 14, right: 14 },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 15 },
      2: { cellWidth: 15 },
      3: { cellWidth: 12 },
      4: { cellWidth: 15 },
      5: { cellWidth: 18 },
      6: { cellWidth: 15 },
      7: { cellWidth: 18 },
      8: { cellWidth: 15 },
      9: { cellWidth: 12 },
      10: { cellWidth: 30 },
      11: { cellWidth: 25 },
      12: { cellWidth: 10 },
      13: { cellWidth: 15 },
    },
    didDrawPage: () => drawPageHeaderAndFooter(),
  });

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Página ${i} de ${pageCount}`, 283, 203, { align: "right" });
  }

  return doc;
}

export function downloadPDF(rows: ExportRow[], filename: string, title: string) {
  const doc = generatePDFDoc(rows, title);
  doc.save(filename);
}

export function getPDFBase64(rows: ExportRow[], title: string): string {
  const doc = generatePDFDoc(rows, title);
  // output datauristring format: "data:application/pdf;filename=generated.pdf;base64,JVBER..."
  // we only want the base64 part
  const dataUri = doc.output("datauristring");
  return dataUri.split("base64,")[1];
}

// ── FULL REPORT PDF GENERATION (PORTRAIT) ──
export function generateFullReportPDFDoc(payload: FullReportPDFPayload) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const drawPageHeaderAndFooter = () => {
    if (HEADER_IMAGE_BASE64) {
      const hW = 95;
      const hH = hW / 3.688;
      const hX = (210 - hW) / 2;
      doc.addImage(HEADER_IMAGE_BASE64, "PNG", hX, 5, hW, hH);
    }
    if (FOOTER_IMAGE_BASE64) {
      const fW = 150;
      const fH = fW / 4.4466;
      const fX = (210 - fW) / 2;
      doc.addImage(FOOTER_IMAGE_BASE64, "PNG", fX, 297 - fH - 4, fW, fH);
    }
  };

  drawPageHeaderAndFooter();

  let y = 35;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 182, 20, 2, 2, "FD");
  doc.setFillColor(79, 70, 229);
  doc.rect(14, y, 3, 20, "F");

  doc.setFontSize(10.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 27, 75);
  doc.text("REPORTE COMPLETO INTEGRADO DE PARCHEO Y SERVIDORES", 20, y + 5.5);

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105);
  doc.text(`Filtros: Banco(s): ${payload.selectedBanksText}  |  Filtro Tiempo: ${payload.timeFilterText}`, 20, y + 11);
  doc.text(`Emisión: ${payload.generatedAt}  |  Umbral Inactividad: ${payload.inactivityThresholdText || "15 días"}`, 20, y + 15.5);

  y += 25;

  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > 255) {
      doc.addPage();
      drawPageHeaderAndFooter();
      y = 35;
    }
  };

  const addSectionHeader = (title: string, colorRGB: [number, number, number] = [79, 70, 229]) => {
    checkPageBreak(12);
    doc.setFillColor(...colorRGB);
    doc.roundedRect(14, y, 182, 6.5, 1, 1, "F");
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), 18, y + 4.5);
    y += 10;
  };

  addSectionHeader("1. Resumen por Tipo de Banco", [79, 70, 229]);

  checkPageBreak(25);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Tasa de Éxito y Volumen por Banco", 14, y);
  y += 4;

  payload.byType.forEach((item) => {
    checkPageBreak(8);
    const color = BANK_RGB[item.name] ?? [99, 102, 241];
    
    doc.setFontSize(7.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(51, 65, 85);
    doc.text(item.name, 14, y + 3.5);

    doc.setFillColor(241, 245, 249);
    doc.roundedRect(42, y, 110, 4.5, 1, 1, "F");

    const filledWidth = Math.max(2, (110 * item.successRate) / 100);
    doc.setFillColor(...color);
    doc.roundedRect(42, y, filledWidth, 4.5, 1, 1, "F");

    doc.setFontSize(7);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text(`${item.successRate}%`, 156, y + 3.5);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139);
    doc.text(`(${item.total} srv: ${item.ok} OK, ${item.error} Err)`, 168, y + 3.5);

    y += 6;
  });

  y += 4;

  checkPageBreak(45);
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Gráfico Vectorial: Distribución de OK (Verde), Errores (Rojo) y Sin datos (Gris)", 14, y);
  y += 4;

  const chartX = 14;
  const chartY = y;
  const chartW = 182;
  const chartH = 36;

  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(chartX, chartY, chartW, chartH, 2, 2, "FD");

  doc.setDrawColor(241, 245, 249);
  doc.setLineWidth(0.2);
  for (let gl = 1; gl <= 3; gl++) {
    const gridY = chartY + (chartH / 4) * gl;
    doc.line(chartX + 8, gridY, chartX + chartW - 8, gridY);
  }

  const maxTotal = Math.max(...payload.byType.map((d) => d.total), 1);
  const colWidth = Math.min(22, (chartW - 20) / Math.max(1, payload.byType.length));

  payload.byType.forEach((item, idx) => {
    const barX = chartX + 12 + idx * colWidth;
    const okH = (chartH - 10) * (item.ok / maxTotal);
    const errH = (chartH - 10) * (item.error / maxTotal);
    const nodataH = (chartH - 10) * (item.nodata / maxTotal);

    let currY = chartY + chartH - 5;

    if (okH > 0) {
      currY -= okH;
      doc.setFillColor(16, 185, 129);
      doc.rect(barX, currY, colWidth - 4, okH, "F");
    }
    if (errH > 0) {
      currY -= errH;
      doc.setFillColor(239, 68, 68);
      doc.rect(barX, currY, colWidth - 4, errH, "F");
    }
    if (nodataH > 0) {
      currY -= nodataH;
      doc.setFillColor(100, 116, 139);
      doc.rect(barX, currY, colWidth - 4, nodataH, "F");
    }

    doc.setFontSize(6.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(71, 85, 105);
    doc.text(item.name.slice(0, 8), barX + (colWidth - 4) / 2, chartY + chartH - 1, { align: "center" });

    doc.setFontSize(6);
    doc.setTextColor(30, 41, 59);
    doc.text(String(item.total), barX + (colWidth - 4) / 2, Math.max(chartY + 3, currY - 1), { align: "center" });
  });

  y = chartY + chartH + 6;

  checkPageBreak(30);
  autoTable(doc, {
    startY: y,
    head: [["Tipo / Banco", "Total Servidores", "OK", "Errores", "Sin Datos", "Tasa de Éxito %"]],
    body: payload.byType.map((d) => [d.name, String(d.total), String(d.ok), String(d.error), String(d.nodata), `${d.successRate}%`]),
    styles: { fontSize: 7.5, cellPadding: 1.5 },
    headStyles: { fillColor: [49, 46, 129], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { top: 35, bottom: 42, left: 14, right: 14 },
    didDrawPage: () => drawPageHeaderAndFooter(),
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  addSectionHeader("2. Tendencia de Errores por Sincronización", [3, 105, 161]);

  if (payload.errorTrend.length > 0) {
    checkPageBreak(45);
    doc.setFontSize(8);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Gráfico Vectorial: Tendencia de Errores (Línea Roja) y Éxitos (Línea Verde)", 14, y);
    y += 4;

    const lineChartX = 14;
    const lineChartY = y;
    const lineChartW = 182;
    const lineChartH = 36;

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(lineChartX, lineChartY, lineChartW, lineChartH, 2, 2, "FD");

    const maxVal = Math.max(...payload.errorTrend.map((d) => Math.max(d.errores, d.ok, d.total)), 1);
    const pointsCount = payload.errorTrend.length;
    const stepX = pointsCount > 1 ? (lineChartW - 24) / (pointsCount - 1) : 0;

    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.2);
    for (let g = 1; g <= 3; g++) {
      const gy = lineChartY + (lineChartH / 4) * g;
      doc.line(lineChartX + 10, gy, lineChartX + lineChartW - 10, gy);
    }

    for (let i = 0; i < pointsCount; i++) {
      const curr = payload.errorTrend[i];
      const cx = lineChartX + 12 + i * stepX;
      
      const errY = lineChartY + lineChartH - 6 - ((lineChartH - 12) * curr.errores) / maxVal;
      const okY = lineChartY + lineChartH - 6 - ((lineChartH - 12) * curr.ok) / maxVal;

      if (i > 0) {
        const prev = payload.errorTrend[i - 1];
        const px = lineChartX + 12 + (i - 1) * stepX;
        const pErrY = lineChartY + lineChartH - 6 - ((lineChartH - 12) * prev.errores) / maxVal;
        const pOkY = lineChartY + lineChartH - 6 - ((lineChartH - 12) * prev.ok) / maxVal;

        doc.setDrawColor(239, 68, 68);
        doc.setLineWidth(0.8);
        doc.line(px, pErrY, cx, errY);

        doc.setDrawColor(16, 185, 129);
        doc.setLineWidth(0.8);
        doc.line(px, pOkY, cx, okY);
      }

      doc.setFillColor(239, 68, 68);
      doc.circle(cx, errY, 1.2, "F");

      doc.setFillColor(16, 185, 129);
      doc.circle(cx, okY, 1.2, "F");

      doc.setFontSize(6);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100, 116, 139);
      doc.text(curr.label, cx, lineChartY + lineChartH - 1, { align: "center" });
    }

    y = lineChartY + lineChartH + 6;
  }

  checkPageBreak(30);
  autoTable(doc, {
    startY: y,
    head: [["Fecha Sync", "Total Servidores", "Servidores OK", "Servidores con Error"]],
    body: payload.errorTrend.map((d) => [d.label, String(d.total), String(d.ok), String(d.errores)]),
    styles: { fontSize: 7.5, cellPadding: 1.5 },
    headStyles: { fillColor: [3, 105, 161], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 249, 255] },
    margin: { top: 35, bottom: 42, left: 14, right: 14 },
    didDrawPage: () => drawPageHeaderAndFooter(),
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  addSectionHeader("3. Listado de Sincronizaciones por Día", [4, 120, 87]);
  checkPageBreak(30);
  autoTable(doc, {
    startY: y,
    head: [["Fecha / Día", "Total Servidores", "OK", "Errores", "Tasa Éxito %"]],
    body: payload.syncList.map((d) => [d.day, String(d.serverCount), String(d.totalSuccess), String(d.totalErrors), `${d.successRate}%`]),
    styles: { fontSize: 7.5, cellPadding: 1.5 },
    headStyles: { fillColor: [4, 120, 87], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    margin: { top: 35, bottom: 42, left: 14, right: 14 },
    didDrawPage: () => drawPageHeaderAndFooter(),
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  addSectionHeader("4. Top Errores Más Frecuentes", [159, 18, 57]);
  checkPageBreak(30);
  autoTable(doc, {
    startY: y,
    head: [["#", "Mensaje de Error", "Afectados", "Servidores Afectados"]],
    body: payload.topErrors.map((d) => [String(d.rank), d.message, String(d.count), d.serversText]),
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: [159, 18, 57], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [255, 241, 242] },
    columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 70 }, 2: { cellWidth: 20 }, 3: { cellWidth: "auto" } },
    margin: { top: 35, bottom: 42, left: 14, right: 14 },
    didDrawPage: () => drawPageHeaderAndFooter(),
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  addSectionHeader("5. Evolución Histórica y Comparativa", [124, 58, 237]);
  
  checkPageBreak(30);

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 88, 20, 2, 2, "FD");
  doc.setFillColor(100, 116, 139);
  doc.rect(14, y, 3, 20, "F");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text(payload.evoluciones.baselineTitle.toUpperCase(), 20, y + 4.5);

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text(`Total Servidores: ${payload.evoluciones.baselineTotal}`, 20, y + 9.5);
  doc.text(`OK: ${payload.evoluciones.baselineOk}  |  Errores: ${payload.evoluciones.baselineErrors}  |  Sin datos: ${payload.evoluciones.baselineNoData}`, 20, y + 14.5);

  doc.setFillColor(240, 242, 254);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(108, y, 88, 20, 2, 2, "FD");
  doc.setFillColor(79, 70, 229);
  doc.rect(108, y, 3, 20, "F");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(67, 56, 202);
  doc.text(payload.evoluciones.targetTitle.toUpperCase(), 114, y + 4.5);

  doc.setFontSize(6.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text(`Total Servidores: ${payload.evoluciones.targetTotal}`, 114, y + 9.5);
  doc.text(`OK: ${payload.evoluciones.targetOk}  |  Errores: ${payload.evoluciones.targetErrors}  |  Sin datos: ${payload.evoluciones.targetNoData}`, 114, y + 14.5);

  y += 25;

  checkPageBreak(25);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(4, 120, 87);
  doc.text(`5.1 Errores Solucionados (${payload.evoluciones.solucionados.length})`, 14, y);
  y += 3;
  autoTable(doc, {
    startY: y,
    head: [["Servidor", "Banco", "IP", "Error Anterior Solucionado", "Estado"]],
    body: payload.evoluciones.solucionados.length > 0
      ? payload.evoluciones.solucionados.map((d) => [d.serverName, d.bank, d.ip || "—", d.pastError, "SOLUCIONADO"])
      : [["Sin errores solucionados en este período", "-", "-", "-", "-"]],
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: [4, 120, 87], textColor: 255, fontStyle: "bold" },
    margin: { top: 35, bottom: 42, left: 14, right: 14 },
    didDrawPage: () => drawPageHeaderAndFooter(),
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  checkPageBreak(25);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(159, 18, 57);
  doc.text(`5.2 Errores Actuales (${payload.evoluciones.nuevosErrores.length})`, 14, y);
  y += 3;
  autoTable(doc, {
    startY: y,
    head: [["Servidor", "Banco", "IP", "Error Reportado Actual", "Condición"]],
    body: payload.evoluciones.nuevosErrores.length > 0
      ? payload.evoluciones.nuevosErrores.map((d) => [d.serverName, d.bank, d.ip || "—", d.currentError, d.badge])
      : [["Sin errores reportados en este período", "-", "-", "-", "-"]],
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: [159, 18, 57], textColor: 255, fontStyle: "bold" },
    margin: { top: 35, bottom: 42, left: 14, right: 14 },
    didDrawPage: () => drawPageHeaderAndFooter(),
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  checkPageBreak(25);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(67, 56, 202);
  doc.text(`5.3 Nuevos Servidores Ingresados (${payload.evoluciones.nuevosServidores.length})`, 14, y);
  y += 3;
  autoTable(doc, {
    startY: y,
    head: [["Servidor", "Banco", "IP", "Estado Inicial"]],
    body: payload.evoluciones.nuevosServidores.length > 0
      ? payload.evoluciones.nuevosServidores.map((d) => [d.serverName, d.bank, d.ip || "—", d.status])
      : [["Sin nuevos servidores en este período", "-", "-", "-"]],
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: [67, 56, 202], textColor: 255, fontStyle: "bold" },
    margin: { top: 35, bottom: 42, left: 14, right: 14 },
    didDrawPage: () => drawPageHeaderAndFooter(),
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  checkPageBreak(25);
  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text(`5.4 Servidores Removidos / Inactivos (${payload.evoluciones.servidoresInactivos.length})`, 14, y);
  y += 3;
  autoTable(doc, {
    startY: y,
    head: [["Servidor", "Banco", "IP", "Estado Anterior"]],
    body: payload.evoluciones.servidoresInactivos.length > 0
      ? payload.evoluciones.servidoresInactivos.map((d) => [d.serverName, d.bank, d.ip || "—", "INACTIVO"])
      : [["Sin servidores inactivos en este período", "-", "-", "-"]],
    styles: { fontSize: 7, cellPadding: 1.5 },
    headStyles: { fillColor: [71, 85, 105], textColor: 255, fontStyle: "bold" },
    margin: { top: 35, bottom: 42, left: 14, right: 14 },
    didDrawPage: () => drawPageHeaderAndFooter(),
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  if (payload.inactiveServersByBank && payload.inactiveServersByBank.length > 0) {
    addSectionHeader(`6. Servidores Inactivos por Umbral (${payload.inactivityThresholdText || "15 días"})`, [225, 29, 72]);

    payload.inactiveServersByBank.forEach((group) => {
      checkPageBreak(25);

      doc.setFontSize(7.5);
      doc.setFont("helvetica", "bold");
      const rgb = BANK_RGB[group.bank] ?? [225, 29, 72];
      doc.setTextColor(...rgb);
      doc.text(`Banco ${group.bank} (${group.count} servidores inactivos)`, 14, y);
      y += 3;

      autoTable(doc, {
        startY: y,
        head: [["Servidor", "IP", "Último Reporte", "Inactividad", "Sistema Operativo", "Último Estado"]],
        body: group.servers.map((s) => [
          s.serverName,
          s.ip || "—",
          s.lastSeenDate,
          s.elapsedDaysText,
          s.lastOS || "—",
          s.lastStatus === "ok" ? "OK" : s.lastStatus === "error" ? "Error" : "Sin Datos",
        ]),
        styles: { fontSize: 6.5, cellPadding: 1.5 },
        headStyles: { fillColor: rgb, textColor: 255, fontStyle: "bold" },
        alternateRowStyles: { fillColor: [254, 242, 242] },
        margin: { top: 35, bottom: 42, left: 14, right: 14 },
        didDrawPage: () => drawPageHeaderAndFooter(),
      });
      y = (doc as any).lastAutoTable.finalY + 8;
    });
  }

  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text(`Página ${i} de ${pageCount}`, 196, 290, { align: "right" });
  }

  return doc;
}

export function downloadFullReportPDF(payload: FullReportPDFPayload, filename: string) {
  const doc = generateFullReportPDFDoc(payload);
  doc.save(filename);
}

export function getFullReportPDFBase64(payload: FullReportPDFPayload): string {
  const doc = generateFullReportPDFDoc(payload);
  const dataUri = doc.output("datauristring");
  return dataUri.split("base64,")[1];
}
