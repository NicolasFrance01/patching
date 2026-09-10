const fs = require('fs');

function fixHistorial(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');

    // Estado in HistorialView
    content = content.replace(
        /<td className="px-3 py-2 min-w-\[160px\] max-w-\[160px\] truncate">\s*\{r\.status === "ok" \? \([\s\S]*?<span className="inline-flex px-2 py-0\.5 rounded-full text-\[10px\] font-medium bg-emerald-500\/10 text-emerald-400 border border-emerald-500\/20">OK<\/span>[\s\S]*?\) : r\.status === "error" \? \([\s\S]*?<span className="inline-flex px-2 py-0\.5 rounded-full text-\[10px\] font-medium bg-rose-500\/10 text-rose-400 border border-rose-500\/20">Error<\/span>[\s\S]*?\) : \([\s\S]*?<span className="inline-flex px-2 py-0\.5 rounded-full text-\[10px\] font-medium bg-zinc-500\/10 text-zinc-400 border border-zinc-600\/30">Sin datos<\/span>[\s\S]*?\)\}\s*<\/td>/,
        `<TruncatedCell title="Estado" content={r.status === "ok" ? "OK" : r.status === "error" ? "Error" : "Sin datos"} onClick={setSelectedDetail}>
                                          {r.status === "ok" ? (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">OK</span>
                                          ) : r.status === "error" ? (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-rose-500/10 text-rose-400 border border-rose-500/20">Error</span>
                                          ) : (
                                            <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-500/10 text-zinc-400 border border-zinc-600/30">Sin datos</span>
                                          )}
                                        </TruncatedCell>`
    );

    fs.writeFileSync(filepath, content, 'utf8');
}

fixHistorial("src/components/HistorialView.tsx");
