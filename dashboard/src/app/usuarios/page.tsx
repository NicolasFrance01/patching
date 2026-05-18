import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import UsuariosView from "@/components/UsuariosView";

export const dynamic = "force-dynamic";

export default async function UsuariosPage() {
  const session = await getServerSession(authOptions);
  if ((session?.user as any)?.role !== "admin") redirect("/");

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, username: true, role: true, createdAt: true },
  });

  const serialized = users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() }));

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Gestión de Usuarios
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Administración de accesos al sistema.
        </p>
      </div>
      <UsuariosView users={serialized} />
    </div>
  );
}
