"use client";

import { useMemo, useState, useEffect, memo, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid,
} from "recharts";
import { getServerInfo, SERVER_TYPES, ServerType } from "@/lib/serverTypeMap";
import {
  ChevronDown, ChevronRight, Info, Search, Download, Filter, Mail,
  Calendar, CheckCircle, AlertCircle, PlusCircle, MinusCircle,
  TrendingUp, X, CheckCircle2, XCircle, AlertTriangle, FileText, Send
} from "lucide-react";
import { downloadCSV, downloadPDF, downloadFullReportPDF, FullReportPDFPayload, ExportRow } from "@/lib/exportUtils";
import EmailModal, { EmailPayload } from "./EmailModal";

interface SyncRunData {
  id: string;
  syncedAt: string;
  total: number;
  success: number;
  errors: number;
  noData: number;
  records: { serverName: string; ip: string | null; status: string; errorDescription: string | null; os?: string | null; installedKBs?: string | null }[];
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

type TimeFilter = "all" | "hoy" | "semana" | "mes" | "custom";
type BankFilter = "all" | ServerType | "unclassified";

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

function matchesBankFilter(serverName: string, selectedBanks: BankFilter[]): boolean {
  if (selectedBanks.includes("all")) return true;
  const info = getServerInfo(serverName);
  const bank = info ? info.type : "unclassified";
  return selectedBanks.includes(bank as BankFilter);
}

function isDateInRange(isoDate: string, timeFilter: TimeFilter, fromStr: string, toStr: string): boolean {
  if (timeFilter === "all") return true;
  const d = new Date(isoDate);
  const now = new Date();

  if (timeFilter === "hoy") {
    return toLocalDayKey(isoDate) === toLocalDayKey(now.toISOString());
  }
  if (timeFilter === "semana") {
    const cutoff = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    return d >= cutoff;
  }
  if (timeFilter === "mes") {
    const cutoff = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    return d >= cutoff;
  }
  if (timeFilter === "custom") {
    let from = fromStr ? new Date(fromStr) : new Date(0);
    let to = toStr ? new Date(toStr) : new Date();
    to.setHours(23, 59, 59, 999);
    return d >= from && d <= to;
  }
  return true;
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

/* Modal de Justificación de Métricas KPI */
interface MetricModalData {
  title: string;
  subtitle: string;
  metricType: "total" | "ok" | "errors" | "nodata";
  panelName: string;
  servers: Array<{
    serverName: string;
    ip: string | null;
    os: string | null;
    installedKBs: string | null;
    errorDescription: string | null;
    status: string;
    bank: string;
    justification: string;
  }>;
}

function MetricDetailModal({
  isOpen,
  onClose,
  modalData,
}: {
  isOpen: boolean;
  onClose: () => void;
  modalData: MetricModalData | null;
}) {
  const [search, setSearch] = useState("");
  if (!isOpen || !modalData) return null;

  const filtered = modalData.servers.filter(
    (s) =>
      s.serverName.toLowerCase().includes(search.toLowerCase()) ||
      (s.ip ?? "").includes(search) ||
      s.bank.toLowerCase().includes(search.toLowerCase()) ||
      (s.errorDescription ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="glass rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-zinc-700/80 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60">
          <div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              {modalData.title}
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">{modalData.subtitle}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Toolbar */}
        <div className="px-6 py-3 border-b border-zinc-800/60 bg-black/20 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar servidor, IP, banco..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-zinc-900 border border-zinc-700/60 rounded-lg text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <span className="text-xs text-zinc-400">
            Mostrando <strong className="text-white">{filtered.length}</strong> de {modalData.servers.length} servidores
          </span>
        </div>

        {/* Modal Table Content */}
        <div className="flex-1 overflow-auto p-6 space-y-3">
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-xs text-left">
              <thead className="sticky top-0 bg-zinc-950 text-zinc-400 uppercase border-b border-zinc-800">
                <tr>
                  <th className="px-3 py-2.5 font-semibold">Servidor</th>
                  <th className="px-3 py-2.5 font-semibold">Banco</th>
                  <th className="px-3 py-2.5 font-semibold">IP</th>
                  <th className="px-3 py-2.5 font-semibold">Estado</th>
                  <th className="px-3 py-2.5 font-semibold">Justificación / Motivo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filtered.map((s, idx) => {
                  const color = TYPE_COLORS[s.bank] ?? "#a855f7";
                  return (
                    <tr key={`${s.serverName}-${idx}`} className="hover:bg-white/[0.02]">
                      <td className="px-3 py-2.5 font-medium text-zinc-200 whitespace-nowrap">{s.serverName}</td>
                      <td className="px-3 py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold border" style={{ color, borderColor: color + "44", backgroundColor: color + "15" }}>
                          {s.bank}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-zinc-400 whitespace-nowrap">{s.ip ?? "—"}</td>
                      <td className="px-3 py-2.5">
                        {s.status === "ok" ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">OK</span>
                        ) : s.status === "error" ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/20">Error</span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-zinc-500/10 text-zinc-400 border border-zinc-600/30">Sin datos</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-zinc-300 text-[11px] min-w-[260px]">
                        <span className="block p-1.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-400">
                          {s.justification}
                        </span>
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-zinc-500">
                      No se encontraron servidores con ese filtro.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-zinc-800 bg-zinc-900/80 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-500 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ReportesView({ data }: ReportesViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Por Tipo");
  const [expandedSync, setExpandedSync] = useState<string | null>(null);
  const [syncListExpandedDay, setSyncListExpandedDay] = useState<string | null>(null);
  const [showUnclassified, setShowUnclassified] = useState(false);
  const [tabKey, setTabKey] = useState(0);
  const [errorSearch, setErrorSearch] = useState("");
  const [emailPayload, setEmailPayload] = useState<EmailPayload | null>(null);
  const autocompleteRef = useRef<HTMLDivElement>(null);

  // Multi-bank selection state
  const [selectedBanks, setSelectedBanks] = useState<BankFilter[]>(["all"]);

  // Unified Time Filter State across ALL modules
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [trendFrom, setTrendFrom] = useState("");
  const [trendTo, setTrendTo] = useState("");

  // Card Bank Sub-tab Filter States inside Evoluciones cards
  const [solucionadosBank, setSolucionadosBank] = useState<string | null>(null);
  const [erroresBank, setErroresBank] = useState<string | null>(null);
  const [nuevosBank, setNuevosBank] = useState<string | null>(null);
  const [inactivosBank, setInactivosBank] = useState<string | null>(null);

  // Modal State for KPI metrics
  const [metricModalOpen, setMetricModalOpen] = useState(false);
  const [metricModalData, setMetricModalData] = useState<MetricModalData | null>(null);

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

  const enrichedServers = useMemo(() =>
    data.currentServers.map((s) => ({
      ...s,
      info: getServerInfo(s.serverName, s.ip),
      isError: !!(s.errorDescription && s.errorDescription !== "N/A"),
      isNoData: (!s.os || s.os === "N/A") && !(s.errorDescription && s.errorDescription !== "N/A"),
    })),
    [data.currentServers]
  );

  const filteredEnrichedServers = useMemo(() =>
    enrichedServers.filter(
      (s) => matchesBankFilter(s.serverName, selectedBanks) && isDateInRange(s.updatedAt, timeFilter, trendFrom, trendTo)
    ),
    [enrichedServers, selectedBanks, timeFilter, trendFrom, trendTo]
  );

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
      return [{ label: "Estado actual", errores, ok, total: filteredEnrichedServers.length }];
    }

    let runs = data.syncRuns.filter((r) => isDateInRange(r.syncedAt, timeFilter, trendFrom, trendTo));

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
  }, [data.syncRuns, filteredEnrichedServers, hasSyncHistory, timeFilter, trendFrom, trendTo, selectedBanks]);

  // ── Top Errores ───────────────────────────────────────────────────────────
  const errorGroups = useMemo(() => {
    const map: Record<string, Set<string>> = {};
    if (hasSyncHistory) {
      const validRuns = data.syncRuns.filter((r) => isDateInRange(r.syncedAt, timeFilter, trendFrom, trendTo));
      for (const run of validRuns) {
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
  }, [data.syncRuns, filteredEnrichedServers, hasSyncHistory, selectedBanks, timeFilter, trendFrom, trendTo]);

  const filteredErrorGroups = useMemo(() => {
    if (!errorSearch) return errorGroups;
    return errorGroups.filter((g) => g.message.toLowerCase().includes(errorSearch.toLowerCase()));
  }, [errorGroups, errorSearch]);

  // ── Listado Syncs ─────────────────────────────────────────────────────────
  const syncListDayGroups = useMemo(() => {
    const validRuns = hasSyncHistory
      ? data.syncRuns.filter((r) => isDateInRange(r.syncedAt, timeFilter, trendFrom, trendTo))
      : (() => {
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
    for (const run of validRuns) {
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
  }, [data.syncRuns, filteredEnrichedServers, hasSyncHistory, data.currentServers, selectedBanks, timeFilter, trendFrom, trendTo]);

  // ── EVOLUCIONES COMPUTE ──────────────────────────────────────────────────
  const evolucionesData = useMemo(() => {
    const now = new Date();
    
    let baselineDate = new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000);
    if (timeFilter === "semana") {
      baselineDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (timeFilter === "mes") {
      baselineDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (timeFilter === "all" && data.syncRuns.length > 0) {
      const sorted = [...data.syncRuns].sort((a, b) => new Date(a.syncedAt).getTime() - new Date(b.syncedAt).getTime());
      baselineDate = new Date(sorted[0].syncedAt);
    } else if (timeFilter === "custom" && trendFrom) {
      baselineDate = new Date(trendFrom);
    }

    let isTargetToday = true;
    let targetDate = now;
    if (timeFilter === "custom" && trendTo) {
      const t = new Date(trendTo);
      t.setHours(23, 59, 59, 999);
      if (toLocalDayKey(t.toISOString()) !== toLocalDayKey(now.toISOString())) {
        isTargetToday = false;
        targetDate = t;
      }
    }

    let baselineRun: SyncRunData | null = null;
    if (data.syncRuns.length > 0) {
      let minDiff = Infinity;
      for (const run of data.syncRuns) {
        const diff = Math.abs(new Date(run.syncedAt).getTime() - baselineDate.getTime());
        if (diff < minDiff) {
          minDiff = diff;
          baselineRun = run;
        }
      }
    }

    let targetRun: SyncRunData | null = null;
    if (!isTargetToday && data.syncRuns.length > 0) {
      let minDiff = Infinity;
      for (const run of data.syncRuns) {
        const diff = Math.abs(new Date(run.syncedAt).getTime() - targetDate.getTime());
        if (diff < minDiff) {
          minDiff = diff;
          targetRun = run;
        }
      }
    }

    const targetRecordsMap = new Map<string, { serverName: string; ip: string | null; os: string | null; installedKBs: string | null; errorDescription: string | null; status: string; bank: string }>();

    if (isTargetToday || !targetRun) {
      filteredEnrichedServers.forEach((s) => {
        const bank = s.info ? s.info.type : "Sin clasificar";
        const status = s.isError ? "error" : s.isNoData ? "nodata" : "ok";
        targetRecordsMap.set(s.serverName, {
          serverName: s.serverName,
          ip: s.ip,
          os: s.os,
          installedKBs: s.installedKBs,
          errorDescription: s.errorDescription,
          status,
          bank,
        });
      });
    } else {
      targetRun.records.forEach((r) => {
        if (matchesBankFilter(r.serverName, selectedBanks)) {
          const inf = getServerInfo(r.serverName);
          const bank = inf ? inf.type : "Sin clasificar";
          targetRecordsMap.set(r.serverName, {
            serverName: r.serverName,
            ip: r.ip,
            os: r.os ?? null,
            installedKBs: r.installedKBs ?? null,
            errorDescription: r.errorDescription,
            status: r.status,
            bank,
          });
        }
      });
    }

    const baselineRecordsMap = new Map<string, { serverName: string; ip: string | null; os: string | null; installedKBs: string | null; errorDescription: string | null; status: string; bank: string }>();
    if (baselineRun) {
      baselineRun.records.forEach((r) => {
        if (matchesBankFilter(r.serverName, selectedBanks)) {
          const inf = getServerInfo(r.serverName);
          const bank = inf ? inf.type : "Sin clasificar";
          baselineRecordsMap.set(r.serverName, {
            serverName: r.serverName,
            ip: r.ip,
            os: r.os ?? null,
            installedKBs: r.installedKBs ?? null,
            errorDescription: r.errorDescription,
            status: r.status,
            bank,
          });
        }
      });
    }

    const solucionados: Array<{ serverName: string; ip: string | null; pastError: string; bank: string }> = [];
    const nuevosErrores: Array<{ serverName: string; ip: string | null; currentError: string; isRecurring: boolean; bank: string }> = [];
    const nuevosServidores: Array<{ serverName: string; ip: string | null; status: string; bank: string }> = [];
    const servidoresInactivos: Array<{ serverName: string; ip: string | null; pastStatus: string; bank: string }> = [];

    for (const [sName, sCurr] of targetRecordsMap.entries()) {
      const base = baselineRecordsMap.get(sName);

      if (!base) {
        nuevosServidores.push({
          serverName: sName,
          ip: sCurr.ip,
          status: sCurr.status === "error" ? "Error" : sCurr.status === "nodata" ? "Sin datos" : "OK",
          bank: sCurr.bank,
        });
      } else {
        const wasError = base.status === "error";
        const isError = sCurr.status === "error";

        if (wasError && !isError) {
          solucionados.push({
            serverName: sName,
            ip: sCurr.ip,
            pastError: base.errorDescription ?? "Error previo resuelto",
            bank: sCurr.bank,
          });
        } else if (isError) {
          nuevosErrores.push({
            serverName: sName,
            ip: sCurr.ip,
            currentError: sCurr.errorDescription ?? "Error detectado",
            isRecurring: wasError,
            bank: sCurr.bank,
          });
        }
      }
    }

    for (const [pName, pRec] of baselineRecordsMap.entries()) {
      if (!targetRecordsMap.has(pName)) {
        servidoresInactivos.push({
          serverName: pName,
          ip: pRec.ip,
          pastStatus: pRec.status === "error" ? "Error" : "OK",
          bank: pRec.bank,
        });
      }
    }

    const baselineTotal = baselineRecordsMap.size;
    const baselineErrors = Array.from(baselineRecordsMap.values()).filter((r) => r.status === "error").length;
    const baselineOk = Array.from(baselineRecordsMap.values()).filter((r) => r.status === "ok").length;
    const baselineNoData = Array.from(baselineRecordsMap.values()).filter((r) => r.status === "nodata").length;
    const baselineSuccessRate = baselineTotal > 0 ? Math.round((baselineOk / baselineTotal) * 100) : 0;

    const targetTotal = targetRecordsMap.size;
    const targetErrors = Array.from(targetRecordsMap.values()).filter((r) => r.status === "error").length;
    const targetOk = Array.from(targetRecordsMap.values()).filter((r) => r.status === "ok").length;
    const targetNoData = Array.from(targetRecordsMap.values()).filter((r) => r.status === "nodata").length;
    const targetSuccessRate = targetTotal > 0 ? Math.round((targetOk / targetTotal) * 100) : 0;

    const targetTitle = isTargetToday ? "Estado Actual" : `Estado Histórico (${new Date(targetDate).toLocaleDateString("es-AR")})`;
    const baselineTitle = `Estado Histórico (${baselineRun ? new Date(baselineRun.syncedAt).toLocaleDateString("es-AR") : "Desde"})`;

    return {
      baselineTitle,
      baselineTotal, baselineErrors, baselineOk, baselineNoData, baselineSuccessRate, baselineRecordsMap,
      targetTitle,
      targetTotal, targetErrors, targetOk, targetNoData, targetSuccessRate, targetRecordsMap,
      solucionados, nuevosErrores, nuevosServidores, servidoresInactivos,
    };
  }, [data.syncRuns, filteredEnrichedServers, timeFilter, trendFrom, trendTo, selectedBanks]);

  // COMPILED FULL REPORT PAYLOAD ACROSS ALL 5 SUBMODULES
  const fullReportPayload = useMemo((): FullReportPDFPayload => {
    const selectedBanksText = selectedBanks.includes("all")
      ? "Todos los bancos"
      : selectedBanks.join(", ");

    let timeFilterText = "Todo el historial";
    if (timeFilter === "hoy") timeFilterText = "Hoy";
    else if (timeFilter === "semana") timeFilterText = "Última Semana (7 días)";
    else if (timeFilter === "mes") timeFilterText = "Último Mes (30 días)";
    else if (timeFilter === "custom") {
      timeFilterText = `Personalizado (${trendFrom || "Inicio"} a ${trendTo || "Hoy"})`;
    }

    return {
      selectedBanksText,
      timeFilterText,
      generatedAt: new Date().toLocaleString("es-AR"),
      byType: byTypeData,
      errorTrend: errorTrendData,
      syncList: syncListDayGroups.map((g) => ({
        day: g.day,
        serverCount: g.serverCount,
        totalSuccess: g.totalSuccess,
        totalErrors: g.totalErrors,
        successRate: g.successRate,
      })),
      topErrors: errorGroups.map((g, idx) => ({
        rank: idx + 1,
        message: g.message,
        count: g.count,
        serversText: g.servers.join(", "),
      })),
      evoluciones: {
        baselineTitle: evolucionesData.baselineTitle,
        baselineTotal: evolucionesData.baselineTotal,
        baselineOk: evolucionesData.baselineOk,
        baselineErrors: evolucionesData.baselineErrors,
        baselineNoData: evolucionesData.baselineNoData,
        targetTitle: evolucionesData.targetTitle,
        targetTotal: evolucionesData.targetTotal,
        targetOk: evolucionesData.targetOk,
        targetErrors: evolucionesData.targetErrors,
        targetNoData: evolucionesData.targetNoData,
        solucionados: evolucionesData.solucionados.map((s) => ({
          serverName: s.serverName,
          bank: s.bank,
          ip: s.ip ?? "—",
          pastError: s.pastError,
        })),
        nuevosErrores: evolucionesData.nuevosErrores.map((s) => ({
          serverName: s.serverName,
          bank: s.bank,
          ip: s.ip ?? "—",
          currentError: s.currentError,
          badge: s.isRecurring ? "[Reincidente]" : "[Nuevo Error]",
        })),
        nuevosServidores: evolucionesData.nuevosServidores.map((s) => ({
          serverName: s.serverName,
          bank: s.bank,
          ip: s.ip ?? "—",
          status: s.status,
        })),
        servidoresInactivos: evolucionesData.servidoresInactivos.map((s) => ({
          serverName: s.serverName,
          bank: s.bank,
          ip: s.ip ?? "—",
        })),
      },
    };
  }, [selectedBanks, timeFilter, trendFrom, trendTo, byTypeData, errorTrendData, syncListDayGroups, errorGroups, evolucionesData]);

  // Open Metric Detail Modal with justification
  const openMetricModal = (
    panelName: string,
    metricType: "total" | "ok" | "errors" | "nodata",
    recordsMap: Map<string, any>
  ) => {
    const serversArray: MetricModalData["servers"] = [];

    recordsMap.forEach((rec, sName) => {
      let isMatch = false;
      let justification = "";

      if (metricType === "total") {
        isMatch = true;
        justification = `Servidor registrado y activo en la sincronización de ${panelName}.`;
      } else if (metricType === "ok" && rec.status === "ok") {
        isMatch = true;
        justification = `El agente reportó estado exitoso (sin errores de parches ni fallos de comunicación).`;
      } else if (metricType === "errors" && rec.status === "error") {
        isMatch = true;
        justification = `Contabilizado en Errores debido al reporte: "${rec.errorDescription ?? "Error de ejecución"}".`;
      } else if (metricType === "nodata" && rec.status === "nodata") {
        isMatch = true;
        justification = `Sin datos reportados de Sistema Operativo o sin comunicación en la prueba WUU.`;
      }

      if (isMatch) {
        serversArray.push({
          serverName: sName,
          ip: rec.ip ?? null,
          os: rec.os ?? null,
          installedKBs: rec.installedKBs ?? null,
          errorDescription: rec.errorDescription ?? null,
          status: rec.status,
          bank: rec.bank ?? "Sin clasificar",
          justification,
        });
      }
    });

    const labelsMap: Record<string, string> = {
      total: "Total de Servidores Registrados",
      ok: "Servidores Correctos (OK)",
      errors: "Servidores con Errores",
      nodata: "Servidores Sin Datos",
    };

    setMetricModalData({
      title: `Justificación: ${labelsMap[metricType]} (${panelName})`,
      subtitle: `Análisis detallado de los ${serversArray.length} servidores contabilizados bajo esta métrica.`,
      metricType,
      panelName,
      servers: serversArray,
    });
    setMetricModalOpen(true);
  };

  const getBankCounts = <T extends { bank: string }>(items: T[]): Array<{ name: string; count: number }> => {
    const counts: Record<string, number> = {};
    items.forEach((item) => {
      const b = item.bank || "Sin clasificar";
      counts[b] = (counts[b] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count);
  };

  return (
    <div className="space-y-4">
      {/* ── FULL INTEGRATED REPORT ACTION BAR ── */}
      <div className="glass rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 border border-indigo-500/30 bg-indigo-500/5">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
            <FileText className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-zinc-100 flex items-center gap-2">
              Obtener o enviar Reporte Completo
              <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                5 Submódulos Integrados
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              Genera un informe completo consolidado (Por Tipo, Errores, Syncs, Top Errores, Evoluciones) filtrado por <strong className="text-zinc-200">{fullReportPayload.selectedBanksText}</strong> y <strong className="text-zinc-200">{fullReportPayload.timeFilterText}</strong>.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => downloadFullReportPDF(fullReportPayload, `Reporte_Completo_Parcheo_${new Date().toISOString().slice(0, 10)}.pdf`)}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Descargar PDF Completo
          </button>
          <button
            onClick={() => {
              setEmailPayload({
                attachmentType: "report",
                summaryText: `Reporte Completo Integrado - Banco(s): ${fullReportPayload.selectedBanksText} | Tiempo: ${fullReportPayload.timeFilterText}`,
                data: [fullReportPayload],
              });
            }}
            className="px-3.5 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all shadow-md flex items-center gap-2"
          >
            <Mail className="w-4 h-4" />
            Enviar por Correo
          </button>
        </div>
      </div>

      {/* ── Multi-Bank Selection & Color Legend Bar ── */}
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

      {/* ── Unified Time Filter Bar across ALL Submodules ── */}
      <div className="glass rounded-xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-400 shrink-0" />
          <span className="text-xs font-semibold text-zinc-300">Filtro de Tiempo:</span>
          <div className="flex flex-wrap gap-1 ml-1">
            {(["all", "hoy", "semana", "mes", "custom"] as TimeFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setTimeFilter(f)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors border ${
                  timeFilter === f
                    ? "bg-indigo-600 text-white border-transparent shadow"
                    : "text-zinc-400 border-zinc-800 hover:text-zinc-200"
                }`}
              >
                {f === "all" ? "Todo" : f === "hoy" ? "Hoy" : f === "semana" ? "Semana" : f === "mes" ? "Mes" : "Rango Personalizado"}
              </button>
            ))}
          </div>
        </div>

        {timeFilter === "custom" && (
          <div className="flex items-center gap-2 bg-zinc-900/80 px-3 py-1 rounded-lg border border-zinc-800">
            <span className="text-[11px] text-zinc-400 font-medium">Desde:</span>
            <input
              type="date"
              value={trendFrom}
              onChange={(e) => setTrendFrom(e.target.value)}
              className="px-2 py-0.5 text-xs bg-black/40 border border-zinc-700 rounded text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-[11px] text-zinc-400 font-medium ml-1">Hasta:</span>
            <input
              type="date"
              value={trendTo}
              onChange={(e) => setTrendTo(e.target.value)}
              className="px-2 py-0.5 text-xs bg-black/40 border border-zinc-700 rounded text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
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
              activeTab === tab ? "bg-indigo-600 text-white shadow-lg font-bold" : "text-zinc-400 hover:text-zinc-200"
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
                    </div>
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
            <h2 className="text-sm font-semibold text-zinc-200 mb-4">
              Tendencia de errores {!selectedBanks.includes("all") ? `(${selectedBanks.join(", ")})` : ""}
            </h2>
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
                      const filteredRunRecords = run.records.filter((r) => matchesBankFilter(r.serverName, selectedBanks));
                      const filteredSuccess = filteredRunRecords.filter((r) => r.status === "ok").length;
                      const filteredErrors = filteredRunRecords.filter((r) => r.status === "error").length;
                      return (
                        <div key={run.id} className="px-6 py-3 flex items-center justify-between text-xs">
                          <span className="font-medium text-zinc-300">Sync {new Date(run.syncedAt).toLocaleTimeString("es-AR")}</span>
                          <div className="flex items-center gap-4 text-[11px]">
                            <span className="text-emerald-400">✓ {filteredSuccess}</span>
                            <span className="text-rose-400">✕ {filteredErrors}</span>
                          </div>
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
                    {g.servers.slice(0, 12).map((srv) => {
                      const inf = getServerInfo(srv);
                      const bankLabel = inf ? inf.type : "Sin clasificar";
                      const color = TYPE_COLORS[bankLabel] ?? "#6b7280";
                      return (
                        <span key={srv} className="px-1.5 py-0.5 rounded text-[9px] bg-zinc-900 border font-bold" style={{ color, borderColor: color + "44" }}>
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

      {/* ── EVOLUCIONES ── */}
      {activeTab === "Evoluciones" && (
        <div key={`evoluciones-${tabKey}`} className="space-y-5">
          {/* Interactive Metric Cards (Clickable for Detail Justification Modal) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Panel 1: Estado Histórico (Baseline Date) */}
            <div className="glass rounded-2xl p-5 border-l-4 border-l-zinc-500 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">{evolucionesData.baselineTitle}</span>
                <span className="text-xs font-bold text-zinc-300">{evolucionesData.baselineTotal} Servidores</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => openMetricModal(evolucionesData.baselineTitle, "total", evolucionesData.baselineRecordsMap)}
                  className="p-2 rounded-xl bg-zinc-800/60 border border-zinc-700/50 hover:bg-zinc-800 transition-all text-center group"
                >
                  <p className="text-base font-bold text-zinc-200 group-hover:scale-105 transition-transform">{evolucionesData.baselineTotal}</p>
                  <p className="text-[10px] text-zinc-400">Total</p>
                </button>
                <button
                  onClick={() => openMetricModal(evolucionesData.baselineTitle, "ok", evolucionesData.baselineRecordsMap)}
                  className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-center group"
                >
                  <p className="text-base font-bold text-emerald-400 group-hover:scale-105 transition-transform">{evolucionesData.baselineOk}</p>
                  <p className="text-[10px] text-emerald-300">OK ({evolucionesData.baselineSuccessRate}%)</p>
                </button>
                <button
                  onClick={() => openMetricModal(evolucionesData.baselineTitle, "errors", evolucionesData.baselineRecordsMap)}
                  className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all text-center group"
                >
                  <p className="text-base font-bold text-rose-400 group-hover:scale-105 transition-transform">{evolucionesData.baselineErrors}</p>
                  <p className="text-[10px] text-rose-300">Errores</p>
                </button>
                <button
                  onClick={() => openMetricModal(evolucionesData.baselineTitle, "nodata", evolucionesData.baselineRecordsMap)}
                  className="p-2 rounded-xl bg-zinc-800/40 border border-zinc-700/40 hover:bg-zinc-800/80 transition-all text-center group"
                >
                  <p className="text-base font-bold text-zinc-400 group-hover:scale-105 transition-transform">{evolucionesData.baselineNoData}</p>
                  <p className="text-[10px] text-zinc-400">Sin datos</p>
                </button>
              </div>
            </div>

            {/* Panel 2: Estado Actual / Estado Histórico (Target Date) */}
            <div className="glass rounded-2xl p-5 border-l-4 border-l-indigo-500 space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">{evolucionesData.targetTitle}</span>
                <span className="text-xs font-bold text-zinc-200">{evolucionesData.targetTotal} Servidores</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                <button
                  onClick={() => openMetricModal(evolucionesData.targetTitle, "total", evolucionesData.targetRecordsMap)}
                  className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all text-center group"
                >
                  <p className="text-base font-bold text-indigo-300 group-hover:scale-105 transition-transform">{evolucionesData.targetTotal}</p>
                  <p className="text-[10px] text-indigo-400">Total</p>
                </button>
                <button
                  onClick={() => openMetricModal(evolucionesData.targetTitle, "ok", evolucionesData.targetRecordsMap)}
                  className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 transition-all text-center group"
                >
                  <p className="text-base font-bold text-emerald-400 group-hover:scale-105 transition-transform">{evolucionesData.targetOk}</p>
                  <p className="text-[10px] text-emerald-300">OK ({evolucionesData.targetSuccessRate}%)</p>
                </button>
                <button
                  onClick={() => openMetricModal(evolucionesData.targetTitle, "errors", evolucionesData.targetRecordsMap)}
                  className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/20 transition-all text-center group"
                >
                  <p className="text-base font-bold text-rose-400 group-hover:scale-105 transition-transform">{evolucionesData.targetErrors}</p>
                  <p className="text-[10px] text-rose-300">Errores</p>
                </button>
                <button
                  onClick={() => openMetricModal(evolucionesData.targetTitle, "nodata", evolucionesData.targetRecordsMap)}
                  className="p-2 rounded-xl bg-zinc-800/40 border border-zinc-700/40 hover:bg-zinc-800/80 transition-all text-center group"
                >
                  <p className="text-base font-bold text-zinc-400 group-hover:scale-105 transition-transform">{evolucionesData.targetNoData}</p>
                  <p className="text-[10px] text-zinc-400">Sin datos</p>
                </button>
              </div>
            </div>
          </div>

          {/* Diffs List - Bank selector row DIRECTLY BELOW card title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* 1. ERRORES SOLUCIONADOS */}
            <div className="glass rounded-2xl p-5 border border-emerald-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                    Errores Solucionados ({evolucionesData.solucionados.length})
                  </h3>
                </div>

                {/* Horizontal Bank Button Row DIRECTLY BELOW title */}
                {(() => {
                  const counts = getBankCounts(evolucionesData.solucionados);
                  if (counts.length === 0) return null;
                  const activeBank = solucionadosBank || counts[0]?.name;
                  return (
                    <div className="flex flex-wrap gap-1.5 my-2 pt-1 pb-2 border-b border-zinc-800/60">
                      {counts.map(({ name, count }) => {
                        const color = TYPE_COLORS[name] ?? "#10b981";
                        const isAct = activeBank === name;
                        return (
                          <button
                            key={name}
                            onClick={() => setSolucionadosBank(name)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                              isAct
                                ? "bg-white/10 text-white border-zinc-500 shadow-sm scale-105"
                                : "bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                            }`}
                            style={isAct ? { borderColor: color, backgroundColor: color + "25", color: "#fff" } : {}}
                          >
                            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
                            <span style={isAct ? { color: "#fff" } : { color }}>{name}</span>
                            <span className="text-[10px] opacity-75">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* List of items for selected bank */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 mt-2">
                  {(() => {
                    const counts = getBankCounts(evolucionesData.solucionados);
                    if (counts.length === 0) {
                      return <p className="text-xs text-zinc-500 py-6 text-center">Sin errores resueltos en este período.</p>;
                    }
                    const activeBank = solucionadosBank || counts[0]?.name;
                    const items = evolucionesData.solucionados.filter((item) => item.bank === activeBank);
                    return items.map((item, idx) => (
                      <div key={`${item.serverName}-${idx}`} className="p-2.5 rounded-xl bg-emerald-500/5 border border-emerald-500/20 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-zinc-100">{item.serverName} <span className="text-[10px] text-zinc-500 font-normal">({item.bank})</span></p>
                          <p className="text-[10px] text-zinc-400 truncate max-w-xs">{item.pastError}</p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shrink-0">
                          [Solucionado]
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>

            {/* 2. ERRORES ACTUALES */}
            <div className="glass rounded-2xl p-5 border border-rose-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-4 h-4 text-rose-400" />
                  <h3 className="text-xs font-bold text-rose-400 uppercase tracking-wider">
                    Errores Actuales ({evolucionesData.nuevosErrores.length})
                  </h3>
                </div>

                {/* Horizontal Bank Button Row DIRECTLY BELOW title */}
                {(() => {
                  const counts = getBankCounts(evolucionesData.nuevosErrores);
                  if (counts.length === 0) return null;
                  const activeBank = erroresBank || counts[0]?.name;
                  return (
                    <div className="flex flex-wrap gap-1.5 my-2 pt-1 pb-2 border-b border-zinc-800/60">
                      {counts.map(({ name, count }) => {
                        const color = TYPE_COLORS[name] ?? "#ef4444";
                        const isAct = activeBank === name;
                        return (
                          <button
                            key={name}
                            onClick={() => setErroresBank(name)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                              isAct
                                ? "bg-white/10 text-white border-zinc-500 shadow-sm scale-105"
                                : "bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                            }`}
                            style={isAct ? { borderColor: color, backgroundColor: color + "25", color: "#fff" } : {}}
                          >
                            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
                            <span style={isAct ? { color: "#fff" } : { color }}>{name}</span>
                            <span className="text-[10px] opacity-75">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* List of items for selected bank */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 mt-2">
                  {(() => {
                    const counts = getBankCounts(evolucionesData.nuevosErrores);
                    if (counts.length === 0) {
                      return <p className="text-xs text-zinc-500 py-6 text-center">¡Sin errores reportados en este período!</p>;
                    }
                    const activeBank = erroresBank || counts[0]?.name;
                    const items = evolucionesData.nuevosErrores.filter((item) => item.bank === activeBank);
                    return items.map((item, idx) => (
                      <div key={`${item.serverName}-${idx}`} className="p-2.5 rounded-xl bg-rose-500/5 border border-rose-500/20 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-zinc-100">{item.serverName} <span className="text-[10px] text-zinc-500 font-normal">({item.bank})</span></p>
                          <p className="text-[10px] text-zinc-400 truncate max-w-xs">{item.currentError}</p>
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold shadow-sm shrink-0 border ${
                          item.isRecurring
                            ? "bg-rose-600/30 text-rose-300 border-rose-500/60"
                            : "bg-rose-500/20 text-rose-400 border-rose-500/40"
                        }`}>
                          {item.isRecurring ? "[Reincidente]" : "[Nuevo Error]"}
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>

            {/* 3. NUEVOS SERVIDORES INGRESADOS */}
            <div className="glass rounded-2xl p-5 border border-indigo-500/30 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <PlusCircle className="w-4 h-4 text-indigo-400" />
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">
                    Nuevos Servidores Ingresados ({evolucionesData.nuevosServidores.length})
                  </h3>
                </div>

                {/* Horizontal Bank Button Row DIRECTLY BELOW title */}
                {(() => {
                  const counts = getBankCounts(evolucionesData.nuevosServidores);
                  if (counts.length === 0) return null;
                  const activeBank = nuevosBank || counts[0]?.name;
                  return (
                    <div className="flex flex-wrap gap-1.5 my-2 pt-1 pb-2 border-b border-zinc-800/60">
                      {counts.map(({ name, count }) => {
                        const color = TYPE_COLORS[name] ?? "#6366f1";
                        const isAct = activeBank === name;
                        return (
                          <button
                            key={name}
                            onClick={() => setNuevosBank(name)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                              isAct
                                ? "bg-white/10 text-white border-zinc-500 shadow-sm scale-105"
                                : "bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                            }`}
                            style={isAct ? { borderColor: color, backgroundColor: color + "25", color: "#fff" } : {}}
                          >
                            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
                            <span style={isAct ? { color: "#fff" } : { color }}>{name}</span>
                            <span className="text-[10px] opacity-75">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* List of items for selected bank */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 mt-2">
                  {(() => {
                    const counts = getBankCounts(evolucionesData.nuevosServidores);
                    if (counts.length === 0) {
                      return <p className="text-xs text-zinc-500 py-6 text-center">Sin nuevos servidores en este período.</p>;
                    }
                    const activeBank = nuevosBank || counts[0]?.name;
                    const items = evolucionesData.nuevosServidores.filter((item) => item.bank === activeBank);
                    return items.map((item, idx) => {
                      const isErr = item.status === "Error";
                      const isOk = item.status === "OK";
                      return (
                        <div key={`${item.serverName}-${idx}`} className="p-2.5 rounded-xl bg-indigo-500/5 border border-indigo-500/20 flex items-center justify-between text-xs">
                          <div>
                            <p className="font-bold text-zinc-100">{item.serverName} <span className="text-[10px] text-zinc-500 font-normal">({item.bank})</span></p>
                            <p className="text-[10px] text-zinc-500">IP: {item.ip ?? "N/A"}</p>
                          </div>
                          {/* BADGE: ROJO 🔴 si Error, VERDE 🟢 si OK */}
                          {isErr ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/20 text-rose-400 border border-rose-500/40 shadow-sm shrink-0">
                              [Nuevo (Error)]
                            </span>
                          ) : isOk ? (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm shrink-0">
                              [Nuevo (OK)]
                            </span>
                          ) : (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-zinc-800 text-zinc-400 border border-zinc-700 shadow-sm shrink-0">
                              [Nuevo (Sin datos)]
                            </span>
                          )}
                        </div>
                      );
                    });
                  })()}
                </div>
              </div>
            </div>

            {/* 4. SERVIDORES REMOVIDOS / INACTIVOS */}
            <div className="glass rounded-2xl p-5 border border-zinc-700/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MinusCircle className="w-4 h-4 text-zinc-400" />
                  <h3 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                    Servidores Removidos / Inactivos ({evolucionesData.servidoresInactivos.length})
                  </h3>
                </div>

                {/* Horizontal Bank Button Row DIRECTLY BELOW title */}
                {(() => {
                  const counts = getBankCounts(evolucionesData.servidoresInactivos);
                  if (counts.length === 0) return null;
                  const activeBank = inactivosBank || counts[0]?.name;
                  return (
                    <div className="flex flex-wrap gap-1.5 my-2 pt-1 pb-2 border-b border-zinc-800/60">
                      {counts.map(({ name, count }) => {
                        const color = TYPE_COLORS[name] ?? "#71717a";
                        const isAct = activeBank === name;
                        return (
                          <button
                            key={name}
                            onClick={() => setInactivosBank(name)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
                              isAct
                                ? "bg-white/10 text-white border-zinc-500 shadow-sm scale-105"
                                : "bg-zinc-900/90 text-zinc-400 border-zinc-800 hover:text-zinc-200"
                            }`}
                            style={isAct ? { borderColor: color, backgroundColor: color + "25", color: "#fff" } : {}}
                          >
                            <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: color }} />
                            <span style={isAct ? { color: "#fff" } : { color }}>{name}</span>
                            <span className="text-[10px] opacity-75">({count})</span>
                          </button>
                        );
                      })}
                    </div>
                  );
                })()}

                {/* List of items for selected bank */}
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1 mt-2">
                  {(() => {
                    const counts = getBankCounts(evolucionesData.servidoresInactivos);
                    if (counts.length === 0) {
                      return <p className="text-xs text-zinc-500 py-6 text-center">Sin servidores inactivos en este período.</p>;
                    }
                    const activeBank = inactivosBank || counts[0]?.name;
                    const items = evolucionesData.servidoresInactivos.filter((item) => item.bank === activeBank);
                    return items.map((item, idx) => (
                      <div key={`${item.serverName}-${idx}`} className="p-2.5 rounded-xl bg-zinc-800/40 border border-zinc-700/40 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-bold text-zinc-300">{item.serverName} <span className="text-[10px] text-zinc-500 font-normal">({item.bank})</span></p>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-zinc-800 text-zinc-400 border border-zinc-700 shrink-0">
                          [Inactivo]
                        </span>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Metric Detail Justification Modal */}
      <MetricDetailModal
        isOpen={metricModalOpen}
        onClose={() => setMetricModalOpen(false)}
        modalData={metricModalData}
      />

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
