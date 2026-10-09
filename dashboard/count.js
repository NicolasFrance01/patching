const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  const res = await c.query('SELECT COUNT(*) FROM "MonthlyServerStatus" WHERE month = $1', ['2026-09']);
  console.log('September count:', res.rows[0]);
  
  const res2 = await c.query('SELECT COUNT(*) FROM "MonthlyServerStatus" WHERE month = $1 AND status = $2', ['2026-09', 'Actualizado']);
  console.log('September Actualizados:', res2.rows[0]);
  
  await c.end();
}
run();
