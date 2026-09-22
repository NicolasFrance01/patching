import { prisma } from "@/lib/prisma";
import CalendarioView from "@/components/CalendarioView";

export const dynamic = "force-dynamic";

export default async function CalendarioPage() {
  const orders = await prisma.patchOrder.findMany({
    orderBy: { scheduledAt: "asc" },
  });

  const serializedOrders = orders.map((o) => ({
    ...o,
    scheduledAt: o.scheduledAt.toISOString(),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }));

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Calendario de Parcheo
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Visualiza, programa y gestiona las ejecuciones de parcheo (WUU).
        </p>
      </div>
      <CalendarioView initialOrders={serializedOrders} />
    </div>
  );
}
