"use client";

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Server, CheckCircle2, XCircle, AlertCircle } from "lucide-react";

interface PatchOrder {
  id: string;
  title: string;
  description: string | null;
  actionType: string;
  targetGroups: string | null;
  targetServers: string | null;
  scheduledAt: string;
  status: string;
  executionLog: string | null;
}

export default function CalendarioView({ initialOrders }: { initialOrders: PatchOrder[] }) {
  const [orders, setOrders] = useState<PatchOrder[]>(initialOrders);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PatchOrder | null>(null);

  // Form states for creating new order
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actionType, setActionType] = useState("CHECK");
  const [targetGroups, setTargetGroups] = useState("");
  const [targetServers, setTargetServers] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calendar logic
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const handlePrevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "bg-zinc-500/20 text-zinc-300 border-zinc-500/50";
      case "IN_PROGRESS": return "bg-blue-500/20 text-blue-300 border-blue-500/50 animate-pulse";
      case "COMPLETED": return "bg-emerald-500/20 text-emerald-300 border-emerald-500/50";
      case "FAILED": return "bg-rose-500/20 text-rose-300 border-rose-500/50";
      default: return "bg-zinc-800 text-zinc-300";
    }
  };

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, actionType, targetGroups, targetServers, scheduledAt, status: "PENDING"
        })
      });

      if (res.ok) {
        const newOrder = await res.json();
        setOrders([...orders, newOrder]);
        setIsCreateModalOpen(false);
        // Reset form
        setTitle(""); setDescription(""); setTargetGroups(""); setTargetServers(""); setScheduledDate(""); setScheduledTime("");
      } else {
        alert("Error al crear la programación.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al crear la programación.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build calendar grid
  const renderCalendarDays = () => {
    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="min-h-[100px] bg-zinc-950/20 border border-zinc-800/50 p-2" />);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayOrders = orders.filter(o => o.scheduledAt.startsWith(dateStr));

      days.push(
        <div key={day} className="min-h-[100px] bg-zinc-900/40 border border-zinc-800/80 p-2 flex flex-col gap-1 hover:bg-zinc-800/40 transition-colors">
          <div className="text-right text-xs text-zinc-500 font-semibold mb-1">{day}</div>
          {dayOrders.map(order => (
            <div
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`text-[10px] px-2 py-1 rounded border cursor-pointer truncate ${getStatusColor(order.status)}`}
              title={order.title}
            >
              {new Date(order.scheduledAt).toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" })} - {order.title}
            </div>
          ))}
        </div>
      );
    }
    return days;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4 bg-zinc-900/50 p-1.5 rounded-lg border border-zinc-800">
          <button onClick={handlePrevMonth} className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="text-sm font-semibold w-32 text-center capitalize text-zinc-200">
            {currentDate.toLocaleDateString("es-AR", { month: "long", year: "numeric" })}
          </span>
          <button onClick={handleNextMonth} className="p-1.5 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-indigo-500/20"
        >
          <Plus className="w-4 h-4" />
          Programar Ejecución
        </button>
      </div>

      <div className="glass rounded-xl overflow-hidden border border-zinc-800">
        <div className="grid grid-cols-7 bg-zinc-950/80 border-b border-zinc-800">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map(day => (
            <div key={day} className="py-3 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {renderCalendarDays()}
        </div>
      </div>

      {/* Create Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-xl w-full max-w-lg shadow-2xl flex flex-col border border-zinc-700/50">
            <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center">
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-indigo-400" /> Nueva Programación
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="text-zinc-500 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateOrder} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Título</label>
                <input required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Ej: Parcheo de Base de Datos" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Fecha</label>
                  <input required type="date" value={scheduledDate} onChange={(e) => setScheduledDate(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-400 mb-1">Hora</label>
                  <input required type="time" value={scheduledTime} onChange={(e) => setScheduledTime(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Tipo de Acción</label>
                <select value={actionType} onChange={(e) => setActionType(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none">
                  <option value="CHECK">Solo Chequeo (CheckWSUS)</option>
                  <option value="INSTALL">Instalación y Reinicio (Install)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Grupos Destino (separados por coma)</label>
                <input value={targetGroups} onChange={(e) => setTargetGroups(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Ej: ASJ, BSC" />
              </div>
              <div>
                <label className="block text-xs font-medium text-zinc-400 mb-1">Servidores Destino (opcional)</label>
                <input value={targetServers} onChange={(e) => setTargetServers(e.target.value)} className="w-full bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-2 text-sm text-white focus:border-indigo-500 outline-none" placeholder="Ej: SRV1, SRV2" />
              </div>
              <div className="pt-2 flex justify-end gap-2">
                <button type="button" onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors">Cancelar</button>
                <button type="submit" disabled={isSubmitting} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-lg text-sm font-semibold shadow-lg shadow-indigo-500/20 transition-all">
                  {isSubmitting ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="glass rounded-xl w-full max-w-lg max-h-[90vh] shadow-2xl flex flex-col border border-zinc-700/50">
            <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center shrink-0">
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                Detalle de Programación
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="text-zinc-500 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto min-h-0">
              <div className="flex justify-between items-start">
                <div className="flex-1 pr-4 min-w-0">
                  <h4 className="text-lg font-bold text-white break-words">{selectedOrder.title}</h4>
                  <p className="text-xs text-zinc-400 mt-1">{new Date(selectedOrder.scheduledAt).toLocaleString("es-AR")}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border uppercase ${getStatusColor(selectedOrder.status)}`}>
                  {selectedOrder.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 bg-zinc-900/50 p-3 rounded-lg border border-zinc-800/50">
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium uppercase">Acción</p>
                  <p className="text-sm text-zinc-200 font-semibold">{selectedOrder.actionType}</p>
                </div>
                <div>
                  <p className="text-[10px] text-zinc-500 font-medium uppercase">Grupos</p>
                  <p className="text-sm text-zinc-200">{selectedOrder.targetGroups || "—"}</p>
                </div>
              </div>

              {selectedOrder.executionLog && (
                <div>
                  <p className="text-xs text-zinc-400 mb-1 font-medium">Log de Ejecución</p>
                  <pre className="bg-black/50 border border-zinc-800 rounded-lg p-3 text-[10px] text-zinc-300 max-h-60 overflow-y-auto font-mono whitespace-pre-wrap break-all">
                    {selectedOrder.executionLog}
                  </pre>
                </div>
              )}
            </div>
            <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/50 flex justify-end shrink-0">
              <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-white rounded-lg text-sm font-semibold transition-colors">
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
