const fs = require('fs');
const schemaPath = './prisma/schema.prisma';
let schema = fs.readFileSync(schemaPath, 'utf8');

if (!schema.includes('ServerMappingOverride')) {
  schema += `\n
model ServerMappingOverride {
  id         String   @id @default(uuid())
  serverName String   @unique
  bank       String
  createdAt  DateTime @default(now())
  updatedAt  DateTime @updatedAt
}
`;
  fs.writeFileSync(schemaPath, schema, 'utf8');
  console.log('Appended model to schema');
} else {
  console.log('Model already exists');
}
