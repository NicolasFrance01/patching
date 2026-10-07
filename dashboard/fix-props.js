const fs = require('fs');

const dvPath = './src/components/DashboardView.tsx';
let dvContent = fs.readFileSync(dvPath, 'utf8');

dvContent = dvContent.replace(
  /interface DashboardViewProps \{\s+initialData: ServerStatus\[\];\s+syncRuns\?: SyncRun\[\];\s+creatorUsername\?: string;\s+scheduledOrders\?: PatchOrder\[\];\s+\}/m,
  `interface DashboardViewProps {\n  initialData: ServerStatus[];\n  syncRuns?: SyncRun[];\n  creatorUsername?: string;\n  scheduledOrders?: PatchOrder[];\n  initialOverrides?: Record<string, string>;\n}`
);

fs.writeFileSync(dvPath, dvContent, 'utf8');
console.log('Props replaced');
