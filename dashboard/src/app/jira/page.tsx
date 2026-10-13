import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import JiraView from "@/components/JiraView";

export const dynamic = "force-dynamic";

export default async function JiraPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/login");
  const role = ((session.user as any)?.role || "").toLowerCase();
  if (role !== "admin") redirect("/");
  return (
    <div className="p-6 md:p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
          Tickets de Jira
        </h1>
        <p className="mt-1 text-sm text-zinc-400">
          Listado de todos los tickets generados desde el Centro de Control de Parcheo.
        </p>
      </div>
      <JiraView />
    </div>
  );
}
