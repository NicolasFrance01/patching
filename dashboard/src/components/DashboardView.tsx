"use client";

import { useMemo, useState, useEffect, memo } from "react";
import { ServerStatus } from "@/types";
import {
  Server, CheckCircle2, XCircle, Clock, Search, AlertTriangle,
  Mail, Filter, X,
} from "lucide-react";
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line,
} from "recharts";
import { getServerInfo, SERVER_TYPES, ServerType } from "@/lib/serverTypeMap";
import EmailModal, { EmailPayload } from "./EmailModal";

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
}

type BankFilter = "all" | ServerType | "unclassified";
type TimeFilter = "all" | "hoy" | "semana" | "mes" | "custom";

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

function matchesBankFilter(serverName: string, bankFilter: BankFilter): boolean {
  if (bankFilter === "all") return true;
  const info = getServerInfo(serverName);
  if (bankFilter === "unclassified") return !info;
  return info?.type === bankFilter;
}

function toLocalDayKey(iso: string): string {
  const d = new Date(iso);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function isInTimeFilter(iso: string, tf: TimeFilter, from: string, to: string): boolean {
  if (tf === "all") return true;
  const d = new Date(iso);
  const now = new Date();
  if (tf === "hoy") return toLocalDayKey(iso) === toLocalDayKey(now.toISOString());
  if (tf === "semana") return d >= new Date(now.getTime() - 7 * 86400000);
  if (tf === "mes") return d >= new Date(now.getTime() - 30 * 86400000);
  if (tf === "custom") {
    const f = from ? new Date(from) : new Date(0);
    const t = to ? new Date(to + "T23:59:59") : new Date();
    return d >= f && d <= t;
  }
  return true;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const ChartCard = memo(function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="glass rounded-2xl p-5 flex flex-col gap-3">
      <h3 className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide">{title}</h3>
      {children}
    </div>
  );
});

