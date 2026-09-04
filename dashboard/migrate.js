const { PrismaClient } = require('@prisma/client'); 
const prisma = new PrismaClient(); 

async function main() { 
  const tickets = await prisma.jiraTicket.findMany(); 
  for (const t of tickets) { 
    if (!t.assignedUsername && t.creatorUsername) {
      await prisma.jiraTicket.update({ 
        where: { id: t.id }, 
        data: { assignedUsername: t.creatorUsername }
      }); 
    }
  } 
  console.log('Migrated ' + tickets.length + ' tickets'); 
} 

main().catch(console.error).finally(() => prisma.$disconnect());
