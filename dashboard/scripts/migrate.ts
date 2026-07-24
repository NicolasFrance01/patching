import { PrismaClient } from '../prisma/generated/client';
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const neonUrl = "postgresql://neondb_owner:npg_CbgNVhDe6oO1@ep-plain-band-apfpx7th-pooler.c-7.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";
const azureUrl = "postgresql://patchingadmin:DBserver%232026!alg@patching-db.postgres.database.azure.com:5432/patching?sslmode=require";

async function migrate() {
    const poolNeon = new Pool({ connectionString: neonUrl, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000 });
    const adapterNeon = new PrismaPg(poolNeon);
    const neon = new PrismaClient({ adapter: adapterNeon });

    const poolAzure = new Pool({ connectionString: azureUrl, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000 });
    const adapterAzure = new PrismaPg(poolAzure);
    const azure = new PrismaClient({ adapter: adapterAzure });

    console.log("Fetching users from Neon...");
    const users = await neon.user.findMany();
    console.log(`Found ${users.length} users. Migrating to Azure...`);
    for (const u of users) {
        await azure.user.upsert({
            where: { username: u.username },
            update: u,
            create: u
        });
    }

    console.log("Fetching ServerStatus from Neon...");
    const statuses = await neon.serverStatus.findMany();
    console.log(`Found ${statuses.length} statuses. Migrating to Azure...`);
    
    let cnt = 0;
    for (const s of statuses) {
        await azure.serverStatus.upsert({
            where: { serverName: s.serverName },
            update: s,
            create: s
        });
        cnt++;
        if (cnt % 500 === 0) console.log(`Migrated ${cnt}/${statuses.length} statuses`);
    }

    console.log("Fetching SyncRuns from Neon...");
    const runs = await neon.syncRun.findMany();
    console.log(`Found ${runs.length} runs. Migrating...`);
    for (const r of runs) {
        await azure.syncRun.upsert({
            where: { id: r.id },
            update: r,
            create: r
        });
    }

    console.log("Fetching SyncHistories from Neon...");
    const histories = await neon.syncHistory.findMany();
    console.log(`Found ${histories.length} histories. Migrating...`);
    cnt = 0;
    for (const h of histories) {
        await azure.syncHistory.upsert({
            where: { id: h.id },
            update: h,
            create: h
        });
        cnt++;
        if(cnt % 500 === 0) console.log(`Migrated ${cnt}/${histories.length} histories`);
    }

    console.log("Migration complete!");
    process.exit(0);
}
migrate().catch((e) => {
    console.error(e);
    process.exit(1);
});
