"use client";

import { useState, useMemo } from "react";
import { Search, ChevronDown, ChevronRight, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface SyncRecord {
  id: string;
  serverName: string;
  ip: string | null;
  os: string | null;
  status: string;
  errorDescription: string | null;
  installDate: string | null;
  installedKBs: string | null;
  createdAt: string;
}

interface SyncRun {
  id: string;
  syncedAt: string;
  total: number;
  success: number;
  errors: number;
  noData: number;
  records: SyncRecord[];
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
  const [expandedDay, setExpandedDay] = useState<string | null>(() => {
    if (syncRuns.length === 0) return null;
    return toLocalDayKey(syncRuns[0].syncedAt);
  });
  const [expandedSync, setExpandedSync] = useState<string | null>(null);
  const [recordSearch, setRecordSearch] = useState<Record<string, string>>({});
  const [statusFilter, setStatusFilter] = useState<Record<string, string>>({});

  const filteredRuns = useMemo(() => {
    if (!search) return syncRuns;
    const q = search.toLowerCase();
    return syncRuns.filter((run) => {
      const dateStr = new Date(run.syncedAt).toLocaleString("es-AR").toLowerCase();
      if (dateStr.includes(q)) return true;
      return run.records.some(
        (r) => r.serverName.toLowerCase().includes(q) || (r.ip ?? "").includes(q) || r.status.includes(q)
      );
    });
  }, [syncRuns, search]);

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
        return {
          day,
          runs: sorted,
          serverCount: latest.total,
          totalSuccess: runs.reduce((s, r) => s + r.success, 0),
          totalErrors: runs.reduce((s, r) => s + r.errors, 0),
          totalNoData: runs.reduce((s, r) => s + r.noData, 0),
          successRate: latest.total > 0 ? Math.round((latest.success / latest.total) * 100) : 0,
        };
      });
  }, [filteredRuns]);

  function getFilteredRecords(run: SyncRun) {
    const q = (recordSearch[run.id] ?? "").toLowerCase();
    const sf = statusFilter[run.id] ?? "all";
    return run.records.filter((r) => {
      if (sf !== "all" && r.status !== sf) return false;
      if (!q) return true;
      return (
        r.serverName.toLowerCase().includes(q) ||
        (r.ip ?? "").includes(q) ||
        (r.os ?? "").toLowerCase().includes(q)
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
      {/* Búsqueda global */}
      <div className="glass rounded-xl p-4 flex items-center gap-3">
        <Search className="w-4 h-4 text-zinc-500 shrink-0" />
        <input
          type="text"
          placeholder="Buscar por fecha, servidor, IP, estado..."
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
      <div className="space-y-3">
        {dayGroups.map(({ day, runs, serverCount, totalSuccess, totalErrors, totalNoData, successRate }) => {
          const isDayOpen = expandedDay === day;

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
                    <p className="text-sm font-semibold text-zinc-200 capitalize">{formatDayHeader(day)}</p>
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
                    const syncSuccessRate = run.total > 0 ? Math.round((run.success / run.total) * 100) : 0;
                    const records = getFilteredRecords(run);

                    return (
                      <div key={run.id}>
                        {/* Sync sub-header */}
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
                              <p className="text-xs font-medium text-zinc-300">Sync · {syncTime}</p>
                              <p className="text-[10px] text-zinc-600">{run.total} servidores</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 mr-2 text-[11px]">
                            <span className="text-emerald-400">✓ {run.success}</span>
                            <span className="text-rose-400">✕ {run.errors}</span>
                            <span className="text-zinc-500">― {run.noData}</span>
                            <span className="text-zinc-400">{syncSuccessRate}%</span>
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
                                  placeholder="Filtrar servidor, IP, OS..."
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

                            <div className="overflow-auto max-h-80">
                              <table className="w-full text-xs text-left">
                                <thead className="sticky top-0 bg-zinc-900 text-zinc-400 uppercase">
                                  <tr>
                                    <th className="px-3 py-2 font-medium">Servidor</th>
                                    <th className="px-3 py-2 font-medium">IP</th>
                                    <th className="px-3 py-2 font-medium">Estado</th>
                                    <th className="px-3 py-2 font-medium hidden md:table-cell">OS</th>
                                    <th className="px-3 py-2 font-medium hidden lg:table-cell">KBs</th>
                                    <th className="px-3 py-2 font-medium hidden xl:table-cell">Error</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-zinc-800/40">
                                  {records.map((r) => (
                                    <tr key={r.id} className="hover:bg-white/[0.02]">
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
                                      <td className="px-3 py-2 text-zinc-400 hidden md:table-cell">{r.os ?? "—"}</td>
                                      <td className="px-3 py-2 text-zinc-400 hidden lg:table-cell">{r.installedKBs ?? "—"}</td>
                                      <td className="px-3 py-2 text-rose-400/80 hidden xl:table-cell text-[10px]">{r.errorDescription ?? "—"}</td>
                                    </tr>
                                  ))}
                                  {records.length === 0 && (
                                    <tr>
                                      <td colSpan={6} className="px-4 py-6 text-center text-zinc-600">Sin resultados.</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <p className="text-xs text-zinc-600 text-right">{records.length} de {run.records.length} registros</p>
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
    </div>
  );
}
