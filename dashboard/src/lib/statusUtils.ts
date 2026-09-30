import { ServerStatus } from "@/types";

export type ExtendedStatus = 
  | "Actualizado"
  | "Error"
  | "Sin Confirmación"
  | "Sin Snap"
  | "En Revisión"
  | "Pendiente"
  | "Sin Datos";

export function getExtendedStatus(
  status: string,
  comentarios: string | null,
  snap: string | null,
  confirmado: string | null
): ExtendedStatus {
  const s = status.trim();
  
  // If it exactly matches one of our valid ExtendedStatus, just return it.
  if (EXTENDED_STATUS_LABELS[s as ExtendedStatus]) {
    return s as ExtendedStatus;
  }
  
  // Otherwise, fallback mapping
  const lower = s.toLowerCase();
  
  if (lower === "ok" || lower === "actualizado") {
    return "Actualizado";
  }
  if (lower === "error" || lower === "no actualizado") {
    return "Error";
  }
  if (lower.includes("sin confirmaci")) {
    return "Sin Confirmación";
  }
  if (lower.includes("sin snap")) {
    return "Sin Snap";
  }
  if (lower.includes("revisión") || lower.includes("revision")) {
    return "En Revisión";
  }
  if (lower === "pending" || lower === "pendiente") {
    return "Pendiente";
  }

  return "Sin Datos";
}

export const EXTENDED_STATUS_COLORS: Record<ExtendedStatus, string> = {
  "Actualizado": "#10b981", // Emerald 500
  "Error": "#ef4444",       // Red 500
  "Sin Confirmación": "#f97316", // Orange 500
  "Sin Snap": "#eab308",    // Yellow 500
  "En Revisión": "#3b82f6", // Blue 500
  "Pendiente": "#a855f7",   // Purple 500
  "Sin Datos": "#71717a"    // Zinc 500
};

export const EXTENDED_STATUS_LABELS: Record<ExtendedStatus, string> = {
  "Actualizado": "Actualizado (OK)",
  "Error": "Fallo (Error)",
  "Sin Confirmación": "Sin Confirmación",
  "Sin Snap": "Sin Snap",
  "En Revisión": "En Revisión",
  "Pendiente": "Pendiente",
  "Sin Datos": "Sin Datos"
};
