import { prisma } from "@/lib/prisma";
import DashboardView from "@/components/DashboardView";
import { ServerStatus } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const raw = await prisma.serverStatus.findMany({ orderBy: { updatedAt: "desc" } });

  const servers: ServerStatus[] = raw.map((s) => ({
    ...s,
    updatedAt: new Date(s.updatedAt),
    createdAt: new Date(s.createdAt),
  }));

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
      <DashboardView initialData={servers} />
    </div>
  );
}
