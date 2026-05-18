import { prisma } from "@/lib/prisma";
import HistorialView from "@/components/HistorialView";

export const dynamic = "force-dynamic";

export default async function HistorialPage() {
  const syncRuns = await prisma.syncRun.findMany({
    orderBy: { syncedAt: "desc" },
    take: 50,
    include: {
      records: {
        orderBy: { serverName: "asc" },
      },
    },
  });

  const serialized = syncRuns.map((run) => ({
    ...run,
    syncedAt: run.syncedAt.toISOString(),
    records: run.records.map((r) => ({
      ...r,
      createdAt: r.createdAt.toISOString(),
    })),
  }));

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Historial de Sincronizaciones
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Registro histórico de todas las sincronizaciones realizadas.
        </p>
      </div>
      <HistorialView syncRuns={serialized} />
    </div>
  );
}
