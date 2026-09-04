"use client";

import { useState, useEffect } from "react";
import { Ticket, ExternalLink, Search, User, Calendar, Database, Building2 } from "lucide-react";

export interface JiraTicket {
  id: string;
  ticketKey: string;
  ticketUrl: string;
  bank: string;
  errorDescription: string;
  creatorUsername: string;
  assignedUsername?: string | null;
  reporterName?: string | null;
  isUnread?: boolean;
  reassignedBy?: string | null;
  createdAt: string;
}

import TicketEditModal from "./TicketEditModal";
import TicketDetailModal from "./TicketDetailModal";

export default function JiraView({ creatorOnly = false, creatorUsername }: { creatorOnly?: boolean; creatorUsername?: string }) {
  const [tickets, setTickets] = useState<JiraTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBanks, setSelectedBanks] = useState<string[]>(["all"]);
  const [selectedUserFilter, setSelectedUserFilter] = useState<string[]>(["all"]);
  const [timeFilter, setTimeFilter] = useState<"all" | "month" | "custom">("all");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [customFrom, setCustomFrom] = useState("");
  const [customTo, setCustomTo] = useState("");
  const [editingTicket, setEditingTicket] = useState<JiraTicket | null>(null);
  const [detailTicket, setDetailTicket] = useState<JiraTicket | null>(null);

  const fetchTickets = () => {
    setLoading(true);
    fetch("/api/jira?action=get-tickets")
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setTickets(creatorOnly ? data.filter(t => t.assignedUsername === creatorUsername || t.creatorUsername === creatorUsername) : data);
        }
      })
      .catch((e) => console.error("Error fetching Jira tickets:", e))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchTickets();
  }, [creatorOnly, creatorUsername]);

  const banks = Array.from(new Set(tickets.map(t => t.bank))).sort();
  
  // User counts
  const userCounts = tickets.reduce((acc, t) => {
    acc[t.creatorUsername] = (acc[t.creatorUsername] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const uniqueUsers = Object.keys(userCounts).sort();
  
  const filteredTickets = tickets.filter(t => {
    const matchSearch = t.ticketKey.toLowerCase().includes(search.toLowerCase()) || 
                        t.errorDescription.toLowerCase().includes(search.toLowerCase()) ||
                        t.creatorUsername.toLowerCase().includes(search.toLowerCase());
    const matchBank = selectedBanks.includes("all") || selectedBanks.includes(t.bank);
    const matchUser = selectedUserFilter.includes("all") || selectedUserFilter.includes(t.creatorUsername);
    
    // Time filter
    let matchTime = true;
    const d = new Date(t.createdAt);
    if (timeFilter === "month" && selectedMonth) {
      matchTime = t.createdAt.startsWith(selectedMonth);
    } else if (timeFilter === "custom") {
      const f = customFrom ? new Date(customFrom) : new Date(0);
      const to = customTo ? new Date(customTo + "T23:59:59") : new Date();
      matchTime = d >= f && d <= to;
    }

    return matchSearch && matchBank && matchUser && matchTime;
  });

  const handleTicketClick = (t: JiraTicket) => {
    if (creatorOnly && t.isUnread) {
      fetch("/api/jira", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-read", id: t.id })
      }).then(() => fetchTickets());
    }
  };

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

        {/* Filters Group */}
        <div className={`grid grid-cols-1 ${creatorOnly ? 'md:grid-cols-2' : 'md:grid-cols-3'} gap-6 mb-6`}>
          <div className="flex flex-col gap-2 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/50">
            <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Banco(s)</span>
            <div className="flex flex-wrap items-center gap-2">
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
          </div>

          {!creatorOnly && (
            <div className="flex flex-col gap-2 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/50">
              <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Creado por</span>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedUserFilter(["all"])}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                    selectedUserFilter.includes("all") ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" : "text-zinc-400 border-zinc-700/50 hover:text-zinc-200"
                  }`}
                >
                  Todos
                </button>
                {uniqueUsers.map(u => (
                  <button
                    key={u}
                    onClick={() => {
                      setSelectedUserFilter(prev => {
                        const next = prev.filter(x => x !== "all");
                        if (next.includes(u)) {
                          const res = next.filter(x => x !== u);
                          return res.length === 0 ? ["all"] : res;
                        }
                        return [...next, u];
                      });
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all border ${
                      selectedUserFilter.includes(u) ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30" : "text-zinc-400 border-zinc-700/50 hover:text-zinc-200"
                    }`}
                  >
                    {u} <span className="opacity-50 ml-1">({userCounts[u]})</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-2 bg-zinc-900/30 p-3 rounded-xl border border-zinc-800/50">
            <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-wider">Tiempo</span>
            <div className="flex flex-wrap items-center gap-2">
              {(["all", "month", "custom"] as const).map((tf) => (
                <button
                  key={tf}
                  onClick={() => setTimeFilter(tf)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all border ${
                    timeFilter === tf
                      ? "bg-indigo-500/15 text-indigo-300 border-indigo-500/30"
                      : "text-zinc-400 border-zinc-700/50 hover:text-zinc-200"
                  }`}
                >
                  {tf === "all" ? "Todos" : tf === "month" ? "Mes" : "Rango Personalizado"}
                </button>
              ))}
              {timeFilter === "month" && (
                <input 
                  type="month" 
                  value={selectedMonth} 
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500 w-full mt-2" 
                />
              )}
              {timeFilter === "custom" && (
                <div className="flex items-center gap-2 w-full mt-2">
                  <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)}
                    className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500 w-full" />
                  <span className="text-zinc-600 text-xs">→</span>
                  <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)}
                    className="px-2 py-1 text-xs bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500 w-full" />
                </div>
              )}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20 text-zinc-500">Cargando tickets...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredTickets.map(t => {
              const isUnreadAlert = creatorOnly && t.isUnread;
              return (
              <div 
                key={t.id} 
                onClick={() => handleTicketClick(t)}
                className={`bg-zinc-900/50 border rounded-xl p-4 flex flex-col justify-between transition-all group ${
                  isUnreadAlert ? "border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] animate-pulse hover:animate-none cursor-pointer" : "border-zinc-800 hover:border-zinc-700"
                }`}
              >
                <div>
                  <div className="flex items-start justify-between mb-2">
                    <a href={t.ticketUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => isUnreadAlert ? null : e.stopPropagation()} className="text-indigo-400 font-bold hover:underline flex items-center gap-1.5">
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
                  {t.reporterName && (
                    <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                      <User className="w-3.5 h-3.5" /> Informador: <span className="text-zinc-300">{t.reporterName}</span>
                    </div>
                  )}
                  {isUnreadAlert && t.reassignedBy && (
                    <div className="flex items-center gap-2 text-[11px] text-indigo-400 font-semibold">
                      <User className="w-3.5 h-3.5" /> Derivado por: <span>{t.reassignedBy}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-[11px] text-zinc-500">
                    <Calendar className="w-3.5 h-3.5" /> {new Date(t.createdAt).toLocaleString("es-AR")}
                  </div>
                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setDetailTicket(t);
                      }}
                      className="px-3 py-1 text-[11px] font-medium text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-lg transition-colors border border-indigo-500/20"
                    >
                      Detalle
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingTicket(t);
                      }}
                      className="px-3 py-1 text-[11px] font-medium text-zinc-400 bg-zinc-800 hover:bg-zinc-700 hover:text-zinc-200 rounded-lg transition-colors"
                    >
                      Modificar
                    </button>
                  </div>
                </div>
              </div>
            )})}
            {filteredTickets.length === 0 && (
              <div className="col-span-full py-12 text-center text-zinc-500 border-2 border-dashed border-zinc-800 rounded-xl">
                No se encontraron tickets con esos filtros.
              </div>
            )}
          </div>
        )}
      </div>

      <TicketEditModal 
        isOpen={!!editingTicket} 
        onClose={() => setEditingTicket(null)}
        ticket={editingTicket}
        onSuccess={fetchTickets}
      />

      <TicketDetailModal
        isOpen={!!detailTicket}
        onClose={() => setDetailTicket(null)}
        ticket={detailTicket}
      />
    </div>
  );
}
