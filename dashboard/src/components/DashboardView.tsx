"use client";

import { useMemo, useState } from "react";
import { ServerStatus } from "@/types";
import { Server, CheckCircle2, XCircle, Clock, Search, AlertTriangle, X } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { getServerInfo, SERVER_TYPES, ServerType } from "@/lib/serverTypeMap";

interface DashboardViewProps {
  initialData: ServerStatus[];
}

type StatusFilter = "all" | "ok" | "error" | "nodata";

const AMBIENTES = ["Producción", "Desarrollo", "Test", "Sandbox"] as const;

export default function DashboardView({ initialData }: DashboardViewProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<ServerType | "all">("all");
  const [ambienteFilter, setAmbienteFilter] = useState<string>("all");

  const enriched = useMemo(() =>
    initialData.map((s) => ({
      ...s,
      info: getServerInfo(s.serverName, s.ip),
    })), [initialData]);

  const stats = useMemo(() => {
    const total = enriched.length;
    const errors = enriched.filter((s) => s.errorDescription && s.errorDescription !== "N/A").length;
    const noData = enriched.filter((s) => !s.os || s.os === "N/A").length;
    const success = total - errors - noData;
    return { total, success, errors, noData, successRate: total > 0 ? Math.round((success / total) * 100) : 0 };
  }, [enriched]);

  const chartData = [
    { name: "Sin errores", value: stats.success, color: "#10b981" },
    { name: "Con errores", value: stats.errors, color: "#ef4444" },
    { name: "Sin datos", value: stats.noData, color: "#6b7280" },
  ].filter((d) => d.value > 0);

  // Ambientes available for the currently selected type
  const availableAmbientes = useMemo(() => {
    const set = new Set<string>();
    for (const s of enriched) {
      if (typeFilter !== "all" && s.info?.type !== typeFilter) continue;
      const amb = s.info?.ambiente;
      if (amb && AMBIENTES.includes(amb as any)) set.add(amb);
    }
    return AMBIENTES.filter((a) => set.has(a));
  }, [enriched, typeFilter]);

  // Reset ambiente when type changes and current ambiente is not available
  const effectiveAmbiente = availableAmbientes.includes(ambienteFilter as any) || ambienteFilter === "all"
    ? ambienteFilter : "all";

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return enriched.filter((s) => {
      const isError = !!(s.errorDescription && s.errorDescription !== "N/A");
      const isNoData = !s.os || s.os === "N/A";
      if (statusFilter === "ok" && (isError || isNoData)) return false;
      if (statusFilter === "error" && !isError) return false;
      if (statusFilter === "nodata" && !isNoData) return false;
      if (typeFilter !== "all" && s.info?.type !== typeFilter) return false;
      if (effectiveAmbiente !== "all" && s.info?.ambiente !== effectiveAmbiente) return false;
      if (q) {
        return (
          s.serverName.toLowerCase().includes(q) ||
          (s.ip ?? "").includes(q) ||
          (s.os ?? "").toLowerCase().includes(q) ||
          (s.domain ?? "").toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [enriched, search, statusFilter, typeFilter, effectiveAmbiente]);

  const lastUpdated = enriched.length > 0
    ? new Date(enriched[0].updatedAt).toLocaleString("es-AR")
    : "—";

  function handleCardClick(filter: StatusFilter) {
    setStatusFilter((prev) => (prev === filter ? "all" : filter));
  }

  function handleTypeChange(t: ServerType | "all") {
    setTypeFilter(t);
    setAmbienteFilter("all");
  }

  const hasFilter = statusFilter !== "all" || typeFilter !== "all" || effectiveAmbiente !== "all" || search;

  return (
    <div className="space-y-5">
      <p className="text-xs text-zinc-500">
        Última sincronización: <span className="text-zinc-300">{lastUpdated}</span>
      </p>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard
          title="Total Servidores"
          value={stats.total}
          icon={<Server className="w-5 h-5 text-indigo-400" />}
          accent="indigo"
        />
        <MetricCard
          title="Sin Errores"
          value={stats.success}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
          accent="emerald"
          active={statusFilter === "ok"}
          onClick={() => handleCardClick("ok")}
        />
        <MetricCard
          title="Con Errores"
          value={stats.errors}
          icon={<XCircle className="w-5 h-5 text-rose-400" />}
          accent="rose"
          active={statusFilter === "error"}
          onClick={() => handleCardClick("error")}
        />
        <MetricCard
          title="Tasa de Éxito"
          value={`${stats.successRate}%`}
          icon={<Clock className="w-5 h-5 text-cyan-400" />}
          accent="cyan"
        />
      </div>

      {/* Layout principal: gráfico compacto + tabla dominante */}
      <div className="flex flex-col xl:flex-row gap-5 items-start">

        {/* Gráfico — columna lateral compacta */}
        <div className="glass rounded-2xl p-5 w-full xl:w-64 shrink-0">
          <h2 className="text-sm font-semibold text-zinc-200 mb-3">Resumen de Estado</h2>
          {stats.total > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={190}>
                <PieChart>
                  <Pie data={chartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value" stroke="none">
                    {chartData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: "#18181b", border: "1px solid #27272a", borderRadius: "8px", fontSize: "11px" }} itemStyle={{ color: "#e4e4e7" }} />
                  <Legend iconType="circle" iconSize={7} formatter={(v) => <span className="text-zinc-400 text-[11px]">{v}</span>} />
                </PieChart>
              </ResponsiveContainer>
              {stats.noData > 0 && (
                <div className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-500 border-t border-zinc-800 pt-2">
                  <AlertTriangle className="w-3 h-3 text-yellow-500 shrink-0" />
                  <span><span className="text-yellow-400">{stats.noData}</span> sin OS</span>
                </div>
              )}
            </>
          ) : (
            <div className="h-40 flex items-center justify-center text-zinc-600 text-sm">Sin datos</div>
          )}
        </div>

        {/* Tabla — ocupa todo el espacio restante */}
        <div className="glass rounded-2xl p-5 flex-1 min-w-0 flex flex-col">
          {/* Header + buscador */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <h2 className="text-sm font-semibold text-zinc-200 shrink-0">
              Detalle de Servidores
              <span className="ml-2 text-xs font-normal text-zinc-500">({filtered.length} de {enriched.length})</span>
            </h2>
            <div className="flex items-center gap-2">
              {hasFilter && (
                <button
                  onClick={() => { setSearch(""); setStatusFilter("all"); handleTypeChange("all"); }}
                  className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors whitespace-nowrap"
                >
                  <X className="w-3 h-3" /> Limpiar
                </button>
              )}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-500" />
                <input
                  type="text"
                  placeholder="Buscar servidor, IP, OS..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 w-full sm:w-52 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Filtro por tipo */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            <FilterPill label="Todos" active={typeFilter === "all"} onClick={() => handleTypeChange("all")} />
            {SERVER_TYPES.map((t) => (
              <FilterPill key={t} label={t} active={typeFilter === t} onClick={() => handleTypeChange(t)} />
            ))}
          </div>

          {/* Filtro por ambiente — solo aparece cuando hay tipos disponibles */}
          {availableAmbientes.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-3 pl-0.5">
              <span className="text-[10px] text-zinc-600 self-center mr-1">Ambiente:</span>
              <FilterPill label="Todos" active={effectiveAmbiente === "all"} onClick={() => setAmbienteFilter("all")} small />
              {availableAmbientes.map((a) => (
                <FilterPill key={a} label={a} active={effectiveAmbiente === a} onClick={() => setAmbienteFilter(a)} small />
              ))}
            </div>
          )}

          {/* Tabla */}
          <div className="overflow-auto flex-1 max-h-[560px]">
            <table className="w-full text-xs text-left">
              <thead className="sticky top-0 z-10 text-zinc-400 uppercase bg-zinc-950 border-b border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Servidor</th>
                  <th className="px-3 py-2 font-medium">IP</th>
                  <th className="px-3 py-2 font-medium hidden sm:table-cell">Tipo</th>
                  <th className="px-3 py-2 font-medium hidden md:table-cell">Ambiente</th>
                  <th className="px-3 py-2 font-medium hidden md:table-cell">OS</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                  <th className="px-3 py-2 font-medium hidden lg:table-cell">KBs</th>
                  <th className="px-3 py-2 font-medium hidden lg:table-cell">Últ. Inst.</th>
                  <th className="px-3 py-2 font-medium hidden xl:table-cell">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filtered.map((s) => {
                  const isError = !!(s.errorDescription && s.errorDescription !== "N/A");
                  const isNoData = !s.os || s.os === "N/A";
                  return (
                    <tr key={s.id} className="hover:bg-white/[0.025] transition-colors">
                      <td className="px-3 py-2.5 font-medium text-zinc-100 min-w-[160px]">
                        <span className="block" title={s.serverName}>{s.serverName}</span>
                      </td>
                      <td className="px-3 py-2.5 text-zinc-400 whitespace-nowrap">{s.ip ?? "—"}</td>
                      <td className="px-3 py-2.5 hidden sm:table-cell">
                        {s.info ? (
                          <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{s.info.type}</span>
                        ) : <span className="text-zinc-700 text-[10px]">—</span>}
                      </td>
                      <td className="px-3 py-2.5 hidden md:table-cell">
                        {s.info?.ambiente ? <AmbienteBadge ambiente={s.info.ambiente} /> : <span className="text-zinc-700">—</span>}
                      </td>
                      <td className="px-3 py-2.5 text-zinc-400 hidden md:table-cell min-w-[160px]">
                        <span className="block" title={s.os ?? ""}>
                          {s.os && s.os !== "N/A" ? s.os : <span className="text-zinc-700">—</span>}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {isNoData ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-600/30">Sin datos</span>
                        ) : isError ? (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">Error</span>
                        ) : (
                          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">OK</span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-zinc-400 hidden lg:table-cell min-w-[120px]">
                        <span className="block break-words" title={s.installedKBs ?? ""}>{s.installedKBs ?? "—"}</span>
                      </td>
                      <td className="px-3 py-2.5 text-zinc-400 whitespace-nowrap hidden lg:table-cell">{s.installDate ?? "—"}</td>
                      <td className="px-3 py-2.5 text-rose-400/80 hidden xl:table-cell min-w-[180px]">
                        {isError ? (
                          <span className="block text-[10px] whitespace-normal" title={s.errorDescription ?? ""}>{s.errorDescription}</span>
                        ) : <span className="text-zinc-700">—</span>}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={9} className="px-4 py-10 text-center text-zinc-600">No se encontraron servidores con ese criterio.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterPill({ label, active, onClick, small }: { label: string; active: boolean; onClick: () => void; small?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-md font-medium transition-colors border ${
        small ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-[11px]"
      } ${
        active
          ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
          : "bg-transparent text-zinc-500 border-zinc-700/50 hover:text-zinc-300 hover:border-zinc-600"
      }`}
    >
      {label}
    </button>
  );
}

function AmbienteBadge({ ambiente }: { ambiente: string }) {
  const colors: Record<string, string> = {
    "Producción": "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    "Desarrollo": "bg-amber-500/10 text-amber-400 border-amber-500/20",
    "Test": "bg-blue-500/10 text-blue-400 border-blue-500/20",
    "Sandbox": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };
  const cls = colors[ambiente] ?? "bg-zinc-500/10 text-zinc-400 border-zinc-600/20";
  return (
    <span className={`inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium border ${cls}`}>{ambiente}</span>
  );
}

function MetricCard({
  title, value, icon, accent, active, onClick,
}: {
  title: string; value: string | number; icon: React.ReactNode;
  accent: "indigo" | "emerald" | "rose" | "cyan";
  active?: boolean; onClick?: () => void;
}) {
  const gradients: Record<string, string> = {
    indigo: "from-indigo-500/5", emerald: "from-emerald-500/5",
    rose: "from-rose-500/5", cyan: "from-cyan-500/5",
  };
  const activeRing: Record<string, string> = {
    indigo: "", emerald: "ring-1 ring-emerald-500/40", rose: "ring-1 ring-rose-500/40", cyan: "",
  };
  return (
    <div
      onClick={onClick}
      className={`glass rounded-2xl p-5 flex items-start justify-between relative overflow-hidden group hover:border-white/10 transition-all ${onClick ? "cursor-pointer select-none" : ""} ${active ? activeRing[accent] : ""}`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[accent]} to-transparent ${active ? "opacity-100" : "opacity-0 group-hover:opacity-100"} transition-opacity`} />
      <div className="relative">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{title}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
        {onClick && <p className="text-[10px] text-zinc-600 mt-1">{active ? "✓ Filtro activo" : "Click para filtrar"}</p>}
      </div>
      <div className="relative p-2.5 bg-white/[0.04] rounded-xl border border-white/[0.06]">{icon}</div>
    </div>
  );
}
