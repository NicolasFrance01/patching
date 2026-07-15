"use client";

import { useMemo, useState } from "react";
import { ServerStatus } from "@/types";
import { Server, CheckCircle2, XCircle, Clock, Search, AlertTriangle } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

interface DashboardViewProps {
  initialData: ServerStatus[];
}

export default function DashboardView({ initialData }: DashboardViewProps) {
  const [search, setSearch] = useState("");

  const stats = useMemo(() => {
    const total = initialData.length;
    const errors = initialData.filter(
      (s) => s.errorDescription && s.errorDescription !== "N/A"
    ).length;
    const unreachable = initialData.filter(
      (s) => !s.os || s.os === "N/A"
    ).length;
    const success = total - errors - unreachable;
    const successRate = total > 0 ? Math.round((success / total) * 100) : 0;
    return { total, success, errors, unreachable, successRate };
  }, [initialData]);

  const chartData = [
    { name: "Sin errores", value: stats.success,     color: "#10b981" },
    { name: "Con errores",  value: stats.errors,     color: "#ef4444" },
    { name: "Sin datos",    value: stats.unreachable, color: "#6b7280" },
  ].filter((d) => d.value > 0);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return initialData.filter(
      (s) =>
        s.serverName.toLowerCase().includes(q) ||
        (s.ip ?? "").includes(q) ||
        (s.os ?? "").toLowerCase().includes(q) ||
        (s.domain ?? "").toLowerCase().includes(q)
    );
  }, [initialData, search]);

  const lastUpdated = initialData.length > 0
    ? new Date(initialData[0].updatedAt).toLocaleString("es-AR")
    : "—";

  return (
    <div className="space-y-6">
      {/* Última actualización */}
      <p className="text-xs text-zinc-500">
        Última sincronización: <span className="text-zinc-300">{lastUpdated}</span>
      </p>

      {/* Métricas */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
        />
        <MetricCard
          title="Con Errores"
          value={stats.errors}
          icon={<XCircle className="w-5 h-5 text-rose-400" />}
          accent="rose"
        />
        <MetricCard
          title="Tasa de Éxito"
          value={`${stats.successRate}%`}
          icon={<Clock className="w-5 h-5 text-cyan-400" />}
          accent="cyan"
        />
      </div>

      {/* Gráfico + Tabla */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gráfico de torta */}
        <div className="glass rounded-2xl p-6 col-span-1 flex flex-col min-h-[320px]">
          <h2 className="text-base font-semibold text-zinc-200 mb-4">
            Resumen de Estado
          </h2>
          {stats.total > 0 ? (
            <div className="flex-1 w-full">
              <ResponsiveContainer width="100%" height={240}>
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="45%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                      fontSize: "12px",
                    }}
                    itemStyle={{ color: "#e4e4e7" }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(v) => (
                      <span className="text-zinc-400 text-xs">{v}</span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-zinc-500 text-sm">
              Sin datos disponibles aún.
            </div>
          )}
          {stats.unreachable > 0 && (
            <div className="mt-3 flex items-center gap-2 text-xs text-zinc-500 border-t border-zinc-800 pt-3">
              <AlertTriangle className="w-3.5 h-3.5 text-yellow-500 shrink-0" />
              <span>
                <span className="text-yellow-400">{stats.unreachable}</span> servidores sin información de OS (sin acceso / N/A)
              </span>
            </div>
          )}
        </div>

        {/* Tabla de servidores */}
        <div className="glass rounded-2xl p-6 col-span-1 lg:col-span-2 flex flex-col">
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
                placeholder="Buscar servidor, IP, OS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 pr-4 py-1.5 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-indigo-500 w-full sm:w-56 transition-colors"
              />
            </div>
          </div>

          <div className="overflow-auto flex-1 max-h-[420px]">
            <table className="w-full text-xs text-left">
              <thead className="sticky top-0 z-10 text-zinc-400 uppercase bg-zinc-950 border-b border-zinc-800">
                <tr>
                  <th className="px-3 py-2 font-medium">Servidor</th>
                  <th className="px-3 py-2 font-medium">IP</th>
                  <th className="px-3 py-2 font-medium hidden md:table-cell">Sistema Operativo</th>
                  <th className="px-3 py-2 font-medium">Estado</th>
                  <th className="px-3 py-2 font-medium hidden lg:table-cell">KBs Instaladas</th>
                  <th className="px-3 py-2 font-medium hidden lg:table-cell">Últ. Instalación</th>
                  <th className="px-3 py-2 font-medium hidden xl:table-cell">Error</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60">
                {filtered.map((server) => {
                  const isError = server.errorDescription && server.errorDescription !== "N/A";
                  const isUnreachable = !server.os || server.os === "N/A";
                  return (
                    <tr
                      key={server.id}
                      className="hover:bg-white/[0.025] transition-colors"
                    >
                      <td className="px-3 py-2.5 font-medium text-zinc-100 min-w-[180px]">
                        <span className="block" title={server.serverName}>
                          {server.serverName}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-zinc-400 whitespace-nowrap">{server.ip ?? "N/A"}</td>
                      <td className="px-3 py-2.5 text-zinc-400 hidden md:table-cell min-w-[200px]">
                        <span className="block" title={server.os ?? ""}>
                          {server.os && server.os !== "N/A" ? server.os : <span className="text-zinc-600">—</span>}
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        {isUnreachable ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-600/30">
                            Sin datos
                          </span>
                        ) : isError ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            Error
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                            OK
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2.5 text-zinc-400 hidden lg:table-cell min-w-[150px]">
                        <span className="block break-words" title={server.installedKBs ?? ""}>
                          {server.installedKBs ?? "—"}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-zinc-400 whitespace-nowrap hidden lg:table-cell">
                        {server.installDate ?? "—"}
                      </td>
                      <td className="px-3 py-2.5 text-rose-400/80 hidden xl:table-cell min-w-[200px]">
                        {isError ? (
                          <span className="block text-[10px] whitespace-normal" title={server.errorDescription ?? ""}>
                            {server.errorDescription}
                          </span>
                        ) : (
                          <span className="text-zinc-700">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center text-zinc-600">
                      No se encontraron servidores con ese criterio de búsqueda.
                    </td>
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

function MetricCard({
  title, value, icon, accent,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  accent: "indigo" | "emerald" | "rose" | "cyan";
}) {
  const gradients: Record<string, string> = {
    indigo:  "from-indigo-500/5",
    emerald: "from-emerald-500/5",
    rose:    "from-rose-500/5",
    cyan:    "from-cyan-500/5",
  };
  return (
    <div className={`glass rounded-2xl p-5 flex items-start justify-between relative overflow-hidden group hover:border-white/10 transition-all`}>
      <div className={`absolute inset-0 bg-gradient-to-br ${gradients[accent]} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`} />
      <div className="relative">
        <p className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{title}</p>
        <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
      </div>
      <div className="relative p-2.5 bg-white/[0.04] rounded-xl border border-white/[0.06]">
        {icon}
      </div>
    </div>
  );
}
