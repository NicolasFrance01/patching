"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronRight, CheckCircle2, XCircle, AlertCircle, Mail } from "lucide-react";
import { getServerInfo, SERVER_TYPES, ServerType } from "@/lib/serverTypeMap";
import EmailModal, { EmailPayload } from "./EmailModal";
import { getPDFBase64, ExportRow } from "@/lib/exportUtils";

interface SyncRecord {
  id: string;
  serverName: string;
  grupo: string | null;
  ambiente: string | null;
  domain: string | null;
  ip: string | null;
  os: string | null;
  osVersion: string | null;
  status: string;
  errorDescription: string | null;
  installDate: string | null;
  installedKBs: string | null;
  runningTime: string | null;
  diskSpace: string | null;
  comentarios: string | null;
  snap: string | null;
  confirmado: string | null;
  createdAt: string;
}

interface SyncRun {
  id: string;
  syncedAt: string;
  total: number;
  success: number;
  errors: number;
  noData: number;
  isNew: boolean;
  records: SyncRecord[];
}

type BankFilter = "all" | ServerType | "unclassified";

const TYPE_COLORS: Record<string, string> = {
  ASJ: "#6366f1", BSC: "#06b6d4", BSJ: "#10b981",
  Corp: "#f59e0b", NBERSA: "#ef4444", NBSF: "#8b5cf6", QUALIA: "#ec4899",
  "Sin clasificar": "#52525b",
};

const BANK_CHIPS: { label: string; value: BankFilter }[] = [
  { label: "Todos", value: "all" },
  ...SERVER_TYPES.map((t) => ({ label: t, value: t as BankFilter })),
  { label: "Sin clasificar", value: "unclassified" },
];

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

function formatDayHeader(dayKey: string): string {
  const [y, m, d] = dayKey.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("es-AR", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  });
}

