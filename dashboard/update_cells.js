const fs = require('fs');

function updateFile(filepath) {
    let content = fs.readFileSync(filepath, 'utf8');

    // Update state definition
    content = content.replace(
        "const [selectedError, setSelectedError] = useState<string | null>(null);",
        "const [selectedDetail, setSelectedDetail] = useState<{ title: string; content: string; isError?: boolean } | null>(null);"
    );

    // Update modal rendering
    const modal_old = `      {/* Modal de Error */}
      {selectedError && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh] overflow-hidden border border-rose-500/20">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/50">
              <h3 className="text-sm font-semibold text-rose-400 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Detalle del Error
              </h3>
              <button onClick={() => setSelectedError(null)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 overflow-auto text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {selectedError}
            </div>
            <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/50 flex justify-end">
              <button
                onClick={() => setSelectedError(null)}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}`;
      
    const modal_new = `      {/* Modal de Detalles */}
      {selectedDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className={\`glass rounded-xl w-full max-w-lg shadow-2xl flex flex-col max-h-[80vh] overflow-hidden border \${selectedDetail.isError ? 'border-rose-500/20' : 'border-zinc-700/50'}\`}>
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/50">
              <h3 className={\`text-sm font-semibold flex items-center gap-2 \${selectedDetail.isError ? 'text-rose-400' : 'text-zinc-200'}\`}>
                {selectedDetail.isError && <AlertCircle className="w-4 h-4" />}
                {selectedDetail.title}
              </h3>
              <button onClick={() => setSelectedDetail(null)} className="text-zinc-400 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 overflow-auto text-sm text-zinc-300 whitespace-pre-wrap leading-relaxed">
              {selectedDetail.content}
            </div>
            <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/50 flex justify-end">
              <button
                onClick={() => setSelectedDetail(null)}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}`;
    content = content.replace(modal_old, modal_new);
    
    const helper = `
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
  if (!content || content === "—" || content === "N/A") {
    return (
      <td className={\`px-3 py-2.5 min-w-[160px] max-w-[160px] truncate \${extraClasses}\`}>
        {children || <span className="text-zinc-700">—</span>}
      </td>
    );
  }
  return (
    <td className={\`px-3 py-2.5 min-w-[160px] max-w-[160px] \${isError ? "text-rose-400/80" : "text-zinc-400"} \${extraClasses}\`}>
      {children ? children : (
        <button 
          onClick={() => onClick({ title, content: display, isError })}
          className={\`w-full text-left block text-[10px] truncate transition-colors \${isError ? "hover:text-rose-300" : "hover:text-zinc-200"}\`}
          title={\`Ver \${title} completo\`}
        >
          {display}
        </button>
      )}
    </td>
  );
}
`;
    if (!content.includes("function TruncatedCell")) {
        content = content.replace("export default function", helper + "\nexport default function");
    }

    const replacements = [
        [/<td className="px-3 py-2\.5 text-zinc-200 font-medium min-w-\[160px\] max-w-\[160px\] truncate" title=\{server\.serverName\}>\{server\.serverName\}<\/td>/g,
         '<TruncatedCell title="Servidor" content={server.serverName} onClick={setSelectedDetail} extraClasses="text-zinc-200 font-medium" />'],
         
        [/<td className="px-3 py-2\.5 min-w-\[160px\] max-w-\[160px\] truncate">\s*\{server\.grupo \? \(\s*<span className="px-1\.5 py-0\.5 rounded text-\[10px\] bg-indigo-500\/10 text-indigo-300 border border-indigo-500\/20">\{server\.grupo\}<\/span>\s*\) : <span className="text-zinc-700">—<\/span>\}\s*<\/td>/g,
         '<TruncatedCell title="Grupo" content={server.grupo} onClick={setSelectedDetail}>{server.grupo ? <span className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{server.grupo}</span> : <span className="text-zinc-700">—</span>}</TruncatedCell>'],
         
        [/<td className="px-3 py-2\.5 min-w-\[160px\] max-w-\[160px\] truncate">\s*\{server\.ambiente \? \(\s*<span className="px-1\.5 py-0\.5 rounded text-\[10px\] bg-violet-500\/10 text-violet-300 border border-violet-500\/20">\{server\.ambiente\}<\/span>\s*\) : <span className="text-zinc-700">—<\/span>\}\s*<\/td>/g,
         '<TruncatedCell title="Ambiente" content={server.ambiente} onClick={setSelectedDetail}>{server.ambiente ? <span className="px-1.5 py-0.5 rounded text-[10px] bg-violet-500/10 text-violet-300 border border-violet-500/20">{server.ambiente}</span> : <span className="text-zinc-700">—</span>}</TruncatedCell>'],

        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\] truncate" title=\{server\.domain \?\? ""\}>\{server\.domain \?\? "—"\}<\/td>/g,
         '<TruncatedCell title="Dominio" content={server.domain} onClick={setSelectedDetail} />'],
         
        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\] truncate" title=\{server\.ip \?\? ""\}>\{server\.ip \?\? "N\/A"\}<\/td>/g,
         '<TruncatedCell title="IP" content={server.ip} onClick={setSelectedDetail} />'],

        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\] truncate" title=\{server\.analista \?\? ""\}>\{server\.analista \?\? "—"\}<\/td>/g,
         '<TruncatedCell title="Analista" content={server.analista} onClick={setSelectedDetail} />'],
         
        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\]">\s*<span className="block truncate" title=\{server\.os \?\? ""\}>\{server\.os \?\? "—"\}<\/span>\s*<\/td>/g,
         '<TruncatedCell title="OS" content={server.os} onClick={setSelectedDetail} />'],

        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\] truncate" title=\{server\.osVersion \?\? ""\}>\{server\.osVersion \?\? "—"\}<\/td>/g,
         '<TruncatedCell title="Versión SO" content={server.osVersion} onClick={setSelectedDetail} />'],

        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\] truncate" title=\{server\.sqlInstancia \?\? ""\}>\{server\.sqlInstancia \?\? "—"\}<\/td>/g,
         '<TruncatedCell title="SQL Instancia" content={server.sqlInstancia} onClick={setSelectedDetail} />'],

        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\] truncate" title=\{server\.sqlVersion \?\? ""\}>\{server\.sqlVersion \?\? "—"\}<\/td>/g,
         '<TruncatedCell title="SQL Versión" content={server.sqlVersion} onClick={setSelectedDetail} />'],

        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\] truncate" title=\{server\.sqlUltimaActualizacion \?\? ""\}>\{server\.sqlUltimaActualizacion \?\? "—"\}<\/td>/g,
         '<TruncatedCell title="SQL Última Actualización" content={server.sqlUltimaActualizacion} onClick={setSelectedDetail} />'],

        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\] truncate" title=\{server\.fechaVentana \?\? ""\}>\{server\.fechaVentana \?\? "—"\}<\/td>/g,
         '<TruncatedCell title="Fecha Ventana" content={server.fechaVentana} onClick={setSelectedDetail} />'],

        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\]">\s*<span className="block truncate" title=\{server\.installedKBs \?\? ""\}>\{server\.installedKBs \?\? "—"\}<\/span>\s*<\/td>/g,
         '<TruncatedCell title="KBs Instaladas" content={server.installedKBs} onClick={setSelectedDetail} />'],

        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\] truncate" title=\{server\.installDate \?\? ""\}>\{server\.installDate \?\? "—"\}<\/td>/g,
         '<TruncatedCell title="Fecha de Instalación" content={server.installDate} onClick={setSelectedDetail} />'],

        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\] truncate" title=\{server\.runningTime \?\? ""\}>\{server\.runningTime \?\? "—"\}<\/td>/g,
         '<TruncatedCell title="Running Time" content={server.runningTime} onClick={setSelectedDetail} />'],

        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\]">\s*<span className="block truncate" title=\{server\.diskSpace \?\? ""\}>\{server\.diskSpace \?\? "—"\}<\/span>\s*<\/td>/g,
         '<TruncatedCell title="Espacio en Disco" content={server.diskSpace} onClick={setSelectedDetail} />'],

        [/<td className="px-3 py-2\.5 text-rose-400\/80 min-w-\[160px\] max-w-\[160px\]">\s*\{server\.isError \? \(\s*<button\s*onClick=\{[^}]*\}\s*className="w-full text-left block text-\[10px\] truncate hover:text-rose-300 transition-colors"\s*title="Ver error completo"\s*>\s*\{server\.errorDescription\}\s*<\/button>\s*\) : <span className="text-zinc-700">—<\/span>\}\s*<\/td>/g,
         '<TruncatedCell title="Detalle del Error" content={server.errorDescription} isError={true} onClick={setSelectedDetail} />'],

        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\]">\s*<span className="block truncate" title=\{server\.comentarios \?\? ""\}>\{server\.comentarios \?\? "—"\}<\/span>\s*<\/td>/g,
         '<TruncatedCell title="Comentarios" content={server.comentarios} onClick={setSelectedDetail} />'],

        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\] truncate" title=\{server\.snap \?\? ""\}>\{server\.snap \?\? "—"\}<\/td>/g,
         '<TruncatedCell title="Snap" content={server.snap} onClick={setSelectedDetail} />'],

        [/<td className="px-3 py-2\.5 text-zinc-400 min-w-\[160px\] max-w-\[160px\] truncate" title=\{server\.confirmado \?\? ""\}>\{server\.confirmado \?\? "—"\}<\/td>/g,
         '<TruncatedCell title="Confirmado" content={server.confirmado} onClick={setSelectedDetail} />']
    ];

    for (let [pattern, rep] of replacements) {
        content = content.replace(pattern, rep);
    }

    fs.writeFileSync(filepath, content, 'utf8');
}

updateFile("src/components/DashboardView.tsx");
