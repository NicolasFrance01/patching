import { useState, useEffect } from "react";
import { X, User, Save, RefreshCw } from "lucide-react";

interface JiraTicket {
  id: string;
  ticketKey: string;
  ticketUrl: string;
  bank: string;
  errorDescription: string;
  creatorUsername: string;
  isUnread?: boolean;
  reassignedBy?: string | null;
  createdAt: string;
}

interface TicketEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: JiraTicket | null;
  onSuccess: () => void;
}

export default function TicketEditModal({ isOpen, onClose, ticket, onSuccess }: TicketEditModalProps) {
  const [users, setUsers] = useState<{ id: string, username: string, email?: string | null }[]>([]);
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedUser(ticket?.creatorUsername || "");
      fetch("/api/usuarios?action=list")
        .then(r => r.json())
        .then(data => {
          if (Array.isArray(data)) setUsers(data);
        })
        .catch(e => console.error("Error fetching users:", e));
    }
  }, [isOpen, ticket]);

  if (!isOpen || !ticket) return null;

  const handleSave = async () => {
    if (!selectedUser || selectedUser === ticket.creatorUsername) return onClose();
    
    setLoading(true);
    try {
      const res = await fetch("/api/jira", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reassign", id: ticket.id, newCreatorUsername: selectedUser })
      });
      if (res.ok) {
        onSuccess();
        onClose();
      } else {
        console.error("Failed to reassign");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-2xl bg-[#111113] border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-zinc-800/60 bg-white/[0.02]">
          <h2 className="text-lg font-bold text-zinc-100 flex items-center gap-2">
            Modificar Ticket <span className="text-indigo-400">{ticket.ticketKey}</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-white/10 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh]">
          {/* Error Description (Full) */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Detalle del Correo / Error
            </label>
            <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4 text-sm text-zinc-300 whitespace-pre-wrap font-mono">
              {ticket.errorDescription}
            </div>
          </div>

          {/* Reassign User */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" /> Reasignar Usuario
            </label>
            <select
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-900 border border-zinc-700/50 rounded-xl text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
            >
              <option value="">Seleccione un usuario...</option>
              {users.map(u => (
                <option key={u.id} value={u.username}>
                  {u.username} {u.email ? `(${u.email})` : ""}
                </option>
              ))}
            </select>
            <p className="text-[11px] text-zinc-500">
              Al guardar, este ticket se trasladará a la pestaña "Mis Tickets" de este usuario.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-zinc-800/60 bg-white/[0.01] flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-zinc-300 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={loading || !selectedUser || selectedUser === ticket.creatorUsername}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl transition-colors shadow-lg shadow-indigo-500/20"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
}
