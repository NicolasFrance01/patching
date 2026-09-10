const fs = require('fs');
const path = require('path');

function patchJiraApi() {
    const p = path.join(__dirname, 'src/app/api/jira/route.ts');
    let content = fs.readFileSync(p, 'utf8');

    // 1. Update GET?action=get-tickets
    content = content.replace(
        /if \(action === "get-tickets"\) \{\s+try \{\s+const tickets = await prisma\.jiraTicket\.findMany\(\{\s+orderBy: \{ createdAt: "desc" \}\s+\}\);\s+return NextResponse\.json\(tickets\);\s+\} catch \(e: any\) \{\s+return NextResponse\.json\(\{ error: e\.message \}, \{ status: 500 \}\);\s+\}\s+\}/,
        `if (action === "get-tickets") {
    try {
      const tickets = await prisma.jiraTicket.findMany({
        orderBy: { createdAt: "desc" }
      });
      const withStatus = searchParams.get("withStatus");
      if (withStatus === "true") {
         const keys = tickets.slice(0, 50).map(t => t.ticketKey);
         if (keys.length > 0) {
            const jql = \`issueKey in (\${keys.join(",")})\`;
            const jRes = await jiraFetch(\`/rest/api/3/search/jql\`, {
               method: "POST",
               body: JSON.stringify({ jql, fields: ["status"], maxResults: 50 })
            });
            if (jRes.ok) {
               const jData = await jRes.json();
               const statuses = Object.fromEntries((jData.issues ?? []).map((i: any) => [i.key, i.fields?.status?.name]));
               const mapped = tickets.map(t => ({ ...t, liveStatus: statuses[t.ticketKey] || "Desconocido" }));
               return NextResponse.json(mapped);
            }
         }
      }
      return NextResponse.json(tickets);
    } catch (e: any) {
      return NextResponse.json({ error: e.message }, { status: 500 });
    }
  }`
    );

    // 2. Update GET?action=get-issue
    content = content.replace(
        /if \(action === "get-issue"\) \{[\s\S]*?return NextResponse\.json\(\{\s*status: data\.fields\?\.status\?\.name,\s*statusCategory: data\.fields\?\.status\?\.statusCategory\?\.colorName,\s*description: data\.fields\?\.description,\s*comments: data\.fields\?\.comment\?\.comments \|\| \[\]\s*\}\);\s*\}/,
        `if (action === "get-issue") {
    const issueKey = searchParams.get("issueKey");
    if (!issueKey) return NextResponse.json({ error: "Missing issueKey" }, { status: 400 });
    
    const project = issueKey.split("-")[0];
    const { mapping } = await discoverFields(project);
    
    const fieldsToFetch = ["status","description","comment"];
    if (mapping.areaField) fieldsToFetch.push(mapping.areaField);
    if (mapping.accountField) fieldsToFetch.push(mapping.accountField);

    const res = await jiraFetch(\`/rest/api/3/issue/\${issueKey}?fields=\${fieldsToFetch.join(",")}\`);
    if (!res.ok) return NextResponse.json({ error: await res.text() }, { status: res.status });
    
    const data = await res.json();

    let areaValue = null;
    if (mapping.areaField) {
      const areaObj = data.fields?.[mapping.areaField];
      areaValue = areaObj?.value || areaObj?.name || areaObj;
    }

    let accountValue = null;
    if (mapping.accountField) {
      const accObj = data.fields?.[mapping.accountField];
      accountValue = accObj?.name || accObj?.value;
      if (typeof accObj === "number") {
          if (accObj === 608) accountValue = "ASJ | SEC | Abono";
          else if (accObj === 609) accountValue = "GP | SEC | Abono";
          else accountValue = "GP | InO | Abono";
      }
    }

    return NextResponse.json({
      status: data.fields?.status?.name,
      statusCategory: data.fields?.status?.statusCategory?.colorName,
      description: data.fields?.description,
      comments: data.fields?.comment?.comments || [],
      area: areaValue,
      account: accountValue,
    });
  }`
    );

    // 3. Update POST action variables (isINO, targetArea, targetAccount)
    content = content.replace(
        /if \(areaField\) \{\s*fields\[areaField\] = resolveValue\(fieldMeta\.areaField, "SEC"\);\s*\}/,
        `const isINO = ["BSC", "BSJ", "Corp", "NBERSA", "NBSF"].includes(bankCode);
    const targetArea = isINO ? "INO" : "SEC";

    if (areaField) {
      fields[areaField] = resolveValue(fieldMeta.areaField, targetArea);
    }`
    );

    content = content.replace(
        /const targetAccount = projectKey === "ASJ" \? "ASJ \| SEC \| Abono" : "GP \| SEC \| Abono";/,
        `const targetAccount = projectKey === "ASJ" ? "ASJ | SEC | Abono" : (isINO ? "GP | InO | Abono" : "GP | SEC | Abono");`
    );

    fs.writeFileSync(p, content, 'utf8');
}
patchJiraApi();
