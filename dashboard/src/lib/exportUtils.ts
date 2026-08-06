import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
}

export interface FullReportPDFPayload {
  selectedBanksText: string;
  timeFilterText: string;
  generatedAt: string;
  chartImages?: {
    byTypeBar?: string;
    byTypePie?: string;
    trendLine?: string;
  };
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
];

function toRow(r: ExportRow): string[] {
  return [
    r.servidor, r.dominio, r.ip, r.tipo, r.ambiente,
    r.os, r.fechaInstalacion, r.kbsInstaladas, r.fechaReinicio, r.estado, r.error,
  ];
}

export async function svgToPngDataUrl(svgElement: SVGElement): Promise<string> {
  return new Promise((resolve) => {
    try {
      const clone = svgElement.cloneNode(true) as SVGElement;
      clone.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      const svgString = new XMLSerializer().serializeToString(clone);
      const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      const URL = window.URL || window.webkitURL || window;
      const blobURL = URL.createObjectURL(svgBlob);
      
      const image = new Image();
      image.onload = () => {
        const canvas = document.createElement("canvas");
        const scale = 2;
        const w = (svgElement.clientWidth || 600) * scale;
        const h = (svgElement.clientHeight || 300) * scale;
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.fillStyle = "#18181b"; // Dark background theme
          ctx.fillRect(0, 0, w, h);
          ctx.drawImage(image, 0, 0, w, h);
          const dataUrl = canvas.toDataURL("image/png");
          URL.revokeObjectURL(blobURL);
          resolve(dataUrl);
        } else {
          resolve("");
        }
      };
      image.onerror = () => resolve("");
      image.src = blobURL;
    } catch (e) {
      resolve("");
    }
  });
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

export function downloadPDF(rows: ExportRow[], filename: string, title: string) {
  const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  doc.setFontSize(12);
  doc.setTextColor(40);
  doc.text(title, 14, 14);
  doc.setFontSize(8);
  doc.setTextColor(120);
  doc.text(`Generado: ${new Date().toLocaleString("es-AR")}  |  Total: ${rows.length} servidores`, 14, 20);

  autoTable(doc, {
    startY: 25,
    head: [HEADERS],
    body: rows.map(toRow),
    styles: { fontSize: 6.5, cellPadding: 1.5, overflow: "linebreak" },
    headStyles: { fillColor: [63, 63, 70], textColor: 255, fontSize: 7, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 250] },
    columnStyles: {
      0: { cellWidth: 30 },  // Servidor
      1: { cellWidth: 20 },  // Dominio
      2: { cellWidth: 22 },  // IP
      3: { cellWidth: 16 },  // Tipo
      4: { cellWidth: 20 },  // Ambiente
      5: { cellWidth: 28 },  // OS
      6: { cellWidth: 22 },  // Fecha Instalación
      7: { cellWidth: 28 },  // KBs
      8: { cellWidth: 22 },  // Fecha Reinicio
      9: { cellWidth: 14 },  // Estado
      10: { cellWidth: "auto" }, // Error
    },
  });

  doc.save(filename);
}

