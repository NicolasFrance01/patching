const fs = require('fs');
const path = require('path');
const publicDir = path.join(process.cwd(), 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.csv') && !f.includes('septiembre') && !f.includes('Duplicados'));

const serverTypeMap = {};
const groupsSet = new Set();
const serverTypesSet = new Set();

for (const file of files) {
  let type = 'Sin clasificar';
  if (file.includes('BSC')) type = 'BSC';
  else if (file.includes('BSJ')) type = 'BSJ';
  else if (file.includes('CORP')) type = 'Corporativo';
  else if (file.includes('NBERSA')) type = 'NBERSA';
  else if (file.includes('NBSF')) type = 'NBSF';

  if (type !== 'Sin clasificar') serverTypesSet.add(type);

  const content = fs.readFileSync(path.join(publicDir, file), 'utf8');
  const lines = content.split('\n');
  const headers = lines[0].toLowerCase();
  
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    const parts = line.split(';');
    const cols = parts.length > 1 ? parts : line.split(',');
    
    // Format: Cliente;Grupo;Dominio;IP;OS;Servidor;Ambiente
    if (headers.includes('cliente;grupo;dominio;ip;os;servidor;ambiente') || headers.includes('cliente,grupo,dominio,ip,os,servidor,ambiente')) {
      if (cols.length >= 7) {
        const grupo = cols[1].trim() || null;
        const rawDomain = cols[2].trim() || null;
        const ip = cols[3].trim() || null;
        const rawServerName = cols[5].trim();
        const ambiente = cols[6].trim() || null;
        
        if (rawServerName) {
          const serverName = (rawDomain && rawDomain !== "N/A" && rawDomain !== "null") ? `${rawServerName} (${rawDomain})` : rawServerName;
          
          serverTypeMap[serverName] = { type, grupo, ip, ambiente };
          if (grupo) groupsSet.add(grupo);
        }
      }
    }
  }
}

const groups = Array.from(groupsSet).sort();
const serverTypes = Array.from(serverTypesSet).sort();

const contentOut = `
export interface ServerInfo {
  type: string;
  grupo?: string | null;
  ip?: string | null;
  ambiente?: string | null;
}

export type ServerType = ${serverTypes.map(t => `"${t}"`).join(' | ')} | "Sin clasificar";

export const SERVER_TYPES: ServerType[] = [
  ${serverTypes.map(t => `"${t}"`).join(',\n  ')},
  "Sin clasificar"
];

export const GROUPS: string[] = [
  ${groups.map(g => `"${g}"`).join(',\n  ')}
];

export const serverTypeMap: Record<string, ServerInfo> = ${JSON.stringify(serverTypeMap, null, 2)};

export function getServerInfo(serverName: string): ServerInfo | undefined {
  if (serverTypeMap[serverName]) return serverTypeMap[serverName];
  
  // Fallback: If DB server name has no domain, try to find a match in the map that starts with "serverName ("
  if (!serverName.includes(' (')) {
    const prefix = serverName + ' (';
    const match = Object.keys(serverTypeMap).find(k => k.startsWith(prefix) || k === serverName);
    if (match) return serverTypeMap[match];
  }
  
  // Fallback 2: If DB server name HAS domain, but map does not
  const baseName = serverName.split(' (')[0];
  if (serverTypeMap[baseName]) return serverTypeMap[baseName];
  
  // Fallback 3: Find any key in map that shares the same baseName
  const matchBase = Object.keys(serverTypeMap).find(k => k.split(' (')[0].toLowerCase() === baseName.toLowerCase());
  if (matchBase) return serverTypeMap[matchBase];
  
  return undefined;
}
`;

fs.writeFileSync('src/lib/serverTypeMap.ts', contentOut);
console.log('Successfully generated serverTypeMap.ts with ' + Object.keys(serverTypeMap).length + ' servers.');
