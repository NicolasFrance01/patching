const fs = require('fs');
const path = require('path');
const publicDir = path.join(process.cwd(), 'public');
const files = fs.readdirSync(publicDir).filter(f => f.endsWith('.csv') && !f.includes('septiembre'));

const serverTypeMap = {};
const groupsSet = new Set();
const serverTypesSet = new Set();

for (const file of files) {
  let type = 'Sin clasificar';
  if (file.includes('1(BSC)')) type = 'Banco Santa Cruz';
  else if (file.includes('1(BSJ)')) type = 'Banco San Juan';
  else if (file.includes('1(CORP)')) type = 'Corpo';
  else if (file.includes('1(NBERSA)')) type = 'Banco Entre Rios';
  else if (file.includes('1(NBSF)')) type = 'Banco Santa Fe';
  else if (file.includes('septiembre 26')) type = 'all'; 

  if (type !== 'all') serverTypesSet.add(type);

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
        
        if (rawServerName && type !== 'all') {
          // If the server name is duplicated across domains, we must append the domain to make it unique
          const serverName = rawDomain ? `${rawServerName} (${rawDomain})` : rawServerName;
          
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

export type ServerType = ${serverTypes.map(t => `"${t}"`).join(' | ')};

export const SERVER_TYPES: ServerType[] = [
  ${serverTypes.map(t => `"${t}"`).join(',\n  ')}
];

export const GROUPS: string[] = [
  ${groups.map(g => `"${g}"`).join(',\n  ')}
];

export const serverTypeMap: Record<string, ServerInfo> = ${JSON.stringify(serverTypeMap, null, 2)};

export function getServerInfo(serverName: string): ServerInfo | undefined {
  return serverTypeMap[serverName];
}
`;

fs.writeFileSync('src/lib/serverTypeMap.ts', contentOut);
console.log('Successfully generated serverTypeMap.ts with ' + Object.keys(serverTypeMap).length + ' servers.');
