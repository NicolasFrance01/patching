const fs = require('fs');

const path = './src/components/DashboardView.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Add import if not present
if (!content.includes('import ServerBankManagerModal')) {
  content = content.replace(
    'import KbExplorerModal from "./KbExplorerModal";',
    'import KbExplorerModal from "./KbExplorerModal";\nimport ServerBankManagerModal from "./ServerBankManagerModal";'
  );
}

// 2. Add Modal inside return tree
// Find the closing div of the main return
if (!content.includes('<ServerBankManagerModal')) {
  // Let's insert it before the very last `</div>`
  const insertionPoint = content.lastIndexOf('</div>');
  const modalCode = `
      <ServerBankManagerModal
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
`;
  content = content.slice(0, insertionPoint) + modalCode + content.slice(insertionPoint);
}

// 3. Fix byBankData to exclude "Sin clasificar"
if (!content.includes('filter((d) => d.total > 0 && d.name !== "Sin clasificar")')) {
  content = content.replace(
    '.filter((d) => d.total > 0).sort((a, b) => b.total - a.total);',
    '.filter((d) => d.total > 0 && d.name !== "Sin clasificar").sort((a, b) => b.total - a.total);'
  );
}

// 4. Fix KPI grid cols to fill the space
content = content.replace(
  'className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3"',
  'className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4"'
);
content = content.replace(
  'className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3"',
  'className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4"'
);

// 5. Add a button below the table for "Sin clasificar"
if (!content.includes('gestionar servidores sin clasificar')) {
  content = content.replace(
    '</table>\n              </div>\n            ) : (',
    `</table>
              </div>
              <div className="mt-4 flex justify-end">
                <button 
                  onClick={() => setSelectedBankManager("Sin clasificar")}
                  className="text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 px-3 py-1.5 rounded-lg border border-zinc-700 transition-colors"
                >
                  Ver y gestionar servidores sin clasificar
                </button>
              </div>
            ) : (`
  );
}

fs.writeFileSync(path, content, 'utf8');
console.log('Update successful');
