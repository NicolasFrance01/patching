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
  const blob = new Blob(["﻿" + lines.join("\r\n")], { type: "text/csv;charset=utf-8;" });
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
