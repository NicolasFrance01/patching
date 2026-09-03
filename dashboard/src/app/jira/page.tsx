import JiraView from "@/components/JiraView";

export const dynamic = "force-dynamic";

export default function JiraPage() {
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
