import * as dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaNeon({ connectionString });
const prisma = new PrismaClient({ adapter });

const data = [
  // ─── Reporte 22/04/2026 ───────────────────────────────────────────────────
  { serverName: "BEROCEMS01T.petersen.corp",       domain: "petersen.corp", ip: "172.30.87.71",  os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSCOCEIS01T.petersen.corp",        domain: "petersen.corp", ip: "172.30.97.72",  os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSFINSTWEB02T.petersen.corp",      domain: "petersen.corp", ip: "10.50.82.98",   os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSJGCONTAWEB01T.petersen.corp",    domain: "petersen.corp", ip: "172.30.92.187", os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "CLOUDERAMS01T.petersen.corp",      domain: "petersen.corp", ip: "172.30.211.78", os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVINTEG01T.petersen.corp",        domain: "petersen.corp", ip: "172.30.82.81",  os: "Microsoft Windows Server 2022 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVSELENI02T.petersen.corp",       domain: "petersen.corp", ip: "172.30.211.55", os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVDBFCI01T.OLD.petersen.corp",    domain: "N/A",           ip: "N/A",           os: "N/A",                                    installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BERONBOARDMS02T.petersen.corp",    domain: "petersen.corp", ip: "172.30.87.181", os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSCSBALSQL01T.petersen.corp",      domain: "petersen.corp", ip: "172.30.97.74",  os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSFPWRCRVDA01T.petersen.corp",     domain: "petersen.corp", ip: "172.30.82.69",  os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSJOMNIRATL02T.petersen.corp",     domain: "petersen.corp", ip: "172.30.92.88",  os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVDOCDIN01T.petersen.corp",       domain: "petersen.corp", ip: "172.30.212.189",os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVPWCSYSCET.petersen.corp",       domain: "petersen.corp", ip: "172.30.211.217",os: "Microsoft Windows Server 2022 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVPWCSDSCI2T.petersen.corp",      domain: "N/A",           ip: "N/A",           os: "N/A",                                    installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BEROMNIPB01T.petersen.corp",       domain: "petersen.corp", ip: "172.30.85.81",  os: "Microsoft Windows Server 2016 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSCOMNIFS01T.petersen.corp",       domain: "petersen.corp", ip: "172.30.97.85",  os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSFOMNISQL01T.petersen.corp",      domain: "petersen.corp", ip: "172.30.82.90",  os: "Microsoft Windows Server 2016 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSJOMNISQL01T.petersen.corp",      domain: "petersen.corp", ip: "172.30.92.90",  os: "Microsoft Windows Server 2016 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "PWCCE-DAS-01T.petersen.corp",      domain: "petersen.corp", ip: "172.30.211.216",os: "Microsoft Windows Server 2022 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVINVAM02T.petersen.corp",        domain: "petersen.corp", ip: "172.30.211.101",os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVSQLCITAS01T.petersen.corp",     domain: "petersen.corp", ip: "172.30.211.193",os: "Microsoft Windows Server 2016 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSCCBANKIIS01T.petersen.corp",     domain: "petersen.corp", ip: "10.50.97.161",  os: "Microsoft Windows Server 2022 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BEROMNIWS02T.petersen.corp",       domain: "petersen.corp", ip: "172.30.87.81",  os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSCOMNIRATL01T.petersen.corp",     domain: "petersen.corp", ip: "172.30.97.88",  os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSFOCEAPI01T.petersen.corp",       domain: "petersen.corp", ip: "172.30.82.70",  os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSJINSTWEB02T.petersen.corp",      domain: "petersen.corp", ip: "10.50.92.98",   os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "PWCCI-DAS-01T.petersen.corp",      domain: "petersen.corp", ip: "172.30.211.175",os: "Microsoft Windows Server 2022 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVPACORESQL01T.petersen.corp",    domain: "petersen.corp", ip: "172.30.211.161",os: "Microsoft Windows Server 2022 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSFDEBMEDIADB01T.petersen.corp",   domain: "petersen.corp", ip: "172.30.211.97", os: "Microsoft Windows Server 2022 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BEROCEIS01T.petersen.corp",        domain: "petersen.corp", ip: "172.30.87.72",  os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSCOCEAPI01T.petersen.corp",       domain: "petersen.corp", ip: "172.30.97.70",  os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSFINSTWEB01T.petersen.corp",      domain: "petersen.corp", ip: "10.50.82.95",   os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSJGCONTASQL01T.petersen.corp",    domain: "petersen.corp", ip: "172.30.92.184", os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSJVUFADB01T.petersen.corp",       domain: "petersen.corp", ip: "172.30.92.185", os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVIIS02T.petersen.corp",          domain: "petersen.corp", ip: "172.30.16.180", os: "Microsoft Windows Server 2016 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVSELENI01T.petersen.corp",       domain: "petersen.corp", ip: "172.30.211.50", os: "Microsoft Windows Server 2019 Standard", installDate: "22/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  // ─── Reporte 29/04/2026 ───────────────────────────────────────────────────
  { serverName: "AONOCEDB01T",        domain: "petersen.corp", ip: "172.30.211.130", os: "Microsoft Windows Server 2019 Standard", installDate: "17/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BERPWRCRVDAS01T",    domain: "petersen.corp", ip: "172.30.87.68",   os: "Microsoft Windows Server 2019 Standard", installDate: "16/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSCPWRCRVDAS01T",    domain: "petersen.corp", ip: "172.30.97.68",   os: "Microsoft Windows Server 2019 Standard", installDate: "14/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSFONBOARDMS02T",    domain: "petersen.corp", ip: "172.30.82.181",  os: "Microsoft Windows Server 2019 Standard", installDate: "15/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSJOMNIFS01T",       domain: "petersen.corp", ip: "172.30.92.85",   os: "Microsoft Windows Server 2019 Standard", installDate: "14/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVDB01T",           domain: "petersen.corp", ip: "172.30.210.85",  os: "Microsoft Windows Server 2016 Standard", installDate: "19/08/2025", installedKBs: "Ninguna/No detectada", errorDescription: "There is not enough space on the disk." },
  { serverName: "SRVOMNIBOPI01T",     domain: "petersen.corp", ip: "172.30.211.56",  os: "Microsoft Windows Server 2019 Standard", installDate: "17/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BERABSDEV-W2019S01T",domain: "N/A",           ip: "N/A",            os: "N/A",                                    installDate: "N/A",         installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BERINSTBFF01T",      domain: "petersen.corp", ip: "172.30.87.95",   os: "Microsoft Windows Server 2019 Standard", installDate: "15/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSCINSTWEB01T",      domain: "petersen.corp", ip: "10.50.97.95",    os: "Microsoft Windows Server 2019 Standard", installDate: "14/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSFGCONTASQL01T",    domain: "petersen.corp", ip: "172.30.82.184",  os: "Microsoft Windows Server 2019 Standard", installDate: "15/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSJCBANKIIS01T",     domain: "petersen.corp", ip: "10.50.92.161",   os: "Microsoft Windows Server 2022 Standard", installDate: "18/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSJSBALSQL01T",      domain: "petersen.corp", ip: "172.30.92.74",   os: "Microsoft Windows Server 2019 Standard", installDate: "15/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVINTEG02T",        domain: "petersen.corp", ip: "172.30.82.82",   os: "Microsoft Windows Server 2022 Standard", installDate: "07/10/2022", installedKBs: "Ninguna/No detectada", errorDescription: "PsExec failed with error code 1" },
  { serverName: "BERABSRUNUAT",       domain: "N/A",           ip: "N/A",            os: "N/A",                                    installDate: "N/A",         installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BERENROLLWEB01T",    domain: "petersen.corp", ip: "10.50.87.97",    os: "Microsoft Windows Server 2019 Standard", installDate: "15/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BERSONPRTG01T",      domain: "petersen.corp", ip: "172.30.87.73",   os: "Microsoft Windows Server 2019 Standard", installDate: "17/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSCSONPRTG01T",      domain: "petersen.corp", ip: "172.30.97.73",   os: "Microsoft Windows Server 2019 Standard", installDate: "14/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSFVUFADB01T",       domain: "petersen.corp", ip: "172.30.82.185",  os: "Microsoft Windows Server 2019 Standard", installDate: "15/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSJSONPRTG01T",      domain: "petersen.corp", ip: "172.30.92.73",   os: "Microsoft Windows Server 2019 Standard", installDate: "15/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVDBFCI01T",        domain: "petersen.corp", ip: "172.30.211.14",  os: "Microsoft Windows Server 2022 Standard", installDate: "07/10/2022", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVPACOREIIS01T",    domain: "petersen.corp", ip: "172.30.211.160", os: "Microsoft Windows Server 2022 Standard", installDate: "07/10/2022", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BERABSTFS01T",       domain: "N/A",           ip: "N/A",            os: "N/A",                                    installDate: "N/A",         installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BERFDSQL01T",        domain: "petersen.corp", ip: "172.30.87.122",  os: "Microsoft Windows Server 2022 Standard", installDate: "07/10/2022", installedKBs: "Ninguna/No detectada", errorDescription: "PsExec failed with error code 1" },
  { serverName: "BERSONPRTG02T",      domain: "N/A",           ip: "N/A",            os: "N/A",                                    installDate: "N/A",         installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSCSONPRTG02T",      domain: "petersen.corp", ip: "10.50.97.73",    os: "Microsoft Windows Server 2019 Standard", installDate: "14/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSFPWRCRVDAS01T",    domain: "petersen.corp", ip: "172.30.82.68",   os: "Microsoft Windows Server 2019 Standard", installDate: "14/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSJONBOARDMS03T",    domain: "petersen.corp", ip: "172.30.92.76",   os: "Microsoft Windows Server 2019 Standard", installDate: "21/08/2025", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVEFLOWTSQL01T",    domain: "petersen.corp", ip: "172.30.211.90",  os: "Microsoft Windows Server 2019 Standard", installDate: "16/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVPWRCRVDAS01T",    domain: "petersen.corp", ip: "172.30.211.105", os: "Microsoft Windows Server 2019 Standard", installDate: "10/12/2025", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSCINSTWEB02T",      domain: "petersen.corp", ip: "10.50.97.98",    os: "Microsoft Windows Server 2019 Standard", installDate: "14/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BERPWRCRVDA01T",     domain: "petersen.corp", ip: "172.30.87.69",   os: "Microsoft Windows Server 2019 Standard", installDate: "17/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSCPWRCRVDA01T",     domain: "petersen.corp", ip: "172.30.97.69",   os: "Microsoft Windows Server 2019 Standard", installDate: "14/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSFONBOARDMS01T",    domain: "petersen.corp", ip: "10.50.82.140",   os: "Microsoft Windows Server 2019 Standard", installDate: "15/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BSJOCEMS01T",        domain: "petersen.corp", ip: "172.30.92.71",   os: "Microsoft Windows Server 2019 Standard", installDate: "16/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVCOMFRON01T",      domain: "petersen.corp", ip: "10.50.211.140",  os: "Microsoft Windows Server 2022 Standard", installDate: "18/08/2025", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "SRVOCRBAL01T",       domain: "petersen.corp", ip: "172.30.211.36",  os: "Microsoft Windows Server 2019 Standard", installDate: "18/04/2026", installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
  { serverName: "BERDEBMEDIAPP01T",   domain: "N/A",           ip: "N/A",            os: "N/A",                                    installDate: "N/A",         installedKBs: "Ninguna/No detectada", errorDescription: "N/A" },
];

async function main() {
  console.log(`Cargando ${data.length} servidores en la base de datos...`);
  let created = 0;
  let updated = 0;

  for (const item of data) {
    const existing = await prisma.serverStatus.findUnique({
      where: { serverName: item.serverName },
    });
    await prisma.serverStatus.upsert({
      where: { serverName: item.serverName },
      update: item,
      create: item,
    });
    if (existing) updated++; else created++;
  }

  console.log(`✅ Listo. Creados: ${created}, Actualizados: ${updated}`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
