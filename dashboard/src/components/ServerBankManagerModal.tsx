import React, { useState, useMemo } from "react";
import { ServerType, SERVER_TYPES, serverTypeMap, getServerInfo } from "@/lib/serverTypeMap";
import { ServerStatus } from "@/types";
import { X, Search, RefreshCw, Trash2 } from "lucide-react";

interface ServerBankManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  bank: string;
  syncedServers: ServerStatus[];
  overrides: Record<string, string>;
  onOverrideChange: (serverName: string, newBank: string) => void;
  onServerDelete: (serverName: string) => void;
}

export default function ServerBankManagerModal({
  isOpen,
  onClose,
  bank,
  syncedServers,
  overrides,
  onOverrideChange,
  onServerDelete
}: ServerBankManagerModalProps) {
  const [search, setSearch] = useState("");
  const [saving, setSaving] = useState<string | null>(null);

  const serversInBank = useMemo(() => {
    // Collect from map
    const mappedServers = Object.keys(serverTypeMap).filter(k => {
      const type = overrides[k] || serverTypeMap[k].type;
      return type === bank;
    });

    // Collect from synced (unclassified or overridden)
    const syncedNames = syncedServers.filter(s => {
      const b = overrides[s.serverName] || getServerInfo(s.serverName)?.type || "Sin clasificar";
      return b === bank;
    }).map(s => s.serverName);

    // Combine and deduplicate
    const combined = Array.from(new Set([...mappedServers, ...syncedNames])).sort();
    
    if (!search) return combined;
    return combined.filter(s => s.toLowerCase().includes(search.toLowerCase()));
  }, [bank, overrides, syncedServers, search]);

  const handleMove = async (serverName: string, newBank: string) => {
    setSaving(serverName);
    try {
      const res = await fetch('/api/server-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ serverName, bank: newBank })
      });
      if (res.ok) {
        onOverrideChange(serverName, newBank);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(null);
    }
  };

  const handleDelete = async (serverName: string) => {
    if (!confirm(`¿Estás seguro de eliminar completamente el servidor ${serverName}? Esto borrará su historial de la base de datos.`)) return;
    
    setSaving(serverName);
    try {
      const res = await fetch(`/api/server/${serverName}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        onServerDelete(serverName);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(null);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass w-full max-w-2xl rounded-2xl shadow-2xl flex flex-col max-h-[85vh] border border-zinc-800">
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/60">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            Gestionar Servidores: {bank}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-zinc-800 rounded-full transition-colors">
            <X className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        <div className="p-4 border-b border-zinc-800/60">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Buscar servidor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="space-y-2">
            {serversInBank.length === 0 ? (
              <div className="text-center text-zinc-500 py-10 text-sm">No se encontraron servidores.</div>
            ) : (
              serversInBank.map(srv => {
                const isSynced = syncedServers.some(s => s.serverName === srv);
                return (
                  <div key={srv} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-zinc-900/50 rounded-xl border border-zinc-800 hover:border-zinc-700 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center text-zinc-400 font-bold text-xs">
                        {srv.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">{srv}</p>
                        <p className="text-[10px] text-zinc-500">
                          {isSynced ? "Sincronizado" : "No sincronizado (Solo en diccionario)"}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select 
                        value={bank}
                        onChange={(e) => handleMove(srv, e.target.value)}
                        disabled={saving === srv}
                        className="bg-zinc-800 border border-zinc-700 text-xs rounded-lg px-2 py-1.5 focus:outline-none"
                      >
                        {[...SERVER_TYPES, "Sin clasificar"].map(t => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      
                      {isSynced && (
                        <button
                          onClick={() => handleDelete(srv)}
                          disabled={saving === srv}
                          title="Eliminar de la base de datos"
                          className="p-1.5 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg transition-colors disabled:opacity-50"
                        >
                          {saving === srv ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
