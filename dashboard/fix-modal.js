const fs = require('fs');

const path = './src/components/DashboardView.tsx';
let content = fs.readFileSync(path, 'utf8');

// 1. Remove the incorrectly placed modal
const modalStart = content.indexOf('<ServerBankManagerModal');
if (modalStart !== -1) {
  const modalEnd = content.indexOf('/>', modalStart) + 2;
  // Remove the modal from where it currently is
  content = content.slice(0, modalStart) + content.slice(modalEnd);
}

// 2. Insert it before `    </div>\n  );\n}\n\n// ─── MetricCard ───────────────────────────────────────────────────────────────`
const insertionPointStr = '    </div>\n  );\n}\n\n// ─── MetricCard ───────────────────────────────────────────────────────────────';
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

// It might be formatted slightly differently (e.g. carriage returns). Let's use regex.
const insertionRegex = /    <\/div>\s*?\n\s*\);\s*?\n\}\s*?\n\s*?\/\/\s*───\s*MetricCard/;
content = content.replace(insertionRegex, (match) => modalCode + match);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed modal placement');
