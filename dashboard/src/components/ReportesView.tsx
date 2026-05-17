"use client";

import { useMemo, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend, LineChart, Line, CartesianGrid,
} from "recharts";
import { getServerInfo, SERVER_TYPES, ServerType } from "@/lib/serverTypeMap";
import { ChevronDown, ChevronRight } from "lucide-react";

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

const TABS = ["Por Tipo", "Errores por Sync", "Listado de Syncs", "Top Errores"] as const;
type Tab = (typeof TABS)[number];

const TYPE_COLORS: Record<string, string> = {
  ASJ: "#6366f1", BSC: "#06b6d4", BSJ: "#10b981",
  Corp: "#f59e0b", NBERSA: "#ef4444", NBSF: "#8b5cf6", QUALIA: "#ec4899",
};

export default function ReportesView({ data }: ReportesViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("Por Tipo");
  const [expandedSync, setExpandedSync] = useState<string | null>(null);

  const enrichedServers = useMemo(() =>
    data.currentServers.map((s) => ({ ...s, info: getServerInfo(s.serverName, s.ip) })),
    [data.currentServers]
  );

  // --- Por Tipo ---
  const byTypeData = useMemo(() => {
    const counts: Record<string, { total: number; ok: number; error: number; nodata: number }> = {};
    SERVER_TYPES.forEach((t) => { counts[t] = { total: 0, ok: 0, error: 0, nodata: 0 }; });
    counts["Sin clasificar"] = { total: 0, ok: 0, error: 0, nodata: 0 };

    for (const s of enrichedServers) {
      const key = s.info?.type ?? "Sin clasificar";
      if (!counts[key]) counts[key] = { total: 0, ok: 0, error: 0, nodata: 0 };
      counts[key].total++;
      const isError = !!(s.errorDescription && s.errorDescription !== "N/A");
      const isNoData = !s.os || s.os === "N/A";
      if (isError) counts[key].error++;
      else if (isNoData) counts[key].nodata++;
      else counts[key].ok++;
    }

    return Object.entries(counts)
      .filter(([, v]) => v.total > 0)
      .map(([name, v]) => ({ name, ...v, successRate: v.total > 0 ? Math.round((v.ok / v.total) * 100) : 0 }));
  }, [enrichedServers]);

  const pieData = byTypeData.map((d) => ({ name: d.name, value: d.total }));

  // --- Errores por Sync ---
  const errorTrendData = useMemo(() =>
    data.syncRuns.slice().reverse().slice(-20).map((run) => ({
      fecha: new Date(run.syncedAt).toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" }),
      hora: new Date(run.syncedAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" }),
      errores: run.errors,
      ok: run.success,
      sinDatos: run.noData,
      total: run.total,
    })),
    [data.syncRuns]
  );

  // --- Top Errores ---
  const topErrors = useMemo(() => {
    const counts: Record<string, { count: number; lastError: string; serverName: string }> = {};
    for (const run of data.syncRuns) {
      for (const r of run.records) {
        if (r.status === "error") {
          if (!counts[r.serverName]) {
            counts[r.serverName] = { count: 0, lastError: r.errorDescription ?? "", serverName: r.serverName };
          }
          counts[r.serverName].count++;
          counts[r.serverName].lastError = r.errorDescription ?? counts[r.serverName].lastError;
        }
      }
    }
    return Object.values(counts).sort((a, b) => b.count - a.count).slice(0, 20);
  }, [data.syncRuns]);

  const tooltipStyle = {
    contentStyle: { backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "11px" },
    itemStyle: { color: "#e4e4e7" },
    labelStyle: { color: "#a1a1aa" },
  };

  return (
    <div className="space-y-4">
      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-zinc-900 rounded-xl w-fit border border-zinc-800">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              activeTab === tab
                ? "bg-indigo-600 text-white"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Por Tipo */}
      {activeTab === "Por Tipo" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-zinc-200 mb-4">Servidores por tipo</h2>
            <ResponsiveContainer width="100%" height={280}>
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
          </div>

          <div className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-zinc-200 mb-4">Distribución por tipo</h2>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={3} dataKey="value" stroke="none">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={TYPE_COLORS[entry.name] ?? "#6b7280"} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
                <Legend iconType="circle" iconSize={8} formatter={(v) => <span className="text-zinc-400 text-xs">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="glass rounded-2xl p-5 lg:col-span-2">
            <h2 className="text-sm font-semibold text-zinc-200 mb-4">Tasa de éxito por tipo</h2>
            <div className="space-y-2">
              {byTypeData.sort((a, b) => b.total - a.total).map((d) => (
                <div key={d.name} className="flex items-center gap-3">
                  <span className="text-xs text-zinc-400 w-24 shrink-0">{d.name}</span>
                  <div className="flex-1 h-2 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${d.successRate}%` }} />
                  </div>
                  <span className="text-xs text-zinc-400 w-16 text-right">{d.successRate}% <span className="text-zinc-600">({d.total})</span></span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Errores por Sync */}
      {activeTab === "Errores por Sync" && (
        <div className="space-y-5">
          <div className="glass rounded-2xl p-5">
            <h2 className="text-sm font-semibold text-zinc-200 mb-4">Tendencia de errores por sincronización</h2>
            {errorTrendData.length === 0 ? (
              <p className="text-zinc-500 text-sm text-center py-8">Sin datos de sincronizaciones aún.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={errorTrendData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                  <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: "#71717a" }} />
                  <YAxis tick={{ fontSize: 11, fill: "#71717a" }} />
                  <Tooltip {...tooltipStyle} labelFormatter={(_, payload) => payload?.[0]?.payload?.hora ?? ""} />
                  <Line type="monotone" dataKey="errores" name="Errores" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="ok" name="OK" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} />
                  <Line type="monotone" dataKey="sinDatos" name="Sin datos" stroke="#6b7280" strokeWidth={1} strokeDasharray="4 2" dot={false} />
                  <Legend formatter={(v) => <span className="text-zinc-400 text-xs">{v}</span>} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}

      {/* Listado de Syncs */}
      {activeTab === "Listado de Syncs" && (
        <div className="space-y-3">
          {data.syncRuns.length === 0 && (
            <div className="glass rounded-2xl p-12 text-center text-zinc-500">No hay sincronizaciones registradas.</div>
          )}
          {data.syncRuns.map((run) => {
            const successRate = run.total > 0 ? Math.round((run.success / run.total) * 100) : 0;
            const isOpen = expandedSync === run.id;
            return (
              <div key={run.id} className="glass rounded-2xl overflow-hidden">
                <button
                  className="w-full flex items-center justify-between p-4 hover:bg-white/[0.02] transition-colors"
                  onClick={() => setExpandedSync(isOpen ? null : run.id)}
                >
                  <div className="flex items-center gap-3">
                    {isOpen ? <ChevronDown className="w-4 h-4 text-indigo-400" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
                    <div className="text-left">
                      <p className="text-sm font-medium text-zinc-200">{new Date(run.syncedAt).toLocaleString("es-AR")}</p>
                      <p className="text-xs text-zinc-500">{run.total} servidores procesados</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 mr-2">
                    <div className="text-center">
                      <p className="text-lg font-bold text-emerald-400">{successRate}%</p>
                      <p className="text-[10px] text-zinc-600">éxito</p>
                    </div>
                    <div className="hidden sm:flex gap-4 text-xs">
                      <span className="text-emerald-400">✓ {run.success}</span>
                      <span className="text-rose-400">✕ {run.errors}</span>
                      <span className="text-zinc-500">― {run.noData}</span>
                    </div>
                  </div>
                </button>
                {isOpen && (
                  <div className="border-t border-zinc-800/60 p-4">
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
                          {run.records.map((r) => (
                            <tr key={r.serverName} className="hover:bg-white/[0.02]">
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

      {/* Top Errores */}
      {activeTab === "Top Errores" && (
        <div className="glass rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">
            Servidores con más fallas históricas
          </h2>
          {topErrors.length === 0 ? (
            <p className="text-zinc-500 text-sm text-center py-8">Sin errores registrados aún.</p>
          ) : (
            <div className="space-y-2">
              {topErrors.map((e, i) => (
                <div key={e.serverName} className="flex items-start gap-3 p-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
                  <span className={`text-xs font-bold w-5 text-center mt-0.5 ${i < 3 ? "text-rose-400" : "text-zinc-500"}`}>#{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-200">{e.serverName}</p>
                    <p className="text-[10px] text-zinc-600 mt-0.5 truncate">{e.lastError || "—"}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-bold text-rose-400">{e.count}</p>
                    <p className="text-[10px] text-zinc-600">fallas</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
