"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Server, CheckCircle2, XCircle, AlertCircle, Trash2, Check, Search } from "lucide-react";
import { GROUPS, SERVER_TYPES } from "@/lib/serverTypeMap";

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

interface ServerInfo {
  serverName: string;
  grupo: string | null;
  ip: string | null;
  ambiente: string | null;
}

const PREDEFINED_GROUPS = GROUPS;

const PREDEFINED_BANKS = SERVER_TYPES;

function ComboMultiSelect({ 
  label, options, selected, onChange 
}: { 
  label: string, options: string[], selected: string[], onChange: (s: string[]) => void 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredOptions = useMemo(() => {
    const q = search.toLowerCase();
    const opts = new Set(options);
    selected.forEach(s => opts.add(s));
    if (search && !opts.has(search)) opts.add(search); // Allow custom typing
    return Array.from(opts).filter(o => o.toLowerCase().includes(q));
  }, [options, selected, search]);

  const toggleOption = (opt: string) => {
    if (selected.includes(opt)) onChange(selected.filter(s => s !== opt));
    else onChange([...selected, opt]);
  };

  return (
    <div className="relative flex flex-col gap-1" ref={containerRef}>
      <label className="block text-xs font-medium text-zinc-400">{label}</label>
      <div 
        onClick={() => setIsOpen(true)}
        className="min-h-[38px] p-1.5 w-full bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-white focus-within:border-indigo-500 flex flex-wrap gap-1 items-center cursor-text"
      >
        {selected.map(sel => (
          <span key={sel} className="bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-2 py-0.5 rounded text-[10px] font-medium flex items-center gap-1">
            {sel}
            <button type="button" onClick={(e) => { e.stopPropagation(); toggleOption(sel); }} className="hover:text-indigo-100">
              <XCircle className="w-3 h-3" />
            </button>
          </span>
        ))}
        <input 
          value={search} 
          onChange={e => setSearch(e.target.value)}
          onFocus={() => setIsOpen(true)}
          className="bg-transparent flex-1 outline-none min-w-[80px] text-xs px-1"
          placeholder={selected.length === 0 ? "Buscar o escribir..." : ""}
        />
      </div>
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 max-h-48 overflow-y-auto bg-zinc-900 border border-zinc-700 rounded-lg shadow-2xl z-50 custom-scrollbar py-1">
          {filteredOptions.length === 0 && <div className="px-3 py-2 text-xs text-zinc-500">Sin resultados</div>}
          {filteredOptions.map(opt => {
            const isSelected = selected.includes(opt);
            return (
              <button
                type="button"
                key={opt}
                onClick={() => { toggleOption(opt); setSearch(""); }}
                className="w-full flex items-center gap-2 px-3 py-2 text-left text-xs hover:bg-zinc-800 transition-colors"
              >
                <div className={`shrink-0 w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${isSelected ? "bg-indigo-500 border-indigo-500" : "border-zinc-600 bg-zinc-950"}`}>
                  {isSelected && <Check className="w-2.5 h-2.5 text-white" />}
                </div>
                <span className={`text-zinc-300 ${isSelected ? "font-medium text-white" : ""}`}>{opt}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function CalendarioView({ initialOrders, initialServers = [] }: { initialOrders: PatchOrder[], initialServers?: ServerInfo[] }) {
  const [orders, setOrders] = useState<PatchOrder[]>(initialOrders);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PatchOrder | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form states for creating new order
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [actionType, setActionType] = useState("CHECK");
  const [targetBanks, setTargetBanks] = useState<string[]>([]);
  const [targetGroups, setTargetGroups] = useState<string[]>([]);
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
      const dbTargetGroups = targetBanks.join(", ");
      const dbTargetServers = targetGroups.join(", ");
      
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title, description, actionType, targetGroups: dbTargetGroups, targetServers: dbTargetServers, scheduledAt, status: "PENDING"
        })
      });

      if (res.ok) {
        const newOrder = await res.json();
        setOrders([...orders, newOrder]);
        setIsCreateModalOpen(false);
        // Reset form
        setTitle(""); setDescription(""); setTargetBanks([]); setTargetGroups([]); setScheduledDate(""); setScheduledTime("");
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

  const handleDeleteOrder = async (id: string) => {
    if (!confirm("¿Estás seguro que deseas eliminar esta programación?")) return;
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/calendar?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setOrders(orders.filter(o => o.id !== id));
        setSelectedOrder(null);
      } else {
        alert("Error al eliminar la programación.");
      }
    } catch (error) {
      console.error(error);
      alert("Error al eliminar la programación.");
    } finally {
      setIsDeleting(false);
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

  const selectedOrderGroups = selectedOrder?.targetServers ? selectedOrder.targetServers.split(", ").map(g => g.trim()) : [];
  const selectedOrderBanks = selectedOrder?.targetGroups ? selectedOrder.targetGroups.split(", ").map(b => b.trim()) : [];
  
  const selectedOrderServers = useMemo(() => {
    if (!initialServers || !selectedOrder) return [];
    if (selectedOrderGroups.length === 0 && selectedOrderBanks.length === 0) return [];
    
    return initialServers.filter(s => {
      // Very basic filtering based on group name
      if (s.grupo && selectedOrderGroups.includes(s.grupo)) return true;
      // If we implemented serverTypeMap here we could filter by bank, but we don't have it easily. 
      // We'll just rely on the groups for now, or add a basic check:
      if (s.serverName && selectedOrderBanks.some(b => s.serverName.toUpperCase().includes(b))) return true;
      return false;
    });
  }, [selectedOrder, initialServers, selectedOrderGroups, selectedOrderBanks]);

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
              
              <ComboMultiSelect 
                label="Bancos Destino" 
                options={PREDEFINED_BANKS} 
                selected={targetBanks} 
                onChange={setTargetBanks} 
              />
              
              <ComboMultiSelect 
                label="Grupos Destino" 
                options={PREDEFINED_GROUPS} 
                selected={targetGroups} 
                onChange={setTargetGroups} 
              />

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
          <div className="glass rounded-xl w-full max-w-2xl max-h-[90vh] shadow-2xl flex flex-col border border-zinc-700/50">
            <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950/50 flex justify-between items-center shrink-0">
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                Detalle de Programación
              </h3>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  disabled={isDeleting}
                  className="text-rose-400 hover:text-rose-300 transition-colors p-1"
                  title="Eliminar programación"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button onClick={() => setSelectedOrder(null)} className="text-zinc-500 hover:text-white transition-colors p-1">
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
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

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-zinc-800/50">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-medium">Acción</span>
                  <p className="text-sm font-medium text-zinc-200 mt-1">{selectedOrder.actionType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-medium">Bancos Destino</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedOrderBanks.map(g => (
                      <span key={g} className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800 text-zinc-300 border border-zinc-700">{g}</span>
                    ))}
                    {selectedOrderBanks.length === 0 && <span className="text-sm text-zinc-500">—</span>}
                  </div>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] text-zinc-500 uppercase font-medium">Grupos Destino</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedOrderGroups.map(g => (
                      <span key={g} className="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{g}</span>
                    ))}
                    {selectedOrderGroups.length === 0 && <span className="text-sm text-zinc-500">—</span>}
                  </div>
                </div>
              </div>
              
              {/* Servidores list */}
              {selectedOrderServers.length > 0 && (
                <div className="pt-4 border-t border-zinc-800/50">
                  <span className="text-[10px] text-zinc-500 uppercase font-medium block mb-2">Servidores Incluidos ({selectedOrderServers.length})</span>
                  <div className="max-h-48 overflow-y-auto border border-zinc-800 rounded-lg">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-zinc-950/80 sticky top-0">
                        <tr>
                          <th className="px-3 py-2 text-zinc-400 font-medium">Servidor</th>
                          <th className="px-3 py-2 text-zinc-400 font-medium">Grupo</th>
                          <th className="px-3 py-2 text-zinc-400 font-medium">IP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {selectedOrderServers.map((s, i) => (
                          <tr key={i} className="hover:bg-zinc-900/50">
                            <td className="px-3 py-2 font-medium text-zinc-300">{s.serverName}</td>
                            <td className="px-3 py-2 text-zinc-400">{s.grupo || "—"}</td>
                            <td className="px-3 py-2 text-zinc-500">{s.ip || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {selectedOrder.executionLog && (
                <div className="pt-4 border-t border-zinc-800/50">
                  <span className="text-[10px] text-zinc-500 uppercase font-medium mb-2 block">Log de Ejecución</span>
                  <pre className="bg-zinc-950 border border-zinc-800 p-3 rounded-lg text-xs text-zinc-400 whitespace-pre-wrap font-mono">
                    {selectedOrder.executionLog}
                  </pre>
                </div>
              )}
            </div>
            
            <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/50 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedOrder(null)}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}