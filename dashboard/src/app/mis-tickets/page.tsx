import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import JiraView from "@/components/JiraView";

export const dynamic = "force-dynamic";

export default async function MisTicketsPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");

  const username = session?.user?.name ?? undefined;

  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Mis Tickets Realizados
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Listado de los tickets que vos creaste.
        </p>
      </div>
      <JiraView creatorOnly={true} creatorUsername={username} />
    </div>
  );
}
