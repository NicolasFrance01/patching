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

function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// ─── Field discovery — ONLY via createmeta (fields on the actual screen) ───────
// This prevents sending fields that exist in Jira but are NOT on the create screen.
async function discoverFieldIds(projectKey: string): Promise<{
  mapping: Record<string, string>;
  allFieldNames: string[];
}> {
  const mapping: Record<string, string> = {};
  const allFieldNames: string[] = [];

  try {
    // Step 1: Get issue types for the project
    const itRes = await jiraFetch(
      `/rest/api/3/issue/createmeta/${projectKey}/issuetypes?maxResults=50`
    );
    if (!itRes.ok) {
      console.warn("[Jira] createmeta issuetypes failed:", itRes.status);
      return { mapping, allFieldNames };
    }

    const itData = await itRes.json();
    const issuetypes: any[] = itData.issueTypes ?? itData.values ?? [];
    console.log("[Jira] Issue types found:", issuetypes.map((it: any) => it.name));

    // Find "Actividad"
    const actividad = issuetypes.find((it: any) => normalize(it.name) === "actividad");
    if (!actividad) {
      console.warn("[Jira] 'Actividad' issue type not found in project", projectKey);
      return { mapping, allFieldNames };
    }

    // Step 2: Get fields for Actividad on this project (only fields on the screen)
    const fieldsRes = await jiraFetch(
      `/rest/api/3/issue/createmeta/${projectKey}/issuetypes/${actividad.id}?maxResults=200`
    );
    if (!fieldsRes.ok) {
      console.warn("[Jira] createmeta fields failed:", fieldsRes.status);
      return { mapping, allFieldNames };
    }

    const fieldsData = await fieldsRes.json();
    const fields: any[] = fieldsData.fields ?? fieldsData.values ?? [];

    for (const field of fields) {
      const id: string = field.fieldId ?? field.id ?? "";
      const name: string = field.name ?? "";
      const n = normalize(name);

      allFieldNames.push(`${id}: ${name}`);

      // Map to our semantic keys
      if (n === "informador" || n.includes("informador") || n.includes("informer")) {
        mapping.informadorField = id;
      }
      if (n === "start date" || n === "fecha inicio" || n === "fecha de inicio") {
        mapping.startDateField = id;
      }
      if (n === "area" || n === "area de negocio") {
        mapping.areaField = id;
      }
      if (n === "account" || n === "cuenta") {
        mapping.accountField = id;
      }
      if (n.includes("organizacion gp") || n.includes("organization gp") || n === "organizacion gp") {
        mapping.organizacionGPField = id;
      }
      if (n === "provider" || n === "proveedor") {
        mapping.providerField = id;
      }
      // Tecnologias / Components custom field
      if (
        (n.includes("tecnologia") || n.includes("component") || n.includes("componente")) &&
        id.startsWith("customfield_")
      ) {
        mapping.componentsField = id;
      }
      // Built-in components field
      if (id === "components") {
        mapping.componentsBuiltin = id;
      }
    }

    console.log("[Jira] Field mapping discovered:", JSON.stringify(mapping));
    console.log("[Jira] All fields on screen:", allFieldNames);
  } catch (e) {
    console.error("[Jira] discoverFieldIds error:", e);
  }

  return { mapping, allFieldNames };
}

// ─── Transition to Work in Progress ───────────────────────────────────────────
async function transitionToWIP(issueKey: string): Promise<boolean> {
  try {
    const res = await jiraFetch(`/rest/api/3/issue/${issueKey}/transitions`);
    if (!res.ok) return false;

    const data = await res.json();
    const transitions: Array<{ id: string; name: string }> = data.transitions ?? [];

    console.log("[Jira] Available transitions for", issueKey, ":", transitions.map((t) => t.name));

    const wipNames = [
      "work in progress", "en progreso", "en curso", "in progress",
      "trabajo en progreso", "wip", "en proceso", "iniciado", "en desarrollo",
    ];
    const target = transitions.find((t) =>
      wipNames.some((name) => normalize(t.name).includes(name))
    );

    if (!target) {
      console.warn("[Jira] WIP transition not found. Available:", transitions.map((t) => t.name));
      return false;
    }

    const transRes = await jiraFetch(`/rest/api/3/issue/${issueKey}/transitions`, {
      method: "POST",
      body: JSON.stringify({ transition: { id: target.id } }),
    });

    const ok = transRes.ok || transRes.status === 204;
    console.log("[Jira] Transition to WIP result:", transRes.status, ok);
    return ok;
  } catch (e) {
    console.error("[Jira] Transition error:", e);
    return false;
  }
}

