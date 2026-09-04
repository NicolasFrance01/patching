import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const JIRA_BASE_URL = process.env.JIRA_BASE_URL!;
const JIRA_USER = process.env.JIRA_USER!;
const JIRA_TOKEN = process.env.JIRA_TOKEN!;

function getBasicAuthHeader(): string {
  return `Basic ${Buffer.from(`${JIRA_USER}:${JIRA_TOKEN}`).toString("base64")}`;
}

async function jiraFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${JIRA_BASE_URL}${path}`, {
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
  return str.toLowerCase().normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ").trim();
}

// ─── Types ────────────────────────────────────────────────────────────────────

type AllowedValue = { id?: string; value?: string; name?: string; key?: string };

interface FieldMeta {
  id: string;
  allowedValues: AllowedValue[];
  isArray: boolean;   // true if the field is multi-value (array type)
  schemaType: string;
}

// Resolve a named value against allowedValues, using id when possible
function resolveValue(meta: FieldMeta | undefined, targetValue: string): any {
  if (!meta) return { value: targetValue };

  const { allowedValues, isArray } = meta;

  let resolved: any;
  if (allowedValues.length > 0) {
    const found = allowedValues.find((av) => {
      const n = normalize(av.value ?? av.name ?? av.key ?? "");
      const t = normalize(targetValue);
      return n === t || n.includes(t) || t.includes(n);
    });
    resolved = found?.id ? { id: found.id } : { value: targetValue };
  } else {
    resolved = { value: targetValue };
  }

  return isArray ? [resolved] : resolved;
}

// ─── Tempo Account lookup ─────────────────────────────────────────────────────

async function findTempoAccountId(searchName: string): Promise<number | null> {
  try {
    const res = await jiraFetch("/rest/tempo-accounts/1/account/?limit=500");
    if (!res.ok) { console.warn("[Jira] Tempo API unavailable:", res.status); return null; }
    const data = await res.json();
    const accounts: any[] = Array.isArray(data) ? data : (data.accounts ?? data.results ?? []);
    const t = normalize(searchName);
    const found = accounts.find((a: any) => {
      const n = normalize(a.name ?? "");
      return n.includes(t) || t.includes(n);
    });
    console.log("[Jira] Tempo account via API:", found?.name, "id:", found?.id);
    return typeof found?.id === "number" ? found.id : (typeof found?.id === "string" ? parseInt(found.id, 10) : null);
  } catch (e) { console.warn("[Jira] Tempo API error:", e); return null; }
}

async function findTempoAccountViaJQL(projectKey: string, accountName: string, accountFieldId: string): Promise<number | null> {
  try {
    console.log("[Jira] Attempting to find Tempo Account ID via JQL fallback POST...");
    const res = await jiraFetch(`/rest/api/3/search/jql`, {
      method: 'POST',
      body: JSON.stringify({
        jql: `project = "${projectKey}" AND "${accountFieldId}" IS NOT EMPTY ORDER BY created DESC`,
        maxResults: 15,
        fields: [accountFieldId]
      })
    });
    if (!res.ok) return null;
    const data = await res.json();
    for (const issue of (data.issues ?? [])) {
      const acc = issue.fields?.[accountFieldId];
      if (acc) {
        const name = normalize(acc.name ?? acc.value ?? "");
        const target = normalize(accountName);
        if (name.includes(target) || target.includes(name)) {
          const id = acc.id ?? acc.accountId;
          if (id) {
            const numId = typeof id === "number" ? id : parseInt(id, 10);
            if (!isNaN(numId)) {
              console.log("[Jira] Tempo account via JQL:", name, "id:", numId);
              return numId;
            }
          }
        }
      }
    }
  } catch (e) { console.warn("[Jira] JQL fallback error:", e); }
  // Hardcoded fallbacks based on project just in case JQL fails
  if (projectKey === "ASJ") return 608; // ASJ | SEC | Abono
  return 609; // GP | SEC | Abono
}

// ─── Field Discovery — ONLY from createmeta (fields on the screen) ────────────

async function discoverFields(projectKey: string): Promise<{
  mapping: Record<string, string>;
  fieldMeta: Record<string, FieldMeta>;
  allFieldNames: string[];
}> {
  const mapping: Record<string, string> = {};
  const fieldMeta: Record<string, FieldMeta> = {};
  const allFieldNames: string[] = [];

  try {
    // 1. Get issue types
    const itRes = await jiraFetch(`/rest/api/3/issue/createmeta/${projectKey}/issuetypes?maxResults=50`);
    if (!itRes.ok) { console.warn("[Jira] issuetypes failed"); return { mapping, fieldMeta, allFieldNames }; }
    const itData = await itRes.json();
    const issuetypes: any[] = itData.issueTypes ?? itData.values ?? [];
    const actividad = issuetypes.find((it: any) => normalize(it.name) === "actividad");
    if (!actividad) { console.warn("[Jira] Actividad not found in", projectKey); return { mapping, fieldMeta, allFieldNames }; }

    // 2. Get fields on the Actividad screen
    const fRes = await jiraFetch(`/rest/api/3/issue/createmeta/${projectKey}/issuetypes/${actividad.id}?maxResults=200`);
    if (!fRes.ok) { console.warn("[Jira] fields failed"); return { mapping, fieldMeta, allFieldNames }; }
    const fData = await fRes.json();
    const fields: any[] = fData.fields ?? fData.values ?? [];

    for (const field of fields) {
      const id: string = field.fieldId ?? field.id ?? "";
      const name: string = field.name ?? "";
      const n = normalize(name);
      const allowedValues: AllowedValue[] = field.allowedValues ?? [];
      const schema = field.schema ?? {};
      // isArray: multi-select / array type
      const isArray = schema.type === "array" || (schema.items !== undefined);
      const schemaType: string = schema.type ?? "unknown";

      allFieldNames.push(`${id}: "${name}" type=${schemaType}${isArray ? "[]" : ""} opts=${allowedValues.length}`);

      const meta: FieldMeta = { id, allowedValues, isArray, schemaType };
      let key = "";

      if (n === "informador" || n.includes("informador") || n.includes("informer")) key = "informadorField";
      else if (n === "start date" || n === "fecha inicio" || n === "fecha de inicio") key = "startDateField";
      else if (n === "area" || n === "area de negocio") key = "areaField";
      else if (n === "account" || n === "cuenta") key = "accountField";
      else if (n.includes("organizacion gp") || n.includes("organization gp") || n === "organizacion gp") key = "organizacionGPField";
      else if (n === "provider" || n === "proveedor") key = "providerField";
      else if ((n.includes("tecnologia") || n.includes("component")) && id.startsWith("customfield_")) key = "componentsField";
      else if (id === "components") key = "componentsBuiltin";

      if (key) {
        mapping[key] = id;
        fieldMeta[key] = meta;
      }
    }

    console.log("[Jira] Fields on screen:", allFieldNames);
    console.log("[Jira] Mapping:", JSON.stringify(mapping));
  } catch (e) { console.error("[Jira] discoverFields error:", e); }

  return { mapping, fieldMeta, allFieldNames };
}

// ─── Transition to Work in Progress ───────────────────────────────────────────

async function transitionToWIP(issueKey: string): Promise<boolean> {
  try {
    const res = await jiraFetch(`/rest/api/3/issue/${issueKey}/transitions`);
    if (!res.ok) return false;
    const data = await res.json();
    const transitions: Array<{ id: string; name: string }> = data.transitions ?? [];
    console.log("[Jira] Transitions:", transitions.map((t) => t.name));

    const wip = ["work in progress", "en progreso", "en curso", "in progress",
      "trabajo en progreso", "wip", "en proceso", "iniciado", "en desarrollo"];
    const target = transitions.find((t) => wip.some((w) => normalize(t.name).includes(w)));
    if (!target) { console.warn("[Jira] WIP transition not found"); return false; }

    const r = await jiraFetch(`/rest/api/3/issue/${issueKey}/transitions`, {
      method: "POST",
      body: JSON.stringify({ transition: { id: target.id } }),
    });
    return r.ok || r.status === 204;
  } catch { return false; }
}

// ─── GET ───────────────────────────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const action = searchParams.get("action");

  if (action === "search-users") {
    const query = searchParams.get("query") ?? "";
    const res = await jiraFetch(`/rest/api/3/user/search?query=${encodeURIComponent(query)}&maxResults=10`);
    if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: res.status });
    return NextResponse.json(await res.json());
  }

  if (action === "get-fields") {
    const project = searchParams.get("project") ?? "GP";
    const result = await discoverFields(project);
    // Don't send full allowedValues to client (too large); only send mapping
    return NextResponse.json({ mapping: result.mapping, allFieldNames: result.allFieldNames });
  }

  if (action === "get-tickets") {
    try {
      const tickets = await prisma.jiraTicket.findMany({
        orderBy: { createdAt: "desc" }
      });
      return NextResponse.json(tickets);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }

  if (action === "get-issue") {
    const issueKey = searchParams.get("issueKey");
    if (!issueKey) return NextResponse.json({ error: "Missing issueKey" }, { status: 400 });
    
    const res = await jiraFetch(`/rest/api/3/issue/${issueKey}?fields=status,description,comment`);
    if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: res.status });
    
    const data = await res.json();
    return NextResponse.json({
      status: data.fields?.status?.name,
      statusCategory: data.fields?.status?.statusCategory?.colorName,
      description: data.fields?.description,
      comments: data.fields?.comment?.comments || []
    });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}

// ─── POST: crear ticket ────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { projectKey, errorMessage, serversList, bankLabel, bankCode, reporterAccountId, fieldMapping: clientMapping } = body;

    const today = new Date().toISOString().slice(0, 10);

    // Re-discover fields server-side to get allowedValues (not stored client-side)
    const { mapping, fieldMeta } = await discoverFields(projectKey);
    // Merge with client mapping (client may have some from a previous fetch)
    const mergedMapping = { ...mapping, ...(clientMapping ?? {}) };

    console.log("[Jira] Using field mapping:", JSON.stringify(mergedMapping));

    // ── Description ADF ──────────────────────────────────────────────────────
    const descriptionADF = {
      type: "doc", version: 1,
      content: [
        { type: "paragraph", content: [
          { type: "text", text: "Error reportado: ", marks: [{ type: "strong" }] },
          { type: "text", text: errorMessage },
        ]},
        { type: "paragraph", content: [
          { type: "text", text: "Banco / Organización: ", marks: [{ type: "strong" }] },
          { type: "text", text: `${bankLabel} (${bankCode})` },
        ]},
        { type: "paragraph", content: [{ type: "text", text: "Servidores afectados:", marks: [{ type: "strong" }] }] },
        {
          type: "bulletList",
          content: (serversList ?? []).map((s: string) => ({
            type: "listItem",
            content: [{ type: "paragraph", content: [{ type: "text", text: s }] }],
          })),
        },
      ],
    };

    // ── Resolve assignee ─────────────────────────────────────────────────────
    let assigneeAccountId: string | undefined;
    try {
      const uRes = await jiraFetch(`/rest/api/3/user/search?query=gramirez&maxResults=5`);
      if (uRes.ok) {
        const users: any[] = await uRes.json();
        const found = users.find((u) =>
          u.emailAddress?.toLowerCase().includes("gramirez") ||
          u.displayName?.toLowerCase().includes("gonzalo")
        );
        assigneeAccountId = found?.accountId;
        console.log("[Jira] Assignee:", found?.displayName, assigneeAccountId);
      }
    } catch { /* ignore */ }

    // ── Build fields payload ─────────────────────────────────────────────────
    const fields: Record<string, any> = {
      project: { key: projectKey },
      issuetype: { name: "Actividad" },
      summary: errorMessage,
      description: descriptionADF,
    };

    if (assigneeAccountId) fields.assignee = { accountId: assigneeAccountId };
    if (reporterAccountId) fields.reporter = { accountId: reporterAccountId };

    const {
      informadorField, startDateField, areaField, accountField,
      organizacionGPField, providerField, componentsField, componentsBuiltin,
    } = mergedMapping;

    // Start date — plain date string
    if (startDateField) fields[startDateField] = today;

    // Area — select, resolve by allowedValues
    if (areaField) {
      fields[areaField] = resolveValue(fieldMeta.areaField, "SEC");
    }

    // Organización GP — select, resolve by allowedValues
    if (organizacionGPField) {
      fields[organizacionGPField] = resolveValue(fieldMeta.organizacionGPField, bankLabel);
    }

    // Provider — often a multi-select (array)
    if (providerField) {
      fields[providerField] = resolveValue(fieldMeta.providerField, "Microsoft");
    }

    // Custom components/tecnologias field
    if (componentsField) {
      fields[componentsField] = resolveValue(fieldMeta.componentsField, "Sistemas Operativos");
    }

    // Built-in components field
    if (componentsBuiltin) {
      fields.components = [{ name: "Sistemas Operativos" }];
    }

    // Informador (reporter field)
    if (informadorField && reporterAccountId) {
      fields[informadorField] = { accountId: reporterAccountId };
    }

    // Tempo Account — needs numeric ID from Tempo API
    if (accountField) {
      const targetAccount = projectKey === "ASJ" ? "ASJ | SEC | Abono" : "GP | SEC | Abono";
      
      if (fieldMeta[accountField] && fieldMeta[accountField].allowedValues.length > 0) {
        // Sometimes it's just a normal select field
        fields[accountField] = resolveValue(fieldMeta[accountField], targetAccount);
      } else {
        let tempoId = await findTempoAccountId(targetAccount);
        if (tempoId === null) {
          tempoId = await findTempoAccountViaJQL(projectKey, targetAccount, accountField);
        }
        
        if (tempoId !== null) {
          fields[accountField] = tempoId; // Tempo expects just the numeric ID
        } else {
          console.warn("[Jira] Skipping accountField — could not resolve Tempo account ID, sending fallback object");
          fields[accountField] = { name: targetAccount };
        }
      }
    }

    console.log("[Jira] Fields being sent:", Object.keys(fields));
    console.log("[Jira] Field values:", JSON.stringify(
      Object.fromEntries(
        Object.entries(fields).filter(([k]) => !["description", "project", "issuetype"].includes(k))
      )
    ));

    // ── Create issue ─────────────────────────────────────────────────────────
    const createRes = await jiraFetch("/rest/api/3/issue", {
      method: "POST",
      body: JSON.stringify({ fields }),
    });

    const createData = await createRes.json();

    if (!createRes.ok) {
      console.error("[Jira] Create error:", JSON.stringify(createData));
      return NextResponse.json(
        { error: createData, fieldMappingUsed: mergedMapping, fieldsSent: Object.keys(fields) },
        { status: createRes.status }
      );
    }

    const issueKey: string = createData.key;
    const issueUrl = `${JIRA_BASE_URL}/browse/${issueKey}`;
    console.log("[Jira] Created:", issueKey);

    // Transition issue to "Work in Progress"
    // Transition ID 891 = "Work in Progress" confirmed by ROVO AI for this Jira instance
    // Save to database
    try {
      await prisma.jiraTicket.create({
        data: {
          ticketKey: issueKey,
          ticketUrl: issueUrl,
          bank: body.bankCode,
          errorDescription: body.errorMessage,
          creatorUsername: body.creatorUsername || "unknown",
          assignedUsername: body.creatorUsername || "unknown",
          reporterName: body.reporterName || null,
        }
      });
      console.log(`[Jira] Saved ticket ${issueKey} to database`);
    } catch (dbError) {
      console.error(`[Jira] Error saving ticket to DB:`, dbError);
    }

    // Work in Progress transition
    let transitioned = false;
    try {
      // Small delay to allow Jira to fully index the new ticket before querying transitions
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const WORK_IN_PROGRESS_TRANSITION_ID = "891";
      
      const applyRes = await jiraFetch(`/rest/api/3/issue/${issueKey}/transitions`, {
        method: "POST",
        body: JSON.stringify({
          transition: { id: WORK_IN_PROGRESS_TRANSITION_ID },
          update: {
            comment: [
              {
                add: {
                  body: {
                    type: "doc",
                    version: 1,
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            text: "Generado automáticamente desde el Centro de Control de Parcheo.",
                            type: "text"
                          }
                        ]
                      }
                    ]
                  }
                }
              }
            ]
          }
        })
      });

      if (applyRes.ok || applyRes.status === 204) {
        transitioned = true;
        console.log(`[Jira] Successfully transitioned ${issueKey} to Work in Progress`);
      } else {
        const errBody = await applyRes.text();
        console.warn(`[Jira] Transition POST failed ${applyRes.status}: ${errBody}`);
        // Fallback: try dynamic search for any "indeterminate" transition
        const transRes = await jiraFetch(`/rest/api/3/issue/${issueKey}/transitions`);
        if (transRes.ok) {
          const transData = await transRes.json();
          console.log(`[Jira] Available transitions for ${issueKey}:`, transData.transitions?.map((t: any) => `${t.id}=${t.name}(${t.to.statusCategory?.key})`));
          const fallbackTransition = transData.transitions?.find((t: any) =>
            t.to.statusCategory?.key === "indeterminate" ||
            t.name.toLowerCase().includes("work in progress") ||
            t.to.name.toLowerCase().includes("trabajo en progeso")
          );
          if (fallbackTransition) {
            const fallbackRes = await jiraFetch(`/rest/api/3/issue/${issueKey}/transitions`, {
              method: "POST",
              body: JSON.stringify({ transition: { id: fallbackTransition.id } })
            });
            if (fallbackRes.ok || fallbackRes.status === 204) {
              transitioned = true;
              console.log(`[Jira] Fallback transition successful with ID ${fallbackTransition.id}`);
            }
          }
        }
      }
    } catch (e) {
      console.warn(`[Jira] Failed to transition ${issueKey}:`, e);
    }

    return NextResponse.json({ success: true, issueKey, issueUrl, transitioned });
  } catch (err: any) {
    console.error("[Jira] Unexpected error:", err);
    return NextResponse.json({ error: err.message ?? "Internal error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { action, id, newCreatorUsername } = body;
    
    if (action === "mark-read" && id) {
      await prisma.jiraTicket.update({
        where: { id },
        data: { isUnread: false }
      });
      return NextResponse.json({ success: true });
    }

    if (action === "reassign" && id && newCreatorUsername) {
      const ticket = await prisma.jiraTicket.findUnique({ where: { id } });
      
      let reporterNameStr = newCreatorUsername;
      if (ticket) {
        // Try to update Jira issue reporter
        try {
          const projectKey = ticket.ticketKey.split('-')[0];
          const { mapping } = await discoverFields(projectKey);
          
          // Get the email or username of the new user to search in Jira
          const newDbUser = await prisma.user.findUnique({ where: { username: newCreatorUsername } });
          reporterNameStr = newDbUser?.fullName || newDbUser?.username || newCreatorUsername;
          const query = newDbUser?.email || newDbUser?.fullName || newCreatorUsername;
          
          // Search for user in Jira
          const uRes = await jiraFetch(`/rest/api/3/user/search?query=${encodeURIComponent(query)}&maxResults=5`);
          let assigneeAccountId;
          if (uRes.ok) {
            const users = await uRes.json();
            if (users.length > 0) {
              assigneeAccountId = users[0].accountId;
            }
          }

          if (assigneeAccountId) {
            const updateFields: any = {
              reporter: { accountId: assigneeAccountId }
            };
            if (mapping.informadorField) {
              updateFields[mapping.informadorField] = { accountId: assigneeAccountId };
            }

            const putRes = await jiraFetch(`/rest/api/3/issue/${ticket.ticketKey}`, {
              method: "PUT",
              body: JSON.stringify({ fields: updateFields })
            });
            
            if (!putRes.ok) {
              console.warn(`[Jira] Failed to update reporter on reassign: ${await putRes.text()}`);
            } else {
              console.log(`[Jira] Successfully updated reporter for ${ticket.ticketKey} to ${assigneeAccountId}`);
              
              // Add comment to notify the new user
              const commentRes = await jiraFetch(`/rest/api/3/issue/${ticket.ticketKey}/comment`, {
                method: "POST",
                body: JSON.stringify({
                  body: {
                    type: "doc",
                    version: 1,
                    content: [
                      {
                        type: "paragraph",
                        content: [
                          {
                            type: "text",
                            text: "Este ticket ha sido reasignado a "
                          },
                          {
                            type: "mention",
                            attrs: {
                              id: assigneeAccountId,
                              text: `@${newCreatorUsername}`
                            }
                          },
                          {
                            type: "text",
                            text: " para darle seguimiento y continuidad (acción realizada desde el Centro de Control de Parcheo)."
                          }
                        ]
                      }
                    ]
                  }
                })
              });
              
              if (!commentRes.ok) {
                console.warn(`[Jira] Failed to add comment on reassign: ${await commentRes.text()}`);
              } else {
                console.log(`[Jira] Successfully added reassign comment to ${ticket.ticketKey}`);
              }
            }
          }
        } catch (err) {
          console.error("[Jira] Error updating Jira issue on reassign:", err);
        }
      }

      await prisma.jiraTicket.update({
        where: { id },
        data: {
          assignedUsername: newCreatorUsername,
          reporterName: reporterNameStr,
          isUnread: true,
          reassignedBy: session.user?.name || "admin"
        }
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid action or parameters" }, { status: 400 });
  } catch (error) {
    console.error("[Jira] Error in PATCH:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
