import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardView from "@/components/DashboardView";
import { ServerStatus } from "@/types";

export const revalidate = 0;

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (!session) {
    redirect("/login");
  }

  const [raw, rawSyncRuns, scheduledOrdersRaw, overridesRaw] = await Promise.all([
    prisma.serverStatus.findMany({ orderBy: { updatedAt: "desc" } }),
    prisma.syncRun.findMany({
      orderBy: { syncedAt: "desc" },
      take: 30,
      include: {
        records: {
          select: {
            serverName: true, ip: true, grupo: true, ambiente: true, os: true, installedKBs: true, status: true, errorDescription: true,
          },
        },
      },
    }),
    prisma.patchOrder.findMany({
      where: { status: "PENDING" }
    }),
    prisma.serverMappingOverride.findMany()
  ]);

  const servers: ServerStatus[] = raw.map((s) => ({
    ...s,
    updatedAt: new Date(s.updatedAt),
    createdAt: new Date(s.createdAt),
  }));

  const syncRuns = rawSyncRuns.map((run) => ({
    id: run.id,
    syncedAt: run.syncedAt.toISOString(),
    records: run.records,
  }));

  const scheduledOrders = scheduledOrdersRaw.map(o => ({
    ...o,
    scheduledAt: o.scheduledAt.toISOString()
  }));

  const overrides = overridesRaw.reduce((acc, curr) => {
    acc[curr.serverName] = curr.bank;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Centro de Control de Parcheo
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Monitoreo en tiempo real del estado de actualizaciones de servidores.
        </p>
      </div>
      <DashboardView initialData={servers} syncRuns={syncRuns} scheduledOrders={scheduledOrders} initialOverrides={overrides} />
    </div>
  );
}
