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
  const c = (comentarios || "").toLowerCase();
  const s = (snap || "").toLowerCase();
  const conf = (confirmado || "").toLowerCase();

  // 1. En Revisión (Comodín administrativo si lo desean, pero primero checamos si hay falta de confirmación)
  // Según el embudo: ¿Confirmación OK?
  if (
    c.includes("el cliente no confirmo") || 
    conf.includes("el cliente no confirmo")
  ) {
    return "Sin Confirmación";
  }

  // 2. ¿SNAP OK?
  if (
    c.includes("no se recibio la confirmacion de la ejecucion del snapshot") || 
    s.includes("no se recibio la confirmacion") ||
    s.includes("no se recibio la confirmacion de la ejecucion del snapshot")
  ) {
    return "Sin Snap";
  }

  // 3. Revisión de reporte
  if (c.includes("revisión de reporte") || c.includes("revision de reporte")) {
    return "En Revisión";
  }

  // 4. Pendiente (programado sin ejecutar)
  if (status.toLowerCase() === "pending" || status.toLowerCase() === "pendiente") {
    return "Pendiente";
  }

  // 5. Ejecución (Actualizado o Error)
  if (status.toLowerCase() === "ok") {
    return "Actualizado";
  }
  
  if (status.toLowerCase() === "error") {
    return "Error";
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
