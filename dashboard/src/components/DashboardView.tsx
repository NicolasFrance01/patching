"use client";

import { useMemo, useState, useEffect, memo } from "react";
import { ServerStatus } from "@/types";
import {
  Server, CheckCircle2, XCircle, Clock, Search, AlertTriangle,
  Mail, Filter, X, AlertCircle, ChevronDown, Check
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from "recharts";
import { getServerInfo, SERVER_TYPES, ServerType, serverTypeMap } from "@/lib/serverTypeMap";
import EmailModal, { EmailPayload } from "./EmailModal";
import { getPDFBase64, ExportRow } from "@/lib/exportUtils";
import { getExtendedStatus, EXTENDED_STATUS_COLORS, EXTENDED_STATUS_LABELS, ExtendedStatus } from "@/lib/statusUtils";
import KbInfoModal from "./KbInfoModal";
import KbExplorerModal from "./KbExplorerModal";

// ─── Types ────────────────────────────────────────────────────────────────────

interface SyncRecord {
  serverName: string;
  ip: string | null;
  grupo: string | null;
  ambiente: string | null;
  os: string | null;
  installedKBs: string | null;
  status: string;
  errorDescription: string | null;
}

interface SyncRun {
  id: string;
  syncedAt: string;
  records: SyncRecord[];
}

interface DashboardViewProps {
  initialData: ServerStatus[];
  syncRuns?: SyncRun[];
  creatorUsername?: string;
}

type BankFilter = "all" | ServerType | "unclassified";
type TimeFilter = "mes" | "custom";

// ─── Constants ────────────────────────────────────────────────────────────────

const TYPE_COLORS: Record<string, string> = {
  ASJ: "#6366f1", BSC: "#06b6d4", BSJ: "#10b981",
  Corp: "#f59e0b", NBERSA: "#ef4444", NBSF: "#8b5cf6", QUALIA: "#ec4899",
  "Sin clasificar": "#71717a",
};

const BANK_CHIPS: { label: string; value: BankFilter }[] = [
  { label: "Todos", value: "all" },
  ...SERVER_TYPES.map((t) => ({ label: t, value: t as BankFilter })),
  { label: "Sin clasificar", value: "unclassified" },
];

const STATUS_COLORS = {
  ok:     "#10b981",
  error:  "#ef4444",
  nodata: "#71717a",
};

const tooltipStyle = {
  contentStyle: { backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "11px" },
  itemStyle: { color: "#e4e4e7" },
  labelStyle: { color: "#a1a1aa" },
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function matchesBankFilter(serverName: string, bankFilters: BankFilter[]): boolean {
  if (bankFilters.includes("all")) return true;
  const info = getServerInfo(serverName);
  if (!info && bankFilters.includes("unclassified")) return true;
  if (info && bankFilters.includes(info.type as BankFilter)) return true;
  return false;
}

function toLocalDayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isInTimeFilter(iso: string, tf: TimeFilter, selectedMonth: string, from: string, to: string): boolean {
  let d: Date;
  try {
    d = new Date(iso);
    if (isNaN(d.getTime())) d = new Date();
  } catch {
    d = new Date();
  }

  if (tf === "mes" && selectedMonth) {
    const isoString = d.toISOString();
    return isoString.startsWith(selectedMonth);
  }
  if (tf === "mes") return true; // no month selected yet, show all
  if (tf === "custom") {
    const f = from ? new Date(from) : new Date(0);
    const t = to ? new Date(to + "T23:59:59") : new Date();
    return d >= f && d <= t;
  }
  return true;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const ChartCard = memo(function ChartCard({ title, children }: { title: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-3">
      <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide flex items-center justify-between">{title}</h3>
      {children}
    </div>
  );
});

function StatusBadge({ status, extendedStatus }: { status: string; extendedStatus?: ExtendedStatus }) {
  if (extendedStatus) {
    const color = EXTENDED_STATUS_COLORS[extendedStatus];
    const label = EXTENDED_STATUS_LABELS[extendedStatus];
    return (
      <span 
        className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium border"
        style={{ backgroundColor: `${color}15`, color: color, borderColor: `${color}30` }}
      >
        {label}
      </span>
    );
  }
  // Fallback
  if (status === "ok")
    return <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">OK</span>;
  if (status === "error")
    return <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">Error</span>;
  return <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-600/30">Sin datos</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

function CustomMultiSelect({
  label,
  options,
  selected,
  onChange,
}: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (newSelected: string[]) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt));
    } else {
      onChange([...selected, opt]);
    }
  };

  return (
    <div className="relative flex flex-col gap-1 min-w-[140px]">
      <span className="text-[10px] text-zinc-500 font-medium uppercase">{label}</span>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-zinc-300 hover:border-zinc-500 transition-colors focus:outline-none focus:border-indigo-500"
      >
        <span className="truncate max-w-[120px]">
          {selected.length === 0 ? "Todos" : `${selected.length} seleccionados`}
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-500 ml-2" />
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-64 max-h-60 overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl z-50 custom-scrollbar py-1">
            {options.map((opt) => {
              const isSelected = selected.includes(opt);
              return (
                <button
                  key={opt}
                  onClick={() => toggleOption(opt)}
                  className="w-full flex items-start gap-2 px-3 py-2 text-left text-xs hover:bg-zinc-800 transition-colors"
                >
                  <div className={`mt-0.5 shrink-0 w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-indigo-500 border-indigo-500" : "border-zinc-600 bg-zinc-950"}`}>
                    {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                  </div>
                  <span className={`text-zinc-300 ${isSelected ? "font-medium text-white" : ""}`}>
                    {opt}
                  </span>
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}



function TruncatedCell({ 
  content, title, onClick, isError = false, children, extraClasses = ""
}: { 
  content: string | null | undefined;
  title: string;
  onClick: (detail: { title: string; content: string; isError?: boolean }) => void;
  isError?: boolean;
  children?: React.ReactNode;
  extraClasses?: string;
}) {
  const display = content ?? "—";
  
  return (
    <td className={`px-3 py-2 min-w-[160px] max-w-[160px] ${isError ? "text-rose-400/80" : "text-zinc-400"} ${extraClasses}`}>
      <button 
        onClick={() => onClick({ title, content: display, isError })}
        className={`w-full text-left block text-[10px] truncate transition-colors ${isError ? "hover:text-rose-300" : "hover:text-zinc-200"}`}
        title={`Ver ${title} completo`}
      >
        {children ? children : (!content || content === "—" || content === "N/A" ? <span className="text-zinc-700">—</span> : display)}
      </button>
    </td>
  );
}
export default function DashboardView({ initialData, syncRuns = [], creatorUsername }: DashboardViewProps) {
  const [activeTab, setActiveTab] = useState<"dashboard" | "reportes" | "historial" | "jira" | "mis-tickets">("dashboard");
  const [search, setSearch] = useState("");
  const [bankFilters, setBankFilters] = useState<BankFilter[]>(["all"]);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  });
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo]   = useState("");
  const [showFilterBar, setShowFilterBar] = useState(false);
  
  // Advanced filters state
  const [grupoFilters, setGrupoFilters] = useState<string[]>([]);
  const [ambienteFilters, setAmbienteFilters] = useState<string[]>([]);
  const [analistaFilters, setAnalistaFilters] = useState<string[]>([]);
  const [comentariosFilters, setComentariosFilters] = useState<string[]>([]);
  const [snapFilters, setSnapFilters] = useState<string[]>([]);
  const [confirmadoFilters, setConfirmadoFilters] = useState<string[]>([]);
  const [estadoFilters, setEstadoFilters] = useState<string[]>([]);
  const [emailPayload, setEmailPayload] = useState<EmailPayload | null>(null);
  const [chartsMounted, setChartsMounted] = useState(false);
  const [serverData, setServerData] = useState<ServerStatus[]>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState<{ title: string; content: string; isError?: boolean } | null>(null);

  const [selectedKbModal, setSelectedKbModal] = useState<string | null>(null);
  const [isKbExplorerOpen, setIsKbExplorerOpen] = useState(false);

  useEffect(() => { setChartsMounted(true); }, []);

  // Fetch server data when the selected month changes
  useEffect(() => {
    async function fetchData() {
      if (timeFilter !== "mes" || !selectedMonth) {
        // If not using month filter, we might want to default to initialData or a specific behavior.
        // For now, if they choose custom time range, we will just use whatever data is loaded,
        // or we could fetch the latest. 
        return;
      }
      
      setIsLoading(true);
      try {
        const res = await fetch(`/api/servers?month=${selectedMonth}`);
        if (res.ok) {
          const data = await res.json();
          setServerData(data);
        }
      } catch (error) {
        console.error("Failed to fetch server data:", error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [timeFilter, selectedMonth]);

  // ── Enriched servers ────────────────────────────────────────────────────────
  const enriched = useMemo(() =>
    serverData.map((s) => {
      const info = getServerInfo(s.serverName, s.ip ?? undefined);
      const isError  = !!(s.errorDescription && s.errorDescription !== "N/A");
      const isNoData = !isError && (!s.os || s.os === "N/A");
      const status   = isError ? "error" : isNoData ? "nodata" : "ok";
      const extendedStatus = getExtendedStatus(status, s.comentarios ?? null, s.snap ?? null, s.confirmado ?? null);
      
      return { 
        ...s, 
        grupo: info?.grupo || s.grupo, 
        ambiente: info?.ambiente || s.ambiente, 
        info, 
        isError, 
        isNoData, 
        status, 
        extendedStatus 
      };
    }),
  [serverData]);

  // ── Filtered servers (bank + time + search + advanced) ──────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return enriched.filter((s) => {
      if (!matchesBankFilter(s.serverName, bankFilters)) return false;
      if (!isInTimeFilter(s.updatedAt.toString(), timeFilter, selectedMonth, customFrom, customTo)) return false;
      
      // Advanced Filters
      if (grupoFilters.length > 0 && (!s.grupo || !grupoFilters.includes(s.grupo))) return false;
      if (ambienteFilters.length > 0 && (!s.ambiente || !ambienteFilters.includes(s.ambiente))) return false;
      if (analistaFilters.length > 0 && (!s.analista || !analistaFilters.includes(s.analista))) return false;
      if (comentariosFilters.length > 0 && (!s.comentarios || !comentariosFilters.includes(s.comentarios))) return false;
      if (snapFilters.length > 0 && (!s.snap || !snapFilters.includes(s.snap))) return false;
      if (confirmadoFilters.length > 0 && (!s.confirmado || !confirmadoFilters.includes(s.confirmado))) return false;
      if (estadoFilters.length > 0 && (!s.extendedStatus || !estadoFilters.includes(s.extendedStatus))) return false;

      if (!q) return true;
      return (
        s.serverName.toLowerCase().includes(q) ||
        (s.ip ?? "").includes(q) ||
        (s.os ?? "").toLowerCase().includes(q) ||
        (s.domain ?? "").toLowerCase().includes(q) ||
        (s.grupo ?? "").toLowerCase().includes(q) ||
        (s.ambiente ?? "").toLowerCase().includes(q)
      );
    });
  }, [enriched, bankFilters, timeFilter, selectedMonth, customFrom, customTo, search, grupoFilters, ambienteFilters, analistaFilters, comentariosFilters, snapFilters, confirmadoFilters, estadoFilters]);

  // ── Advanced filter options ─────────────────────────────────────────────────
  const filterOptions = useMemo(() => {
    const opts = { grupo: new Set<string>(), ambiente: new Set<string>(), analista: new Set<string>(), comentarios: new Set<string>(), snap: new Set<string>(), confirmado: new Set<string>(), estado: new Set<string>() };
    enriched.forEach(s => {
      if (s.grupo) opts.grupo.add(s.grupo);
      if (s.ambiente) opts.ambiente.add(s.ambiente);
      if (s.analista) opts.analista.add(s.analista);
      if (s.comentarios) opts.comentarios.add(s.comentarios);
      if (s.snap) opts.snap.add(s.snap);
      if (s.confirmado) opts.confirmado.add(s.confirmado);
      if (s.extendedStatus) opts.estado.add(s.extendedStatus);
    });
    return {
      grupo: Array.from(opts.grupo).sort(),
      ambiente: Array.from(opts.ambiente).sort(),
      analista: Array.from(opts.analista).sort(),
      comentarios: Array.from(opts.comentarios).sort(),
      snap: Array.from(opts.snap).sort(),
      confirmado: Array.from(opts.confirmado).sort(),
      estado: Array.from(opts.estado).sort(),
    };
  }, [enriched]);

  // ── KPI Stats ───────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total     = filtered.length;
    const ok        = filtered.filter((s) => s.extendedStatus === "Actualizado").length;
    const errors    = filtered.filter((s) => s.extendedStatus === "Error").length;
    const sinConf   = filtered.filter((s) => s.extendedStatus === "Sin Confirmación").length;
    const sinSnap   = filtered.filter((s) => s.extendedStatus === "Sin Snap").length;
    const revision  = filtered.filter((s) => s.extendedStatus === "En Revisión").length;
    const pendientes = filtered.filter((s) => s.extendedStatus === "Pendiente").length;
    const noData    = filtered.filter((s) => s.extendedStatus === "Sin Datos").length;
    
    // Para % de cumplimiento seguimos considerando solo los que ya pasaron
    // O si queremos que el pipeline sea la base: ok / total
    const pct       = total > 0 ? Math.round((ok / total) * 100) : 0;
    return { total, ok, errors, sinConf, sinSnap, revision, pendientes, noData, pct };
  }, [filtered]);

  // ── Donut chart data ────────────────────────────────────────────────────────
  const donutData = useMemo(() => [
    { name: "Actualizado", value: stats.ok, color: EXTENDED_STATUS_COLORS["Actualizado"] },
    { name: "Error", value: stats.errors, color: EXTENDED_STATUS_COLORS["Error"] },
    { name: "Sin Confirmación", value: stats.sinConf, color: EXTENDED_STATUS_COLORS["Sin Confirmación"] },
    { name: "Sin Snap", value: stats.sinSnap, color: EXTENDED_STATUS_COLORS["Sin Snap"] },
    { name: "En Revisión", value: stats.revision, color: EXTENDED_STATUS_COLORS["En Revisión"] },
    { name: "Pendiente", value: stats.pendientes, color: EXTENDED_STATUS_COLORS["Pendiente"] },
    { name: "Sin datos", value: stats.noData, color: EXTENDED_STATUS_COLORS["Sin Datos"] },
  ].filter((d) => d.value > 0).sort((a, b) => b.value - a.value), [stats]);

  // ── Cumplimiento por banco ──────────────────────────────────────────────────
  const byBankData = useMemo(() => {
    const banks = bankFilters.includes("all")
      ? [...SERVER_TYPES, "Sin clasificar"]
      : bankFilters.map(b => b === "unclassified" ? "Sin clasificar" : b);

    return banks.map((bank) => {
      const srvs = filtered.filter((s) => {
        const info = getServerInfo(s.serverName);
        const b = info ? info.type : "Sin clasificar";
        return b === bank;
      });
      const total      = srvs.length;
      const ok         = srvs.filter((s) => s.extendedStatus === "Actualizado").length;
      const errors     = srvs.filter((s) => s.extendedStatus === "Error").length;
      const sinConf    = srvs.filter((s) => s.extendedStatus === "Sin Confirmación").length;
      const sinSnap    = srvs.filter((s) => s.extendedStatus === "Sin Snap").length;
      const revision   = srvs.filter((s) => s.extendedStatus === "En Revisión").length;
      const pendientes = srvs.filter((s) => s.extendedStatus === "Pendiente").length;
      const nodata     = srvs.filter((s) => s.extendedStatus === "Sin Datos").length;
      return { name: bank, total, ok, errors, sinConf, sinSnap, revision, pendientes, nodata, pct: total > 0 ? Math.round((ok / total) * 100) : 0 };
    }).filter((d) => d.total > 0).sort((a, b) => b.total - a.total);
  }, [filtered, bankFilters]);

  // ── Trend: servidores por sync (últimas N syncs) ────────────────────────────
  const trendData = useMemo(() => {
    const runs = syncRuns
      .filter((r) => isInTimeFilter(r.syncedAt, timeFilter, selectedMonth, customFrom, customTo))
      .sort((a, b) => new Date(a.syncedAt).getTime() - new Date(b.syncedAt).getTime())
      .slice(-12);

    return runs.map((run) => {
      const recs = run.records.filter((r) => matchesBankFilter(r.serverName, bankFilters));
      const total  = recs.length;
      
      const mapped = recs.map(r => getExtendedStatus(r.status, r.errorDescription, null, null)); // Not exactly full data but good enough for trend history unless we have full history records. Actually, we do have errorDescription which sometimes stores comments in historical runs, but let's just use what we can. 
      const ok     = mapped.filter((s) => s === "Actualizado").length;
      const errors = mapped.filter((s) => s === "Error").length;
      const sinConf = mapped.filter((s) => s === "Sin Confirmación").length; const revision = mapped.filter((s) => s === "En Revisión").length; const pendientes = mapped.filter((s) => s === "Pendiente").length;
      const sinSnap = mapped.filter((s) => s === "Sin Snap").length;
      const nodata = mapped.filter((s) => s === "Sin Datos").length;

      const dateObj = new Date(run.syncedAt);
      return {
        label: `${dateObj.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" })} ${dateObj.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })}`,
        ok, errors, sinConf, sinSnap, revision, pendientes, nodata, total,
        pct: total > 0 ? Math.round((ok / total) * 100) : 0,
      };
    });
  }, [syncRuns, timeFilter, selectedMonth, customFrom, customTo, bankFilters]);

  // ── Top KBs instaladas ──────────────────────────────────────────────────────
  const allKBs = useMemo(() => {
    const kbMap: Record<string, number> = {};
    for (const s of filtered) {
      if (!s.installedKBs) continue;
      for (const kb of s.installedKBs.split(/[,;|\s]+/).map((k) => k.trim()).filter(Boolean)) {
        kbMap[kb] = (kbMap[kb] ?? 0) + 1;
      }
    }
    return Object.entries(kbMap)
      .sort((a, b) => b[1] - a[1])
      .map(([kb, count]) => ({ kb, count }));
  }, [filtered]);

  // ── Top Grupos afectados (con problemas operativos o técnicos) ───────────────
  const topGrupos = useMemo(() => {
    const gMap: Record<string, { total: number; errors: number }> = {};
    for (const s of filtered) {
      const g = s.grupo ?? s.info?.type ?? "Sin clasificar";
      if (!gMap[g]) gMap[g] = { total: 0, errors: 0 };
      gMap[g].total++;
      if (s.extendedStatus !== "Actualizado" && s.extendedStatus !== "Sin Datos" && s.extendedStatus !== "Pendiente") {
        gMap[g].errors++;
      }
    }
    return Object.entries(gMap)
      .map(([name, v]) => ({ name, ...v, pct: v.total > 0 ? Math.round((v.errors / v.total) * 100) : 0 }))
      .sort((a, b) => b.errors - a.errors)
      .slice(0, 10);
  }, [filtered]);

  // ── Top errores por banco ───────────────────────────────────────────────────
  const topErrors = useMemo(() => {
    const eMap: Record<string, Set<string>> = {};
    for (const s of filtered) {
      if (!s.isError || !s.errorDescription) continue;
      if (!eMap[s.errorDescription]) eMap[s.errorDescription] = new Set();
      eMap[s.errorDescription].add(s.serverName);
    }
    return Object.entries(eMap)
      .map(([msg, servers]) => ({ msg, count: servers.size }))
      .sort((a, b) => b.count - a.count)
      ;
  }, [filtered]);

  // ── Banco con más riesgo ────────────────────────────────────────────────────
  const riskData = useMemo(() =>
    byBankData
      .sort((a, b) => b.errors - a.errors)
      .map((b) => ({ name: b.name, errors: b.errors, pct: b.pct })),
  [byBankData]);

  const lastUpdated = initialData.length > 0
    ? new Date(initialData[0].updatedAt).toLocaleString("es-AR")
    : "—";

  const getPeriodoString = () => {
    if (timeFilter === "mes" && selectedMonth) {
      const [y, m] = selectedMonth.split("-");
      return new Date(Number(y), Number(m) - 1, 1).toLocaleDateString("es-AR", { month: "long", year: "numeric" });
    }
    if (timeFilter === "custom") return `desde el ${customFrom || "inicio"} hasta el ${customTo || "hoy"}`;
    return "el período seleccionado";
  };

  const dashboardDefaultMessage = `Estimados, espero que se encuentren muy bien.\n\nPor medio del presente, remito adjunto el Informe Mensual correspondiente, en el cual se detallan las actualizaciones implementadas en los servidores durante el período de ${getPeriodoString()}.\nQuedo a disposición para cualquier consulta o aclaración adicional que consideren pertinente.\n\nSaludos cordiales`;

  return (
    <div className="space-y-5">
      {/* ── Header: fecha + filtros ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-zinc-500">
          Última sincronización: <span className="text-zinc-300">{lastUpdated}</span>
          {" · "}
          <span className="text-zinc-400">{filtered.length} de {Object.keys(serverTypeMap).length} servidores</span>
        </p>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setShowFilterBar((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
              showFilterBar
                ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                : "text-zinc-400 border-zinc-700/50 hover:border-zinc-600 hover:text-zinc-200"
            }`}
          >
            <Filter className="w-3.5 h-3.5" />
            Filtros
          </button>
          <button
            onClick={() => {
              const rows: ExportRow[] = filtered.map(s => ({
                servidor: s.serverName,
                dominio: s.domain || "—",
                ip: s.ip || "—",
                tipo: s.info?.type || "Sin clasificar",
                ambiente: s.ambiente || "—",
                analista: s.analista || "—",
                os: s.os || "—",
                sqlInstancia: s.sqlInstancia || "—",
                sqlVersion: s.sqlVersion || "—",
                sqlUpd: s.sqlUltimaActualizacion || "—",
                fechaVentana: s.fechaVentana || "—",
                fechaInstalacion: s.installDate || "—",
                kbsInstaladas: s.installedKBs || "—",
                fechaReinicio: s.runningTime || "—",
                estado: s.status === "ok" ? "OK" : s.status === "error" ? "Error" : "Sin Datos",
                error: s.errorDescription || "—",
                comentarios: s.comentarios || "—",
                snap: s.snap || "—",
                confirmado: s.confirmado || "—"
              }));

              setEmailPayload({
                attachmentType: "dashboard",
                summaryText: `Dashboard — ${filtered.length} servidores`,
                defaultMessage: dashboardDefaultMessage,
                data: filtered,
                pdfBase64: getPDFBase64(rows, "Detalle de Servidores"),
                pdfFilename: `Dashboard_${new Date().toISOString().slice(0, 10)}.pdf`
              });
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border text-zinc-400 border-zinc-700/50 hover:border-indigo-500/50 hover:text-indigo-300 transition-all"
          >
            <Mail className="w-3.5 h-3.5" />
            Enviar por Correo
          </button>
        </div>
      </div>

      {/* ── Filter Bar ──────────────────────────────────────────────────────── */}
      {showFilterBar && (
        <div className="glass rounded-xl p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-zinc-500 font-medium mr-1 shrink-0">Banco(s):</span>
            {BANK_CHIPS.map(({ label, value }) => {
              const color = value !== "all" ? TYPE_COLORS[value === "unclassified" ? "Sin clasificar" : value as string] : null;
              const isActive = bankFilters.includes(value);
              return (
                <button
                  key={value}
                  onClick={() => {
                    setBankFilters(prev => {
                      if (value === "all") return ["all"];
                      const next = prev.filter(b => b !== "all");
                      if (next.includes(value)) {
                        const res = next.filter(b => b !== value);
                        return res.length === 0 ? ["all"] : res;
                      }
                      return [...next, value];
                    });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                    isActive ? "text-white border-transparent shadow-lg" : "text-zinc-400 border-zinc-700/50 hover:text-zinc-200 hover:border-zinc-600"
                  }`}
                  style={isActive && color ? { backgroundColor: color + "33", borderColor: color + "66", color } : isActive ? { backgroundColor: "#6366f133", borderColor: "#6366f166", color: "#a5b4fc" } : {}}
                >
                  {label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] text-zinc-500 font-medium mr-1 shrink-0">Filtro de Tiempo:</span>
            {(["mes","custom"] as TimeFilter[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border ${
                  timeFilter === tf
                    ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                    : "text-zinc-400 border-zinc-700/50 hover:text-zinc-200"
                }`}
              >
                {tf === "mes" ? "Mes" : "Rango Personalizado"}
              </button>
            ))}
            {timeFilter === "mes" && (
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
            )}
            {timeFilter === "custom" && (
              <div className="flex items-center gap-2">
                <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)}
                  className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500" />
                <span className="text-zinc-600 text-xs">→</span>
                <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)}
                  className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500" />
              </div>
            )}
            {(!bankFilters.includes("all") || timeFilter !== "mes" || grupoFilters.length > 0 || ambienteFilters.length > 0 || analistaFilters.length > 0 || comentariosFilters.length > 0 || snapFilters.length > 0 || confirmadoFilters.length > 0 || estadoFilters.length > 0) && (
              <button
                onClick={() => { setBankFilters(["all"]); setTimeFilter("mes"); setCustomFrom(""); setCustomTo(""); setGrupoFilters([]); setAmbienteFilters([]); setAnalistaFilters([]); setComentariosFilters([]); setSnapFilters([]); setConfirmadoFilters([]); setEstadoFilters([]); }}
                className="ml-auto flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-3 h-3" /> Limpiar filtros
              </button>
            )}
          </div>
          
          <div className="pt-2 mt-2 border-t border-zinc-800/50 flex flex-wrap gap-x-4 gap-y-3">
            {[
              { label: "Grupo", options: filterOptions.grupo, state: grupoFilters, setState: setGrupoFilters },
              { label: "Ambiente", options: filterOptions.ambiente, state: ambienteFilters, setState: setAmbienteFilters },
              { label: "Analista", options: filterOptions.analista, state: analistaFilters, setState: setAnalistaFilters },
              { label: "Comentarios", options: filterOptions.comentarios, state: comentariosFilters, setState: setComentariosFilters },
              { label: "Snap", options: filterOptions.snap, state: snapFilters, setState: setSnapFilters },
              { label: "Confirmado", options: filterOptions.confirmado, state: confirmadoFilters, setState: setConfirmadoFilters },
              { label: "Estado", options: filterOptions.estado, state: estadoFilters, setState: setEstadoFilters },
            ].map(({ label, options, state, setState }) => (
              options.length > 0 && (
                <CustomMultiSelect
                  key={label}
                  label={label}
                  options={options}
                  selected={state}
                  onChange={setState}
                />
              )
            ))}
          </div>
        </div>
      )}

      {/* ── KPIs ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <MetricCard title="Total Servidores"   value={Object.keys(serverTypeMap).length} subtitle="Inventario evaluado" icon={<Server className="w-5 h-5 text-indigo-400"  />} accent="indigo"  />
        <MetricCard title="Actualizados"  value={stats.ok} subtitle="Seguridad al día" icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />} accent="emerald" />
        <MetricCard title="No Actualizados" value={stats.sinConf + stats.sinSnap + stats.revision + stats.noData} subtitle="Requieren gestión" icon={<AlertCircle className="w-5 h-5 text-amber-400"  />} accent="amber"  />
        <MetricCard title="Errores"        value={stats.errors} subtitle="Requieren remediación" icon={<XCircle className="w-5 h-5 text-rose-400"    />} accent="rose"    />
        <MetricCard title="Pendientes"     value={stats.pendientes} subtitle="Programados a futuro" icon={<Clock className="w-5 h-5 text-violet-400" />} accent="violet" />
        <MetricCard title="Sincronizados este mes" value={stats.total} subtitle="Servidores analizados" icon={<CheckCircle2 className="w-5 h-5 text-cyan-400" />} accent="cyan" />
      </div>

      {/* ── Charts Row 1: Donut + Cumplimiento por Banco ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Donut */}
        <ChartCard title="Distribución de Estado">
          {chartsMounted && stats.total > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={donutData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">
                  {donutData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip {...tooltipStyle} formatter={(v, n) => [`${v} servidores`, n]} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-zinc-400 text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-zinc-500 text-sm">Sin datos</div>
          )}
        </ChartCard>

        {/* Cumplimiento por banco */}
        <div className="lg:col-span-2">
          <ChartCard title="Cumplimiento por Banco">
            {byBankData.length > 0 ? (
              <div className="overflow-auto">
                <table className="w-full text-xs table-fixed">
                  <thead className="text-zinc-500 uppercase">
                    <tr>
                      <th className="px-2 py-2 text-left font-medium">Banco</th>
                      <th className="px-2 py-2 text-right font-medium">Total</th>
                      <th className="px-2 py-2 text-right font-medium" style={{color: EXTENDED_STATUS_COLORS["Actualizado"]}}>OK</th>
                      <th className="px-2 py-2 text-right font-medium" style={{color: EXTENDED_STATUS_COLORS["Error"]}}>Err</th>
                      <th className="px-2 py-2 text-right font-medium" style={{color: EXTENDED_STATUS_COLORS["Sin Confirmación"]}}>S. Conf</th>
                      <th className="px-2 py-2 text-right font-medium" style={{color: EXTENDED_STATUS_COLORS["Sin Snap"]}}>S. Snap</th>
                      <th className="px-2 py-2 text-right font-medium" style={{color: EXTENDED_STATUS_COLORS["En Revisión"]}}>Revisi�n</th>
                      <th className="px-2 py-2 text-right font-medium" style={{color: EXTENDED_STATUS_COLORS["Pendiente"]}}>Pend</th>
                      <th className="px-2 py-2 text-right font-medium text-zinc-500">S/D</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {byBankData.map((b) => {
                      const color = TYPE_COLORS[b.name] ?? "#a855f7";
                      const pctErr = b.total > 0 ? Math.round((b.errors / b.total) * 100) : 0;
                      return (
                        <tr key={b.name} className="hover:bg-white/[0.02]">
                          <td className="px-2 py-2">
                            <span className="px-1.5 py-0.5 rounded text-[10px] font-bold border"
                              style={{ color, borderColor: color + "44", backgroundColor: color + "15" }}>{b.name}</span>
                          </td>
                          <td className="px-2 py-2 text-right text-zinc-300 font-medium">{b.total}</td>
                          <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Actualizado"]}}>{b.ok}</td>
                          <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Error"]}}>{b.errors}</td>
                          <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Sin Confirmación"]}}>{b.sinConf}</td>
                          <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Sin Snap"]}}>{b.sinSnap}</td>
                          <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["En Revisión"]}}>{b.revision}</td>
                          <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Pendiente"]}}>{b.pendientes}</td>
                          <td className="px-2 py-2 text-right text-zinc-500">{b.nodata}</td>
                        </tr>
                      );
                    })}
                    {/* Total row */}
                    <tr className="bg-zinc-900/50 font-bold">
                      <td className="px-2 py-2 text-zinc-300">Total general</td>
                      <td className="px-2 py-2 text-right text-zinc-200">{stats.total}</td>
                      <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Actualizado"]}}>{stats.ok}</td>
                      <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Error"]}}>{stats.errors}</td>
                      <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Sin Confirmación"]}}>{stats.sinConf}</td>
                      <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Sin Snap"]}}>{stats.sinSnap}</td>
                      <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["En Revisión"]}}>{stats.revision}</td>
                      <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Pendiente"]}}>{stats.pendientes}</td>
                      <td className="px-2 py-2 text-right text-zinc-500">{stats.noData}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="h-60 flex items-center justify-center text-zinc-500 text-sm">Sin datos para el filtro seleccionado</div>
            )}
          </ChartCard>
        </div>
      </div>

      {/* ── Charts Row 2: Tendencia (si hay syncs) ──────────────────────────── */}
      {trendData.length > 0 && (
        <ChartCard title="Servidores por Sync · % Cumplimiento">
          {chartsMounted && (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={trendData} margin={{ top: 4, right: 40, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#71717a" }} />
                <YAxis yAxisId="cnt" orientation="left" tick={{ fontSize: 10, fill: "#71717a" }} />
                <YAxis yAxisId="pct" orientation="right" domain={[0, 100]} tickFormatter={(v) => `${v}%`} tick={{ fontSize: 10, fill: "#6366f1" }} />
                <Tooltip {...tooltipStyle} />
                <Legend formatter={(v) => <span className="text-zinc-400 text-xs">{v}</span>} />
                <Bar yAxisId="cnt" dataKey="ok"     name="Actualizado (OK)" stackId="s" fill={EXTENDED_STATUS_COLORS["Actualizado"] + "aa"} />
                <Bar yAxisId="cnt" dataKey="errors" name="Errores"   stackId="s" fill={EXTENDED_STATUS_COLORS["Error"] + "aa"} />
                <Bar yAxisId="cnt" dataKey="sinConf" name="Sin Confirmación" stackId="s" fill={EXTENDED_STATUS_COLORS["Sin Confirmación"] + "aa"} />
                <Bar yAxisId="cnt" dataKey="sinSnap" name="Sin Snap" stackId="s" fill={EXTENDED_STATUS_COLORS["Sin Snap"] + "aa"} />
                <Bar yAxisId="cnt" dataKey="revision" name="En Revisión" stackId="s" fill={EXTENDED_STATUS_COLORS["En Revisión"] + "aa"} />
                <Bar yAxisId="cnt" dataKey="pendientes" name="Pendiente" stackId="s" fill={EXTENDED_STATUS_COLORS["Pendiente"] + "aa"} />
                <Bar yAxisId="cnt" dataKey="nodata" name="Sin Datos" stackId="s" fill={EXTENDED_STATUS_COLORS["Sin Datos"] + "aa"} radius={[4,4,0,0]} />
                <Line yAxisId="pct" type="monotone" dataKey="pct" name="% Cumplimiento"
                  stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      )}

      {/* ── Charts Row 3: Pipeline de Actualización ─────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="lg:col-span-1">
          <ChartCard title="Pipeline de actualización">
            <div className="space-y-8 py-4">
              {[
                { label: "1. Servidores evaluados", value: stats.total, max: stats.total },
                { label: "2. No actualizados", value: stats.total - stats.ok, max: stats.total },
                { label: "3. Confirmación OK", value: stats.total - stats.sinConf - stats.revision, max: stats.total },
                { label: "4. SNAP OK", value: stats.total - stats.sinConf - stats.revision - stats.sinSnap, max: stats.total },
                { label: "5. Actualización ejecutada", value: stats.ok + stats.errors, max: stats.total }
              ].map((step, i) => (
                <div key={i} className="flex flex-col gap-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-zinc-300 font-medium">{step.label}</span>
                    <span className="text-zinc-400 font-bold">{step.value}</span>
                  </div>
                  <div className="h-3 w-full bg-zinc-800/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-indigo-500 rounded-full transition-all duration-1000"
                      style={{ width: `${step.max > 0 ? (step.value / step.max) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </ChartCard>
        </div>
        
        <div className="flex flex-col gap-4 overflow-hidden">
          <ChartCard title="Detalle para seguimiento">
            <div className="overflow-x-auto overflow-y-auto max-h-[360px] custom-scrollbar">
              <table className="w-full text-[10px] text-left min-w-[500px]">
                <thead className="text-zinc-500 uppercase sticky top-0 bg-zinc-950/90 backdrop-blur-md z-10">
                  <tr>
                    <th className="px-2 py-1.5 font-medium">Servidor</th>
                    <th className="px-2 py-1.5 font-medium">Estado</th>
                    <th className="px-2 py-1.5 font-medium">Confirmación</th>
                    <th className="px-2 py-1.5 font-medium">SNAP</th>
                    <th className="px-2 py-1.5 font-medium">Ejecución</th>
                    <th className="px-2 py-1.5 font-medium">Resultado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filtered.slice(0, 50).map((s) => {
                    const isEjecutado = s.status === "ok" || s.status === "error";
                    const confirmLabel = (!s.comentarios?.toLowerCase().includes("no confirmo")) ? "OK" : "No";
                    const snapLabel = (!s.snap?.toLowerCase().includes("no se recibio")) ? "OK" : "No";
                    const ejecucionLabel = isEjecutado ? "Ejecutado" : "No";
                    const resultadoLabel = s.status === "ok" ? "OK" : (s.status === "error" ? "Error" : "-");
                    return (
                      <tr key={s.id} className="hover:bg-white/[0.02]">
                        <td className="px-2 py-1.5 font-medium text-zinc-300 truncate" title={s.serverName}>{s.serverName}</td>
                        <td className="px-2 py-1.5 truncate"><StatusBadge status={s.status} extendedStatus={s.extendedStatus} /></td>
                        <td className="px-2 py-1.5 text-zinc-400">{confirmLabel}</td>
                        <td className="px-2 py-1.5 text-zinc-400">{snapLabel}</td>
                        <td className="px-2 py-1.5 text-zinc-400">{ejecucionLabel}</td>
                        <td className="px-2 py-1.5 text-zinc-400">{resultadoLabel}</td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>          </ChartCard>
        </div>
      </div>

      {/* ── Charts Row 4: Riesgo por banco + Top KBs ────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Riesgo */}
        <ChartCard title="Bancos con Mayor Riesgo (errores)">
          {chartsMounted && riskData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={riskData} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#71717a" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: "#a1a1aa" }} width={65} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="errors" name="Servidores con error" fill="#ef4444aa" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-zinc-500 text-sm">Sin errores registrados</div>
          )}
        </ChartCard>

        {/* Top KBs */}
        <ChartCard title={
          <>
            <span>Top 10 KBs Instaladas</span>
            <button 
              onClick={() => setIsKbExplorerOpen(true)}
              className="text-indigo-400 hover:text-indigo-300 font-bold normal-case text-xs underline underline-offset-2"
            >
              Ver más
            </button>
          </>
        }>
          {chartsMounted && allKBs.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={allKBs.slice(0, 10)} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#71717a" }} />
                <YAxis type="category" dataKey="kb" tick={{ fontSize: 10, fill: "#a1a1aa" }} width={80} />
                <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.05)' }} />
                <Bar 
                  dataKey="count" 
                  name="Servidores" 
                  fill="#6366f1aa" 
                  radius={[0,4,4,0]} 
                  onClick={(data: any) => setSelectedKbModal(data.kb)}
                  className="cursor-pointer hover:fill-indigo-400"
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-zinc-500 text-sm">Sin KBs registradas</div>
          )}
        </ChartCard>
      </div>

      {/* ── Charts Row 4: Top errores + Top grupos afectados ─────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Top errores */}
        <ChartCard title="Top Causas de Error">
          {topErrors.length > 0 ? (
            <div className="space-y-2 overflow-auto max-h-52">
              {topErrors.map((e, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-zinc-300 truncate" title={e.msg}>{e.msg}</p>
                    <div className="mt-1 h-1 bg-zinc-800 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-500/70 rounded-full transition-all"
                        style={{ width: `${topErrors[0].count > 0 ? (e.count / topErrors[0].count) * 100 : 0}%` }} />
                    </div>
                  </div>
                  <span className="text-xs font-bold text-rose-400 shrink-0">{e.count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-52 flex items-center justify-center text-zinc-500 text-sm">Sin errores</div>
          )}
        </ChartCard>

        {/* Top grupos afectados */}
        <ChartCard title="Top 10 Grupos/Ambientes más Afectados">
          {chartsMounted && topGrupos.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topGrupos} layout="vertical" margin={{ top: 0, right: 40, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#71717a" }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#a1a1aa" }} width={80} />
                <Tooltip {...tooltipStyle} formatter={(v, n) => [v, n === "errors" ? "Con error" : n === "total" ? "Total" : n]} />
                <Bar dataKey="errors" name="errors" fill="#ef4444aa" stackId="s" />
                <Bar dataKey="total"  name="total"  fill="#3f3f4650" stackId="s" radius={[0,4,4,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-zinc-500 text-sm">Sin datos de grupos</div>
          )}
        </ChartCard>
      </div>

      {/* ── Tabla Detalle de Servidores ──────────────────────────────────────── */}
      <div className="glass rounded-2xl p-5 flex flex-col">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <h2 className="text-base font-semibold text-zinc-200">
            Detalle de Servidores
            <span className="ml-2 text-xs font-normal text-zinc-500">
              ({filtered.length} de {initialData.length})
            </span>
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar servidor, IP, grupo, ambiente, OS..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 w-full sm:w-64 transition-colors"
            />
          </div>
        </div>

        <div className="overflow-auto flex-1 max-h-[500px]">
          <table className="w-full text-xs text-left">
            <thead className="text-zinc-400 uppercase">
              <tr>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">Servidor</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">Grupo</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">Ambiente</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">Dominio</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">IP</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">Estado</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">Analista</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">OS</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">Versión SO</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">SQL Instancia</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">SQL Versión</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">SQL Upd</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">Fecha Ventana</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">KBs</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">Instalación</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">Running Time</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">Espacio en Disco</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">Error</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">Comentarios</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">Snap</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap min-w-[160px]">Confirmado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((server) => {
                const bankColor = TYPE_COLORS[server.info?.type ?? "Sin clasificar"] ?? "#71717a";
                return (
                  <tr key={server.id} className="hover:bg-white/[0.025] transition-colors">
                    <TruncatedCell title="Servidor" content={server.serverName} onClick={setSelectedDetail} extraClasses="text-zinc-200 font-medium">
                      <div className="flex flex-col gap-0.5">
                        <span className="truncate">{server.serverName}</span>
                        {server.info && (
                          <span className="text-[9px] font-bold px-1 py-0.5 rounded w-fit"
                            style={{ color: bankColor, backgroundColor: bankColor + "18", border: `1px solid ${bankColor}33` }}>
                            {server.info.type}
                          </span>
                        )}
                      </div>
                    </TruncatedCell>
                    <TruncatedCell title="Grupo" content={server.grupo} onClick={setSelectedDetail}>{server.grupo ? <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{server.grupo}</span> : <span className="text-zinc-700">—</span>}</TruncatedCell>
                    <TruncatedCell title="Ambiente" content={server.ambiente} onClick={setSelectedDetail}>{server.ambiente ? <span className="px-1.5 py-0.5 rounded text-[10px] bg-violet-500/10 text-violet-300 border border-violet-500/20">{server.ambiente}</span> : <span className="text-zinc-700">—</span>}</TruncatedCell>
                    <TruncatedCell title="Dominio" content={server.domain} onClick={setSelectedDetail} />
                    <TruncatedCell title="IP" content={server.ip} onClick={setSelectedDetail} />
                    <TruncatedCell title="Estado" content={server.extendedStatus} onClick={setSelectedDetail}><StatusBadge status={server.status} extendedStatus={server.extendedStatus} /></TruncatedCell>
                    <TruncatedCell title="Analista" content={server.analista} onClick={setSelectedDetail} />
                    <TruncatedCell title="OS" content={server.os} onClick={setSelectedDetail} />
                    <TruncatedCell title="Versión SO" content={server.osVersion} onClick={setSelectedDetail} />
                    <TruncatedCell title="SQL Instancia" content={server.sqlInstancia} onClick={setSelectedDetail} />
                    <TruncatedCell title="SQL Versión" content={server.sqlVersion} onClick={setSelectedDetail} />
                    <TruncatedCell title="SQL Última Actualización" content={server.sqlUltimaActualizacion} onClick={setSelectedDetail} />
                    <TruncatedCell title="Fecha Ventana" content={server.fechaVentana} onClick={setSelectedDetail} />
                    <TruncatedCell title="KBs Instaladas" content={server.installedKBs} onClick={setSelectedDetail} />
                    <TruncatedCell title="Fecha de Instalación" content={server.installDate} onClick={setSelectedDetail} />
                    <TruncatedCell title="Running Time" content={server.runningTime} onClick={setSelectedDetail} />
                    <TruncatedCell title="Espacio en Disco" content={server.diskSpace} onClick={setSelectedDetail} />
                    <TruncatedCell title="Detalle del Error" content={server.errorDescription} isError={server.status === "error"} onClick={setSelectedDetail} />
                    <TruncatedCell title="Comentarios" content={server.comentarios} onClick={setSelectedDetail} />
                    <TruncatedCell title="Snap" content={server.snap} onClick={setSelectedDetail} />
                    <TruncatedCell title="Confirmado" content={server.confirmado} onClick={setSelectedDetail} />
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={16} className="px-4 py-10 text-center text-zinc-600">
                    No se encontraron servidores con ese criterio de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <EmailModal
        isOpen={!!emailPayload}
        onClose={() => setEmailPayload(null)}
        payload={emailPayload}
      />

      {/* Modal de Detalles */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={`glass rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh] overflow-hidden border ${selectedDetail.isError ? 'border-rose-500/20' : 'border-zinc-700/50'}`}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/50">
              <h3 className={`text-sm font-semibold flex items-center gap-2 ${selectedDetail.isError ? 'text-rose-400' : 'text-zinc-200'}`}>
                {selectedDetail.isError && <AlertCircle className="w-4 h-4" />}
                {selectedDetail.title}
              </h3>
              <button onClick={() => setSelectedDetail(null)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 overflow-auto text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {selectedDetail.content}
            </div>
            <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/50 flex justify-end">
              <button
                onClick={() => setSelectedDetail(null)}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
      {selectedKbModal && (
        <KbInfoModal kbNumber={selectedKbModal} onClose={() => setSelectedKbModal(null)} />
      )}
      {isKbExplorerOpen && (
        <KbExplorerModal kbs={allKBs} onClose={() => setIsKbExplorerOpen(false)} />
      )}
    </div>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({
  title, value, icon, accent, subtitle
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent: "indigo" | "emerald" | "rose" | "amber" | "violet" | "zinc" | "cyan";
  subtitle?: string;
}) {
  const gradients: Record<string, string> = {
    indigo:  "from-indigo-500/5",
    emerald: "from-emerald-500/5",
    rose:    "from-rose-500/5",
    amber:   "from-amber-500/5",
    violet:  "from-violet-500/5",
    zinc:    "from-zinc-500/5",
    cyan:    "from-cyan-500/5",
  };
  return (
    <div className="glass rounded-2xl p-4 flex flex-col justify-between relative overflow-hidden group hover:border-white/10 transition-all min-h-[105px]">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[accent]} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative flex items-start justify-between w-full">
        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">{title}</p>
        <div className="relative p-1.5 bg-white/[0.04] rounded-lg border border-white/[0.06]">
          {icon}
        </div>
      </div>
      <div className="relative mt-2">
        <p className="text-2xl font-bold tracking-tight text-white leading-none">{value}</p>
        {subtitle && <p className="text-[10px] text-zinc-400 mt-1.5 font-medium truncate">{subtitle}</p>}
      </div>
    </div>
  );
}

