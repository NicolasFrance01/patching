const fs = require('fs');
const path = require('path');

const files = [
  'Listado de servidores GP 1(BSC).csv',
  'Listado de servidores GP 1(BSJ).csv',
  'Listado de servidores GP 1(CORP).csv',
  'Listado de servidores GP 1(NBERSA).csv',
  'Listado de servidores GP 1(NBSF).csv'
];

const servers = {};
const ips = {};
const serverTypes = new Set();
const groupSet = new Set();

for (const file of files) {
  const csvPath = path.join(__dirname, 'public', file);
  if (!fs.existsSync(csvPath)) continue;
  
  const raw = fs.readFileSync(csvPath);
  let content = raw[0] === 0xFF && raw[1] === 0xFE ? raw.toString('utf16le') : raw.toString('utf8');
  const lines = content.split(/\r?\n/);
  
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const separator = lines[i].includes(';') ? ';' : ',';
    const parts = lines[i].split(separator);
    
    const cliente = parts[0]?.trim();
    const grupo = parts[1]?.trim() || '';
    const ambiente = parts[6]?.trim() || '';
    const ip = parts[3]?.trim();
    const server = parts[5]?.trim();
    
    if (server && cliente) {
      servers[server] = { type: cliente, ambiente, grupo };
      serverTypes.add(cliente);
      if (grupo) groupSet.add(grupo);
      if (ip) ips[ip] = servers[server];
    }
  }
}

const typeArr = Array.from(serverTypes).sort();
const groupArr = Array.from(groupSet).sort();
const sortedServers = Object.keys(servers).sort().reduce((acc, k) => { acc[k] = servers[k]; return acc; }, {});
const sortedIPs = Object.keys(ips).sort().reduce((acc, k) => { acc[k] = ips[k]; return acc; }, {});

let tsContent = `// Auto-generated from multiple CSVs
export type ServerType = ${typeArr.length > 0 ? typeArr.map(t => '\'' + t + '\'').join(' | ') : 'string'};
export type Ambiente = string;

export interface ServerInfo { type: ServerType; ambiente: Ambiente; grupo?: string; }

export const SERVER_TYPES: ServerType[] = [${typeArr.map(t => '\'' + t + '\'').join(', ')}];

export const GROUPS: string[] = [${groupArr.map(g => JSON.stringify(g)).join(', ')}];

export const serverTypeMap: Record<string, ServerInfo> = ${JSON.stringify(sortedServers, null, 2)};

export const serverIPMap: Record<string, ServerInfo> = ${JSON.stringify(sortedIPs, null, 2)};

export function getServerInfo(serverName: string, ip?: string | null): ServerInfo | null {
  if (!serverName) return null;
  const nameTrimmed = serverName.trim();
  const byName = serverTypeMap[nameTrimmed] ?? serverTypeMap[nameTrimmed.toUpperCase()] ?? null;
  if (byName) return byName;

  const shortName = nameTrimmed.split('.')[0];
  if (shortName && shortName !== nameTrimmed) {
    const byShort = serverTypeMap[shortName] ?? serverTypeMap[shortName.toUpperCase()] ?? null;
    if (byShort) return byShort;
  }

  if (ip && ip !== 'N/A') {
    const byIP = serverIPMap[ip.trim()] ?? null;
    if (byIP) return byIP;
  }

  const upper = nameTrimmed.toUpperCase();
  if (upper.includes('BSJ')) return { type: 'BSJ', ambiente: '' };
  if (upper.includes('NBSF') || upper.includes('BSF')) return { type: 'NBSF', ambiente: '' };
  if (upper.includes('NBERSA') || upper.includes('BER')) return { type: 'NBERSA', ambiente: '' };
  if (upper.includes('BSC')) return { type: 'BSC', ambiente: '' };
  if (upper.includes('ASJ')) return { type: 'ASJ', ambiente: '' };
  if (upper.includes('QUALIA')) return { type: 'QUALIA', ambiente: '' };
  if (upper.includes('CORP')) return { type: 'Corp', ambiente: '' };

  return null;
}
`;

fs.writeFileSync(path.join(__dirname, 'src', 'lib', 'serverTypeMap.ts'), tsContent, 'utf-8');