export function downloadFullReportPDF(payload: FullReportPDFPayload, filename: string) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  let y = 14;

  // Title Banner
  doc.setFillColor(30, 27, 75); // Dark Indigo
  doc.rect(0, 0, 210, 28, "F");
  
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text("REPORTE COMPLETO INTEGRADO DE PARCHEO Y SERVIDORES", 14, 11);

  doc.setFontSize(8.5);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(199, 210, 254);
  doc.text(`Filtros: Banco(s): ${payload.selectedBanksText}  |  Filtro Tiempo: ${payload.timeFilterText}`, 14, 18);
  doc.text(`Emisión: ${payload.generatedAt}`, 14, 23);

  y = 34;

  const addSectionHeader = (title: string, colorRGB: [number, number, number] = [79, 70, 229]) => {
    if (y > 240) { doc.addPage(); y = 15; }
    doc.setFillColor(...colorRGB);
    doc.rect(14, y, 182, 7, "F");
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), 18, y + 5);
    y += 10;
  };

  // ── SECTION 1: Por Tipo ──
  addSectionHeader("1. Resumen por Tipo de Banco", [79, 70, 229]);

  // Embed captured DOM PNG images if present
  if (payload.chartImages?.byTypeBar) {
    if (y > 200) { doc.addPage(); y = 15; }
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Gráfico Capturado: Servidores por Tipo (Barras)", 14, y);
    y += 3;
    doc.addImage(payload.chartImages.byTypeBar, "PNG", 14, y, 182, 55);
    y += 58;
  }

  if (payload.chartImages?.byTypePie) {
    if (y > 200) { doc.addPage(); y = 15; }
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Gráfico Capturado: Distribución por Tipo (Dona)", 14, y);
    y += 3;
    doc.addImage(payload.chartImages.byTypePie, "PNG", 14, y, 182, 55);
    y += 58;
  }

  // Chart 1.1: Visual Progress Bars
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Tasa de Éxito y Volumen por Banco", 14, y);
  y += 4;

  payload.byType.forEach((item) => {
    if (y > 260) { doc.addPage(); y = 15; }
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

  // Chart 1.2: Vector Stacked Bar Chart
  if (y > 220) { doc.addPage(); y = 15; }
  doc.setFontSize(8.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text("Gráfico Vectorial: Distribución de OK, Errores y Sin datos", 14, y);
  y += 4;

  const chartX = 14;
  const chartY = y;
  const chartW = 182;
  const chartH = 36;

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.rect(chartX, chartY, chartW, chartH, "FD");

  const maxTotal = Math.max(...payload.byType.map((d) => d.total), 1);
  const colWidth = Math.min(22, (chartW - 20) / Math.max(1, payload.byType.length));

  payload.byType.forEach((item, idx) => {
    const barX = chartX + 12 + idx * colWidth;
    const okH = (chartH - 8) * (item.ok / maxTotal);
    const errH = (chartH - 8) * (item.error / maxTotal);
    const nodataH = (chartH - 8) * (item.nodata / maxTotal);

    let currY = chartY + chartH - 4;

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
    doc.text(item.name.slice(0, 7), barX + (colWidth - 4) / 2, chartY + chartH - 1, { align: "center" });

    doc.setFontSize(6);
    doc.setTextColor(30, 41, 59);
    doc.text(String(item.total), barX + (colWidth - 4) / 2, currY - 1, { align: "center" });
  });

  y = chartY + chartH + 6;

  // Table 1: Summary Table
  autoTable(doc, {
    startY: y,
    head: [["Tipo / Banco", "Total Servidores", "OK", "Errores", "Sin Datos", "Tasa de Éxito %"]],
    body: payload.byType.map((d) => [d.name, String(d.total), String(d.ok), String(d.error), String(d.nodata), `${d.successRate}%`]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [49, 46, 129], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // ── SECTION 2: Errores por Sync ──
  addSectionHeader("2. Tendencia de Errores por Sincronización", [3, 105, 161]);

  if (payload.chartImages?.trendLine) {
    if (y > 200) { doc.addPage(); y = 15; }
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Gráfico Capturado: Tendencia de Errores por Sincronización", 14, y);
    y += 3;
    doc.addImage(payload.chartImages.trendLine, "PNG", 14, y, 182, 55);
    y += 58;
  }

  if (payload.errorTrend.length > 0) {
    doc.setFontSize(8.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30, 41, 59);
    doc.text("Gráfico Vectorial: Tendencia de Errores (Rojo) y OK (Verde) en el Tiempo", 14, y);
    y += 4;

    const lineChartX = 14;
    const lineChartY = y;
    const lineChartW = 182;
    const lineChartH = 40;

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(lineChartX, lineChartY, lineChartW, lineChartH, "FD");

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

  // Table 2: Trend Table
  autoTable(doc, {
    startY: y,
    head: [["Fecha Sync", "Total Servidores", "Servidores OK", "Servidores con Error"]],
    body: payload.errorTrend.map((d) => [d.label, String(d.total), String(d.ok), String(d.errores)]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [3, 105, 161], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 249, 255] },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // ── SECTION 3: Listado de Syncs ──
  addSectionHeader("3. Listado de Sincronizaciones por Día", [4, 120, 87]);
  autoTable(doc, {
    startY: y,
    head: [["Fecha / Día", "Total Servidores", "OK", "Errores", "Tasa Éxito %"]],
    body: payload.syncList.map((d) => [d.day, String(d.serverCount), String(d.totalSuccess), String(d.totalErrors), `${d.successRate}%`]),
    styles: { fontSize: 8, cellPadding: 2 },
    headStyles: { fillColor: [4, 120, 87], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [240, 253, 244] },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // ── SECTION 4: Top Errores ──
  addSectionHeader("4. Top Errores Más Frecuentes", [159, 18, 57]);
  autoTable(doc, {
    startY: y,
    head: [["#", "Mensaje de Error", "Afectados", "Servidores Afectados"]],
    body: payload.topErrors.map((d) => [String(d.rank), d.message, String(d.count), d.serversText]),
    styles: { fontSize: 7.5, cellPadding: 2 },
    headStyles: { fillColor: [159, 18, 57], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [255, 241, 242] },
    columnStyles: { 0: { cellWidth: 10 }, 1: { cellWidth: 70 }, 2: { cellWidth: 20 }, 3: { cellWidth: "auto" } },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 10;

  // ── SECTION 5: Evoluciones ──
  addSectionHeader("5. Evolución Histórica y Comparativa", [124, 58, 237]);
  
  if (y > 220) { doc.addPage(); y = 15; }

  // KPI Card 1: Baseline
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, 88, 22, 2, 2, "FD");
  doc.setFillColor(100, 116, 139);
  doc.rect(14, y, 3, 22, "F");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(71, 85, 105);
  doc.text(payload.evoluciones.baselineTitle.toUpperCase(), 20, y + 5);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text(`Total Servidores: ${payload.evoluciones.baselineTotal}`, 20, y + 10);
  doc.text(`OK: ${payload.evoluciones.baselineOk}  |  Errores: ${payload.evoluciones.baselineErrors}  |  Sin datos: ${payload.evoluciones.baselineNoData}`, 20, y + 15);

  // KPI Card 2: Target
  doc.setFillColor(240, 242, 254);
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(108, y, 88, 22, 2, 2, "FD");
  doc.setFillColor(79, 70, 229);
  doc.rect(108, y, 3, 22, "F");

  doc.setFontSize(7.5);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(67, 56, 202);
  doc.text(payload.evoluciones.targetTitle.toUpperCase(), 114, y + 5);

  doc.setFontSize(7);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(30, 41, 59);
  doc.text(`Total Servidores: ${payload.evoluciones.targetTotal}`, 114, y + 10);
  doc.text(`OK: ${payload.evoluciones.targetOk}  |  Errores: ${payload.evoluciones.targetErrors}  |  Sin datos: ${payload.evoluciones.targetNoData}`, 114, y + 15);

  y += 28;

  // Subtable 5.1 Errores Solucionados
  doc.setFontSize(8);
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
    styles: { fontSize: 7.5, cellPadding: 1.5 },
    headStyles: { fillColor: [4, 120, 87], textColor: 255, fontStyle: "bold" },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // Subtable 5.2 Errores Actuales
  if (y > 240) { doc.addPage(); y = 15; }
  doc.setFontSize(8);
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
    styles: { fontSize: 7.5, cellPadding: 1.5 },
    headStyles: { fillColor: [159, 18, 57], textColor: 255, fontStyle: "bold" },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // Subtable 5.3 Nuevos Servidores Ingresados
  if (y > 240) { doc.addPage(); y = 15; }
  doc.setFontSize(8);
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
    styles: { fontSize: 7.5, cellPadding: 1.5 },
    headStyles: { fillColor: [67, 56, 202], textColor: 255, fontStyle: "bold" },
    margin: { left: 14, right: 14 },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // Subtable 5.4 Servidores Removidos / Inactivos
  if (y > 240) { doc.addPage(); y = 15; }
  doc.setFontSize(8);
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
    styles: { fontSize: 7.5, cellPadding: 1.5 },
    headStyles: { fillColor: [71, 85, 105], textColor: 255, fontStyle: "bold" },
    margin: { left: 14, right: 14 },
  });

  // Footer page numbering
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(148, 163, 184);
    doc.text(`Página ${i} de ${pageCount}  |  Dashboard de Parcheo de Servidores`, 105, 290, { align: "center" });
  }

  doc.save(filename);
}