// ─── GET ───────────────────────────────────────────────────────────────────────
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const action = searchParams.get("action");

  if (action === "search-users") {
    const query = searchParams.get("query") ?? "";
    const res = await jiraFetch(
      `/rest/api/3/user/search?query=${encodeURIComponent(query)}&maxResults=10`
    );
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }
    return NextResponse.json(await res.json());
  }

  if (action === "get-fields") {
    const project = searchParams.get("project") ?? "GP";
    const { mapping, allFieldNames } = await discoverFieldIds(project);
    return NextResponse.json({ mapping, allFieldNames });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// ─── POST: crear ticket ────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      projectKey,
      errorMessage,
      serversList,
      bankLabel,
      bankCode,
      reporterAccountId,
      fieldMapping: clientMapping,
    } = body;

    const today = new Date().toISOString().slice(0, 10);

    // ── Use mapping from client; if empty, re-discover server-side ────────────
    let fieldMapping: Record<string, string> = clientMapping ?? {};
    if (!fieldMapping || Object.keys(fieldMapping).length === 0) {
      console.log("[Jira] No client mapping provided, discovering server-side...");
      const { mapping } = await discoverFieldIds(projectKey);
      fieldMapping = mapping;
    }

    console.log("[Jira] Final field mapping:", JSON.stringify(fieldMapping));

    // ── Description ADF ───────────────────────────────────────────────────────
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
        console.log("[Jira] Assignee found:", found?.displayName, assigneeAccountId);
      }
    } catch { /* ignore */ }

    // ── Build fields — ONLY include fields confirmed on the screen ────────────
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
      componentsField,
      componentsBuiltin,
    } = fieldMapping;

    // Only add custom fields that were confirmed in the screen
    if (startDateField) {
      fields[startDateField] = today;
    }
    if (areaField) {
      fields[areaField] = { value: "SEC" };
    }
    if (accountField) {
      // Tempo account field — accepts { name: "..." }
      fields[accountField] = { name: "GP | SEC | Abono" };
    }
    if (organizacionGPField) {
      fields[organizacionGPField] = { value: bankLabel };
    }
    if (providerField) {
      fields[providerField] = { value: "Microsoft" };
    }
    if (componentsField) {
      // Custom multi-select (Tecnologias)
      fields[componentsField] = [{ value: "Sistemas Operativos" }];
    }
    if (componentsBuiltin) {
      // Built-in components field
      fields.components = [{ name: "Sistemas Operativos" }];
    }
    if (informadorField && reporterAccountId) {
      fields[informadorField] = { accountId: reporterAccountId };
    }

    console.log("[Jira] Creating issue with fields:", Object.keys(fields));

    // ── Create issue ──────────────────────────────────────────────────────────
    const createRes = await jiraFetch("/rest/api/3/issue", {
      method: "POST",
      body: JSON.stringify({ fields }),
    });

    const createData = await createRes.json();

    if (!createRes.ok) {
      console.error("[Jira] Create error:", JSON.stringify(createData));
      return NextResponse.json(
        { error: createData, fieldMappingUsed: fieldMapping, fieldsSent: Object.keys(fields) },
        { status: createRes.status }
      );
    }

    const issueKey: string = createData.key;
    const issueUrl = `${JIRA_BASE_URL}/browse/${issueKey}`;
    console.log("[Jira] Created:", issueKey);

    // ── Transition to WIP ─────────────────────────────────────────────────────
    const transitioned = await transitionToWIP(issueKey);

    return NextResponse.json({ issueKey, issueUrl, transitioned });
  } catch (err: any) {
    console.error("[Jira] Unexpected error:", err);
    return NextResponse.json({ error: err.message ?? "Internal error" }, { status: 500 });
  }
}
