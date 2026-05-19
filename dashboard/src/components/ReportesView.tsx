"use client";

import { useMemo, useState, useEffect, memo, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from "recharts";
import { getServerInfo, SERVER_TYPES } from "@/lib/serverTypeMap";
import { ChevronDown, ChevronRight, Info, Search, Download, Filter } from "lucide-react";
import { downloadCSV, downloadPDF, ExportRow } from "@/lib/exportUtils";

interface SyncRunData {
  id: string;
  syncedAt: string;
  total: number;
  success: number;
  errors: number;
  noData: number;
  records: { serverName: string; ip: string | null; status: string; errorDescription: string | null }[];
}

interface ServerData {
  id: string;
  serverName: string;
  ip: string | null;
  os: string | null;
  errorDescription: string | null;
  installDate: string | null;
  installedKBs: string | null;
  updatedAt: string;
}

interface ReportesViewProps {
  data: { syncRuns: SyncRunData[]; currentServers: ServerData[] };
}

type ByTypeItem = {
  name: string; total: number; ok: number; error: number; nodata: number; successRate: number;
};

type TrendFilter = "all" | "hoy" | "semana" | "mes" | "custom";

const TABS = ["Por Tipo", "Errores por Sync", "Listado de Syncs", "Top Errores"] as const;
type Tab = (typeof TABS)[number];

const TYPE_COLORS: Record<string, string> = {
  ASJ: "#6366f1", BSC: "#06b6d4", BSJ: "#10b981",
  Corp: "#f59e0b", NBERSA: "#ef4444", NBSF: "#8b5cf6", QUALIA: "#ec4899",
  "Sin clasificar": "#52525b",
};

const tooltipStyle = {
  contentStyle: { backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "11px" },
  itemStyle: { color: "#e4e4e7" },
  labelStyle: { color: "#a1a1aa" },
};

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

const ByTypeCharts = memo(function ByTypeCharts({ byTypeData }: { byTypeData: ByTypeItem[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div className="glass rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-zinc-200 mb-4">Servidores por tipo</h2>
        <div style={{ height: 280 }}>
          {mounted && (
            <ResponsiveContainer width="99%" height={280}>
              <BarChart data={byTypeData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#71717a" }} />
                <YAxis tick={{ fontSize: 11, fill: "#71717a" }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="ok" name="OK" stackId="a" fill="#10b981" />
                <Bar dataKey="error" name="Error" stackId="a" fill="#ef4444" />
                <Bar dataKey="nodata" name="Sin datos" stackId="a" fill="#3f3f46" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="glass rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-zinc-200 mb-4">Distribución por tipo</h2>
        <div style={{ height: 280 }}>
          {mounted && (
            <ResponsiveContainer width="99%" height={280}>
              <PieChart>
                <Pie
                  data={byTypeData.map((d) => ({ name: d.name, value: d.total }))}
                  cx="50%" cy="45%" innerRadius={60} outerRadius={90}
                  paddingAngle={3} dataKey="value" stroke="none"
                >
                  {byTypeData.map((entry, i) => <Cell key={i} fill={TYPE_COLORS[entry.name] ?? "#6b7280"} />)}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-zinc-400 text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
});

const ErrorTrendChart = memo(function ErrorTrendChart({ data }: { data: object[] }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{ height: 300 }}>
      {mounted && (
        <ResponsiveContainer width="99%" height={300}>
          <LineChart data={data} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#71717a" }} />
            <YAxis tick={{ fontSize: 11, fill: "#71717a" }} />
            <Tooltip {...tooltipStyle} />
            <Line type="monotone" dataKey="errores" name="Errores" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="ok" name="OK" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="sinDatos" name="Sin datos" stroke="#6b7280" strokeWidth={1} strokeDasharray="4 2" dot={false} />
            <Legend formatter={(v) => <span className="text-zinc-400 text-xs">{v}</span>} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
});

export default function ReportesView({ data }: ReportesViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Por Tipo");
  const [expandedSync, setExpandedSync] = useState<string | null>(null);
  const [syncListExpandedDay, setSyncListExpandedDay] = useState<string | null>(null);
  const [showUnclassified, setShowUnclassified] = useState(false);
  const [tabKey, setTabKey] = useState(0);
  const [errorSearch, setErrorSearch] = useState("");
  const [selectedError, setSelectedError] = useState<string | null>(null);
  const [autocompleteOpen, setAutocompleteOpen] = useState(false);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Errores por Sync date filter
  const [trendFilter, setTrendFilter] = useState<TrendFilter>("all");
  const [trendFrom, setTrendFrom] = useState("");
  const [trendTo, setTrendTo] = useState("");

  const hasSyncHistory = data.syncRuns.length > 0;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setTabKey((k) => k + 1);
  };

  // Close autocomplete when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (autocompleteRef.current && !autocompleteRef.current.contains(e.target as Node)) {
        setAutocompleteOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const enrichedServers = useMemo(() =>
    data.currentServers.map((s) => ({
      ...s,
      info: getServerInfo(s.serverName, s.ip),
      isError: !!(s.errorDescription && s.errorDescription !== "N/A"),
      isNoData: (!s.os || s.os === "N/A") && !(s.errorDescription && s.errorDescription !== "N/A"),
    })),
    [data.currentServers]
  );

  const unclassifiedServers = useMemo(
    () => enrichedServers.filter((s) => !s.info),
    [enrichedServers]
  );

  // ── Por Tipo ──────────────────────────────────────────────────────────────
  const byTypeData = useMemo((): ByTypeItem[] => {
    const counts: Record<string, { total: number; ok: number; error: number; nodata: number }> = {};
    SERVER_TYPES.forEach((t) => { counts[t] = { total: 0, ok: 0, error: 0, nodata: 0 }; });
    counts["Sin clasificar"] = { total: 0, ok: 0, error: 0, nodata: 0 };

    for (const s of enrichedServers) {
      const key = s.info?.type ?? "Sin clasificar";
      if (!counts[key]) counts[key] = { total: 0, ok: 0, error: 0, nodata: 0 };
      counts[key].total++;
      if (s.isError) counts[key].error++;
      else if (s.isNoData) counts[key].nodata++;
      else counts[key].ok++;
    }

    return Object.entries(counts)
      .filter(([, v]) => v.total > 0)
      .map(([name, v]) => ({
        name,
        ...v,
        successRate: v.total > 0 ? Math.round((v.ok / v.total) * 100) : 0,
      }))
      .sort((a, b) => b.total - a.total);
  }, [enrichedServers]);

  // ── Errores por Sync — filtered by date, deduplicated by day ──────────────
  const errorTrendData = useMemo(() => {
    if (!hasSyncHistory) {
      const ok = enrichedServers.filter((s) => !s.isError && !s.isNoData).length;
      const errores = enrichedServers.filter((s) => s.isError).length;
      const sinDatos = enrichedServers.filter((s) => s.isNoData).length;
      return [{ label: "Estado actual", errores, ok, sinDatos, total: enrichedServers.length }];
    }

    const now = new Date();
    let runs = [...data.syncRuns];

    if (trendFilter === "hoy") {
      const today = toLocalDayKey(now.toISOString());
      runs = runs.filter((r) => toLocalDayKey(r.syncedAt) === today);
    } else if (trendFilter === "semana") {
      const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      runs = runs.filter((r) => new Date(r.syncedAt) >= cutoff);
    } else if (trendFilter === "mes") {
      const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      runs = runs.filter((r) => new Date(r.syncedAt) >= cutoff);
    } else if (trendFilter === "custom" && trendFrom && trendTo) {
      const from = new Date(trendFrom);
      const to = new Date(trendTo);
      to.setHours(23, 59, 59, 999);
      runs = runs.filter((r) => {
        const d = new Date(r.syncedAt);
        return d >= from && d <= to;
      });
    }

    // Deduplicate by day: keep most recent sync per day
    const dayMap: Record<string, SyncRunData> = {};
    for (const run of runs) {
      const key = toLocalDayKey(run.syncedAt);
      if (!dayMap[key] || new Date(run.syncedAt) > new Date(dayMap[key].syncedAt)) {
        dayMap[key] = run;
      }
    }

    return Object.entries(dayMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([, run]) => ({
        label: new Date(run.syncedAt).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
        errores: run.errors,
        ok: run.success,
        sinDatos: run.noData,
        total: run.total,
      }));
  }, [data.syncRuns, enrichedServers, hasSyncHistory, trendFilter, trendFrom, trendTo]);

  // ── Top Errores — grouped by error message ────────────────────────────────
  const errorGroups = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    if (hasSyncHistory) {
      for (const run of data.syncRuns) {
        for (const r of run.records) {
          if (r.status === "error" && r.errorDescription) {
            if (!map[r.errorDescription]) map[r.errorDescription] = new Set();
            map[r.errorDescription].add(r.serverName);
          }
        }
      }
    } else {
      for (const s of enrichedServers) {
        if (s.isError && s.errorDescription) {
          if (!map[s.errorDescription]) map[s.errorDescription] = new Set();
          map[s.errorDescription].add(s.serverName);
        }
      }
    }
    return Object.entries(map)
      .map(([message, servers]) => ({ message, servers: Array.from(servers).sort(), count: servers.size }))
      .sort((a, b) => b.count - a.count);
  }, [data.syncRuns, enrichedServers, hasSyncHistory]);

  // Filtered error groups for Top Errores list
  const filteredErrorGroups = useMemo(() => {
    if (!errorSearch) return errorGroups;
    return errorGroups.filter((g) => g.message.toLowerCase().includes(errorSearch.toLowerCase()));
  }, [errorGroups, errorSearch]);

  // Autocomplete suggestions (top 8 matching groups)
  const autocompleteSuggestions = useMemo(() => {
    const q = errorSearch.toLowerCase();
    return errorGroups.filter((g) => !q || g.message.toLowerCase().includes(q)).slice(0, 8);
  }, [errorGroups, errorSearch]);

  // ── Listado Syncs — grouped by day ────────────────────────────────────────
  const syncListDayGroups = useMemo(() => {
    const runs: SyncRunData[] = hasSyncHistory ? data.syncRuns : (() => {
      if (enrichedServers.length === 0) return [];
      const ok = enrichedServers.filter((s) => !s.isError && !s.isNoData).length;
      const errors = enrichedServers.filter((s) => s.isError).length;
      const noData = enrichedServers.filter((s) => s.isNoData).length;
      return [{
        id: "snapshot-current",
        syncedAt: data.currentServers[0]?.updatedAt ?? new Date().toISOString(),
        total: enrichedServers.length,
        success: ok,
        errors,
        noData,
        records: enrichedServers.map((s) => ({
          serverName: s.serverName,
          ip: s.ip,
          status: s.isError ? "error" : s.isNoData ? "nodata" : "ok",
          errorDescription: s.errorDescription,
        })),
      }];
    })();

    const groups: Record<string, SyncRunData[]> = {};
    for (const run of runs) {
      const key = toLocalDayKey(run.syncedAt);
      if (!groups[key]) groups[key] = [];
      groups[key].push(run);
    }

    return Object.entries(groups)
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([day, dayRuns]) => {
        const sorted = [...dayRuns].sort(
          (a, b) => new Date(b.syncedAt).getTime() - new Date(a.syncedAt).getTime()
        );
        const latest = sorted[0];
        return {
          day,
          runs: sorted,
          serverCount: latest.total,
          totalSuccess: dayRuns.reduce((s, r) => s + r.success, 0),
          totalErrors: dayRuns.reduce((s, r) => s + r.errors, 0),
          totalNoData: dayRuns.reduce((s, r) => s + r.noData, 0),
          successRate: latest.total > 0 ? Math.round((latest.success / latest.total) * 100) : 0,
          isSynthetic: dayRuns[0]?.id === "snapshot-current",
        };
      });
  }, [data.syncRuns, enrichedServers, hasSyncHistory, data.currentServers]);

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-zinc-900 rounded-xl w-fit border border-zinc-800">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === tab ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ── Por Tipo ── */}
      {activeTab === "Por Tipo" && (
        <div key={`portipo-${tabKey}`} className="space-y-5">
          <ByTypeCharts byTypeData={byTypeData} />

          <div className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-zinc-200 mb-4">Tasa de éxito por tipo</h2>
            <div className="space-y-2">
              {byTypeData.map((d) => {
                const isUnclassified = d.name === "Sin clasificar";
                return (
                  <div key={d.name}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-zinc-400 w-24 shrink-0">{d.name}</span>
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${d.successRate}%` }} />
                      </div>
                      <span className="text-xs text-zinc-400 w-20 text-right">
                        {d.successRate}% <span className="text-zinc-600">({d.total})</span>
                      </span>
                      {isUnclassified && d.total > 0 && (
                        <button
                          onClick={() => setShowUnclassified((v) => !v)}
                          className="text-[10px] text-zinc-500 hover:text-zinc-300 transition-colors ml-1 underline underline-offset-2 shrink-0"
                        >
                          {showUnclassified ? "ocultar" : "ver cuáles"}
                        </button>
                      )}
                    </div>
                    {isUnclassified && showUnclassified && unclassifiedServers.length > 0 && (
                      <div className="mt-2 ml-28 pl-2 border-l border-zinc-700/50 space-y-1">
                        {unclassifiedServers.map((s) => (
                          <div key={s.id} className="flex items-center gap-3 text-[10px] text-zinc-500">
                            <span className="font-medium text-zinc-400 w-48 truncate">{s.serverName}</span>
                            <span className="text-zinc-600">{s.ip ?? "sin IP"}</span>
                            {s.isError && <span className="text-rose-400/70">error</span>}
                            {s.isNoData && <span className="text-zinc-600">sin OS</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── Errores por Sync ── */}
      {activeTab === "Errores por Sync" && (
        <div key={`errores-${tabKey}`} className="space-y-4">
          {!hasSyncHistory && (
            <InfoBanner text="Aún no hay syncs históricas registradas. Se mostrará el estado actual como referencia. El gráfico se irá llenando a medida que el proceso WUU.ps1 ejecute nuevas syncs." />
          )}
          <div className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-sm font-semibold text-zinc-200">
                {hasSyncHistory ? "Tendencia de errores por sincronización" : "Estado actual de servidores"}
              </h2>
              {hasSyncHistory && (
                <div className="flex flex-wrap items-center gap-2">
                  {(["all", "hoy", "semana", "mes", "custom"] as TrendFilter[]).map((f) => (
                    <button
                      key={f}
                      onClick={() => setTrendFilter(f)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                        trendFilter === f
                          ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                          : "text-zinc-500 border-zinc-700/50 hover:text-zinc-300"
                      }`}
                    >
                      {f === "all" ? "Todo" : f === "hoy" ? "Hoy" : f === "semana" ? "Semana" : f === "mes" ? "Mes" : "Rango"}
                    </button>
                  ))}
                  {trendFilter === "custom" && (
                    <div className="flex items-center gap-1.5">
                      <input
                        type="date"
                        value={trendFrom}
                        onChange={(e) => setTrendFrom(e.target.value)}
                        className="px-2 py-1 text-[11px] bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:border-indigo-500"
                      />
                      <span className="text-zinc-600 text-[11px]">a</span>
                      <input
                        type="date"
                        value={trendTo}
                        onChange={(e) => setTrendTo(e.target.value)}
                        className="px-2 py-1 text-[11px] bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
            {errorTrendData.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-12">Sin datos para el período seleccionado.</p>
            ) : (
              <ErrorTrendChart data={errorTrendData} />
            )}
          </div>
        </div>
      )}

      {/* ── Listado de Syncs — grouped by day ── */}
      {activeTab === "Listado de Syncs" && (
        <div key={`listado-${tabKey}`} className="space-y-3">
          {!hasSyncHistory && syncListDayGroups.length > 0 && (
            <InfoBanner text="No hay syncs históricas aún. Se muestra el estado actual de los servidores como snapshot de referencia." />
          )}
          {syncListDayGroups.length === 0 && (
            <div className="glass rounded-2xl p-12 text-center text-zinc-500">No hay datos disponibles.</div>
          )}
          {syncListDayGroups.map(({ day, runs, serverCount, totalSuccess, totalErrors, totalNoData, successRate, isSynthetic }) => {
            const isDayOpen = syncListExpandedDay === day;
            return (
              <div key={day} className="glass rounded-2xl overflow-hidden">
                {/* Day header */}
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
                  onClick={() => {
                    setSyncListExpandedDay(isDayOpen ? null : day);
                    if (isDayOpen) setExpandedSync(null);
                  }}
                >
                  <div className="flex items-center gap-3">
                    {isDayOpen
                      ? <ChevronDown className="w-4 h-4 text-indigo-400" />
                      : <ChevronRight className="w-4 h-4 text-zinc-500" />
                    }
                    <div className="text-left">
                      <p className="text-sm font-medium text-zinc-200 capitalize">
                        {isSynthetic ? "Estado actual (snapshot)" : formatDayHeader(day)}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {runs.length} sync{runs.length !== 1 ? "s" : ""} · {serverCount} servidores
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mr-2">
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-400">{successRate}%</p>
                      <p className="text-[10px] text-zinc-600">éxito</p>
                    </div>
                    <div className="hidden sm:flex gap-4 text-xs">
                      <span className="text-emerald-400">✓ {totalSuccess}</span>
                      <span className="text-rose-400">✕ {totalErrors}</span>
                      <span className="text-zinc-500">― {totalNoData}</span>
                    </div>
                  </div>
                </button>

                {/* Expanded: individual syncs in this day */}
                {isDayOpen && (
                  <div className="border-t border-zinc-800/60 divide-y divide-zinc-800/30">
                    {runs.map((run) => {
                      const isSyncOpen = expandedSync === run.id;
                      const syncTime = new Date(run.syncedAt).toLocaleTimeString("es-AR", {
                        hour: "2-digit", minute: "2-digit",
                      });
                      const syncRate = run.total > 0 ? Math.round((run.success / run.total) * 100) : 0;
                      return (
                        <div key={run.id}>
                          <button
                            className="w-full flex items-center justify-between px-6 py-3 hover:bg-white/[0.02] transition-colors text-left"
                            onClick={() => setExpandedSync(isSyncOpen ? null : run.id)}
                          >
                            <div className="flex items-center gap-3">
                              {isSyncOpen
                                ? <ChevronDown className="w-3.5 h-3.5 text-indigo-400" />
                                : <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                              }
                              <div>
                                <p className="text-xs font-medium text-zinc-300">
                                  {isSynthetic ? "Snapshot actual" : `Sync · ${syncTime}`}
                                </p>
                                <p className="text-[10px] text-zinc-600">{run.total} servidores</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 mr-2 text-[11px]">
                              <span className="text-emerald-400">✓ {run.success}</span>
                              <span className="text-rose-400">✕ {run.errors}</span>
                              <span className="text-zinc-500">― {run.noData}</span>
                              <span className="text-zinc-400">{syncRate}%</span>
                            </div>
                          </button>

                          {isSyncOpen && (
                            <div className="border-t border-zinc-800/60 px-6 py-4 bg-black/10">
                              <div className="overflow-auto max-h-72">
                                <table className="w-full text-xs text-left">
                                  <thead className="sticky top-0 bg-zinc-900 text-zinc-400 uppercase">
                                    <tr>
                                      <th className="px-3 py-2 font-medium">Servidor</th>
                                      <th className="px-3 py-2 font-medium">IP</th>
                                      <th className="px-3 py-2 font-medium">Estado</th>
                                      <th className="px-3 py-2 font-medium hidden md:table-cell">Error</th>
                                    </tr>
                                  </thead>
                                  <tbody className="divide-y divide-zinc-800/40">
                                    {run.records.map((r, idx) => (
                                      <tr key={`${r.serverName}-${idx}`} className="hover:bg-white/[0.02]">
                                        <td className="px-3 py-2 font-medium text-zinc-200">{r.serverName}</td>
                                        <td className="px-3 py-2 text-zinc-400">{r.ip ?? "—"}</td>
                                        <td className="px-3 py-2">
                                          {r.status === "ok" ? (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">OK</span>
                                          ) : r.status === "error" ? (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">Error</span>
                                          ) : (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-600/30">Sin datos</span>
                                          )}
                                        </td>
                                        <td className="px-3 py-2 text-rose-400/70 hidden md:table-cell text-[10px]">{r.errorDescription ?? "—"}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
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

      {/* ── Top Errores ── */}
      {activeTab === "Top Errores" && (
        <div key={`toperrores-${tabKey}`} className="glass rounded-2xl overflow-hidden">
          <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-800/60">
            <div className="flex-1">
              <h2 className="text-sm font-semibold text-zinc-200">
                {hasSyncHistory ? "Errores por mensaje" : "Errores actuales por mensaje"}
              </h2>
              {!hasSyncHistory && (
                <p className="text-[10px] text-zinc-600 mt-0.5">El historial se irá acumulando con cada sync del WUU.</p>
              )}
            </div>

            {/* Search + Autocomplete dropdown */}
            <div className="flex items-center gap-2">
              <div className="relative" ref={autocompleteRef}>
                <div className="relative">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
                  <input
                    type="text"
                    placeholder="Buscar error..."
                    value={errorSearch}
                    onChange={(e) => { setErrorSearch(e.target.value); setSelectedError(null); setAutocompleteOpen(true); }}
                    onFocus={() => setAutocompleteOpen(true)}
                    className="pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 w-52"
                  />
                  {errorSearch && (
                    <button
                      onClick={() => { setErrorSearch(""); setSelectedError(null); setAutocompleteOpen(false); }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-zinc-400 text-xs"
                    >
                      ✕
                    </button>
                  )}
                </div>

                {/* Autocomplete dropdown */}
                {autocompleteOpen && autocompleteSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 mt-1 w-80 bg-zinc-900 border border-zinc-700/60 rounded-xl shadow-xl z-50 overflow-hidden">
                    <p className="px-3 py-1.5 text-[10px] text-zinc-600 border-b border-zinc-800">
                      {autocompleteSuggestions.length} error{autocompleteSuggestions.length !== 1 ? "es" : ""} — click para filtrar
                    </p>
                    <div className="max-h-52 overflow-y-auto divide-y divide-zinc-800/40">
                      {autocompleteSuggestions.map((g) => (
                        <button
                          key={g.message}
                          className="w-full flex items-center justify-between px-3 py-2 hover:bg-white/[0.04] transition-colors text-left gap-2"
                          onClick={() => {
                            setErrorSearch(g.message);
                            setSelectedError(null);
                            setAutocompleteOpen(false);
                          }}
                        >
                          <span className="text-[11px] text-zinc-300 truncate flex-1">{g.message}</span>
                          <span className="text-[10px] text-rose-400 shrink-0 font-medium">{g.count} srv</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => setAutocompleteOpen((v) => !v)}
                title="Filtrar por error"
                className={`p-1.5 rounded-lg border transition-colors ${
                  autocompleteOpen
                    ? "bg-indigo-500/15 border-indigo-500/30 text-indigo-400"
                    : "border-zinc-700/50 text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <Filter className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {filteredErrorGroups.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-12">
              {errorSearch ? "Sin coincidencias." : "Sin errores registrados."}
            </p>
          ) : (
            <div className="divide-y divide-zinc-800/40">
              {filteredErrorGroups.map((g, i) => {
                const isSelected = selectedError === g.message;
                const stamp = new Date().toISOString().slice(0, 16).replace("T", "_").replace(":", "");

                const buildRows = (): ExportRow[] => g.servers.map((srv) => {
                  const s = enrichedServers.find((e) => e.serverName === srv);
                  return {
                    servidor: srv,
                    dominio: "—",
                    ip: s?.ip ?? "—",
                    tipo: s?.info?.type ?? "Sin clasificar",
                    ambiente: s?.info?.ambiente ?? "—",
                    os: s?.os && s.os !== "N/A" ? s.os : "—",
                    fechaInstalacion: s?.installDate ?? "—",
                    kbsInstaladas: s?.installedKBs ?? "—",
                    fechaReinicio: "—",
                    estado: "Error",
                    error: g.message,
                  };
                });

                return (
                  <div key={g.message}>
                    <button
                      className="w-full flex items-start gap-3 px-5 py-3 hover:bg-white/[0.02] transition-colors text-left"
                      onClick={() => setSelectedError(isSelected ? null : g.message)}
                    >
                      <span className={`text-xs font-bold w-5 text-center mt-0.5 shrink-0 ${i < 3 ? "text-rose-400" : "text-zinc-600"}`}>
                        #{i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-zinc-300 break-words">{g.message}</p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 ml-3">
                        <div className="text-right">
                          <p className="text-sm font-bold text-rose-400">{g.count}</p>
                          <p className="text-[10px] text-zinc-600">servidor{g.count !== 1 ? "es" : ""}</p>
                        </div>
                        {isSelected
                          ? <ChevronDown className="w-4 h-4 text-indigo-400" />
                          : <ChevronRight className="w-4 h-4 text-zinc-600" />
                        }
                      </div>
                    </button>

                    {isSelected && (
                      <div className="px-5 pb-4 bg-zinc-900/40">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[10px] text-zinc-500">{g.servers.length} servidor{g.servers.length !== 1 ? "es" : ""} con este error</p>
                          <div className="flex gap-1.5">
                            <button
                              onClick={() => downloadCSV(buildRows(), `error_${stamp}.csv`)}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-medium hover:bg-indigo-600/30 transition-colors"
                            >
                              <Download className="w-3 h-3" /> CSV
                            </button>
                            <button
                              onClick={() => downloadPDF(buildRows(), `error_${stamp}.pdf`, `Error: ${g.message.slice(0, 60)}`)}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 text-[10px] font-medium hover:bg-indigo-600/30 transition-colors"
                            >
                              <Download className="w-3 h-3" /> PDF
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-1">
                          {g.servers.map((srv) => (
                            <div key={srv} className="px-2 py-1 rounded bg-zinc-800/60 text-[10px] text-zinc-300 font-mono truncate" title={srv}>
                              {srv}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function InfoBanner({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-indigo-300">
      <Info className="w-4 h-4 shrink-0 mt-0.5" />
      <p>{text}</p>
    </div>
  );
}
