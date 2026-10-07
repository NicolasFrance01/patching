const fs = require('fs');
const tsCode = fs.readFileSync('./src/lib/serverTypeMap.ts', 'utf8');
const mapMatch = tsCode.match(/export const serverTypeMap: Record<string, ServerInfo> = (\{[\s\S]*?\});/);
if (mapMatch) {
  const map = JSON.parse(mapMatch[1]);
  const counts = {};
  for (const k in map) {
    counts[map[k].type] = (counts[map[k].type] || 0) + 1;
  }
  console.log(counts);
}
