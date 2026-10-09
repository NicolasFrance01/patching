import { ServerStatus } from "@/types";

/**
 * PrimaryStatus: the two main states shown in tables and KPIs.
 * SecondaryFlags: breakdown flags (can be combined) for drilldown columns.
 *
 * Classification logic based on WUU.ps1 output fields:
 *   - status  : "Actualizado" | "No actualizado"  (ReportRow.Estado)
 *   - snap    : "SI" | "NO"                         (ReportRow.Snap)
 *   - confirmado: "SI" | "NO"                       (ReportRow.Confirmado)
 *   - errorDescription: string | null               (ReportRow.Descripcion_Error)
 */

export type PrimaryStatus = "Actualizado" | "No Actualizado";

export type SecondaryFlag = "Error" | "S. Conf" | "S. Snap";

export interface ServerClassification {
  primary: PrimaryStatus;
  /** Secondary flags (can be multiple, e.g. ["S. Conf", "S. Snap"]) */
  flags: SecondaryFlag[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function hasSnap(snap: string | null | undefined): boolean {
  const s = (snap ?? "").trim().toUpperCase();
  return s === "SI" || s === "TRUE" || s === "1";
}

function hasConfirmado(confirmado: string | null | undefined): boolean {
  const s = (confirmado ?? "").trim().toUpperCase();
  return s === "SI" || s === "TRUE" || s === "1";
}

function hasError(errorDescription: string | null | undefined): boolean {
  const s = (errorDescription ?? "").trim();
  return s !== "" && s !== "N/A" && s !== "null" && s !== "undefined" && s !== "-";
}

function isActualizadoStatus(status: string | null | undefined): boolean {
  const s = (status ?? "").trim().toLowerCase();
  return s === "actualizado" || s === "ok";
}

// ── Main Classification ───────────────────────────────────────────────────────

/**
 * Classifies a server into its primary group (Actualizado / No Actualizado)
 * and its secondary flags (Error, S. Conf, S. Snap).
 *
 * Rules:
 *  ACTUALIZADO (OK)    : status=Actualizado, Confirmado=SI, Snap=SI, sin error  → primary=Actualizado, flags=[]
 *  ACTUALIZADO (Error) : status=Actualizado, Confirmado=SI, Snap=SI, con error  → primary=Actualizado, flags=[Error]
 *  NO ACTUALIZADO (Error) : status=No actualizado, Confirmado=SI, Snap=SI, con error → primary=No Actualizado, flags=[Error]
 *  NO ACTUALIZADO (S. Conf): status=No actualizado, Confirmado=NO, Snap=SI, sin error → primary=No Actualizado, flags=[S. Conf]
 *  NO ACTUALIZADO (S. Snap): status=No actualizado, Confirmado=SI, Snap=NO, sin error → primary=No Actualizado, flags=[S. Snap]
 *  NO ACTUALIZADO (S. Conf + S. Snap): status=No actualizado, Confirmado=NO, Snap=NO, sin error → primary=No Actualizado, flags=[S. Conf, S. Snap]
 */
export function classifyServer(
  status: string | null | undefined,
  snap: string | null | undefined,
  confirmado: string | null | undefined,
  errorDescription: string | null | undefined
): ServerClassification {
  const actualizado = isActualizadoStatus(status);
  const conSnap = hasSnap(snap);
  const conConf = hasConfirmado(confirmado);
  const conError = hasError(errorDescription);

  const flags: SecondaryFlag[] = [];

  if (conError) {
    flags.push("Error");
  } else {
    if (!conConf) flags.push("S. Conf");
    if (!conSnap) flags.push("S. Snap");
  }

  const primary: PrimaryStatus = actualizado ? "Actualizado" : "No Actualizado";

  return { primary, flags };
}

// ── Legacy compatibility ──────────────────────────────────────────────────────
// Keep ExtendedStatus for any remaining references, but now it's derived
// from the new classification.

export type ExtendedStatus =
  | "Actualizado"
  | "Error"
  | "Sin Confirmación"
  | "Sin Snap"
  | "En Revisión"
  | "Pendiente"
  | "Sin Datos";

/**
 * @deprecated Use classifyServer() instead for new code.
 * Returns a single ExtendedStatus for backwards-compatibility (badge display, filters).
 *
 * Mapping:
 *  primary=Actualizado + flags=[]       → "Actualizado"
 *  primary=Actualizado + flags=[Error]  → "Actualizado"  (still counts as updated)
 *  primary=No Actualizado + flags=[Error]        → "Error"
 *  primary=No Actualizado + flags=[S. Conf]      → "Sin Confirmación"
 *  primary=No Actualizado + flags=[S. Snap]      → "Sin Snap"
 *  primary=No Actualizado + flags=[S. Conf, S. Snap] → "Sin Confirmación"
 */
export function getExtendedStatus(
  status: string,
  errorDescription: string | null,
  snap: string | null,
  confirmado: string | null
): ExtendedStatus {
  const cl = classifyServer(status, snap, confirmado, errorDescription);

  if (cl.primary === "Actualizado") {
    return "Actualizado";
  }

  // No Actualizado
  if (cl.flags.includes("Error")) return "Error";
  if (cl.flags.includes("S. Conf") && cl.flags.includes("S. Snap")) return "Sin Confirmación";
  if (cl.flags.includes("S. Conf")) return "Sin Confirmación";
  if (cl.flags.includes("S. Snap")) return "Sin Snap";

  // Fallback
  return "Sin Datos";
}

// ── Colors & Labels ───────────────────────────────────────────────────────────

export const PRIMARY_STATUS_COLORS: Record<PrimaryStatus, string> = {
  "Actualizado": "#10b981",   // Emerald 500
  "No Actualizado": "#ef4444", // Red 500
};

export const SECONDARY_FLAG_COLORS: Record<SecondaryFlag, string> = {
  "Error": "#ef4444",      // Red 500
  "S. Conf": "#f97316",    // Orange 500
  "S. Snap": "#eab308",    // Yellow 500
};

export const EXTENDED_STATUS_COLORS: Record<ExtendedStatus, string> = {
  "Actualizado": "#10b981",       // Emerald 500
  "Error": "#ef4444",             // Red 500
  "Sin Confirmación": "#f97316",  // Orange 500
  "Sin Snap": "#eab308",          // Yellow 500
  "En Revisión": "#3b82f6",       // Blue 500
  "Pendiente": "#a855f7",         // Purple 500
  "Sin Datos": "#71717a"          // Zinc 500
};

export const EXTENDED_STATUS_LABELS: Record<ExtendedStatus, string> = {
  "Actualizado": "Actualizado",
  "Error": "Error",
  "Sin Confirmación": "Sin Confirmación",
  "Sin Snap": "Sin Snap",
  "En Revisión": "En Revisión",
  "Pendiente": "Pendiente",
  "Sin Datos": "Sin Datos"
};
