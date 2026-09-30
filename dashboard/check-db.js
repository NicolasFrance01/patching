const { Pool } = require('pg');
const fs = require('fs');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  const code = fs.readFileSync('./src/lib/serverTypeMap.ts', 'utf8');
  const match = code.match(/export const serverTypeMap: Record<string, ServerInfo> = (\{[\s\S]*?\});/);
  const map = JSON.parse(match[1]);

  function getServerInfo(serverName) {
    if (map[serverName]) return map[serverName];
    if (!serverName.includes(' (')) {
      const prefix = serverName + ' (';
      const m = Object.keys(map).find(k => k.startsWith(prefix) || k === serverName);
      if (m) return map[m];
    }
    const baseName = serverName.split(' (')[0];
    if (map[baseName]) return map[baseName];
    const matchBase = Object.keys(map).find(k => k.split(' (')[0].toLowerCase() === baseName.toLowerCase());
    if (matchBase) return map[matchBase];
    return undefined;
  }

  const { rows } = await pool.query('SELECT "serverName" FROM "MonthlyServerStatus" WHERE month = $1', ['2026-09']);
  console.log(`Total monthly servers in DB: ${rows.length}`);
  let unclassified = 0;
  for (const s of rows) {
    const info = getServerInfo(s.serverName);
    if (!info) {
      if (unclassified < 20) console.log(`Unclassified: ${s.serverName}`);
      unclassified++;
    }
  }
  console.log(`Total unclassified: ${unclassified}`);
}

check().catch(console.error).finally(() => pool.end());
