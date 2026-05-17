import { prisma } from "@/lib/prisma";
import ReportesView from "@/components/ReportesView";

export const revalidate = 0;

export default async function ReportesPage() {
  const [syncRuns, currentServers] = await Promise.all([
    prisma.syncRun.findMany({
      orderBy: { syncedAt: "desc" },
      take: 30,
      include: { records: { select: { serverName: true, ip: true, status: true, errorDescription: true } } },
    }),
    prisma.serverStatus.findMany({ orderBy: { updatedAt: "desc" } }),
  ]);

  const serialized = {
    syncRuns: syncRuns.map((r) => ({
      ...r,
      syncedAt: r.syncedAt.toISOString(),
    })),
    currentServers: currentServers.map((s) => ({
      ...s,
      updatedAt: s.updatedAt.toISOString(),
      createdAt: s.createdAt.toISOString(),
    })),
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Reportes
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Análisis y estadísticas del estado de parcheo.
        </p>
      </div>
      <ReportesView data={serialized} />
    </div>
  );
}
