const fs = require('fs');

const path = './src/components/DashboardView.tsx';
let content = fs.readFileSync(path, 'utf8');

const oldByBankData = `  const byBankData = useMemo(() => {
    const banks = bankFilters.includes("all")
      ? [...SERVER_TYPES]
      : bankFilters.map(b => b === "unclassified" ? "Sin clasificar" : b);

    return banks.map((bank) => {
      const srvs = filtered.filter((s) => {
        const info = getServerInfo(s.serverName);
        const b = info ? info.type : "Sin clasificar";
        return b === bank;
      });
      const total      = srvs.length;
      const ok         = srvs.filter((s) => s.extendedStatus === "Actualizado").length;
      const errors     = srvs.filter((s) => s.extendedStatus === "Error").length;
      const sinConf    = srvs.filter((s) => s.extendedStatus === "Sin Confirmaci\\u00f3n").length;
      const sinSnap    = srvs.filter((s) => s.extendedStatus === "Sin Snap").length;
      const revision   = srvs.filter((s) => s.extendedStatus === "En Revisi\\u00f3n").length;
      const pendientes = srvs.filter((s) => s.extendedStatus === "Pendiente").length;
      const nodata     = srvs.filter((s) => s.extendedStatus === "Sin Datos").length;
      return { name: bank, total, ok, errors, sinConf, sinSnap, revision, pendientes, nodata, pct: total > 0 ? Math.round((ok / total) * 100) : 0 };
    }).filter((d) => d.total > 0).sort((a, b) => b.total - a.total);
  }, [filtered, bankFilters]);`;

const newByBankData = `  const byBankData = useMemo(() => {
    const banks = bankFilters.includes("all")
      ? [...SERVER_TYPES, "Sin clasificar"]
      : bankFilters.map(b => b === "unclassified" ? "Sin clasificar" : b);

    // Filter duplicates just in case
    const uniqueBanks = Array.from(new Set(banks));

    return uniqueBanks.map((bank) => {
      const expectedTotal = Object.values(serverTypeMap).filter(info => info.type === bank).length;

      const srvs = filtered.filter((s) => {
        const info = getServerInfo(s.serverName);
        const b = info ? info.type : "Sin clasificar";
        return b === bank;
      });
      
      const total = expectedTotal > 0 ? expectedTotal : srvs.length;
      
      const ok = srvs.filter((s) => s.extendedStatus === "Actualizado").length;
      const noActualizados = total - ok;
      
      const sinConf = srvs.filter((s) => s.extendedStatus === "Sin Confirmación").length;
      const sinSnap = srvs.filter((s) => s.extendedStatus === "Sin Snap").length;
      const pendientes = srvs.filter((s) => s.extendedStatus === "Pendiente").length;
      
      const otroMotivo = noActualizados - (sinConf + sinSnap + pendientes);

      return { 
        name: bank, 
        total, 
        actualizados: ok,
        noActualizados,
        pctActualizados: total > 0 ? (ok / total * 100).toFixed(2) : "0.00",
        pctNoActualizados: total > 0 ? (noActualizados / total * 100).toFixed(2) : "0.00",
        sinConf, 
        sinSnap, 
        pendientes, 
        otroMotivo
      };
    }).filter((d) => d.total > 0).sort((a, b) => b.total - a.total);
  }, [filtered, bankFilters]);`;

content = content.replace(/  const byBankData = useMemo\(\(\) => \{[\s\S]*?\}, \[filtered, bankFilters\]\);/, newByBankData);

