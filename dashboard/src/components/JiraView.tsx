"use client";

import { useState, useEffect } from "react";
import { Ticket, ExternalLink, Search, User, Calendar, Database, Building2 } from "lucide-react";

interface JiraTicket {
  id: string;
  ticketKey: string;
  ticketUrl: string;
  bank: string;
  errorDescription: string;
  creatorUsername: string;
  createdAt: string;
}

export default function JiraView({ creatorOnly = false, creatorUsername }: { creatorOnly?: boolean; creatorUsername?: string }) {
  const [tickets, setTickets] = useState<JiraTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBanks, setSelectedBanks] = useState<string[]>(["all"]);

  useEffect(() => {
    fetch("/api/jira?action=get-tickets")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTickets(creatorOnly ? data.filter(t => t.creatorUsername === creatorUsername) : data);
        }
      })
      .catch((e) => console.error("Error fetching Jira tickets:", e))
      .finally(() => setLoading(false));
  }, [creatorOnly, creatorUsername]);

  const banks = Array.from(new Set(tickets.map(t => t.bank))).sort();
  
  const filteredTickets = tickets.filter(t => {
    const matchSearch = t.ticketKey.toLowerCase().includes(search.toLowerCase()) || 
                        t.errorDescription.toLowerCase().includes(search.toLowerCase()) ||
                        t.creatorUsername.toLowerCase().includes(search.toLowerCase());
    const matchBank = selectedBanks.includes("all") || selectedBanks.includes(t.bank);
    return matchSearch && matchBank;
  });

  return (
    <div className="space-y-6">
      <div className="glass rounded-2xl p-5 border-l-4 border-l-indigo-500">
        <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
          <Ticket className="w-5 h-5 text-indigo-400" />
          {creatorOnly ? "Mis Tickets Realizados" : "Tickets de Jira"}
        </h2>
        <p className="text-sm text-zinc-400 mt-1">
          {creatorOnly 
            ? "Historial de los tickets que vos creaste." 
            : "Registro histórico de todos los tickets creados desde el Centro de Control de Parcheo."}
        </p>
      </div>

      <div className="glass rounded-2xl p-5">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar por ID, error, o usuario..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-zinc-900 border border-zinc-700/50 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-[11px] text-zinc-500 font-medium mr-1 shrink-0">Banco(s):</span>
          <button
            onClick={() => setSelectedBanks(["all"])}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
              selectedBanks.includes("all") ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" : "text-zinc-400 border-zinc-700/50 hover:text-zinc-200"
            }`}
          >
            Todos
          </button>
          {banks.map(b => (
            <button
              key={b}
              onClick={() => {
                setSelectedBanks(prev => {
                  const next = prev.filter(x => x !== "all");
                  if (next.includes(b)) {
                    const res = next.filter(x => x !== b);
                    return res.length === 0 ? ["all"] : res;
                  }
                  return [...next, b];
                });
              }}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                selectedBanks.includes(b) ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" : "text-zinc-400 border-zinc-700/50 hover:text-zinc-200"
              }`}
            >
              {b}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-zinc-500">Cargando tickets...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTickets.map(t => (
              <div key={t.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 flex flex-col justify-between hover:border-zinc-700 transition-all group">
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <a href={t.ticketUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 font-bold hover:underline flex items-center gap-1.5">
                      {t.ticketKey} <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 font-bold uppercase">{t.bank}</span>
                  </div>
                  <p className="text-xs text-zinc-300 line-clamp-3 mb-4" title={t.errorDescription}>
                    {t.errorDescription}
                  </p>
                </div>
                
                <div className="space-y-1.5 mt-auto pt-4 border-t border-zinc-800/60">
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <User className="w-3.5 h-3.5" /> Creado por: <span className="text-zinc-400">{t.creatorUsername}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(t.createdAt).toLocaleString("es-AR")}
                  </div>
                </div>
              </div>
            ))}
            {filteredTickets.length === 0 && (
              <div className="col-span-full py-12 text-center text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
                No se encontraron tickets con esos filtros.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
