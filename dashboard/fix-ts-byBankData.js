const fs = require('fs');

const path = './src/components/DashboardView.tsx';
let content = fs.readFileSync(path, 'utf8');

const regex = /  const byBankData = useMemo\(\(\) => \{[\s\S]*?\}, \[filtered, bankFilters\]\);/;

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
      
      // Keep old variables for other dependent memos
      const errors = srvs.filter((s) => s.extendedStatus === "Error").length;
      const revision = srvs.filter((s) => s.extendedStatus === "En Revisión").length;
      const nodata = srvs.filter((s) => s.extendedStatus === "Sin Datos").length;
      const pct = total > 0 ? Math.round((ok / total) * 100) : 0;
      
      const otroMotivo = noActualizados - (sinConf + sinSnap + pendientes);

      return { 
        name: bank, 
        total, 
        ok, // alias for actualizados
        actualizados: ok,
        noActualizados,
        pctActualizados: total > 0 ? (ok / total * 100).toFixed(2) : "0.00",
        pctNoActualizados: total > 0 ? (noActualizados / total * 100).toFixed(2) : "0.00",
        sinConf, 
        sinSnap, 
        pendientes, 
        otroMotivo,
        // Legacy fields for compilation compatibility:
        errors,
        revision,
        nodata,
        pct
      };
    }).filter((d) => d.total > 0).sort((a, b) => b.total - a.total);
  }, [filtered, bankFilters]);`;

content = content.replace(regex, newByBankData);

fs.writeFileSync(path, content, 'utf8');
console.log('Replaced byBankData successfully');