function StatusBadge({ status }: { status: string }) {
  if (status === "ok")
    return <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">OK</span>;
  if (status === "error")
    return <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">Error</span>;
  return <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-600/30">Sin datos</span>;
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function DashboardView({ initialData, syncRuns = [] }: DashboardViewProps) {
  const [search, setSearch] = useState("");
  const [bankFilter, setBankFilter] = useState<BankFilter>("all");
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("all");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo]   = useState("");
  const [showFilterBar, setShowFilterBar] = useState(false);
  const [emailPayload, setEmailPayload] = useState<EmailPayload | null>(null);
  const [chartsMounted, setChartsMounted] = useState(false);

  useEffect(() => { setChartsMounted(true); }, []);

  // ── Enriched servers ────────────────────────────────────────────────────────
  const enriched = useMemo(() =>
    initialData.map((s) => {
      const info = getServerInfo(s.serverName, s.ip ?? undefined);
      const isError  = !!(s.errorDescription && s.errorDescription !== "N/A");
      const isNoData = !isError && (!s.os || s.os === "N/A");
      const status   = isError ? "error" : isNoData ? "nodata" : "ok";
      return { ...s, info, isError, isNoData, status };
    }),
  [initialData]);

  // ── Filtered servers (bank + time + search) ─────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return enriched.filter((s) => {
      if (!matchesBankFilter(s.serverName, bankFilter)) return false;
      if (!isInTimeFilter(s.updatedAt.toString(), timeFilter, customFrom, customTo)) return false;
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
  }, [enriched, bankFilter, timeFilter, customFrom, customTo, search]);

  // ── KPI Stats ───────────────────────────────────────────────────────────────
  const stats = useMemo(() => {
    const total     = filtered.length;
    const ok        = filtered.filter((s) => s.status === "ok").length;
    const errors    = filtered.filter((s) => s.status === "error").length;
    const noData    = filtered.filter((s) => s.status === "nodata").length;
    const pct       = total > 0 ? Math.round((ok / total) * 100) : 0;
    return { total, ok, errors, noData, pct };
  }, [filtered]);

  // ── Donut chart data ────────────────────────────────────────────────────────
  const donutData = useMemo(() => [
    { name: "OK",        value: stats.ok,     color: STATUS_COLORS.ok },
    { name: "Error",     value: stats.errors, color: STATUS_COLORS.error },
    { name: "Sin datos", value: stats.noData, color: STATUS_COLORS.nodata },
  ].filter((d) => d.value > 0), [stats]);

  // ── Cumplimiento por banco ──────────────────────────────────────────────────
  const byBankData = useMemo(() => {
    const banks = bankFilter === "all"
      ? [...SERVER_TYPES, "Sin clasificar"]
      : [bankFilter === "unclassified" ? "Sin clasificar" : bankFilter];

    return banks.map((bank) => {
      const srvs = filtered.filter((s) => {
        const info = getServerInfo(s.serverName);
        const b = info ? info.type : "Sin clasificar";
        return b === bank;
      });
      const total  = srvs.length;
      const ok     = srvs.filter((s) => s.status === "ok").length;
      const errors = srvs.filter((s) => s.status === "error").length;
      const nodata = total - ok - errors;
      return { name: bank, total, ok, errors, nodata, pct: total > 0 ? Math.round((ok / total) * 100) : 0 };
    }).filter((d) => d.total > 0).sort((a, b) => b.total - a.total);
  }, [filtered, bankFilter]);

  // ── Trend: servidores por sync (últimas N syncs) ────────────────────────────
  const trendData = useMemo(() => {
    const runs = syncRuns
      .filter((r) => isInTimeFilter(r.syncedAt, timeFilter, customFrom, customTo))
      .sort((a, b) => new Date(a.syncedAt).getTime() - new Date(b.syncedAt).getTime())
      .slice(-12);

    return runs.map((run) => {
      const recs = run.records.filter((r) => matchesBankFilter(r.serverName, bankFilter));
      const total  = recs.length;
      const ok     = recs.filter((r) => r.status === "ok").length;
      const errors = recs.filter((r) => r.status === "error").length;
      const nodata = recs.filter((r) => r.status === "nodata").length;
      return {
        label: new Date(run.syncedAt).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
        ok, errors, nodata, total,
        pct: total > 0 ? Math.round((ok / total) * 100) : 0,
      };
    });
  }, [syncRuns, timeFilter, customFrom, customTo, bankFilter]);

  // ── Top KBs instaladas ──────────────────────────────────────────────────────
  const topKBs = useMemo(() => {
    const kbMap: Record<string, number> = {};
    for (const s of filtered) {
      if (!s.installedKBs) continue;
      for (const kb of s.installedKBs.split(/[,;|\s]+/).map((k) => k.trim()).filter(Boolean)) {
        kbMap[kb] = (kbMap[kb] ?? 0) + 1;
      }
    }
    return Object.entries(kbMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([kb, count]) => ({ kb, count }));
  }, [filtered]);

  // ── Top Grupos afectados (con errores) ──────────────────────────────────────
  const topGrupos = useMemo(() => {
    const gMap: Record<string, { total: number; errors: number }> = {};
    for (const s of filtered) {
      const g = s.grupo ?? s.info?.type ?? "Sin clasificar";
      if (!gMap[g]) gMap[g] = { total: 0, errors: 0 };
      gMap[g].total++;
      if (s.status === "error") gMap[g].errors++;
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
      .slice(0, 8);
  }, [filtered]);

  // ── Banco con más riesgo ────────────────────────────────────────────────────
  const riskData = useMemo(() =>
    byBankData
      .filter((b) => b.errors > 0)
      .sort((a, b) => b.errors - a.errors)
      .slice(0, 8)
      .map((b) => ({ name: b.name, errors: b.errors, pct: b.pct })),
  [byBankData]);

  const lastUpdated = initialData.length > 0
    ? new Date(initialData[0].updatedAt).toLocaleString("es-AR")
    : "—";

  return (
    <div className="space-y-5">
      {/* ── Header: fecha + filtros ─────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <p className="text-xs text-zinc-500">
          Última sincronización: <span className="text-zinc-300">{lastUpdated}</span>
          {" · "}
          <span className="text-zinc-400">{filtered.length} de {initialData.length} servidores</span>
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
            onClick={() => setEmailPayload({
              attachmentType: "dashboard",
              summaryText: `Dashboard — ${filtered.length} servidores`,
              data: filtered,
            })}
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
              const isActive = bankFilter === value;
              return (
                <button
                  key={value}
                  onClick={() => setBankFilter(value)}
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
            {(["all","hoy","semana","mes","custom"] as TimeFilter[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeFilter(tf)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border ${
                  timeFilter === tf
                    ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                    : "text-zinc-400 border-zinc-700/50 hover:text-zinc-200"
                }`}
              >
                {tf === "all" ? "Todo" : tf === "hoy" ? "Hoy" : tf === "semana" ? "Semana" : tf === "mes" ? "Mes" : "Rango Personalizado"}
              </button>
            ))}
            {timeFilter === "custom" && (
              <div className="flex items-center gap-2">
                <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)}
                  className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500" />
                <span className="text-zinc-600 text-xs">→</span>
                <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)}
                  className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500" />
              </div>
            )}
            {(bankFilter !== "all" || timeFilter !== "all") && (
              <button
                onClick={() => { setBankFilter("all"); setTimeFilter("all"); setCustomFrom(""); setCustomTo(""); }}
                className="ml-auto flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-3 h-3" /> Limpiar filtros
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── KPIs ────────────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <MetricCard title="Total Servidores"   value={stats.total}   icon={<Server       className="w-5 h-5 text-indigo-400"  />} accent="indigo"  />
        <MetricCard title="OK / Actualizados"  value={stats.ok}      icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />} accent="emerald" />
        <MetricCard title="Con Errores"        value={stats.errors}  icon={<XCircle      className="w-5 h-5 text-rose-400"    />} accent="rose"    />
        <MetricCard title="Sin Datos"          value={stats.noData}  icon={<AlertTriangle className="w-5 h-5 text-zinc-500"   />} accent="zinc"    />
        <MetricCard title="% Cumplimiento"     value={`${stats.pct}%`} icon={<Clock      className="w-5 h-5 text-cyan-400"   />} accent="cyan"    />
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
                      <th className="px-2 py-2 text-right font-medium text-emerald-500">OK</th>
                      <th className="px-2 py-2 text-right font-medium text-rose-500">Error</th>
                      <th className="px-2 py-2 text-right font-medium text-zinc-500">Sin datos</th>
                      <th className="px-2 py-2 text-right font-medium text-emerald-400">% OK</th>
                      <th className="px-2 py-2 text-right font-medium text-rose-400">% Err</th>
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
                          <td className="px-2 py-2 text-right text-emerald-400">{b.ok}</td>
                          <td className="px-2 py-2 text-right text-rose-400">{b.errors}</td>
                          <td className="px-2 py-2 text-right text-zinc-500">{b.nodata}</td>
                          <td className="px-2 py-2 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <div className="w-14 h-1 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${b.pct}%` }} />
                              </div>
                              <span className="text-emerald-400 font-medium">{b.pct}%</span>
                            </div>
                          </td>
                          <td className="px-2 py-2 text-right text-rose-400">{pctErr}%</td>
                        </tr>
                      );
                    })}
                    {/* Total row */}
                    <tr className="bg-zinc-900/50 font-bold">
                      <td className="px-2 py-2 text-zinc-300">Total general</td>
                      <td className="px-2 py-2 text-right text-zinc-200">{stats.total}</td>
                      <td className="px-2 py-2 text-right text-emerald-400">{stats.ok}</td>
                      <td className="px-2 py-2 text-right text-rose-400">{stats.errors}</td>
                      <td className="px-2 py-2 text-right text-zinc-500">{stats.noData}</td>
                      <td className="px-2 py-2 text-right text-emerald-400">{stats.pct}%</td>
                      <td className="px-2 py-2 text-right text-rose-400">{stats.total > 0 ? Math.round((stats.errors / stats.total) * 100) : 0}%</td>
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
                <Bar yAxisId="cnt" dataKey="ok"     name="OK"        stackId="s" fill="#10b981aa" />
                <Bar yAxisId="cnt" dataKey="errors" name="Errores"   stackId="s" fill="#ef4444aa" />
                <Bar yAxisId="cnt" dataKey="nodata" name="Sin datos" stackId="s" fill="#3f3f46aa" radius={[4,4,0,0]} />
                <Line yAxisId="pct" type="monotone" dataKey="pct" name="% Cumplimiento"
                  stroke="#6366f1" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </ChartCard>
      )}

      {/* ── Charts Row 3: Riesgo por banco + Top KBs ────────────────────────── */}
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
        <ChartCard title="Top 10 KBs Instaladas">
          {chartsMounted && topKBs.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={topKBs} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" horizontal={false} />
                <XAxis type="number" tick={{ fontSize: 10, fill: "#71717a" }} />
                <YAxis type="category" dataKey="kb" tick={{ fontSize: 10, fill: "#a1a1aa" }} width={80} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="count" name="Servidores" fill="#6366f1aa" radius={[0,4,4,0]} />
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
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800">Servidor</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 hidden sm:table-cell">Grupo</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 hidden md:table-cell">Ambiente</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 hidden md:table-cell">Dominio</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800">IP</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800">Estado</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 hidden lg:table-cell">Sistema Operativo</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 hidden xl:table-cell">Versión SO</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 hidden lg:table-cell">Running Time</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 hidden lg:table-cell">Espacio en Disco</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 hidden xl:table-cell">KBs Instaladas</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 hidden xl:table-cell">Últ. Instalación</th>
                <th className="sticky top-0 z-10 bg-zinc-950 px-3 py-2 font-medium border-b border-zinc-800 hidden xl:table-cell">Error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/60">
              {filtered.map((server) => {
                const bankColor = TYPE_COLORS[server.info?.type ?? "Sin clasificar"] ?? "#71717a";
                return (
                  <tr key={server.id} className="hover:bg-white/[0.025] transition-colors">
                    <td className="px-3 py-2.5 font-medium text-zinc-100 min-w-[160px]">
                      <div className="flex flex-col gap-0.5">
                        <span className="truncate" title={server.serverName}>{server.serverName}</span>
                        {server.info && (
                          <span className="text-[9px] font-bold px-1 py-0.5 rounded w-fit"
                            style={{ color: bankColor, backgroundColor: bankColor + "18", border: `1px solid ${bankColor}33` }}>
                            {server.info.type}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-2.5 hidden sm:table-cell">
                      {server.grupo ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{server.grupo}</span>
                      ) : <span className="text-zinc-700">—</span>}
                    </td>
                    <td className="px-3 py-2.5 hidden md:table-cell">
                      {server.ambiente ? (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-violet-500/10 text-violet-300 border border-violet-500/20">{server.ambiente}</span>
                      ) : <span className="text-zinc-700">—</span>}
                    </td>
                    <td className="px-3 py-2.5 text-zinc-400 hidden md:table-cell whitespace-nowrap">{server.domain ?? "—"}</td>
                    <td className="px-3 py-2.5 text-zinc-400 whitespace-nowrap">{server.ip ?? "N/A"}</td>
                    <td className="px-3 py-2.5"><StatusBadge status={server.status} /></td>
                    <td className="px-3 py-2.5 text-zinc-400 hidden lg:table-cell min-w-[160px]">
                      <span className="block truncate" title={server.os ?? ""}>{server.os ?? "—"}</span>
                    </td>
                    <td className="px-3 py-2.5 text-zinc-400 hidden xl:table-cell whitespace-nowrap">{server.osVersion ?? "—"}</td>
                    <td className="px-3 py-2.5 text-zinc-400 hidden lg:table-cell whitespace-nowrap">{server.runningTime ?? "—"}</td>
                    <td className="px-3 py-2.5 text-zinc-400 hidden lg:table-cell min-w-[140px]">
                      <span className="block truncate" title={server.diskSpace ?? ""}>{server.diskSpace ?? "—"}</span>
                    </td>
                    <td className="px-3 py-2.5 text-zinc-400 hidden xl:table-cell min-w-[140px]">
                      <span className="block truncate" title={server.installedKBs ?? ""}>{server.installedKBs ?? "—"}</span>
                    </td>
                    <td className="px-3 py-2.5 text-zinc-400 hidden xl:table-cell whitespace-nowrap">{server.installDate ?? "—"}</td>
                    <td className="px-3 py-2.5 text-rose-400/80 hidden xl:table-cell min-w-[180px]">
                      {server.isError ? (
                        <span className="block text-[10px] whitespace-normal truncate" title={server.errorDescription ?? ""}>{server.errorDescription}</span>
                      ) : <span className="text-zinc-700">—</span>}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={13} className="px-4 py-10 text-center text-zinc-600">
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
    </div>
  );
}

// ─── MetricCard ───────────────────────────────────────────────────────────────

function MetricCard({
  title, value, icon, accent,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent: "indigo" | "emerald" | "rose" | "zinc" | "cyan";
}) {
  const gradients: Record<string, string> = {
    indigo:  "from-indigo-500/5",
    emerald: "from-emerald-500/5",
    rose:    "from-rose-500/5",
    zinc:    "from-zinc-500/5",
    cyan:    "from-cyan-500/5",
  };
  return (
    <div className="glass rounded-2xl p-4 flex items-start justify-between relative overflow-hidden group hover:border-white/10 transition-all">
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[accent]} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative">
        <p className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">{title}</p>
        <p className="mt-1.5 text-2xl font-bold tracking-tight text-white">{value}</p>
      </div>
      <div className="relative p-2 bg-white/[0.04] rounded-xl border border-white/[0.06]">
        {icon}
      </div>
    </div>
  );
}
