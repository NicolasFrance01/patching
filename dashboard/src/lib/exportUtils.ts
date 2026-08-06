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

  // Helper for section headers
  const addSectionHeader = (title: string, colorRGB: [number, number, number] = [79, 70, 229]) => {
    if (y > 250) { doc.addPage(); y = 15; }
    doc.setFillColor(...colorRGB);
    doc.rect(14, y, 182, 7, "F");
    doc.setFontSize(9.5);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text(title.toUpperCase(), 18, y + 5);
    y += 10;
  };

  // Section 1: Por Tipo
  addSectionHeader("1. Resumen por Tipo de Banco", [79, 70, 229]);
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

  // Section 2: Errores por Sync (Tendencia)
  addSectionHeader("2. Tendencia de Errores por Sincronización", [3, 105, 161]);
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

  // Section 3: Listado de Syncs
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

  // Section 4: Top Errores
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

  // Section 5: Evoluciones e Histórico
  addSectionHeader("5. Evolución Histórica y Comparativa", [124, 58, 237]);
  
  if (y > 240) { doc.addPage(); y = 15; }
  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 41, 59);
  doc.text(`BASELINE (${payload.evoluciones.baselineTitle}): Total ${payload.evoluciones.baselineTotal} | OK: ${payload.evoluciones.baselineOk} | Errores: ${payload.evoluciones.baselineErrors} | Sin datos: ${payload.evoluciones.baselineNoData}`, 14, y);
  y += 4;
  doc.text(`TARGET (${payload.evoluciones.targetTitle}): Total ${payload.evoluciones.targetTotal} | OK: ${payload.evoluciones.targetOk} | Errores: ${payload.evoluciones.targetErrors} | Sin datos: ${payload.evoluciones.targetNoData}`, 14, y);
  y += 7;

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
