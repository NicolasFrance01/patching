const fs = require('fs');
const path = './src/components/DashboardView.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add imports
content = content.replace(
  'import { ServerStatus, SyncRun, PatchOrder } from "@/types";',
  'import { ServerStatus, SyncRun, PatchOrder } from "@/types";\nimport ServerBankManagerModal from "./ServerBankManagerModal";'
);

// 2. Update Props
content = content.replace(
  'scheduledOrders?: PatchOrder[];\n}',
  'scheduledOrders?: PatchOrder[];\n  initialOverrides?: Record<string, string>;\n}'
);

// 3. Update matchesBankFilter definition
content = content.replace(
  'function matchesBankFilter(serverName: string, bankFilters: BankFilter[]): boolean {',
  'function matchesBankFilter(serverName: string, bankFilters: BankFilter[], overrides: Record<string, string> = {}): boolean {'
);
content = content.replace(
  'const info = getServerInfo(serverName);',
  'const info = getServerInfo(serverName);\n    const overrideBank = overrides[serverName];\n    if (overrideBank && bankFilters.includes(overrideBank as BankFilter)) return true;'
);

// 4. Component signature and state
content = content.replace(
  'export default function DashboardView({ initialData, syncRuns = [], creatorUsername, scheduledOrders = [] }: DashboardViewProps) {',
  `export default function DashboardView({ initialData, syncRuns = [], creatorUsername, scheduledOrders = [], initialOverrides = {} }: DashboardViewProps) {
  const [overrides, setOverrides] = useState<Record<string, string>>(initialOverrides);
  const [selectedBankManager, setSelectedBankManager] = useState<string | null>(null);
  const [showNoActDetails, setShowNoActDetails] = useState(false);
  const [localData, setLocalData] = useState<ServerStatus[]>(initialData);
  const [pieMode, setPieMode] = useState<"standard" | "no_act_details">("standard");
  `
);
// Fix localData dependencies
content = content.replace(/initialData/g, 'localData');
// But revert the one in the component signature!
content = content.replace('export default function DashboardView({ localData,', 'export default function DashboardView({ initialData,');

// 5. Update matchesBankFilter calls
content = content.replace(
  '!matchesBankFilter(s.serverName, bankFilters)',
  '!matchesBankFilter(s.serverName, bankFilters, overrides)'
);

// 6. Update byBankData logic to use overrides
const oldByBankDataStart = 'const byBankData = useMemo(() => {';
const oldByBankDataRegex = /const byBankData = useMemo\(\(\) => \{[\s\S]*?\}, \[filtered, bankFilters\]\);/;

const newByBankData = `const byBankData = useMemo(() => {
    const banks = bankFilters.includes("all")
      ? [...SERVER_TYPES, "Sin clasificar"]
      : bankFilters.map(b => b === "unclassified" ? "Sin clasificar" : b);

    const uniqueBanks = Array.from(new Set(banks));

    return uniqueBanks.map((bank) => {
      // Calculate expected total considering overrides!
      const expectedTotal = Object.keys(serverTypeMap).filter(k => {
        const type = overrides[k] || serverTypeMap[k].type;
        return type === bank;
      }).length;

      const srvs = filtered.filter((s) => {
        const info = getServerInfo(s.serverName);
        const b = overrides[s.serverName] || (info ? info.type : "Sin clasificar");
        return b === bank;
      });
      
      const total = expectedTotal > 0 ? expectedTotal : srvs.length;
      
      const ok = srvs.filter((s) => s.extendedStatus === "Actualizado").length;
      const noActualizados = total - ok;
      
      const sinConf = srvs.filter((s) => s.extendedStatus === "Sin Confirmación").length;
      const sinSnap = srvs.filter((s) => s.extendedStatus === "Sin Snap").length;
      const pendientes = srvs.filter((s) => s.extendedStatus === "Pendiente").length;
      
      const errors = srvs.filter((s) => s.extendedStatus === "Error").length;
      const revision = srvs.filter((s) => s.extendedStatus === "En Revisión").length;
      const nodata = srvs.filter((s) => s.extendedStatus === "Sin Datos").length;
      const pct = total > 0 ? Math.round((ok / total) * 100) : 0;
      
      const otroMotivo = noActualizados - (sinConf + sinSnap + pendientes);

      return { 
        name: bank, 
        total, 
        ok, 
        actualizados: ok,
        noActualizados,
        pctActualizados: total > 0 ? (ok / total * 100).toFixed(2) : "0.00",
        pctNoActualizados: total > 0 ? (noActualizados / total * 100).toFixed(2) : "0.00",
        sinConf, 
        sinSnap, 
        pendientes, 
        otroMotivo,
        errors,
        revision,
        nodata,
        pct
      };
    }).filter((d) => d.total > 0).sort((a, b) => b.total - a.total);
  }, [filtered, bankFilters, overrides]);`;

content = content.replace(oldByBankDataRegex, newByBankData);

// 7. Update KPIs
const oldKpisRegex = /<MetricCard title="Total Servidores"[\s\S]*?<MetricCard title="Sincronizados este mes"[\s\S]*?\/>\s*<\/div>/;

