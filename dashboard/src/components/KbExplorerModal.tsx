import React, { useState } from "react";
import { XCircle, Search, FileText } from "lucide-react";
import KbInfoModal from "./KbInfoModal";

interface KbExplorerModalProps {
  kbs: { kb: string; count: number }[];
  onClose: () => void;
}

export default function KbExplorerModal({ kbs, onClose }: KbExplorerModalProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedKb, setSelectedKb] = useState<string | null>(null);

  const filteredKbs = kbs
    .filter(k => k.kb.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="glass rounded-2xl w-full max-w-3xl max-h-[80vh] flex flex-col border border-zinc-700/80 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            Explorador de KBs Instaladas
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b border-zinc-800/80 bg-zinc-950/40">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
            <input
              type="text"
              placeholder="Buscar KB..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg pl-9 pr-4 py-2 text-sm text-zinc-100 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          {filteredKbs.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-zinc-500 text-sm">
              No se encontraron KBs.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredKbs.map((item) => (
                <button
                  key={item.kb}
                  onClick={() => setSelectedKb(item.kb)}
                  className="flex flex-col p-3 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800/80 hover:border-indigo-500/50 transition-all text-left group"
                >
                  <span className="text-sm font-bold text-zinc-200 group-hover:text-indigo-400 transition-colors">
                    {item.kb}
                  </span>
                  <span className="text-[10px] text-zinc-500 mt-1">
                    {item.count} {item.count === 1 ? "servidor" : "servidores"}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {selectedKb && (
        <KbInfoModal kbNumber={selectedKb} onClose={() => setSelectedKb(null)} />
      )}
    </div>
  );
}