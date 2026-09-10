const fs = require('fs');

function fixAllCells(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');

    // Rewrite TruncatedCell completely
    const newHelper = `
function TruncatedCell({ 
  content, title, onClick, isError = false, children, extraClasses = ""
}: { 
  content: string | null | undefined;
  title: string;
  onClick: (detail: { title: string; content: string; isError?: boolean }) => void;
  isError?: boolean;
  children?: React.ReactNode;
  extraClasses?: string;
}) {
  const display = content ?? "—";
  
  return (
    <td className={\`px-3 py-2 min-w-[160px] max-w-[160px] \${isError ? "text-rose-400/80" : "text-zinc-400"} \${extraClasses}\`}>
      <button 
        onClick={() => onClick({ title, content: display, isError })}
        className={\`w-full text-left block text-[10px] truncate transition-colors \${isError ? "hover:text-rose-300" : "hover:text-zinc-200"}\`}
        title={\`Ver \${title} completo\`}
      >
        {children ? children : (!content || content === "—" || content === "N/A" ? <span className="text-zinc-700">—</span> : display)}
      </button>
    </td>
  );
}
`;
    // Replace the old TruncatedCell
    const helperStart = content.indexOf("function TruncatedCell({");
    const helperEnd = content.indexOf("export default function");
    if (helperStart !== -1 && helperEnd !== -1) {
        content = content.substring(0, helperStart) + newHelper + content.substring(helperEnd);
    }
    
    // Now replace the missing columns in DashboardView.tsx
    if (filepath.includes("DashboardView")) {
        // Servidor
        content = content.replace(
            /<td className="px-3 py-2\.5 font-medium text-zinc-100 min-w-\[160px\] max-w-\[160px\] truncate">[\s\S]*?<div className="flex flex-col gap-0\.5">[\s\S]*?<span className="truncate" title=\{server\.serverName\}>\{server\.serverName\}<\/span>[\s\S]*?\{server\.info && \([\s\S]*?<span className="text-\[9px\] font-bold px-1 py-0\.5 rounded w-fit"[\s\S]*?style=\{.*?\}>[\s\S]*?\{server\.info\.type\}[\s\S]*?<\/span>[\s\S]*?\)\}[\s\S]*?<\/div>[\s\S]*?<\/td>/,
            `<TruncatedCell title="Servidor" content={server.serverName} onClick={setSelectedDetail} extraClasses="text-zinc-200 font-medium">
                      <div className="flex flex-col gap-0.5">
                        <span className="truncate">{server.serverName}</span>
                        {server.info && (
                          <span className="text-[9px] font-bold px-1 py-0.5 rounded w-fit"
                            style={{ color: bankColor, backgroundColor: bankColor + "18", border: \`1px solid \${bankColor}33\` }}>
                            {server.info.type}
                          </span>
                        )}
                      </div>
                    </TruncatedCell>`
        );
        
        // Estado
        content = content.replace(
            /<td className="px-3 py-2\.5 min-w-\[160px\] max-w-\[160px\] truncate"><StatusBadge status=\{server\.status\} \/><\/td>/g,
            `<TruncatedCell title="Estado" content={server.status === "ok" ? "OK" : server.status === "error" ? "Error" : "Sin datos"} onClick={setSelectedDetail}><StatusBadge status={server.status} /></TruncatedCell>`
        );
    }

    fs.writeFileSync(filepath, content, 'utf8');
}

fixAllCells("src/components/DashboardView.tsx");
fixAllCells("src/components/HistorialView.tsx");
