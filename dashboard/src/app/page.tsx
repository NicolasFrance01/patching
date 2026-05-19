import { prisma } from "@/lib/prisma";
import DashboardView from "@/components/DashboardView";
import { ServerStatus } from "@/types";

export const dynamic = "force-dynamic";

export default async function Home() {
  const raw = await prisma.serverStatus.findMany({
    orderBy: {
      updatedAt: "desc",
    },
  });

  // Serialize dates to strings for client component
  const servers: ServerStatus[] = raw.map((s) => ({
    ...s,
    updatedAt: new Date(s.updatedAt),
    createdAt: new Date(s.createdAt),
  }));

  return (
    <main className="min-h-screen p-6 md:p-12 selection:bg-indigo-500/30">
      <div className="mx-auto max-w-7xl space-y-8">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
            Centro de Control de Parcheo
          </h1>
          <p className="mt-2 text-zinc-400">
            Monitoreo en tiempo real del estado de actualizaciones de servidores.
          </p>
        </div>

        <DashboardView initialData={servers} />
      </div>
    </main>
  );
}
