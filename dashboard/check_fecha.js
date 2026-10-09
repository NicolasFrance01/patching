const { Client } = require('pg');
require('dotenv').config();

async function run() {
  const c = new Client({ connectionString: process.env.DATABASE_URL });
  await c.connect();
  const res = await c.query('SELECT DISTINCT "fechaVentana" FROM "ServerStatus" WHERE "fechaVentana" IS NOT NULL LIMIT 20');
  console.log(res.rows.map(r => r.fechaVentana));
  await c.end();
}
run();
