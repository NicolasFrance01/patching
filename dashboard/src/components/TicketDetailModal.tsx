"use client";

import { useState, useEffect } from "react";
import { X, Loader2, MessageSquare, AlertCircle, Calendar, User } from "lucide-react";
import { JiraTicket } from "./JiraView";

interface TicketDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: JiraTicket | null;
}

interface TicketDetail {
  status: string;
  statusCategory: string;
  description: any;
  comments: any[];
}

export default function TicketDetailModal({ isOpen, onClose, ticket }: TicketDetailModalProps) {
  const [loading, setLoading] = useState(false);
  const [detail, setDetail] = useState<TicketDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && ticket) {
      setLoading(true);
      setError(null);
      fetch(`/api/jira?action=get-issue&issueKey=${ticket.ticketKey}`)
        .then(res => {
          if (!res.ok) throw new Error("Error al obtener detalles");
          return res.json();
        })
        .then(data => {
          if (data.error) throw new Error(data.error);
          setDetail(data);
        })
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    } else {
      setDetail(null);
      setError(null);
    }
  }, [isOpen, ticket]);

  if (!isOpen || !ticket) return null;

  const renderDescription = () => {
    if (!detail?.description) return <p className="text-sm text-zinc-400 italic">No hay descripción disponible.</p>;
    
    // Si la descripción viene en formato ADF (Atlassian Document Format)
    if (typeof detail.description === 'object') {
      try {
        const renderAdfNode = (node: any, idx: number) => {
          if (node.type === 'paragraph') {
            return (
              <p key={idx} className="mb-2">
                {node.content?.map((contentNode: any, cIdx: number) => {
                  if (contentNode.type === 'text') {
                    const isStrong = contentNode.marks?.some((m: any) => m.type === 'strong');
                    return isStrong ? <strong key={cIdx} className="text-zinc-200">{contentNode.text}</strong> : <span key={cIdx}>{contentNode.text}</span>;
                  }
                  return null;
                })}
              </p>
            );
          }
          if (node.type === 'bulletList') {
            return (
              <ul key={idx} className="list-disc pl-5 mb-2">
                {node.content?.map((item: any, iIdx: number) => (
                  <li key={iIdx}>{item.content?.map((c: any, cIdx: number) => renderAdfNode(c, cIdx))}</li>
                ))}
              </ul>
            );
          }
          // Para otros nodos que no parseamos aún
          return null;
        };
        
        return (
          <div className="text-sm text-zinc-300">
            {detail.description.content?.map((node: any, idx: number) => renderAdfNode(node, idx))}
          </div>
        );
      } catch (e) {
        return <p className="text-sm text-zinc-400">La descripción no se pudo renderizar (formato ADF complejo).</p>;
      }
    }
    
    // Si la descripción viene como string plano
    return <p className="text-sm text-zinc-300 whitespace-pre-wrap">{detail.description}</p>;
  };

  const getStatusColor = (category?: string) => {
    switch(category) {
      case 'blue-gray': return 'bg-zinc-500/20 text-zinc-400 border-zinc-500/40';
      case 'yellow': return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
      case 'green': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
      default: return 'bg-indigo-500/20 text-indigo-400 border-indigo-500/40';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm">
      <div className="glass w-full max-w-4xl max-h-full flex flex-col rounded-2xl border border-zinc-700/80 shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <div>
            <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
              <a href={ticket.ticketUrl} target="_blank" rel="noopener noreferrer" className="hover:underline text-indigo-400">
                {ticket.ticketKey}
              </a>
              <span className="text-sm text-zinc-500 font-normal">Detalle del ticket</span>
            </h2>
            <div className="flex gap-4 text-[11px] text-zinc-500 mt-1">
              <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Creador: {ticket.creatorUsername}</span>
              {ticket.reporterName && <span className="flex items-center gap-1"><User className="w-3.5 h-3.5" /> Informador actual: {ticket.reporterName}</span>}
              <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {new Date(ticket.createdAt).toLocaleString("es-AR")}</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-zinc-950/40 space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-indigo-400 gap-3">
              <Loader2 className="w-8 h-8 animate-spin" />
              <p className="text-sm font-medium">Obteniendo datos en vivo desde Jira...</p>
            </div>
          ) : error ? (
            <div className="flex items-start gap-3 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <div>
                <p className="font-bold text-sm">Error de conexión</p>
                <p className="text-xs opacity-80 mt-1">{error}</p>
              </div>
            </div>
          ) : detail && (
            <>
              {/* Estado y Descripción */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] gap-6">
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Descripción original</h3>
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 max-h-[300px] overflow-y-auto">
                      {renderDescription()}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Estado Actual</h3>
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 flex items-center justify-center">
                      <span className={`px-4 py-2 rounded-full border text-sm font-bold uppercase tracking-wide ${getStatusColor(detail.statusCategory)}`}>
                        {detail.status || 'Desconocido'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Organización</h3>
                    <div className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4">
                      <p className="text-sm font-medium text-zinc-200">{ticket.bank}</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Comentarios */}
              <div className="mt-8 border-t border-zinc-800 pt-6">
                <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-2 mb-4">
                  <MessageSquare className="w-4 h-4 text-indigo-400" />
                  Comentarios en Jira ({detail.comments.length})
                </h3>
                
                <div className="space-y-4">
                  {detail.comments.length === 0 ? (
                    <div className="text-center py-10 bg-zinc-900/30 rounded-xl border border-zinc-800/50">
                      <MessageSquare className="w-6 h-6 text-zinc-600 mx-auto mb-2" />
                      <p className="text-sm text-zinc-500">No hay comentarios en este ticket aún.</p>
                    </div>
                  ) : (
                    detail.comments.map((comment: any) => {
                      const author = comment.author?.displayName || 'Desconocido';
                      const created = new Date(comment.created).toLocaleString('es-AR');
                      
                      return (
                        <div key={comment.id} className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-4 shadow-sm hover:border-zinc-700 transition-colors">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-bold text-indigo-300">{author}</span>
                            <span className="text-[10px] text-zinc-500 font-medium">{created}</span>
                          </div>
                          <div className="text-sm text-zinc-300 whitespace-pre-wrap break-words">
                            {/* Parseamos ADF simple si es necesario, o mostramos body plano */}
                            {typeof comment.body === 'object' ? (
                              comment.body.content?.map((node: any, idx: number) => {
                                if (node.type === 'paragraph') {
                                  return (
                                    <p key={idx} className="mb-2">
                                      {node.content?.map((cn: any, cIdx: number) => {
                                        if (cn.type === 'text') return <span key={cIdx}>{cn.text}</span>;
                                        if (cn.type === 'mention') return <span key={cIdx} className="text-indigo-400 font-bold bg-indigo-500/10 px-1 rounded">@{cn.attrs.text.replace('@', '')}</span>;
                                        return null;
                                      })}
                                    </p>
                                  );
                                }
                                return null;
                              })
                            ) : (
                              comment.body
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
