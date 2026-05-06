"use client";

import { useMemo } from "react";
import { ServerStatus } from "@/types";
import { Server, CheckCircle2, XCircle, Clock } from "lucide-react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface DashboardViewProps {
  initialData: ServerStatus[];
}

export default function DashboardView({ initialData }: DashboardViewProps) {
  const stats = useMemo(() => {
    const total = initialData.length;
    const errors = initialData.filter(
      (s) => s.errorDescription && s.errorDescription !== "N/A"
    ).length;
    const success = total - errors;
    const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

    return { total, success, errors, successRate };
  }, [initialData]);

  const chartData = [
    { name: "Success", value: stats.success, color: "#10b981" },
    { name: "Errors", value: stats.errors, color: "#ef4444" },
  ];

  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <MetricCard
          title="Total Servers"
          value={stats.total}
          icon={<Server className="w-5 h-5 text-indigo-400" />}
        />
        <MetricCard
          title="Successfully Patched"
          value={stats.success}
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />}
        />
        <MetricCard
          title="With Errors"
          value={stats.errors}
          icon={<XCircle className="w-5 h-5 text-rose-400" />}
        />
        <MetricCard
          title="Success Rate"
          value={`${stats.successRate}%`}
          icon={<Clock className="w-5 h-5 text-cyan-400" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart */}
        <div className="glass rounded-2xl p-6 col-span-1 flex flex-col items-center justify-center min-h-[300px]">
          <h2 className="text-lg font-medium text-zinc-200 mb-4 self-start">
            Status Overview
          </h2>
          {stats.total > 0 ? (
            <div className="w-full h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#18181b",
                      border: "1px solid #27272a",
                      borderRadius: "8px",
                    }}
                    itemStyle={{ color: "#e4e4e7" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <p className="text-zinc-500">No data available yet.</p>
          )}
        </div>

        {/* Table */}
        <div className="glass rounded-2xl p-6 col-span-1 lg:col-span-2 overflow-hidden flex flex-col">
          <h2 className="text-lg font-medium text-zinc-200 mb-4">
            Server Details
          </h2>
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-zinc-400 uppercase bg-zinc-900/50 border-b border-zinc-800">
                <tr>
                  <th className="px-4 py-3 font-medium">Server</th>
                  <th className="px-4 py-3 font-medium">IP Address</th>
                  <th className="px-4 py-3 font-medium">OS</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Installed KBs</th>
                  <th className="px-4 py-3 font-medium">Last Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {initialData.map((server) => {
                  const isError =
                    server.errorDescription && server.errorDescription !== "N/A";
                  return (
                    <tr
                      key={server.id}
                      className="hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-zinc-200">
                        {server.serverName}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">{server.ip}</td>
                      <td className="px-4 py-3 text-zinc-400 truncate max-w-[150px]" title={server.os || ""}>
                        {server.os}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            isError
                              ? "bg-rose-500/10 text-rose-400 border border-rose-500/20"
                              : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                          }`}
                        >
                          {isError ? "Error" : "OK"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-zinc-400 max-w-[200px] truncate" title={server.installedKBs || ""}>
                        {server.installedKBs}
                      </td>
                      <td className="px-4 py-3 text-zinc-400">
                        {new Date(server.updatedAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
                {initialData.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-zinc-500"
                    >
                      Waiting for server reports...
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
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
}) {
  return (
    <div className="glass rounded-2xl p-6 flex items-start justify-between relative overflow-hidden group hover:border-indigo-500/30 transition-colors">
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div>
        <p className="text-sm font-medium text-zinc-400">{title}</p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
          {value}
        </p>
      </div>
      <div className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.05]">
        {icon}
      </div>
    </div>
  );
}
