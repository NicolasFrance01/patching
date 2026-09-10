const fs = require('fs');
const path = require('path');

function patchJiraView() {
    const p = path.join(__dirname, 'src/components/JiraView.tsx');
    let content = fs.readFileSync(p, 'utf8');

    // 1. Add JiraTicket liveStatus to the interface
    content = content.replace(
        /createdAt: string;\s*\}/,
        `createdAt: string;\n  liveStatus?: string;\n}`
    );

    // 2. Add status filter state and limit state
    content = content.replace(
        /const \[search, setSearch\] = useState\(""\);/,
        `const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>(["all"]);
  const [statusLimit, setStatusLimit] = useState<number>(25);`
    );

    // 3. Update fetchTickets to use withStatus
    content = content.replace(
        /fetch\("\/api\/jira\?action=get-tickets"\)/,
        `fetch(\`/api/jira?action=get-tickets\${creatorOnly ? \`&withStatus=true&limit=\${statusLimit}\` : ""}\`)`
    );
    
    // Add effect dependency for statusLimit
    content = content.replace(
        /\}, \[creatorOnly, creatorUsername\]\);/,
        `}, [creatorOnly, creatorUsername, statusLimit]);`
    );

    // 4. Update filtering logic for status
    content = content.replace(
        /const matchUser = selectedUserFilter\.includes\("all"\) \|\| selectedUserFilter\.includes\(t\.creatorUsername\);/,
        `const matchUser = selectedUserFilter.includes("all") || selectedUserFilter.includes(t.creatorUsername);
    const matchStatus = statusFilter.includes("all") || (t.liveStatus && statusFilter.some(s => t.liveStatus!.toLowerCase().includes(s.toLowerCase())));`
    );

    content = content.replace(
        /return matchSearch && matchBank && matchUser && matchTime;/,
        `return matchSearch && matchBank && matchUser && matchTime && matchStatus;`
    );

    // 5. Add UI for status filter and limit in Filters Group
    const statusFilterUI = `
          {creatorOnly && (
            <div className="flex flex-col gap-2 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/50">
              <div className="flex justify-between items-center">
                <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Estado (Jira)</span>
                <select 
                  value={statusLimit} 
                  onChange={(e) => setStatusLimit(Number(e.target.value))}
                  className="bg-zinc-800 border border-zinc-700 text-[10px] rounded px-1 text-zinc-300 outline-none"
                >
                  <option value={25}>Últimos 25</option>
                  <option value={50}>Últimos 50</option>
                </select>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setStatusFilter(["all"])}
                  className={\`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border \${
                    statusFilter.includes("all") ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" : "text-zinc-400 border-zinc-700/50 hover:text-zinc-200"
                  }\`}
                >
                  Todos
                </button>
                {["Resuelto", "Trabajo en progreso", "Cancelado", "Pendiente"].map(s => (
                  <button
                    key={s}
                    onClick={() => {
                      setStatusFilter(prev => {
                        const next = prev.filter(x => x !== "all");
                        if (next.includes(s)) {
                          const res = next.filter(x => x !== s);
                          return res.length === 0 ? ["all"] : res;
                        }
                        return [...next, s];
                      });
                    }}
                    className={\`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border \${
                      statusFilter.includes(s) ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" : "text-zinc-400 border-zinc-700/50 hover:text-zinc-200"
                    }\`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <a href="https://jira.gpetersen.com.ar/issues/?jql=reporter%20in%20(currentUser())%20ORDER%20BY%20created%20DESC" target="_blank" rel="noopener noreferrer" className="text-[10px] text-indigo-400 hover:underline mt-1 flex items-center gap-1">
                <ExternalLink className="w-3 h-3" /> Ver más tickets en Jira
              </a>
            </div>
          )}`;

    content = content.replace(
        /\{!creatorOnly && \(/,
        `${statusFilterUI}\n\n          {!creatorOnly && (`
    );

    // 6. Show status in ticket card
    content = content.replace(
        /<p className="text-xs text-zinc-300 line-clamp-3 mb-4" title=\{t\.errorDescription\}>/,
        `{t.liveStatus && (
                    <span className="inline-block mt-2 mb-2 px-2 py-0.5 rounded text-[10px] font-bold uppercase border bg-zinc-800/50 text-indigo-300 border-indigo-500/30">
                      Estado: {t.liveStatus}
                    </span>
                  )}
                  <p className="text-xs text-zinc-300 line-clamp-3 mb-4" title={t.errorDescription}>`
    );

    fs.writeFileSync(p, content, 'utf8');

    // 7. Update API route to accept limit
    const pApi = path.join(__dirname, 'src/app/api/jira/route.ts');
    let apiContent = fs.readFileSync(pApi, 'utf8');
    
    apiContent = apiContent.replace(
        /const keys = tickets\.slice\(0, 50\)\.map\(t => t\.ticketKey\);/,
        `const limit = parseInt(searchParams.get("limit") || "25");
         const keys = tickets.slice(0, limit).map(t => t.ticketKey);`
    );
    apiContent = apiContent.replace(
        /body: JSON\.stringify\(\{ jql, fields: \["status"\], maxResults: 50 \}\)/,
        `body: JSON.stringify({ jql, fields: ["status"], maxResults: limit })`
    );

    fs.writeFileSync(pApi, apiContent, 'utf8');
}

patchJiraView();
