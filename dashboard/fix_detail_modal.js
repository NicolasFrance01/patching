const fs = require('fs');
const path = require('path');

function patchDetailModal() {
    const p = path.join(__dirname, 'src/components/TicketDetailModal.tsx');
    let content = fs.readFileSync(p, 'utf8');

    // 1. Add area and account to TicketDetail interface
    content = content.replace(
        /interface TicketDetail \{\s*status: string;\s*statusCategory: string;\s*description: any;\s*comments: any\[\];\s*\}/,
        `interface TicketDetail {\n  status: string;\n  statusCategory: string;\n  description: any;\n  comments: any[];\n  area?: string;\n  account?: string;\n}`
    );

    // 2. Add state for editing area and account
    content = content.replace(
        /const \[detail, setDetail\] = useState<TicketDetail \| null>\(null\);\s*const \[error, setError\] = useState<string \| null>\(null\);/,
        `const [detail, setDetail] = useState<TicketDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editingArea, setEditingArea] = useState<string>("");
  const [editingAccount, setEditingAccount] = useState<string>("");
  const [isSavingFields, setIsSavingFields] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);`
    );

    // 3. Update useEffect to initialize editing state
    content = content.replace(
        /setDetail\(data\);/,
        `setDetail(data);
          setEditingArea(data.area || "SEC");
          setEditingAccount(data.account || "GP | SEC | Abono");`
    );

    // 4. Add handleSaveFields function
    content = content.replace(
        /if \(!isOpen \|\| !ticket\) return null;/,
        `if (!isOpen || !ticket) return null;

  const handleSaveFields = async () => {
    setIsSavingFields(true);
    setSaveSuccess(false);
    setError(null);
    try {
      const res = await fetch("/api/jira", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update-fields",
          issueKey: ticket.ticketKey,
          area: editingArea,
          account: editingAccount,
        })
      });
      if (!res.ok) throw new Error("Error al guardar cambios en Jira");
      
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
      setDetail(prev => prev ? { ...prev, area: editingArea, account: editingAccount } : null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSavingFields(false);
    }
  };`
    );

    // 5. Inject Area and Account UI in the right column
    const insertUI = `
                  <div>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Área y Cuenta (Jira)</h3>
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 space-y-3">
                      <div>
                        <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Área</label>
                        <select
                          value={editingArea}
                          onChange={(e) => setEditingArea(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="SEC">SEC</option>
                          <option value="INO">INO</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider block mb-1">Account</label>
                        <select
                          value={editingAccount}
                          onChange={(e) => setEditingAccount(e.target.value)}
                          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
                        >
                          <option value="GP | SEC | Abono">GP | SEC | Abono</option>
                          <option value="GP | InO | Abono">GP | InO | Abono</option>
                          <option value="ASJ | SEC | Abono">ASJ | SEC | Abono</option>
                        </select>
                      </div>
                      
                      <button
                        onClick={handleSaveFields}
                        disabled={isSavingFields || (detail.area === editingArea && detail.account === editingAccount)}
                        className="w-full mt-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-bold transition-all flex items-center justify-center gap-2"
                      >
                        {isSavingFields ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                        {isSavingFields ? "Guardando..." : "Guardar Cambios"}
                      </button>
                      {saveSuccess && <p className="text-[11px] text-emerald-400 font-medium text-center mt-1">¡Cambios guardados exitosamente!</p>}
                    </div>
                  </div>`;

    content = content.replace(
        /<div>\s*<h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Organización<\/h3>\s*<div className="bg-zinc-900\/60 border border-zinc-800 rounded-xl p-4">\s*<p className="text-sm font-medium text-zinc-200">\{ticket.bank\}<\/p>\s*<\/div>\s*<\/div>/,
        `<div>\n                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Organización</h3>\n                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">\n                      <p className="text-sm font-medium text-zinc-200">{ticket.bank}</p>\n                    </div>\n                  </div>${insertUI}`
    );

    fs.writeFileSync(p, content, 'utf8');
}

patchDetailModal();
