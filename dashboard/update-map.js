const fs = require('fs');
const path = require('path');
const csvPath = path.join(__dirname, 'public', 'Listado de servidores GP septiembre 26.csv');
const raw = fs.readFileSync(csvPath);

// Detect encoding (UTF-16 LE or UTF-8/Latin1)
let content = '';
if (raw[0] === 0xFF && raw[1] === 0xFE) {
  content = raw.toString('utf16le');
} else {
  content = raw.toString('utf8');
}

const lines = content.split(/\r?\n/);
console.log('Total lines:', lines.length);

const servers = {};
const ips = {};
const serverTypes = new Set();

for (let i = 1; i < lines.length; i++) {
  if (!lines[i].trim()) continue;
  // some might use comma or semicolon
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
    if (ip) ips[ip] = servers[server];
  }
}

const typeArr = Array.from(serverTypes).sort();
const sortedServers = Object.keys(servers).sort().reduce((acc, k) => { acc[k] = servers[k]; return acc; }, {});
const sortedIPs = Object.keys(ips).sort().reduce((acc, k) => { acc[k] = ips[k]; return acc; }, {});

console.log('Types found:', typeArr);

let tsContent = `// Auto-generated from Listado de servidores GP septiembre 26.csv
export type ServerType = ${typeArr.length > 0 ? typeArr.map(t => '\'' + t + '\'').join(' | ') : 'string'};
export type Ambiente = string;

export interface ServerInfo { type: ServerType; ambiente: Ambiente; grupo?: string; }

export const SERVER_TYPES: ServerType[] = [${typeArr.map(t => '\'' + t + '\'').join(', ')}];

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
console.log('Total servers generated:', Object.keys(servers).length);
