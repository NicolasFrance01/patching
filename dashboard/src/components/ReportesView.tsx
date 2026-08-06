"use client";

import { useMemo, useState, useEffect, memo, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from "recharts";
import { getServerInfo, SERVER_TYPES, ServerType } from "@/lib/serverTypeMap";
import { ChevronDown, ChevronRight, Info, Search, Download, Filter, Mail, Calendar, ArrowRightLeft, CheckCircle, AlertCircle, PlusCircle, MinusCircle, TrendingUp } from "lucide-react";
import { downloadCSV, downloadPDF, ExportRow } from "@/lib/exportUtils";
import EmailModal, { EmailPayload } from "./EmailModal";

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
type BankFilter = "all" | ServerType | "unclassified";
type EvolutionPreset = "15d" | "30d" | "custom";

const TABS = ["Por Tipo", "Errores por Sync", "Listado de Syncs", "Top Errores", "Evoluciones"] as const;
type Tab = (typeof TABS)[number];

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

/** Returns true if server matches any of the active bank filters */
function matchesBankFilter(serverName: string, selectedBanks: BankFilter[]): boolean {
  if (selectedBanks.includes("all")) return true;
  const info = getServerInfo(serverName);
  const bank = info ? info.type : "unclassified";
  return selectedBanks.includes(bank as BankFilter);
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

const MultiBankTrendChart = memo(function MultiBankTrendChart({
  data,
  activeBanks,
}: {
  data: any[];
  activeBanks: string[];
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{ height: 320 }}>
      {mounted && (
        <ResponsiveContainer width="99%" height={320}>
          <LineChart data={data} margin={{ top: 8, right: 8, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
            <XAxis dataKey="label" tick={{ fontSize: 11, fill: "#71717a" }} />
            <YAxis tick={{ fontSize: 11, fill: "#71717a" }} />
            <Tooltip {...tooltipStyle} />
            <Legend formatter={(v) => <span className="text-zinc-400 text-xs">{v}</span>} />
            {activeBanks.length === 1 && activeBanks[0] === "all" ? (
              <>
                <Line type="monotone" dataKey="errores" name="Errores totales" stroke="#ef4444" strokeWidth={2} dot={{ r: 4 }} />
                <Line type="monotone" dataKey="ok" name="OK totales" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
              </>
            ) : (
              activeBanks.map((b) => (
                <Line
                  key={b}
                  type="monotone"
                  dataKey={`err_${b}`}
                  name={`Errores ${b === "unclassified" ? "Sin clasificar" : b}`}
                  stroke={TYPE_COLORS[b === "unclassified" ? "Sin clasificar" : b] ?? "#a855f7"}
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                />
              ))
            )}
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
  const [emailPayload, setEmailPayload] = useState<EmailPayload | null>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Multi-bank selection state
  const [selectedBanks, setSelectedBanks] = useState<BankFilter[]>(["all"]);

  // Errores por Sync date filter
  const [trendFilter, setTrendFilter] = useState<TrendFilter>("all");
  const [trendFrom, setTrendFrom] = useState("");
  const [trendTo, setTrendTo] = useState("");

  // Evoluciones state
  const [evoPreset, setEvoPreset] = useState<EvolutionPreset>("15d");
  const [evoFrom, setEvoFrom] = useState("");
  const [evoTo, setEvoTo] = useState("");
  const [evoSearch, setEvoSearch] = useState("");

  const hasSyncHistory = data.syncRuns.length > 0;

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    setTabKey((k) => k + 1);
  };

  const handleBankToggle = (val: BankFilter) => {
    setSelectedBanks((prev) => {
      if (val === "all") return ["all"];
      const withoutAll = prev.filter((b) => b !== "all");
      if (withoutAll.includes(val)) {
        const next = withoutAll.filter((b) => b !== val);
        return next.length === 0 ? ["all"] : next;
      } else {
        return [...withoutAll, val];
      }
    });
    setTabKey((k) => k + 1);
  };

  // Close autocomplete on click outside
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

  // Filtered enriched servers based on active multi-bank selection
  const filteredEnrichedServers = useMemo(() =>
    enrichedServers.filter((s) => matchesBankFilter(s.serverName, selectedBanks)),
    [enrichedServers, selectedBanks]
  );

  const unclassifiedServers = useMemo(
    () => filteredEnrichedServers.filter((s) => !s.info),
    [filteredEnrichedServers]
  );

  // Active bank list for multi-select rendering
  const activeBankList = useMemo(() => {
    if (selectedBanks.includes("all")) return ["all"];
    return selectedBanks;
  }, [selectedBanks]);

  // ── Por Tipo ──────────────────────────────────────────────────────────────
  const byTypeData = useMemo((): ByTypeItem[] => {
    const counts: Record<string, { total: number; ok: number; error: number; nodata: number }> = {};
    const typesToShow = selectedBanks.includes("all")
      ? [...SERVER_TYPES, "Sin clasificar"]
      : selectedBanks.map((b) => (b === "unclassified" ? "Sin clasificar" : b));

    typesToShow.forEach((t) => { counts[t] = { total: 0, ok: 0, error: 0, nodata: 0 }; });

    for (const s of filteredEnrichedServers) {
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
  }, [filteredEnrichedServers, selectedBanks]);

  // ── Errores por Sync ──────────────────────────────────────────────────────
  const errorTrendData = useMemo(() => {
    if (!hasSyncHistory) {
      const ok = filteredEnrichedServers.filter((s) => !s.isError && !s.isNoData).length;
      const errores = filteredEnrichedServers.filter((s) => s.isError).length;
      const sinDatos = filteredEnrichedServers.filter((s) => s.isNoData).length;
      return [{ label: "Estado actual", errores, ok, sinDatos, total: filteredEnrichedServers.length }];
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

    const dayMap: Record<string, SyncRunData> = {};
    for (const run of runs) {
      const key = toLocalDayKey(run.syncedAt);
      if (!dayMap[key] || new Date(run.syncedAt) > new Date(dayMap[key].syncedAt)) {
        dayMap[key] = run;
      }
    }

    return Object.entries(dayMap)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([, run]) => {
        const filteredRecords = run.records.filter((r) => matchesBankFilter(r.serverName, selectedBanks));
        const errores = filteredRecords.filter((r) => r.status === "error").length;
        const ok = filteredRecords.filter((r) => r.status === "ok").length;

        const row: any = {
          label: new Date(run.syncedAt).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
          errores,
          ok,
          total: filteredRecords.length,
        };

        // If specific banks selected, compute errors per bank for parallel lines
        if (!selectedBanks.includes("all")) {
          for (const b of selectedBanks) {
            const bankRecords = filteredRecords.filter((r) => {
              const inf = getServerInfo(r.serverName);
              const bKey = inf ? inf.type : "unclassified";
              return bKey === b;
            });
            row[`err_${b}`] = bankRecords.filter((r) => r.status === "error").length;
          }
        }

        return row;
      })
      .filter((d) => d.total > 0);
  }, [data.syncRuns, filteredEnrichedServers, hasSyncHistory, trendFilter, trendFrom, trendTo, selectedBanks]);

  // ── Top Errores ───────────────────────────────────────────────────────────
  const errorGroups = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    if (hasSyncHistory) {
      for (const run of data.syncRuns) {
        for (const r of run.records) {
          if (!matchesBankFilter(r.serverName, selectedBanks)) continue;
          if (r.status === "error" && r.errorDescription) {
            if (!map[r.errorDescription]) map[r.errorDescription] = new Set();
            map[r.errorDescription].add(r.serverName);
          }
        }
      }
    } else {
      for (const s of filteredEnrichedServers) {
        if (s.isError && s.errorDescription) {
          if (!map[s.errorDescription]) map[s.errorDescription] = new Set();
          map[s.errorDescription].add(s.serverName);
        }
      }
    }
    return Object.entries(map)
      .map(([message, servers]) => ({ message, servers: Array.from(servers).sort(), count: servers.size }))
      .sort((a, b) => b.count - a.count);
  }, [data.syncRuns, filteredEnrichedServers, hasSyncHistory, selectedBanks]);

  const filteredErrorGroups = useMemo(() => {
    if (!errorSearch) return errorGroups;
    return errorGroups.filter((g) => g.message.toLowerCase().includes(errorSearch.toLowerCase()));
  }, [errorGroups, errorSearch]);

  const autocompleteSuggestions = useMemo(() => {
    const q = errorSearch.toLowerCase();
    return errorGroups.filter((g) => !q || g.message.toLowerCase().includes(q)).slice(0, 8);
  }, [errorGroups, errorSearch]);

  // ── Listado Syncs ─────────────────────────────────────────────────────────
  const syncListDayGroups = useMemo(() => {
    const runs: SyncRunData[] = hasSyncHistory ? data.syncRuns : (() => {
      if (filteredEnrichedServers.length === 0) return [];
      const ok = filteredEnrichedServers.filter((s) => !s.isError && !s.isNoData).length;
      const errors = filteredEnrichedServers.filter((s) => s.isError).length;
      const noData = filteredEnrichedServers.filter((s) => s.isNoData).length;
      return [{
        id: "snapshot-current",
        syncedAt: data.currentServers[0]?.updatedAt ?? new Date().toISOString(),
        total: filteredEnrichedServers.length,
        success: ok,
        errors,
        noData,
        records: filteredEnrichedServers.map((s) => ({
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
        const latestFiltered = latest.records.filter((r) => matchesBankFilter(r.serverName, selectedBanks));
        const latestSuccess = latestFiltered.filter((r) => r.status === "ok").length;
        const latestTotal = latestFiltered.length;

        const totalSuccess = dayRuns.reduce((acc, r) => {
          return acc + r.records.filter((rec) => matchesBankFilter(rec.serverName, selectedBanks) && rec.status === "ok").length;
        }, 0);
        const totalErrors = dayRuns.reduce((acc, r) => {
          return acc + r.records.filter((rec) => matchesBankFilter(rec.serverName, selectedBanks) && rec.status === "error").length;
        }, 0);

        return {
          day,
          runs: sorted,
          serverCount: latestTotal,
          totalSuccess,
          totalErrors,
          successRate: latestTotal > 0 ? Math.round((latestSuccess / latestTotal) * 100) : 0,
          isSynthetic: dayRuns[0]?.id === "snapshot-current",
        };
      })
      .filter((g) => g.serverCount > 0);
  }, [data.syncRuns, filteredEnrichedServers, hasSyncHistory, data.currentServers, selectedBanks]);

  // ── EVOLUCIONES COMPUTE ───────────────────────────────────────────────────
  const evolucionesData = useMemo(() => {
    const now = new Date();
    let targetDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    if (evoPreset === "30d") {
      targetDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (evoPreset === "custom" && evoFrom) {
      targetDate = new Date(evoFrom);
    }

    // Find run closest to targetDate
    let pastRun: SyncRunData | null = null;
    if (data.syncRuns.length > 0) {
      let minDiff = Infinity;
      for (const run of data.syncRuns) {
        const diff = Math.abs(new Date(run.syncedAt).getTime() - targetDate.getTime());
        if (diff < minDiff) {
          minDiff = diff;
          pastRun = run;
        }
      }
    }

    // Current state records filtered by active bank
    const currentRecordsMap = new Map<string, typeof enrichedServers[0]>();
    filteredEnrichedServers.forEach((s) => currentRecordsMap.set(s.serverName, s));

    // Past state records filtered by active bank
    const pastRecordsMap = new Map<string, { status: string; errorDescription: string | null; ip: string | null }>();
    if (pastRun) {
      pastRun.records.forEach((r) => {
        if (matchesBankFilter(r.serverName, selectedBanks)) {
          pastRecordsMap.set(r.serverName, r);
        }
      });
    }

    // Diffs calculation
    const solucionados: Array<{ serverName: string; ip: string | null; pastError: string; bank: string }> = [];
    const nuevosErrores: Array<{ serverName: string; ip: string | null; currentError: string; isRecurring: boolean; bank: string }> = [];
    const nuevosServidores: Array<{ serverName: string; ip: string | null; status: string; bank: string }> = [];
    const servidoresInactivos: Array<{ serverName: string; ip: string | null; pastStatus: string; bank: string }> = [];

    // Check current servers vs past
    for (const [sName, sCurr] of currentRecordsMap.entries()) {
      const past = pastRecordsMap.get(sName);
      const bank = sCurr.info ? sCurr.info.type : "Sin clasificar";

      if (!past) {
        nuevosServidores.push({
          serverName: sName,
          ip: sCurr.ip,
          status: sCurr.isError ? "Error" : sCurr.isNoData ? "Sin datos" : "OK",
          bank,
        });
      } else {
        const wasError = past.status === "error";
        const isError = sCurr.isError;

        if (wasError && !isError) {
          solucionados.push({
            serverName: sName,
            ip: sCurr.ip,
            pastError: past.errorDescription ?? "Error previo resuelto",
            bank,
          });
        } else if (isError) {
          nuevosErrores.push({
            serverName: sName,
            ip: sCurr.ip,
            currentError: sCurr.errorDescription ?? "Error detectado",
            isRecurring: wasError,
            bank,
          });
        }
      }
    }

    // Check past servers missing currently
    for (const [pName, pRec] of pastRecordsMap.entries()) {
      if (!currentRecordsMap.has(pName)) {
        const inf = getServerInfo(pName);
        const bank = inf ? inf.type : "Sin clasificar";
        servidoresInactivos.push({
          serverName: pName,
          ip: pRec.ip,
          pastStatus: pRec.status === "error" ? "Error" : "OK",
          bank,
        });
      }
    }

    const pastTotal = pastRecordsMap.size;
    const pastErrors = Array.from(pastRecordsMap.values()).filter((r) => r.status === "error").length;
    const pastOk = Array.from(pastRecordsMap.values()).filter((r) => r.status === "ok").length;
    const pastSuccessRate = pastTotal > 0 ? Math.round((pastOk / pastTotal) * 100) : 0;

    const currentTotal = currentRecordsMap.size;
    const currentErrors = Array.from(currentRecordsMap.values()).filter((s) => s.isError).length;
    const currentOk = Array.from(currentRecordsMap.values()).filter((s) => !s.isError && !s.isNoData).length;
    const currentSuccessRate = currentTotal > 0 ? Math.round((currentOk / currentTotal) * 100) : 0;

    return {
      pastDateLabel: pastRun ? new Date(pastRun.syncedAt).toLocaleDateString("es-AR") : "Sin historial previo",
      pastTotal, pastErrors, pastOk, pastSuccessRate,
      currentTotal, currentErrors, currentOk, currentSuccessRate,
      solucionados, nuevosErrores, nuevosServidores, servidoresInactivos,
    };
  }, [data.syncRuns, filteredEnrichedServers, evoPreset, evoFrom, selectedBanks]);

  return (
    <div className="space-y-4">
      {/* ── Multi-Bank Selection Bar with Color Legend ── */}
      <div className="glass rounded-xl px-4 py-3 space-y-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-zinc-500 font-medium mr-1 shrink-0">Banco(s):</span>
          {BANK_CHIPS.map(({ label, value }) => {
            const color = value !== "all" ? (value === "unclassified" ? TYPE_COLORS["Sin clasificar"] : TYPE_COLORS[value as string]) : null;
            const isActive = selectedBanks.includes(value);
            return (
              <button
                key={value}
                onClick={() => handleBankToggle(value)}
                className={`px-3 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                  isActive
                    ? "text-white border-transparent shadow-md"
                    : "text-zinc-400 border-zinc-700/50 hover:text-zinc-200 hover:border-zinc-600"
                }`}
                style={
                  isActive && color
                    ? { backgroundColor: color + "33", borderColor: color + "66", color }
                    : isActive
                    ? { backgroundColor: "#6366f133", borderColor: "#6366f166", color: "#a5b4fc" }
                    : {}
                }
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Visual Color Legend */}
        {!selectedBanks.includes("all") && (
          <div className="flex flex-wrap items-center gap-3 pt-1 border-t border-zinc-800/60 text-[10px]">
            <span className="text-zinc-500">Diferenciación por color:</span>
            {selectedBanks.map((b) => {
              const label = b === "unclassified" ? "Sin clasificar" : b;
              const color = TYPE_COLORS[label] ?? "#a855f7";
              return (
                <div key={b} className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-zinc-900 border border-zinc-800">
                  <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: color }} />
                  <span className="font-medium" style={{ color }}>{label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1 p-1 bg-zinc-900 rounded-xl w-fit border border-zinc-800">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === tab ? "bg-indigo-600 text-white shadow-lg" : "text-zinc-400 hover:text-zinc-200"
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
                const color = TYPE_COLORS[d.name] ?? "#6366f1";
                return (
                  <div key={d.name}>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium w-24 shrink-0" style={{ color }}>{d.name}</span>
                      <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${d.successRate}%`, backgroundColor: color }} />
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
            <InfoBanner text="Aún no hay syncs históricas registradas. Se mostrará el estado actual como referencia." />
          )}
          <div className="glass rounded-2xl p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-sm font-semibold text-zinc-200">
                Tendencia de errores {!selectedBanks.includes("all") ? `(${selectedBanks.join(", ")})` : ""}
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
                </div>
              )}
            </div>
            {errorTrendData.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-12">Sin datos para el período y banco seleccionados.</p>
            ) : (
              <MultiBankTrendChart data={errorTrendData} activeBanks={activeBankList} />
            )}
          </div>
        </div>
      )}

      {/* ── Listado de Syncs ── */}
      {activeTab === "Listado de Syncs" && (
        <div key={`listado-${tabKey}`} className="space-y-3">
          {syncListDayGroups.map(({ day, runs, serverCount, totalSuccess, totalErrors, successRate, isSynthetic }) => {
            const isDayOpen = syncListExpandedDay === day;
            return (
              <div key={day} className="glass rounded-2xl overflow-hidden">
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
                      <p className="text-xs text-zinc-500">{runs.length} sync(s) · {serverCount} servidores</p>
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
                    </div>
                  </div>
                </button>

                {isDayOpen && (
                  <div className="border-t border-zinc-800/60 divide-y divide-zinc-800/30">
                    {runs.map((run) => {
                      const isSyncOpen = expandedSync === run.id;
                      const filteredRunRecords = run.records.filter((r) => matchesBankFilter(r.serverName, selectedBanks));
                      const filteredSuccess = filteredRunRecords.filter((r) => r.status === "ok").length;
                      const filteredErrors = filteredRunRecords.filter((r) => r.status === "error").length;
                      return (
                        <div key={run.id}>
                          <button
                            className="w-full flex items-center justify-between px-6 py-3 hover:bg-white/[0.02] transition-colors text-left"
                            onClick={() => setExpandedSync(isSyncOpen ? null : run.id)}
                          >
                            <span className="text-xs font-medium text-zinc-300">Sync {new Date(run.syncedAt).toLocaleTimeString("es-AR")}</span>
                            <div className="flex items-center gap-4 text-[11px]">
                              <span className="text-emerald-400">✓ {filteredSuccess}</span>
                              <span className="text-rose-400">✕ {filteredErrors}</span>
                            </div>
                          </button>
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
        <div key={`toperrores-${tabKey}`} className="glass rounded-2xl overflow-hidden p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-200">Errores agrupados por mensaje</h2>
            <input
              type="text"
              placeholder="Buscar error..."
              value={errorSearch}
              onChange={(e) => setErrorSearch(e.target.value)}
              className="px-3 py-1.5 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs text-zinc-300 w-52"
            />
          </div>
          <div className="divide-y divide-zinc-800/40">
            {filteredErrorGroups.map((g, i) => (
              <div key={g.message} className="py-3 flex items-start justify-between gap-3">
                <div>
                  <span className="text-xs text-zinc-300 font-medium">#{i + 1} {g.message}</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {g.servers.slice(0, 10).map((srv) => {
                      const inf = getServerInfo(srv);
                      const bankLabel = inf ? inf.type : "Sin clasificar";
                      const color = TYPE_COLORS[bankLabel] ?? "#6b7280";
                      return (
                        <span key={srv} className="px-1.5 py-0.5 rounded text-[9px] bg-zinc-900 border" style={{ color, borderColor: color + "44" }}>
                          {srv} ({bankLabel})
                        </span>
                      );
                    })}
                  </div>
                </div>
                <span className="text-rose-400 text-xs font-bold shrink-0">{g.count} srv</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── EVOLUCIONES (NUEVA SOLAPA) ── */}
      {activeTab === "Evoluciones" && (
        <div key={`evoluciones-${tabKey}`} className="space-y-5">
          {/* Controls bar */}
          <div className="glass rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-semibold text-zinc-200">Período de comparación:</span>
            </div>
            <div className="flex items-center gap-2">
              {(["15d", "30d", "custom"] as EvolutionPreset[]).map((p) => (
                <button
                  key={p}
                  onClick={() => setEvoPreset(p)}
                  className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
                    evoPreset === p
                      ? "bg-indigo-600 text-white border-transparent shadow"
                      : "text-zinc-400 border-zinc-800 hover:text-zinc-200"
                  }`}
                >
                  {p === "15d" ? "Hace 15 días" : p === "30d" ? "Hace 1 mes" : "Personalizado"}
                </button>
              ))}
              {evoPreset === "custom" && (
                <input
                  type="date"
                  value={evoFrom}
                  onChange={(e) => setEvoFrom(e.target.value)}
                  className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-300"
                />
              )}
            </div>
          </div>

          {/* Comparative Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="glass rounded-2xl p-5 border-l-4 border-l-zinc-500">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Estado Histórico ({evolucionesData.pastDateLabel})</span>
                <span className="text-xs font-bold text-zinc-300">{evolucionesData.pastTotal} Servidores</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-base font-bold text-emerald-400">{evolucionesData.pastOk}</p>
                  <p className="text-[10px] text-zinc-500">OK ({evolucionesData.pastSuccessRate}%)</p>
                </div>
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <p className="text-base font-bold text-rose-400">{evolucionesData.pastErrors}</p>
                  <p className="text-[10px] text-zinc-500">Errores</p>
                </div>
                <div className="p-2 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                  <p className="text-base font-bold text-zinc-300">{evolucionesData.pastTotal - evolucionesData.pastOk - evolucionesData.pastErrors}</p>
                  <p className="text-[10px] text-zinc-500">Sin datos</p>
                </div>
              </div>
            </div>

            <div className="glass rounded-2xl p-5 border-l-4 border-l-indigo-500">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">Estado Actual</span>
                <span className="text-xs font-bold text-zinc-200">{evolucionesData.currentTotal} Servidores</span>
              </div>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <p className="text-base font-bold text-emerald-400">{evolucionesData.currentOk}</p>
                  <p className="text-[10px] text-zinc-500">OK ({evolucionesData.currentSuccessRate}%)</p>
                </div>
                <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20">
                  <p className="text-base font-bold text-rose-400">{evolucionesData.currentErrors}</p>
                  <p className="text-[10px] text-zinc-500">Errores</p>
                </div>
                <div className="p-2 rounded-xl bg-zinc-800/60 border border-zinc-700/50">
                  <p className="text-base font-bold text-zinc-300">{evolucionesData.currentTotal - evolucionesData.currentOk - evolucionesData.currentErrors}</p>
                  <p className="text-[10px] text-zinc-500">Sin datos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Differences Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Errores Solucionados */}
            <div className="glass rounded-2xl p-5 border border-emerald-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-emerald-400 uppercase">Errores Solucionados ({evolucionesData.solucionados.length})</h3>
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {evolucionesData.solucionados.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">Sin errores resueltos en este período.</p>
                ) : (
                  evolucionesData.solucionados.map((item) => (
                    <div key={item.serverName} className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/15 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-zinc-200">{item.serverName} <span className="text-[10px] text-emerald-400 font-normal">({item.bank})</span></p>
                        <p className="text-[10px] text-zinc-500 truncate max-w-xs">{item.pastError}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-500/20 text-emerald-300 font-bold">Solucionado</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Nuevos / Reincidentes Errores */}
            <div className="glass rounded-2xl p-5 border border-rose-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-bold text-rose-400 uppercase">Errores Actuales ({evolucionesData.nuevosErrores.length})</h3>
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {evolucionesData.nuevosErrores.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">¡Sin errores reportados actualmente!</p>
                ) : (
                  evolucionesData.nuevosErrores.map((item) => (
                    <div key={item.serverName} className="p-2 rounded-lg bg-rose-500/5 border border-rose-500/15 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-zinc-200">{item.serverName} <span className="text-[10px] text-rose-400 font-normal">({item.bank})</span></p>
                        <p className="text-[10px] text-zinc-400 truncate max-w-xs">{item.currentError}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold ${item.isRecurring ? "bg-rose-500/20 text-rose-300" : "bg-amber-500/20 text-amber-300"}`}>
                        {item.isRecurring ? "Reincidente" : "Nuevo error"}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Nuevos Servidores */}
            <div className="glass rounded-2xl p-5 border border-indigo-500/20">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <PlusCircle className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold text-indigo-400 uppercase">Nuevos Servidores Ingresados ({evolucionesData.nuevosServidores.length})</h3>
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {evolucionesData.nuevosServidores.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">Sin nuevos servidores agregados.</p>
                ) : (
                  evolucionesData.nuevosServidores.map((item) => (
                    <div key={item.serverName} className="p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/15 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-zinc-200">{item.serverName} <span className="text-[10px] text-indigo-400 font-normal">({item.bank})</span></p>
                        <p className="text-[10px] text-zinc-500">IP: {item.ip ?? "N/A"}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] bg-indigo-500/20 text-indigo-300 font-bold">Nuevo ({item.status})</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Servidores Inactivos / Removidos */}
            <div className="glass rounded-2xl p-5 border border-zinc-700/50">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <MinusCircle className="w-4 h-4 text-zinc-500" />
                  <h3 className="text-xs font-bold text-zinc-400 uppercase">Servidores Removidos / Inactivos ({evolucionesData.servidoresInactivos.length})</h3>
                </div>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {evolucionesData.servidoresInactivos.length === 0 ? (
                  <p className="text-xs text-zinc-500 py-4 text-center">Sin servidores removidos en este período.</p>
                ) : (
                  evolucionesData.servidoresInactivos.map((item) => (
                    <div key={item.serverName} className="p-2 rounded-lg bg-zinc-800/40 border border-zinc-700/40 flex items-center justify-between text-xs">
                      <div>
                        <p className="font-semibold text-zinc-400">{item.serverName} <span className="text-[10px] text-zinc-500">({item.bank})</span></p>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[9px] bg-zinc-700/40 text-zinc-400 font-bold">Inactivo</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
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

function InfoBanner({ text }: { text: string }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 rounded-xl bg-indigo-500/5 border border-indigo-500/20 text-xs text-indigo-300">
      <Info className="w-4 h-4 shrink-0 mt-0.5" />
      <p>{text}</p>
    </div>
  );
}