const newKpis = `<MetricCard title="Total Servidores" value={byBankData.reduce((acc, curr) => acc + curr.total, 0)} subtitle="Inventario evaluado" icon={<Server className="w-5 h-5 text-indigo-400"  />} accent="indigo"  />
        <MetricCard title="Actualizados"  value={byBankData.reduce((acc, curr) => acc + curr.actualizados, 0)} subtitle="Seguridad al día" icon={<CheckCircle2 className="w-5 h-5 text-emerald-400" />} accent="emerald" />
        <div className="cursor-pointer transition-transform hover:scale-105 relative" onClick={() => setShowNoActDetails(!showNoActDetails)}>
          <MetricCard title="No Actualizados" value={byBankData.reduce((acc, curr) => acc + curr.noActualizados, 0)} subtitle="Click para ver desglose" icon={<AlertCircle className="w-5 h-5 text-amber-400"  />} accent="amber"  />
          {showNoActDetails && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-zinc-900 border border-amber-500/30 p-3 rounded-xl shadow-xl z-10 text-xs flex flex-col gap-1 text-zinc-300">
              <div className="flex justify-between"><span>Errores:</span><span className="font-bold text-rose-400">{byBankData.reduce((acc, curr) => acc + curr.errors, 0)}</span></div>
              <div className="flex justify-between"><span>Sin Confirmar:</span><span className="font-bold text-orange-400">{byBankData.reduce((acc, curr) => acc + curr.sinConf, 0)}</span></div>
              <div className="flex justify-between"><span>Sin Snap:</span><span className="font-bold text-yellow-400">{byBankData.reduce((acc, curr) => acc + curr.sinSnap, 0)}</span></div>
            </div>
          )}
        </div>
        <MetricCard title="Sincronizados este mes" value={stats.total} subtitle="Servidores analizados" icon={<CheckCircle2 className="w-5 h-5 text-cyan-400" />} accent="cyan" />
      </div>`;

content = content.replace(oldKpisRegex, newKpis);

// 8. Update Donut Chart
const oldDonutRegex = /const donutData = useMemo\(\(\) => \{[\s\S]*?\}, \[stats\]\);/;
const newDonut = `const donutData = useMemo(() => {
    if (pieMode === "standard") {
      return [
        { name: "Actualizado", value: stats.ok, color: EXTENDED_STATUS_COLORS["Actualizado"] },
        { name: "No Actualizado", value: stats.total - stats.ok, color: EXTENDED_STATUS_COLORS["Error"] },
      ].filter(d => d.value > 0);
    } else {
      return [
        { name: "Actualizado", value: stats.ok, color: EXTENDED_STATUS_COLORS["Actualizado"] },
        { name: "Error", value: stats.errors, color: EXTENDED_STATUS_COLORS["Error"] },
        { name: "Sin Confirmación", value: stats.sinConf, color: EXTENDED_STATUS_COLORS["Sin Confirmación"] },
        { name: "Sin Snap", value: stats.sinSnap, color: EXTENDED_STATUS_COLORS["Sin Snap"] },
        { name: "En Revisión", value: stats.revision, color: EXTENDED_STATUS_COLORS["En Revisión"] },
        { name: "Pendiente", value: stats.pendientes, color: EXTENDED_STATUS_COLORS["Pendiente"] },
        { name: "Sin Datos", value: stats.noData, color: EXTENDED_STATUS_COLORS["Sin Datos"] }
      ].filter((d) => d.value > 0);
    }
  }, [stats, pieMode]);`;

content = content.replace(oldDonutRegex, newDonut);

// Donut onClick
content = content.replace(
  '<Pie data={donutData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none">',
  '<Pie data={donutData} cx="50%" cy="45%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value" stroke="none" onClick={(data) => { if (data.name === "No Actualizado") setPieMode("no_act_details"); else setPieMode("standard"); }} className="cursor-pointer">'
);

// 9. Table click for drilldown
content = content.replace(
  /<td className="px-2 py-2 text-right text-zinc-300 font-medium">\{b\.total\}<\/td>/g,
  '<td className="px-2 py-2 text-right text-zinc-300 font-medium cursor-pointer hover:text-indigo-400 underline decoration-indigo-500/50 underline-offset-2" onClick={() => setSelectedBankManager(b.name)} title="Ver y gestionar servidores">{b.total}</td>'
);

// 10. Insert Modal at the end
content = content.replace(
  '      {/* ── Charts Row 3: Calendario ─────────────────────────────────────────── */}',
  `      <ServerBankManagerModal
        isOpen={!!selectedBankManager}
        onClose={() => setSelectedBankManager(null)}
        bank={selectedBankManager || ""}
        syncedServers={filtered}
        overrides={overrides}
        onOverrideChange={(srv, newBank) => setOverrides(prev => ({ ...prev, [srv]: newBank }))}
        onServerDelete={(srv) => {
          setLocalData(prev => prev.filter(s => s.serverName !== srv));
        }}
      />
      {/* ── Charts Row 3: Calendario ─────────────────────────────────────────── */}`
);


fs.writeFileSync(path, content, 'utf8');
console.log('Update script executed successfully');