export default function HistorialView({ syncRuns }: { syncRuns: SyncRun[] }) {
  const [search, setSearch] = useState("");
  const [bankFilters, setBankFilters] = useState<BankFilter[]>(["all"]);
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "custom">("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [expandedDay, setExpandedDay] = useState<string | null>(() => {
    if (syncRuns.length === 0) return null;
    return toLocalDayKey(syncRuns[0].syncedAt);
  });
  const [expandedSync, setExpandedSync] = useState<string | null>(null);
  const [recordSearch, setRecordSearch] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState<Record<string, string>>({});
  const [emailPayload, setEmailPayload] = useState<EmailPayload | null>(null);
  const [readSyncIds, setReadSyncIds] = useState<Set<string>>(new Set());

  const filteredRuns = useMemo(() => {
    return syncRuns.filter((run) => {
      // 1. Time Filter
      if (timeFilter === "month" && selectedMonth) {
        if (!run.syncedAt.startsWith(selectedMonth)) return false;
      }
      if (timeFilter === "custom") {
        const d = new Date(run.syncedAt);
        const f = customFrom ? new Date(customFrom) : new Date(0);
        const t = customTo ? new Date(customTo + "T23:59:59") : new Date();
        if (d < f || d > t) return false;
      }

      // 2. Bank Filter
      const bankMatchedRecords = run.records.filter((r) => matchesBankFilter(r.serverName, bankFilters));
      if (!bankFilters.includes("all") && bankMatchedRecords.length === 0) return false;
      if (!search) return true;
      const q = search.toLowerCase();
      const dateStr = new Date(run.syncedAt).toLocaleString("es-AR").toLowerCase();
      if (dateStr.includes(q)) return true;
      return bankMatchedRecords.some(
        (r) =>
          r.serverName.toLowerCase().includes(q) ||
          (r.ip ?? "").includes(q) ||
          r.status.includes(q) ||
          (r.grupo ?? "").toLowerCase().includes(q) ||
          (r.ambiente ?? "").toLowerCase().includes(q)
      );
    });
  }, [syncRuns, search, bankFilters, timeFilter, selectedMonth, customFrom, customTo]);

  const dayGroups = useMemo(() => {
    const groups: Record<string, SyncRun[]> = {};
    for (const run of filteredRuns) {
      const key = toLocalDayKey(run.syncedAt);
      if (!groups[key]) groups[key] = [];
      groups[key].push(run);
    }
    return Object.entries(groups)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([day, runs]) => {
        const sorted = [...runs].sort(
          (a, b) => new Date(b.syncedAt).getTime() - new Date(a.syncedAt).getTime()
        );
        const latest = sorted[0];

        const latestFiltered = latest.records.filter((r) => matchesBankFilter(r.serverName, bankFilters));
        const latestTotal = latestFiltered.length;
        const latestSuccess = latestFiltered.filter((r) => r.status === "ok").length;

        const totalSuccess = runs.reduce((acc, r) =>
          acc + r.records.filter((rec) => matchesBankFilter(rec.serverName, bankFilters) && rec.status === "ok").length, 0);
        const totalErrors = runs.reduce((acc, r) =>
          acc + r.records.filter((rec) => matchesBankFilter(rec.serverName, bankFilters) && rec.status === "error").length, 0);
        const totalNoData = runs.reduce((acc, r) =>
          acc + r.records.filter((rec) => matchesBankFilter(rec.serverName, bankFilters) && rec.status === "nodata").length, 0);

        return {
          day,
          runs: sorted,
          serverCount: latestTotal,
          totalSuccess,
          totalErrors,
          totalNoData,
          successRate: latestTotal > 0 ? Math.round((latestSuccess / latestTotal) * 100) : 0,
        };
      });
  }, [filteredRuns, bankFilters]);

  function getFilteredRecords(run: SyncRun) {
    const q = (recordSearch[run.id] ?? "").toLowerCase();
    const sf = statusFilter[run.id] ?? "all";
    return run.records.filter((r) => {
      if (!matchesBankFilter(r.serverName, bankFilters)) return false;
      if (sf !== "all" && r.status !== sf) return false;
      if (!q) return true;
      return (
        r.serverName.toLowerCase().includes(q) ||
        (r.ip ?? "").includes(q) ||
        (r.os ?? "").toLowerCase().includes(q) ||
        (r.grupo ?? "").toLowerCase().includes(q) ||
        (r.ambiente ?? "").toLowerCase().includes(q)
      );
    });
  }

  if (syncRuns.length === 0) {
    return (
      <div className="glass rounded-2xl p-12 text-center text-zinc-500">
        No hay sincronizaciones registradas aún. Las próximas syncs del proceso WUU aparecerán aquí.
      </div>
    );
  }


  return (
    <div className="space-y-4">
      {/* ── Filters ── */}
      <div className="glass rounded-xl p-4 space-y-3">
        {/* Bank Type Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-zinc-500 font-medium mr-1 shrink-0">Banco(s):</span>
          {BANK_CHIPS.map(({ label, value }) => {
            const color = value !== "all" ? (value === "unclassified" ? TYPE_COLORS["Sin clasificar"] : TYPE_COLORS[value as string]) : null;
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
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                  isActive
                    ? "text-white border-transparent shadow-lg"
                    : "text-zinc-400 border-zinc-700/50 hover:text-zinc-200 hover:border-zinc-600"
                }`}
                style={isActive && color ? { backgroundColor: color + "33", borderColor: color + "66", color } : isActive ? { backgroundColor: "#6366f133", borderColor: "#6366f166", color: "#a5b4fc" } : {}}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Time Filter */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-zinc-500 font-medium mr-1 shrink-0">Filtro de Tiempo:</span>
          {(["all", "month", "custom"] as const).map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeFilter(tf)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border ${
                timeFilter === tf
                  ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                  : "text-zinc-400 border-zinc-700/50 hover:text-zinc-200"
              }`}
            >
              {tf === "all" ? "Todos" : tf === "month" ? "Mes" : "Rango Personalizado"}
            </button>
          ))}
          {timeFilter === "month" && (
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
          {/* Enviar mes completo por correo */}
          {timeFilter === "month" && selectedMonth && filteredRuns.length > 0 && (
            <button
              onClick={() => {
                const [y, m] = selectedMonth.split("-");
                const monthLabel = new Date(Number(y), Number(m) - 1, 1)
                  .toLocaleDateString("es-AR", { month: "long", year: "numeric" });
                const capitalizedMonth = monthLabel.charAt(0).toUpperCase() + monthLabel.slice(1);

                // Build month email: all runs grouped by day
                const allRecords = filteredRuns.flatMap(run =>
                  run.records.filter(r => matchesBankFilter(r.serverName, bankFilters))
                );
                const rows: ExportRow[] = allRecords.map(r => {
                  const info = getServerInfo(r.serverName);
                  return {
                    servidor: r.serverName,
                    dominio: r.domain || "—",
                    ip: r.ip || "—",
                    tipo: info?.type || "Sin clasificar",
                    ambiente: r.ambiente || "—",
                    os: r.os || "—",
                    fechaInstalacion: r.installDate || "—",
                    kbsInstaladas: r.installedKBs || "—",
                    fechaReinicio: r.runningTime || "—",
                    estado: r.status === "ok" ? "OK" : r.status === "error" ? "Error" : "Sin Datos",
                    error: r.errorDescription || "—",
                    comentarios: r.comentarios || "—",
                    snap: r.snap || "—",
                    confirmado: r.confirmado || "—"
                  };
                });
                const defaultMsg = `Estimados, espero que se encuentren muy bien.\n\nPor medio del presente, remito adjunto el Informe Mensual de ${capitalizedMonth}, en el cual se detallan todas las sincronizaciones y actualizaciones implementadas en los servidores durante dicho período.\nQuedo a disposición para cualquier consulta o aclaración adicional que consideren pertinente.\n\nSaludos cordiales`;
                setEmailPayload({
                  attachmentType: "history",
                  summaryText: `Historial completo – ${capitalizedMonth} (${filteredRuns.length} syncs · ${rows.length} registros)`,
                  defaultMessage: defaultMsg,
                  data: allRecords,
                  pdfBase64: getPDFBase64(rows, `Historial ${capitalizedMonth}`),
                  pdfFilename: `Historial_${selectedMonth}.pdf`
                });
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/30 hover:bg-indigo-500/20 transition-colors"
            >
              <Mail className="w-3.5 h-3.5" />
              Enviar mes completo por correo
            </button>
          )}
        </div>
      </div>

      {/* Búsqueda global */}
      <div className="glass rounded-xl p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-zinc-500 shrink-0" />
        <input
          type="text"
          placeholder="Buscar por fecha, servidor, IP, grupo, ambiente, estado..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
        />
        <span className="text-xs text-zinc-600">
          {dayGroups.length} día{dayGroups.length !== 1 ? "s" : ""}
          {" · "}
          {filteredRuns.length} sync{filteredRuns.length !== 1 ? "s" : ""}
        </span>
      </div>


      {/* Lista de días */}
      {dayGroups.length === 0 ? (
        <div className="glass rounded-2xl p-12 text-center text-zinc-500">
          Sin resultados para el banco y búsqueda seleccionados.
        </div>
      ) : (
        <div className="space-y-3">
          {dayGroups.map(({ day, runs, serverCount, totalSuccess, totalErrors, totalNoData, successRate }) => {
            const isDayOpen = expandedDay === day;
            const hasNew = runs.some(r => r.isNew && !readSyncIds.has(r.id));

            return (
              <div key={day} className="glass rounded-2xl overflow-hidden">
                {/* Day accordion header */}
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors text-left"
                  onClick={() => {
                    if (isDayOpen) {
                      setExpandedDay(null);
                      setExpandedSync(null);
                    } else {
                      setExpandedDay(day);
                      setExpandedSync(null);
                    }
                  }}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${isDayOpen ? "bg-indigo-500/10" : "bg-white/[0.03]"}`}>
                      {isDayOpen
                        ? <ChevronDown className="w-4 h-4 text-indigo-400" />
                        : <ChevronRight className="w-4 h-4 text-zinc-500" />
                      }
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-zinc-200 capitalize">{formatDayHeader(day)}</p>
                        {hasNew && (
                          <span className="flex h-2 w-2 relative">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-zinc-500">
                        {runs.length} sync{runs.length !== 1 ? "s" : ""} · {serverCount} servidores
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 mr-2">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-xs text-emerald-400">{totalSuccess}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <XCircle className="w-3.5 h-3.5 text-rose-400" />
                      <span className="text-xs text-rose-400">{totalErrors}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="text-xs text-zinc-500">{totalNoData}</span>
                    </div>
                    <div className="hidden sm:flex items-center">
                      <div className="w-20 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${successRate}%` }} />
                      </div>
                      <span className="ml-2 text-xs text-zinc-400">{successRate}%</span>
                    </div>
                  </div>
                </button>

                {/* Expanded day: individual syncs */}
                {isDayOpen && (
                  <div className="border-t border-zinc-800/60 divide-y divide-zinc-800/30">
                    {runs.map((run) => {
                      const isSyncOpen = expandedSync === run.id;
                      const syncTime = new Date(run.syncedAt).toLocaleTimeString("es-AR", {
                        hour: "2-digit", minute: "2-digit",
                      });
                      const records = getFilteredRecords(run);
                      const filteredTotal = run.records.filter((r) => matchesBankFilter(r.serverName, bankFilters)).length;
                      const filteredSuccess = run.records.filter((r) => matchesBankFilter(r.serverName, bankFilters) && r.status === "ok").length;
                      const filteredErrors = run.records.filter((r) => matchesBankFilter(r.serverName, bankFilters) && r.status === "error").length;
                      const filteredNoData = run.records.filter((r) => matchesBankFilter(r.serverName, bankFilters) && r.status === "nodata").length;
                      const syncSuccessRate = filteredTotal > 0 ? Math.round((filteredSuccess / filteredTotal) * 100) : 0;

                      return (
                        <div key={run.id}>
                          {/* Sync sub-header */}
                          <button
                            className="w-full flex items-center justify-between px-6 py-3 hover:bg-white/[0.02] transition-colors text-left"
                            onClick={() => {
                              setExpandedSync(isSyncOpen ? null : run.id);
                              if (run.isNew && !readSyncIds.has(run.id)) {
                                setReadSyncIds(prev => new Set(prev).add(run.id));
                                fetch('/api/sync', { method: 'PATCH', body: JSON.stringify({ action: 'mark-read', syncId: run.id }) });
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              {isSyncOpen
                                ? <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                                : <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                              }
                              <div>
                                <div className="flex items-center gap-2">
                                  <p className="text-xs font-medium text-zinc-300">Sync · {syncTime}</p>
                                  {run.isNew && !readSyncIds.has(run.id) && (
                                    <span className="flex h-2 w-2 relative">
                                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                                      <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-zinc-600">{filteredTotal} servidores</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mr-2 text-[11px]">
                              <span className="text-emerald-400">✓ {filteredSuccess}</span>
                              <span className="text-rose-400">✕ {filteredErrors}</span>
                              <span className="text-zinc-500">― {filteredNoData}</span>
                              <span className="text-zinc-400">{syncSuccessRate}%</span>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  const syncDateTime = new Date(run.syncedAt).toLocaleString("es-AR", {
                                    day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit"
                                  });
                                  const historyDefaultMessage = `Estimados, un placer saludarlos,.\n\nInformamos que hemos finalizado con la ventana de actualizaciones sobre los Servidores Windows, programada para el ${syncDateTime}.\nAsí mismo, enviamos adjunto el Informe Técnico de Finalización de Actualizaciones correspondiente a los servidores involucrados.\nQuedamos a disposición para cualquier consulta adicional o información que puedan requerir.\n\n\nSaludos cordiales,`;

                                  const recordsToExport = run.records.filter((r) => matchesBankFilter(r.serverName, bankFilters));
                                  const rows: ExportRow[] = recordsToExport.map(r => {
                                    const info = getServerInfo(r.serverName);
                                    return {
                                      servidor: r.serverName,
                                      dominio: r.domain || "—",
                                      ip: r.ip || "—",
                                      tipo: info?.type || "Sin clasificar",
                                      ambiente: r.ambiente || "—",
                                      os: r.os || "—",
                                      fechaInstalacion: r.installDate || "—",
                                      kbsInstaladas: r.installedKBs || "—",
                                      fechaReinicio: r.runningTime || "—",
                                      estado: r.status === "ok" ? "OK" : r.status === "error" ? "Error" : "Sin Datos",
                                      error: r.errorDescription || "—",
                                      comentarios: r.comentarios || "—",
                                      snap: r.snap || "—",
                                      confirmado: r.confirmado || "—"
                                    };
                                  });

                                  setEmailPayload({
                                    attachmentType: "history",
                                    summaryText: `Sincronización ${syncTime} (${filteredTotal} servidores)`,
                                    defaultMessage: historyDefaultMessage,
                                    data: recordsToExport,
                                    pdfBase64: getPDFBase64(rows, `Sincronización ${syncTime}`),
                                    pdfFilename: `Sync_${run.syncedAt.replace(/[:T]/g, "-").slice(0, 19)}.pdf`
                                  });
                                }}
                                title="Enviar por correo"
                                className="ml-2 p-1.5 rounded-lg border border-zinc-700/50 text-indigo-400 hover:bg-indigo-500/10 hover:border-indigo-500/30 transition-colors"
                              >
                                <Mail className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </button>

                          {/* Server records */}
                          {isSyncOpen && (
                            <div className="px-6 pb-4 space-y-3 bg-black/10">
                              <div className="flex flex-col sm:flex-row gap-2">
                                <div className="relative flex-1">
                                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                                  <input
                                    type="text"
                                    placeholder="Filtrar servidor, IP, OS, grupo, ambiente..."
                                    value={recordSearch[run.id] ?? ""}
                                    onChange={(e) => setRecordSearch((prev) => ({ ...prev, [run.id]: e.target.value }))}
                                    className="w-full pl-9 pr-4 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500"
                                  />
                                </div>
                                <div className="flex gap-1">
                                  {(["all", "ok", "error", "nodata"] as const).map((s) => (
                                    <button
                                      key={s}
                                      onClick={() => setStatusFilter((prev) => ({ ...prev, [run.id]: s }))}
                                      className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium transition-colors border ${
                                        (statusFilter[run.id] ?? "all") === s
                                          ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                                          : "text-zinc-500 border-zinc-700/50 hover:text-zinc-300"
                                      }`}
                                    >
                                      {s === "all" ? "Todos" : s === "ok" ? "OK" : s === "error" ? "Error" : "Sin datos"}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="overflow-auto max-h-96">
                                <table className="w-full text-xs text-left">
                                  <thead className="text-zinc-400 uppercase">
                                    <tr>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">Servidor</th>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">Grupo</th>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">Ambiente</th>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">Dominio</th>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">IP</th>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">Estado</th>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">OS</th>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">Versión SO</th>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">KBs</th>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">Instalación</th>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">Running Time</th>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">Espacio en Disco</th>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">Error</th>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">Comentarios</th>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">Snap</th>
                                      <th className="sticky top-0 z-10 bg-zinc-900 px-3 py-2 font-medium border-b border-zinc-800 whitespace-nowrap">Confirmado</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-zinc-800/40">
                                    {records.map((r) => (
                                      <tr key={r.id} className="hover:bg-white/[0.02]">
                                        <td className="px-3 py-2 font-medium text-zinc-200 whitespace-nowrap">{r.serverName}</td>
                                        <td className="px-3 py-2">
                                          {r.grupo ? (
                                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                                              {r.grupo}
                                            </span>
                                          ) : "—"}
                                        </td>
                                        <td className="px-3 py-2">
                                          {r.ambiente ? (
                                            <span className="px-1.5 py-0.5 rounded text-[10px] bg-violet-500/10 text-violet-300 border border-violet-500/20">
                                              {r.ambiente}
                                            </span>
                                          ) : "—"}
                                        </td>
                                        <td className="px-3 py-2 text-zinc-400 whitespace-nowrap">{r.domain ?? "—"}</td>
                                        <td className="px-3 py-2 text-zinc-400 whitespace-nowrap">{r.ip ?? "—"}</td>
                                        <td className="px-3 py-2">
                                          {r.status === "ok" ? (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">OK</span>
                                          ) : r.status === "error" ? (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">Error</span>
                                          ) : (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-600/30">Sin datos</span>
                                          )}
                                        </td>
                                        <td className="px-3 py-2 text-zinc-400 min-w-[160px] truncate" title={r.os ?? ""}>{r.os ?? "—"}</td>
                                        <td className="px-3 py-2 text-zinc-400 whitespace-nowrap">{r.osVersion ?? "—"}</td>
                                        <td className="px-3 py-2 text-zinc-400 min-w-[140px] truncate" title={r.installedKBs ?? ""}>{r.installedKBs ?? "—"}</td>
                                        <td className="px-3 py-2 text-zinc-400 whitespace-nowrap">{r.installDate ?? "—"}</td>
                                        <td className="px-3 py-2 text-zinc-400 whitespace-nowrap">{r.runningTime ?? "—"}</td>
                                        <td className="px-3 py-2 text-zinc-400 min-w-[140px] truncate" title={r.diskSpace ?? ""}>{r.diskSpace ?? "—"}</td>
                                        <td className="px-3 py-2 text-rose-400/80 text-[10px] min-w-[180px] truncate" title={r.errorDescription ?? ""}>{r.errorDescription ?? "—"}</td>
                                        <td className="px-3 py-2 text-zinc-400 min-w-[140px] truncate" title={r.comentarios ?? ""}>{r.comentarios ?? "—"}</td>
                                        <td className="px-3 py-2 text-zinc-400 whitespace-nowrap">{r.snap ?? "—"}</td>
                                        <td className="px-3 py-2 text-zinc-400 whitespace-nowrap">{r.confirmado ?? "—"}</td>
                                      </tr>
                                    ))}
                                    {records.length === 0 && (
                                      <tr>
                                        <td colSpan={16} className="px-4 py-6 text-center text-zinc-600">Sin resultados.</td>
                                      </tr>
                                    )}
                                  </tbody>
                                </table>
                              </div>
                              <p className="text-xs text-zinc-600 text-right">{records.length} de {filteredTotal} registros</p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <EmailModal
        isOpen={!!emailPayload}
        onClose={() => setEmailPayload(null)}
        payload={emailPayload}
      />
    </div>
  );
}
