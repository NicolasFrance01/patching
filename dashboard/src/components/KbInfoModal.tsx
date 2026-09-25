import React, { useEffect, useState } from "react";
import { XCircle, Loader2, ExternalLink, ShieldAlert, AlertTriangle, ShieldCheck } from "lucide-react";

interface CVERecord {
  cveNumber: string;
  releaseDate: string;
  severity: string;
  impact: string;
  product: string;
}

interface KbInfoModalProps {
  kbNumber: string;
  onClose: () => void;
}

export default function KbInfoModal({ kbNumber, onClose }: KbInfoModalProps) {
  const [cves, setCves] = useState<CVERecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchKbInfo() {
      try {
        const res = await fetch(`/api/kb-info?kb=${kbNumber}`);
        if (!res.ok) {
          throw new Error("Error al obtener datos de MSRC");
        }
        const data = await res.json();
        setCves(data);
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    }
    fetchKbInfo();
  }, [kbNumber]);

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="glass rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col border border-zinc-700/80 shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <div>
            <h2 className="text-base font-bold text-zinc-100 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-indigo-400" />
              Información de Vulnerabilidades (MSRC)
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">Base de Conocimiento: <strong className="text-white">{kbNumber}</strong></p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-100 hover:bg-white/10 transition-colors"
          >
            <XCircle className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-6 space-y-4">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-40 text-zinc-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
              <span className="text-sm">Consultando API de MSRC...</span>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-40 text-rose-400 gap-2">
              <AlertTriangle className="w-6 h-6" />
              <span className="text-sm font-medium">{error}</span>
            </div>
          ) : cves.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-emerald-400 gap-2 bg-emerald-950/20 rounded-xl border border-emerald-900/30">
              <ShieldCheck className="w-8 h-8" />
              <span className="text-sm font-medium">No se encontraron CVEs críticos asociados a este KB en MSRC.</span>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-xl border border-zinc-800">
              <table className="w-full text-xs text-left">
                <thead className="sticky top-0 bg-zinc-950 text-zinc-400 uppercase border-b border-zinc-800">
                  <tr>
                    <th className="px-4 py-3 font-semibold">CVE</th>
                    <th className="px-4 py-3 font-semibold">Gravedad</th>
                    <th className="px-4 py-3 font-semibold">Impacto</th>
                    <th className="px-4 py-3 font-semibold">Fecha Publicación</th>
                    <th className="px-4 py-3 font-semibold text-center">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {cves.map((cve) => {
                    const isCritical = cve.severity?.toLowerCase() === "critical";
                    const isImportant = cve.severity?.toLowerCase() === "important";
                    return (
                      <tr key={cve.cveNumber} className="hover:bg-white/[0.02]">
                        <td className="px-4 py-3 font-bold text-zinc-200">{cve.cveNumber}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold border ${isCritical ? "bg-rose-500/10 text-rose-400 border-rose-500/20" : isImportant ? "bg-orange-500/10 text-orange-400 border-orange-500/20" : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"}`}>
                            {cve.severity || "—"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-zinc-300">{cve.impact || "—"}</td>
                        <td className="px-4 py-3 text-zinc-400">{new Date(cve.releaseDate).toLocaleDateString("es-AR")}</td>
                        <td className="px-4 py-3 text-center">
                          <a 
                            href={`https://msrc.microsoft.com/update-guide/vulnerability/${cve.cveNumber}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/40 hover:text-indigo-300 transition-colors font-medium text-[10px] border border-indigo-500/20"
                          >
                            Ver en MSRC <ExternalLink className="w-3 h-3" />
                          </a>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}