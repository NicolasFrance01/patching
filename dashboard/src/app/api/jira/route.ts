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

// ─── GET: buscar usuarios Jira por nombre ─────────────────────────────────────
// GET /api/jira?action=search-users&query=Nicolas
// GET /api/jira?action=get-fields&project=GP
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
    const data = await res.json();
    return NextResponse.json(data);
  }

  if (action === "get-fields") {
    const project = searchParams.get("project") ?? "GP";
    // Fetch createmeta to get all custom field IDs for the project
    const res = await jiraFetch(
      `/rest/api/3/issue/createmeta?projectKeys=${project}&issuetypeNames=Actividad&expand=projects.issuetypes.fields`
    );
    if (!res.ok) {
      const text = await res.text();
      return NextResponse.json({ error: text }, { status: res.status });
    }
    const data = await res.json();
    // Extract fields
    const fields: Record<string, { key: string; name: string; schema?: object }> = {};
    const projectMeta = data?.projects?.[0];
    const issuetype = projectMeta?.issuetypes?.[0];
    if (issuetype?.fields) {
      for (const [key, value] of Object.entries(issuetype.fields as Record<string, any>)) {
        fields[key] = { key, name: value.name, schema: value.schema };
      }
    }
    return NextResponse.json({ fields });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// ─── POST: crear ticket en Jira ────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      projectKey,       // "GP" o "ASJ"
      errorMessage,     // string del error
      serversList,      // string[] de servidores del banco elegido
      bankLabel,        // "Banco Santa Cruz", "Corporativo", etc.
      bankCode,         // "BSC", "Corp", "ASJ", etc.
      reporterAccountId,// accountId del informador
      customFields,     // Record<string, any> con los IDs resueltos de los custom fields
    } = body;

    // Build summary: error name
    const summary = errorMessage;

    // Build description with server list (in Jira ADF format)
    const serverListText = serversList?.length
      ? serversList.map((s: string) => `• ${s}`).join("\n")
      : "Sin servidores identificados";

    const descriptionADF = {
      type: "doc",
      version: 1,
      content: [
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: `Error reportado: ${errorMessage}`,
              marks: [{ type: "strong" }],
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: `Banco / Organización: ${bankLabel} (${bankCode})`,
            },
          ],
        },
        {
          type: "paragraph",
          content: [
            {
              type: "text",
              text: "Servidores afectados:",
              marks: [{ type: "strong" }],
            },
          ],
        },
        {
          type: "bulletList",
          content: (serversList ?? []).map((s: string) => ({
            type: "listItem",
            content: [
              {
                type: "paragraph",
                content: [{ type: "text", text: s }],
              },
            ],
          })),
        },
      ],
    };

    // Today's date in ISO format (YYYY-MM-DD)
    const today = new Date().toISOString().slice(0, 10);

    // Build Jira issue payload
    const issuePayload: Record<string, any> = {
      fields: {
        project: { key: projectKey },
        issuetype: { name: "Actividad" },
        summary,
        description: descriptionADF,
        assignee: { accountId: customFields?.assigneeAccountId },
        reporter: reporterAccountId ? { accountId: reporterAccountId } : undefined,
      },
    };

    // Attach custom fields if provided
    if (customFields) {
      const {
        startDateField,
        areaField,
        accountField,
        organizacionGPField,
        providerField,
        componentsField,
        informadorField,
        assigneeAccountId, // already used above
        ...rest
      } = customFields;

      if (startDateField) issuePayload.fields[startDateField] = today;
      if (areaField) issuePayload.fields[areaField] = { value: "SEC" };
      if (accountField) issuePayload.fields[accountField] = { name: "GP | SEC | Abono" };
      if (organizacionGPField && bankLabel) {
        issuePayload.fields[organizacionGPField] = { value: bankLabel };
      }
      if (providerField) issuePayload.fields[providerField] = { value: "Microsoft" };
      if (componentsField) {
        issuePayload.fields[componentsField] = [{ value: "Sistemas Operativos" }];
      }
      if (informadorField && reporterAccountId) {
        issuePayload.fields[informadorField] = { accountId: reporterAccountId };
      }
    }

    // Remove undefined fields
    issuePayload.fields = Object.fromEntries(
      Object.entries(issuePayload.fields).filter(([, v]) => v !== undefined && v !== null)
    );

    const res = await jiraFetch("/rest/api/3/issue", {
      method: "POST",
      body: JSON.stringify(issuePayload),
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json({ error: data }, { status: res.status });
    }

    // Return issue key and URL
    const issueKey = data.key;
    const issueUrl = `${JIRA_BASE_URL}/browse/${issueKey}`;
    return NextResponse.json({ issueKey, issueUrl });
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? "Internal error" }, { status: 500 });
  }
}
