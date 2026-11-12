import { PrismaClient } from "../../prisma/generated/client";

const GRACE_DAY_OF_MONTH = 10;

/**
 * Returns the current year-month (YYYY-MM) and day of month in Argentina time (UTC-3),
 * avoiding UTC midnight rollovers at the end of a month.
 */
export function getArgentinaDateParts(now: Date = new Date()): {
  year: string;
  month: string;
  yearMonth: string;
  dayOfMonth: number;
} {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = parts.find((p) => p.type === "year")?.value ?? String(now.getUTCFullYear());
  const month = parts.find((p) => p.type === "month")?.value ?? String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = Number(parts.find((p) => p.type === "day")?.value ?? now.getUTCDate());

  return {
    year,
    month,
    yearMonth: `${year}-${month}`,
    dayOfMonth: day,
  };
}

/**
 * Extracts YYYY-MM from Fecha_Ventana supporting YYYY-MM-DD, DD/MM/YYYY, and MXX YYYY formats.
 */
export function extractMonthFromFechaVentana(fechaVentana: string | null | undefined): string | null {
  const raw = String(fechaVentana ?? "").trim();
  if (!raw || raw === "N/A" || raw === "null" || raw === "undefined") {
    return null;
  }

  // ISO format: YYYY-MM-DD or YYYY-MM
  const isoMatch = raw.match(/^(\d{4})-(\d{2})(?:-\d{2})?/);
  if (isoMatch) {
    const m = Number(isoMatch[2]);
    if (m >= 1 && m <= 12) return `${isoMatch[1]}-${isoMatch[2]}`;
  }

  // Argentine/DMY format: DD/MM/YYYY or DD-MM-YYYY
  const dmyMatch = raw.match(/^(\d{1,2})[/-](\d{1,2})[/-](\d{4})/);
  if (dmyMatch) {
    const m = Number(dmyMatch[2]);
    if (m >= 1 && m <= 12) return `${dmyMatch[3]}-${String(m).padStart(2, "0")}`;
  }

  // Legacy MXX YYYY format: e.g. M09 2026
  const mMatch = raw.match(/^M(\d{2})\s+(\d{4})/i);
  if (mMatch) {
    const m = Number(mMatch[1]);
    if (m >= 1 && m <= 12) return `${mMatch[2]}-${mMatch[1]}`;
  }

  return null;
}

export function getPreviousYearMonth(yearMonth: string): string {
  const [yStr, mStr] = yearMonth.split("-");
  let y = Number(yStr);
  let m = Number(mStr) - 1;
  if (m < 1) {
    m = 12;
    y -= 1;
  }
  return `${y}-${String(m).padStart(2, "0")}`;
}

/**
 * Determines which months in `candidateMonths` are frozen/locked and automatically locks
 * any prior months once a newer month starts or the grace window expires.
 */
export async function resolveFrozenMonths(
  db: PrismaClient,
  candidateMonths: Iterable<string>,
  now: Date = new Date()
): Promise<Set<string>> {
  const candidates = Array.from(new Set(candidateMonths)).filter(Boolean);
  if (candidates.length === 0) return new Set();

  const { yearMonth: currentMonth, dayOfMonth } = getArgentinaDateParts(now);
  const previousMonth = getPreviousYearMonth(currentMonth);

  const [existingLocks, latestMonthly] = await Promise.all([
    db.closedMonth.findMany({ select: { month: true } }),
    db.monthlyServerStatus.findFirst({
      orderBy: { month: "desc" },
      select: { month: true },
    }),
  ]);

  const frozen = new Set<string>(existingLocks.map((l) => l.month));
  const maxMonthInBatch = candidates.reduce((max, m) => (m > max ? m : max), "");
  const newestKnownMonth = [latestMonthly?.month ?? "", maxMonthInBatch]
    .filter(Boolean)
    .sort()
    .pop() ?? "";

  const toLock: string[] = [];

  for (const m of candidates) {
    if (frozen.has(m)) continue;

    // A past month is automatically frozen if:
    // 1. A newer month has already started (in DB or in the current upload batch), OR
    // 2. It is older than the previous month (m < previousMonth), OR
    // 3. We are past the grace window (dayOfMonth > GRACE_DAY_OF_MONTH) of the following month.
    const newerMonthStarted = newestKnownMonth > m;
    const pastGraceWindow = m < previousMonth || (m < currentMonth && dayOfMonth > GRACE_DAY_OF_MONTH);

    if (newerMonthStarted || pastGraceWindow) {
      frozen.add(m);
      toLock.push(m);
    }
  }

  // Also lock any open months in MonthlyServerStatus strictly older than the newest non-frozen month being written
  const existingOpenMonths = await db.monthlyServerStatus.findMany({
    distinct: ["month"],
    select: { month: true },
  });
  for (const row of existingOpenMonths) {
    if (frozen.has(row.month)) continue;
    if (newestKnownMonth > row.month || row.month < previousMonth || (row.month < currentMonth && dayOfMonth > GRACE_DAY_OF_MONTH)) {
      frozen.add(row.month);
      toLock.push(row.month);
    }
  }

  for (const month of new Set(toLock)) {
    await db.closedMonth.upsert({
      where: { month },
      update: {},
      create: { month, lockedBy: "auto" },
    });
  }

  return frozen;
}

