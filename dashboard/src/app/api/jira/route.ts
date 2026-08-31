import { NextRequest, NextResponse } from "next/server";

const JIRA_BASE_URL = process.env.JIRA_BASE_URL!;
const JIRA_USER = process.env.JIRA_USER!;
const JIRA_TOKEN = process.env.JIRA_TOKEN!;

function getBasicAuthHeader(): string {
  const credentials = Buffer.from(`${JIRA_USER}:${JIRA_TOKEN}`).toString("base64");
  return `Basic ${credentials}`;
}

async function jiraFetch(path: string, options: RequestInit = {}) {
  const url = `${JIRA_BASE_URL}${path}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      Authorization: getBasicAuthHeader(),
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers ?? {}),
    },
  });
  return res;
}

// Normalize string: lowercase, remove accents, remove special chars
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Field discovery: fetches ALL fields and maps names to IDs ─────────────────
async function discoverFieldIds(projectKey: string): Promise<Record<string, string>> {
  // Use the global /rest/api/3/field endpoint — most reliable
  const res = await jiraFetch("/rest/api/3/field");
  if (!res.ok) return {};

  const allFields: Array<{ id: string; name: string; custom: boolean }> = await res.json();

  const mapping: Record<string, string> = {};

  for (const field of allFields) {
    const n = normalize(field.name);

    // Informador
    if (n === "informador" || n === "informer" || n.includes("informador")) {
      mapping.informadorField = field.id;
    }
    // Start date (SoftwarePlant / Tempo)
    if (n === "start date" || n === "fecha inicio" || n === "fecha de inicio") {
      mapping.startDateField = field.id;
    }
    // Area
    if (n === "area" || n === "area de negocio") {
      mapping.areaField = field.id;
    }
    // Account (Tempo)
    if (n === "account" || n === "cuenta") {
      mapping.accountField = field.id;
    }
    // Organización GP
    if (
      n.includes("organizacion gp") ||
      n.includes("organization gp") ||
      n === "organizacion gp"
    ) {
      mapping.organizacionGPField = field.id;
    }
    // Provider
    if (n === "provider" || n === "proveedor") {
      mapping.providerField = field.id;
    }
    // Components / Tecnologías (custom multi-select)
    if (
      (n.includes("component") || n.includes("componente") || n.includes("tecnologia")) &&
      field.custom
    ) {
      mapping.componentsCustomField = field.id;
    }
  }

  // Also try createmeta for this specific project to get exact required fields
  try {
    const cmRes = await jiraFetch(
      `/rest/api/3/issue/createmeta/${projectKey}/issuetypes?maxResults=50`
    );
    if (cmRes.ok) {
      const cmData = await cmRes.json();
      // Find Actividad issue type
      const actividad = (cmData.issueTypes ?? cmData.values ?? []).find(
        (it: any) => normalize(it.name) === "actividad"
      );
      if (actividad?.id) {
        const fieldsRes = await jiraFetch(
          `/rest/api/3/issue/createmeta/${projectKey}/issuetypes/${actividad.id}?maxResults=100`
        );
        if (fieldsRes.ok) {
          const fieldsData = await fieldsRes.json();
          for (const field of fieldsData.fields ?? fieldsData.values ?? []) {
            const n = normalize(field.name);
            if (n.includes("organizacion gp") || n.includes("organization gp")) {
              mapping.organizacionGPField = field.fieldId ?? field.id;
            }
            if (n === "provider" || n === "proveedor") {
              mapping.providerField = field.fieldId ?? field.id;
            }
            if (n === "account" || n === "cuenta") {
              mapping.accountField = field.fieldId ?? field.id;
            }
            if (n === "area" || n === "area de negocio") {
              mapping.areaField = field.fieldId ?? field.id;
            }
            if (n === "informador" || n.includes("informador")) {
              mapping.informadorField = field.fieldId ?? field.id;
            }
            if (n === "start date" || n.includes("start date")) {
              mapping.startDateField = field.fieldId ?? field.id;
            }
            if ((n.includes("component") || n.includes("tecnologia")) && field.custom) {
              mapping.componentsCustomField = field.fieldId ?? field.id;
            }
          }
        }
      }
    }
  } catch {
    // ignore
  }

  return mapping;
}

// ─── Transition issue to "Work in Progress" ────────────────────────────────────
async function transitionToWIP(issueKey: string): Promise<boolean> {
  try {
    const res = await jiraFetch(`/rest/api/3/issue/${issueKey}/transitions`);
    if (!res.ok) return false;

    const data = await res.json();
    const transitions: Array<{ id: string; name: string }> = data.transitions ?? [];

    // Look for "Work in Progress", "En Progreso", "En Curso", "In Progress", "Trabajo en Progreso"
    const wipNames = ["work in progress", "en progreso", "en curso", "in progress", "trabajo en progreso", "wip", "in progress"];
    const target = transitions.find((t) =>
      wipNames.some((name) => normalize(t.name).includes(name))
    );

    if (!target) {
      console.log("[Jira] Available transitions:", transitions.map((t) => t.name));
      return false;
    }

    const transRes = await jiraFetch(`/rest/api/3/issue/${issueKey}/transitions`, {
      method: "POST",
      body: JSON.stringify({ transition: { id: target.id } }),
    });

    return transRes.ok || transRes.status === 204;
  } catch {
    return false;
  }
}

// ─── GET ───────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const action = searchParams.get("action");

  // Search users
  if (action === "search-users") {
    const query = searchParams.get("query") ?? "";
    const res = await jiraFetch(
      `/rest/api/3/user/search?query=${encodeURIComponent(query)}&maxResults=10`
    );
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  }

  // Discover field IDs
  if (action === "get-fields") {
    const project = searchParams.get("project") ?? "GP";
    const mapping = await discoverFieldIds(project);
    return NextResponse.json({ mapping });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// ─── POST: crear ticket ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      projectKey,         // "GP" | "ASJ"
      errorMessage,
      serversList,        // string[]
      bankLabel,          // "Banco Santa Cruz" etc.
      bankCode,
      reporterAccountId,
      fieldMapping,       // discovered field IDs from client
    } = body;

    const today = new Date().toISOString().slice(0, 10);

    // ── Build description in Jira ADF ──────────────────────────────────────────
    const descriptionADF = {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Error reportado: ", marks: [{ type: "strong" }] },
            { type: "text", text: errorMessage },
          ],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Banco / Organización: ", marks: [{ type: "strong" }] },
            { type: "text", text: `${bankLabel} (${bankCode})` },
          ],
        },
        {
          type: "paragraph",
          content: [{ type: "text", text: "Servidores afectados:", marks: [{ type: "strong" }] }],
        },
        {
          type: "bulletList",
          content: (serversList ?? []).map((s: string) => ({
            type: "listItem",
            content: [{ type: "paragraph", content: [{ type: "text", text: s }] }],
          })),
        },
      ],
    };

    // ── Discover field IDs server-side (backup if client didn't send them) ─────
    const discoveredMapping = Object.keys(fieldMapping ?? {}).length > 0
      ? fieldMapping
      : await discoverFieldIds(projectKey);

    console.log("[Jira] Field mapping used:", JSON.stringify(discoveredMapping));

    // ── Resolve assignee (gramirez) ───────────────────────────────────────────
    let assigneeAccountId: string | undefined;
    try {
      const uRes = await jiraFetch(`/rest/api/3/user/search?query=gramirez&maxResults=5`);
      if (uRes.ok) {
        const users: any[] = await uRes.json();
        const found = users.find(
          (u) =>
            u.emailAddress?.toLowerCase().includes("gramirez") ||
            u.displayName?.toLowerCase().includes("gonzalo ramirez") ||
            u.displayName?.toLowerCase().includes("gonzalo ramírez")
        );
        assigneeAccountId = found?.accountId;
      }
    } catch { /* ignore */ }

    // ── Build fields payload ───────────────────────────────────────────────────
    const fields: Record<string, any> = {
      project: { key: projectKey },
      issuetype: { name: "Actividad" },
      summary: errorMessage,
      description: descriptionADF,
    };

    if (assigneeAccountId) fields.assignee = { accountId: assigneeAccountId };
    if (reporterAccountId) fields.reporter = { accountId: reporterAccountId };

    const {
      informadorField,
      startDateField,
      areaField,
      accountField,
      organizacionGPField,
      providerField,
      componentsCustomField,
    } = discoveredMapping ?? {};

    if (startDateField) fields[startDateField] = today;

    if (areaField) {
      // Try multiple formats for select fields
      fields[areaField] = { value: "SEC" };
    }

    if (accountField) {
      // Tempo account — try by name
      fields[accountField] = { name: "GP | SEC | Abono" };
    }

    if (organizacionGPField) {
      fields[organizacionGPField] = { value: bankLabel };
    }

    if (providerField) {
      fields[providerField] = { value: "Microsoft" };
    }

    // Built-in components field
    fields.components = [{ name: "Sistemas Operativos" }];

    // Custom components/tecnologias field (if different from built-in)
    if (componentsCustomField && componentsCustomField !== "components") {
      fields[componentsCustomField] = [{ value: "Sistemas Operativos" }];
    }

    if (informadorField && reporterAccountId) {
      fields[informadorField] = { accountId: reporterAccountId };
    }

    // ── Create the issue ───────────────────────────────────────────────────────
    const createRes = await jiraFetch("/rest/api/3/issue", {
      method: "POST",
      body: JSON.stringify({ fields }),
    });

    const createData = await createRes.json();

    if (!createRes.ok) {
      // Return full error details to help debug field issues
      console.error("[Jira] Create error:", JSON.stringify(createData));
      return NextResponse.json(
        {
          error: createData,
          fieldMappingUsed: discoveredMapping,
          fieldsSent: Object.keys(fields),
        },
        { status: createRes.status }
      );
    }

    const issueKey: string = createData.key;
    const issueUrl = `${JIRA_BASE_URL}/browse/${issueKey}`;

    // ── Transition to Work in Progress ─────────────────────────────────────────
    const transitioned = await transitionToWIP(issueKey);

    return NextResponse.json({ issueKey, issueUrl, transitioned });
  } catch (err: any) {
    console.error("[Jira] Unexpected error:", err);
    return NextResponse.json({ error: err.message ?? "Internal error" }, { status: 500 });
  }
}
