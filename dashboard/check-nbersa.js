const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });
require('ts-node/register');

const { getServerInfo } = require('./src/lib/serverTypeMap.ts');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function check() {
  const { rows } = await pool.query('SELECT "serverName" FROM "ServerStatus"');
  const counts = {};
  for (const s of rows) {
    const info = getServerInfo(s.serverName);
    const type = info ? info.type : 'Sin clasificar';
    counts[type] = (counts[type] || 0) + 1;
  }
  console.log(counts);
}

check().catch(console.error).finally(() => pool.end());
