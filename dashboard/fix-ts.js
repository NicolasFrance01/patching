const fs = require('fs');

// 1. Fix DashboardView.tsx
const dvPath = './src/components/DashboardView.tsx';
let dvContent = fs.readFileSync(dvPath, 'utf8');

dvContent = dvContent.replace(
  'localData: ServerStatus[];',
  'initialData: ServerStatus[];'
);

dvContent = dvContent.replace(
  'const [localData, setLocalData] = useState<ServerStatus[]>(localData);',
  'const [localData, setLocalData] = useState<ServerStatus[]>(initialData);'
);

fs.writeFileSync(dvPath, dvContent, 'utf8');

// 2. Fix route.ts
const routePath = './src/app/api/server/[serverName]/route.ts';
let routeContent = fs.readFileSync(routePath, 'utf8');

routeContent = routeContent.replace(
  'export async function DELETE(req: Request, { params }: { params: { serverName: string } }) {',
  'export async function DELETE(req: Request, { params }: { params: any }) {\n    const serverName = params.serverName;'
);
// Make sure serverName extraction is replaced correctly
routeContent = routeContent.replace(
  'const { serverName } = params;',
  ''
);

fs.writeFileSync(routePath, routeContent, 'utf8');

console.log('Fixed TS errors in files');
