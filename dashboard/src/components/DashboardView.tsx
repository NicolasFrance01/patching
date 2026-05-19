"use client";

import { useMemo, useState } from "react";
import { ServerStatus } from "@/types";
import { CheckCircle2, XCircle, Search, X } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { getServerInfo, SERVER_TYPES, ServerType } from "@/lib/serverTypeMap";

interface DashboardViewProps {
  initialData: ServerStatus[];
}

type StatusFilter = "all" | "ok" | "error" | "nodata";

export default function DashboardView({ initialData }: DashboardViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<ServerType | "all">("all");
  const [ambienteFilter, setAmbienteFilter] = useState<string>("all");

  const enriched = useMemo(() =>
    initialData.map((s) => ({
      ...s,
      info: getServerInfo(s.serverName, s.ip),
    })),
    [initialData]
  );

  const stats = useMemo(() => {
    const total = enriched.length;
    const errors  = enriched.filter((s) => !!(s.errorDescription && s.errorDescription !== "N/A")).length;
    const noData  = enriched.filter((s) => (!s.os || s.os === "N/A") && !(s.errorDescription && s.errorDescription !== "N/A")).length;
    const success = total - errors - noData;
    return { total, success, errors, noData, successRate: total > 0 ? Math.round((success / total) * 100) : 0 };
  }, [enriched]);

  const chartData = [
    { name: "Sin errores", value: stats.success, color: "#10b981" },
    { name: "Con errores", value: stats.errors,  color: "#ef4444" },
    { name: "Sin OS",      value: stats.noData,  color: "#52525b" },
  ].filter((d) => d.value > 0);

  const availableAmbientes = useMemo(() => {
    const set = new Set<string>();
    for (const s of enriched) {
      if (typeFilter !== "all" && s.info?.type !== typeFilter) continue;
      if (s.info?.ambiente) set.add(s.info.ambiente);
    }
    return Array.from(set).sort();
  }, [enriched, typeFilter]);

  const effectiveAmbiente = availableAmbientes.includes(ambienteFilter) || ambienteFilter === "all"
    ? ambienteFilter : "all";

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return enriched.filter((s) => {
      const isError  = !!(s.errorDescription && s.errorDescription !== "N/A");
      const isNoData = (!s.os || s.os === "N/A") && !isError;

      if (statusFilter === "ok"     && (isError || isNoData)) return false;
      if (statusFilter === "error"  && !isError)              return false;
      if (statusFilter === "nodata" && !isNoData)             return false;
      if (typeFilter !== "all" && s.info?.type !== typeFilter) return false;
      if (effectiveAmbiente !== "all" && s.info?.ambiente !== effectiveAmbiente) return false;
      if (q && !s.serverName.toLowerCase().includes(q) && !(s.ip ?? "").includes(q)) return false;
      return true;
    });
  }, [enriched, statusFilter, typeFilter, effectiveAmbiente, search]);

  const lastUpdated = enriched.length > 0
    ? new Date(enriched[0].updatedAt).toLocaleString("es-AR")
    : "—";

  function handleCardClick(f: StatusFilter) {
    setStatusFilter((prev) => (prev === f ? "all" : f));
  }

  function handleTypeChange(t: ServerType | "all") {
    setTypeFilter(t);
    setAmbienteFilter("all");
  }

  const hasFilter = statusFilter !== "all" || typeFilter !== "all" || effectiveAmbiente !== "all" || !!search;

  return (
    <div className="space-y-5 p-6 md:p-8">
      <p className="text-xs text-zinc-500">
        Última sincronización: <span className="text-zinc-300">{lastUpdated}</span>
      </p>

      {/* Metric cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="glass rounded-2xl p-4 space-y-1">
          <p className="text-xs text-zinc-500">Total</p>
          <p className="text-2xl font-bold text-zinc-100">{stats.total}</p>
          <p className="text-xs text-zinc-600">servidores</p>
        </div>

        <button
          onClick={() => handleCardClick("ok")}
          className={`glass rounded-2xl p-4 space-y-1 text-left transition-all ${
            statusFilter === "ok" ? "ring-2 ring-emerald-500/50" : "hover:bg-white/[0.03]"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            <p className="text-xs text-zinc-500">Sin errores</p>
          </div>
          <p className="text-2xl font-bold text-emerald-400">{stats.success}</p>
          <p className="text-xs text-zinc-600">{stats.successRate}% del total</p>
        </button>

        <button
          onClick={() => handleCardClick("error")}
          className={`glass rounded-2xl p-4 space-y-1 text-left transition-all ${
            statusFilter === "error" ? "ring-2 ring-rose-500/50" : "hover:bg-white/[0.03]"
          }`}
        >
          <div className="flex items-center gap-1.5">
            <XCircle className="w-3.5 h-3.5 text-rose-400" />
            <p className="text-xs text-zinc-500">Con errores</p>
          </div>
          <p className="text-2xl font-bold text-rose-400">{stats.errors}</p>
          <p className="text-xs text-zinc-600">requieren atención</p>
        </button>

        <div className="glass rounded-2xl p-4 space-y-1">
          <p className="text-xs text-zinc-500">Tasa de éxito</p>
          <p className="text-2xl font-bold text-indigo-400">{stats.successRate}%</p>
          <p className="text-xs text-zinc-600">actualización OK</p>
        </div>
      </div>

      {/* Type filter pills */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => handleTypeChange("all")}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            typeFilter === "all"
              ? "bg-indigo-600 text-white"
              : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
          }`}
        >
          Todos los tipos
        </button>
        {SERVER_TYPES.map((t) => (
          <button
            key={t}
            onClick={() => handleTypeChange(t)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              typeFilter === t
                ? "bg-indigo-600 text-white"
                : "bg-zinc-800 text-zinc-400 hover:text-zinc-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Ambiente sub-filter */}
      {availableAmbientes.length > 0 && (
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setAmbienteFilter("all")}
            className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
              effectiveAmbiente === "all"
                ? "bg-zinc-600 text-white"
                : "bg-zinc-800/60 text-zinc-500 hover:text-zinc-300"
            }`}
          >
            Todos
          </button>
          {availableAmbientes.map((a) => (
            <button
              key={a}
              onClick={() => setAmbienteFilter(a)}
              className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium transition-colors ${
                effectiveAmbiente === a
                  ? "bg-zinc-600 text-white"
                  : "bg-zinc-800/60 text-zinc-500 hover:text-zinc-300"
              }`}
            >
              {a}
            </button>
          ))}
        </div>
      )}

      {/* Chart + Table */}
      <div className="flex flex-col xl:flex-row gap-5">
        {/* Pie chart */}
        <div className="glass rounded-2xl p-5 w-full xl:w-64 shrink-0">
          <h2 className="text-sm font-semibold text-zinc-200 mb-2">Resumen de Estado</h2>
          <ResponsiveContainer width="99%" height={180}>
            <PieChart>
              <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={72} paddingAngle={3} dataKey="value" stroke="none">
                {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "11px" }}
                itemStyle={{ color: "#e4e4e7" }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-1.5 mt-2">
            {chartData.map((d) => {
              const isNodata = d.name === "Sin OS";
              return (
                <div key={d.name} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
                  {isNodata ? (
                    <button
                      onClick={() => handleCardClick("nodata")}
                      className={`text-xs flex-1 text-left transition-colors ${
                        statusFilter === "nodata" ? "text-zinc-200 font-medium" : "text-zinc-500 hover:text-zinc-300"
                      }`}
                    >
                      {d.value} sin OS
                    </button>
                  ) : (
                    <span className="text-xs text-zinc-500 flex-1">{d.name}</span>
                  )}
                  <span className="text-xs font-medium text-zinc-300">{d.value}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Table */}
        <div className="glass rounded-2xl flex-1 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-zinc-800/60">
            <h2 className="text-sm font-semibold text-zinc-200 flex-1">Detalle de Servidores</h2>
            {hasFilter && (
              <button
                onClick={() => { setStatusFilter("all"); setTypeFilter("all"); setAmbienteFilter("all"); setSearch(""); }}
                className="flex items-center gap-1 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <X className="w-3 h-3" /> Limpiar filtros
              </button>
            )}
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
              <input
                type="text"
                placeholder="Buscar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-700/50 rounded-lg text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-indigo-500/50 w-44"
              />
            </div>
            <span className="text-xs text-zinc-600">{filtered.length} de {stats.total}</span>
          </div>

          <div className="overflow-auto max-h-[560px]">
            <table className="w-full text-xs text-left">
              <thead className="sticky top-0 bg-zinc-900/95 backdrop-blur text-zinc-400 uppercase text-[10px]">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Servidor</th>
                  <th className="px-4 py-2.5 font-medium hidden sm:table-cell">IP</th>
                  <th className="px-4 py-2.5 font-medium hidden md:table-cell">Tipo</th>
                  <th className="px-4 py-2.5 font-medium hidden lg:table-cell">Ambiente</th>
                  <th className="px-4 py-2.5 font-medium hidden md:table-cell">OS</th>
                  <th className="px-4 py-2.5 font-medium hidden lg:table-cell">KB instalada</th>
                  <th className="px-4 py-2.5 font-medium">Estado</th>
                  <th className="px-4 py-2.5 font-medium hidden xl:table-cell">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-zinc-600">
                      Sin resultados para los filtros aplicados.
                    </td>
                  </tr>
                ) : (
                  filtered.map((s) => {
                    const isError  = !!(s.errorDescription && s.errorDescription !== "N/A");
                    const isNoData = (!s.os || s.os === "N/A") && !isError;
                    return (
                      <tr key={s.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-4 py-2.5 font-medium text-zinc-200 max-w-[180px] truncate">{s.serverName}</td>
                        <td className="px-4 py-2.5 text-zinc-400 hidden sm:table-cell font-mono">{s.ip ?? "—"}</td>
                        <td className="px-4 py-2.5 hidden md:table-cell">
                          {s.info?.type ? (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                              {s.info.type}
                            </span>
                          ) : (
                            <span className="text-zinc-600">—</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-zinc-400 hidden lg:table-cell text-[10px]">{s.info?.ambiente ?? "—"}</td>
                        <td className="px-4 py-2.5 text-zinc-400 hidden md:table-cell max-w-[140px] truncate">{s.os && s.os !== "N/A" ? s.os : "—"}</td>
                        <td className="px-4 py-2.5 text-zinc-400 hidden lg:table-cell text-[10px] max-w-[120px] truncate">
                          {s.installedKBs && s.installedKBs !== "N/A" && s.installedKBs !== "Ninguna/No detectada" ? s.installedKBs : "—"}
                        </td>
                        <td className="px-4 py-2.5">
                          {isError ? (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">Error</span>
                          ) : isNoData ? (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-600/30">Sin OS</span>
                          ) : (
                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">OK</span>
                          )}
                        </td>
                        <td className="px-4 py-2.5 text-rose-400/70 hidden xl:table-cell text-[10px] max-w-[200px] truncate">
                          {isError ? s.errorDescription : "—"}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