const oldTable = `<table className="w-full text-xs table-fixed">`;
const newTableBlock = `<table className="w-full text-xs table-fixed min-w-[750px]">
                    <thead className="text-zinc-500 uppercase text-[10px]">
                      <tr>
                        <th className="px-2 py-2 text-left font-medium">Banco</th>
                        <th className="px-2 py-2 text-right font-medium">Servidores</th>
                        <th className="px-2 py-2 text-right font-medium" style={{color: EXTENDED_STATUS_COLORS["Actualizado"]}}>Act.</th>
                        <th className="px-2 py-2 text-right font-medium" style={{color: EXTENDED_STATUS_COLORS["Error"]}}>No Act.</th>
                        <th className="px-2 py-2 text-right font-medium text-emerald-400">% Act</th>
                        <th className="px-2 py-2 text-right font-medium text-rose-400">% No Act</th>
                        <th className="px-2 py-2 text-right font-medium" style={{color: EXTENDED_STATUS_COLORS["Sin Confirmación"]}}>S. Conf</th>
                        <th className="px-2 py-2 text-right font-medium" style={{color: EXTENDED_STATUS_COLORS["Sin Snap"]}}>S. Snap</th>
                        <th className="px-2 py-2 text-right font-medium" style={{color: EXTENDED_STATUS_COLORS["Pendiente"]}}>Pend</th>
                        <th className="px-2 py-2 text-right font-medium text-zinc-400">Otro</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/60">
                      {byBankData.map((b) => {
                        const color = TYPE_COLORS[b.name] ?? "#a855f7";
                        return (
                          <tr key={b.name} className="hover:bg-white/[0.02]">
                            <td className="px-2 py-2">
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-bold border"
                                style={{ color, borderColor: color + "44", backgroundColor: color + "15" }}>{b.name}</span>
                            </td>
                            <td className="px-2 py-2 text-right text-zinc-300 font-medium">{b.total}</td>
                            <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Actualizado"]}}>{b.actualizados}</td>
                            <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Error"]}}>{b.noActualizados}</td>
                            <td className="px-2 py-2 text-right text-emerald-400">{b.pctActualizados}%</td>
                            <td className="px-2 py-2 text-right text-rose-400">{b.pctNoActualizados}%</td>
                            <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Sin Confirmación"]}}>{b.sinConf}</td>
                            <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Sin Snap"]}}>{b.sinSnap}</td>
                            <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Pendiente"]}}>{b.pendientes}</td>
                            <td className="px-2 py-2 text-right text-zinc-400">{b.otroMotivo}</td>
                          </tr>
                        );
                      })}
                      {/* Total row */}
                      <tr className="bg-zinc-900/50 font-bold">
                        <td className="px-2 py-2 text-zinc-300">Total general</td>
                        <td className="px-2 py-2 text-right text-zinc-200">{byBankData.reduce((acc, curr) => acc + curr.total, 0)}</td>
                        <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Actualizado"]}}>{byBankData.reduce((acc, curr) => acc + curr.actualizados, 0)}</td>
                        <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Error"]}}>{byBankData.reduce((acc, curr) => acc + curr.noActualizados, 0)}</td>
                        <td className="px-2 py-2 text-right text-emerald-400">{byBankData.reduce((acc, curr) => acc + curr.total, 0) > 0 ? ((byBankData.reduce((acc, curr) => acc + curr.actualizados, 0) / byBankData.reduce((acc, curr) => acc + curr.total, 0)) * 100).toFixed(2) : "0.00"}%</td>
                        <td className="px-2 py-2 text-right text-rose-400">{byBankData.reduce((acc, curr) => acc + curr.total, 0) > 0 ? ((byBankData.reduce((acc, curr) => acc + curr.noActualizados, 0) / byBankData.reduce((acc, curr) => acc + curr.total, 0)) * 100).toFixed(2) : "0.00"}%</td>
                        <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Sin Confirmación"]}}>{byBankData.reduce((acc, curr) => acc + curr.sinConf, 0)}</td>
                        <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Sin Snap"]}}>{byBankData.reduce((acc, curr) => acc + curr.sinSnap, 0)}</td>
                        <td className="px-2 py-2 text-right" style={{color: EXTENDED_STATUS_COLORS["Pendiente"]}}>{byBankData.reduce((acc, curr) => acc + curr.pendientes, 0)}</td>
                        <td className="px-2 py-2 text-right text-zinc-400">{byBankData.reduce((acc, curr) => acc + curr.otroMotivo, 0)}</td>
                      </tr>
                    </tbody>
                  </table>`;

content = content.replace(/<table className="w-full text-xs table-fixed">[\s\S]*?<\/table>/, newTableBlock);

fs.writeFileSync(path, content, 'utf8');
console.log('Replaced successfully');
