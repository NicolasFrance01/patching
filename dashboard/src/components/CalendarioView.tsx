"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon, Clock, Server, CheckCircle2, XCircle, AlertCircle, Trash2, Check, Search, Play, Terminal, Copy, RotateCcw, Send } from "lucide-react";
import { GROUPS, SERVER_TYPES, serverTypeMap, getBanksForGroups, getServerInfo } from "@/lib/serverTypeMap";

interface PatchOrder {
  id: string;
  title: string;
  description: string | null;
  actionType: string;
  targetBanks?: string | null;
  targetGroups: string | null;
  targetServers: string | null;
  scheduledAt: string;
  status: string;
  executionLog: string | null;
  createdBy?: string | null;
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
  
  const searchParams = useSearchParams();
  const orderIdParam = searchParams?.get("orderId");

  const [currentDate, setCurrentDate] = useState(() => {
    if (orderIdParam) {
      const o = initialOrders.find(ord => ord.id === orderIdParam);
      if (o) return new Date(o.scheduledAt);
    }
    return new Date();
  });
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<PatchOrder | null>(() => {
    if (orderIdParam) return initialOrders.find(ord => ord.id === orderIdParam) || null;
    return null;
  });
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

  // Filter groups based on selected banks
  const availableGroups = useMemo(() => {
    if (targetBanks.length === 0) return GROUPS;
    const groupsForBanks = new Set<string>();
    Object.values(serverTypeMap).forEach((s) => {
      if (targetBanks.includes(s.type) && s.grupo) {
        groupsForBanks.add(s.grupo);
      }
    });
    return Array.from(groupsForBanks).sort();
  }, [targetBanks]);

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

  // Real-time polling for selected order
  useEffect(() => {
    if (!selectedOrder) return;
    if (selectedOrder.status !== "IN_PROGRESS") return;

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/calendar/${selectedOrder.id}`);
        if (res.ok) {
          const data = await res.json();
          setSelectedOrder(prev => {
            if (prev && prev.id === data.id) {
              return { ...prev, status: data.status, executionLog: data.executionLog };
            }
            return prev;
          });
          // Also update it in the `orders` list so the calendar reflects the change
          setOrders(prevOrders => prevOrders.map(o => o.id === data.id ? data : o));
        }
      } catch (err) {
        console.error("Polling error", err);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [selectedOrder?.id, selectedOrder?.status]);

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}:00`).toISOString();
      const dbTargetBanks = targetBanks.join(", ");
      const dbTargetGroups = targetGroups.join(", ");
      
      const res = await fetch("/api/calendar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          description,
          actionType,
          targetBanks: dbTargetBanks || null,
          targetGroups: dbTargetGroups || null,
          targetServers: null,
          scheduledAt,
          status: "PENDING"
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

  // State & Handlers for Live Terminal & Status Switching
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [logInput, setLogInput] = useState("");
  const [isSendingLog, setIsSendingLog] = useState(false);
  const [isLogCopied, setIsLogCopied] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal when log updates
  useEffect(() => {
    if (selectedOrder?.executionLog) {
      terminalEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [selectedOrder?.executionLog]);

  const handleUpdateStatus = async (newStatus: string) => {
    if (!selectedOrder) return;
    setIsUpdatingStatus(true);
    try {
      const res = await fetch(`/api/calendar/${selectedOrder.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedOrder(prev => prev ? { ...prev, status: updated.status } : null);
        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, status: updated.status } : o));
      } else {
        alert("No se pudo actualizar el estado.");
      }
    } catch (e) {
      console.error(e);
      alert("Error al actualizar el estado.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSendLog = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedOrder || !logInput.trim()) return;
    setIsSendingLog(true);
    try {
      const res = await fetch("/api/orders/status", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: selectedOrder.id,
          executionLog: logInput.trim(),
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setSelectedOrder(prev => prev ? { ...prev, executionLog: updated.executionLog } : null);
        setOrders(prev => prev.map(o => o.id === selectedOrder.id ? { ...o, executionLog: updated.executionLog } : o));
        setLogInput("");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSendingLog(false);
    }
  };

  const handleCopyLog = () => {
    if (!selectedOrder?.executionLog) return;
    navigator.clipboard.writeText(selectedOrder.executionLog);
    setIsLogCopied(true);
    setTimeout(() => setIsLogCopied(false), 2000);
  };

  const handleRefreshOrder = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/calendar/${selectedOrder.id}`);
      if (res.ok) {
        const data = await res.json();
        setSelectedOrder(prev => prev ? { ...prev, ...data } : null);
        setOrders(prev => prev.map(o => o.id === data.id ? data : o));
      }
    } catch (e) {
      console.error(e);
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

  const selectedOrderGroups = useMemo(() => {
    if (!selectedOrder) return [];
    if (selectedOrder.targetGroups) {
      return selectedOrder.targetGroups.split(", ").map(g => g.trim()).filter(Boolean);
    }
    // Fallback for legacy records where groups were stored in targetServers
    if (selectedOrder.targetServers) {
      return selectedOrder.targetServers.split(", ").map(g => g.trim()).filter(Boolean);
    }
    return [];
  }, [selectedOrder]);

  const selectedOrderBanks = useMemo(() => {
    if (!selectedOrder) return [];
    if (selectedOrder.targetBanks) {
      return selectedOrder.targetBanks.split(", ").map(b => b.trim()).filter(Boolean);
    }
    // Automatically deduce banks from groups!
    if (selectedOrderGroups.length > 0) {
      const deduced = getBanksForGroups(selectedOrderGroups);
      if (deduced.length > 0) return deduced;
    }
    // Fallback for legacy records where banks were placed in targetGroups
    if (selectedOrder.targetGroups) {
      const parts = selectedOrder.targetGroups.split(", ").map(b => b.trim()).filter(Boolean);
      const matched = parts.filter(p => PREDEFINED_BANKS.some(pb => pb.toLowerCase() === p.toLowerCase()));
      if (matched.length > 0) return matched;
    }
    return [];
  }, [selectedOrder, selectedOrderGroups]);
  
  const selectedOrderServers = useMemo(() => {
    if (!initialServers || !selectedOrder) return [];
    if (selectedOrderGroups.length === 0 && selectedOrderBanks.length === 0) return [];

    const getGroup = (s: any) => {
      if (s.grupo && s.grupo.trim() !== "" && s.grupo !== "—") return s.grupo.trim();
      const info = getServerInfo(s.serverName);
      return info?.grupo?.trim() || "";
    };

    const getBank = (s: any) => {
      const info = getServerInfo(s.serverName);
      if (info?.type && info.type !== "Sin clasificar") return info.type;
      const upper = (s.serverName || "").toUpperCase();
      if (upper.includes("NBSF") || upper.includes("BSF")) return "NBSF";
      if (upper.includes("BSC") || upper.includes("SCA")) return "BSC";
      if (upper.includes("BSJ") || upper.includes("SJA")) return "BSJ";
      if (upper.includes("NBERSA") || upper.includes("BER")) return "NBERSA";
      if (upper.includes("QUALIA")) return "QUALIA";
      if (upper.includes("CORP")) return "Corporativo";
      return "";
    };

    // Si se seleccionaron grupos específicos, SOLO mostrar los servidores de esos grupos
    if (selectedOrderGroups.length > 0) {
      return initialServers.filter(s => {
        const grp = getGroup(s);
        const matchesGroup = selectedOrderGroups.some(g => g.toLowerCase() === grp.toLowerCase());
        if (!matchesGroup) return false;

        // Si también se indicaron bancos, verificar que el servidor corresponda a dicho banco
        if (selectedOrderBanks.length > 0) {
          const bank = getBank(s);
          const matchesBank = selectedOrderBanks.some(b => 
            b.toLowerCase() === bank.toLowerCase() ||
            (b.toUpperCase() === "CORPORATIVO" && bank.toUpperCase() === "CORP") ||
            s.serverName.toUpperCase().includes(b.toUpperCase())
          );
          if (!matchesBank) return false;
        }
        return true;
      });
    }

    // Si no se seleccionó ningún grupo específico, mostrar todos los servidores del banco destino
    return initialServers.filter(s => {
      const bank = getBank(s);
      return selectedOrderBanks.some(b => 
        b.toLowerCase() === bank.toLowerCase() ||
        (b.toUpperCase() === "CORPORATIVO" && bank.toUpperCase() === "CORP") ||
        s.serverName.toUpperCase().includes(b.toUpperCase())
      );
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
                  <option value="REPORT">Reporte automático (Reporte)</option>
                </select>
              </div>
              
              <ComboMultiSelect 
                label="Bancos Destino" 
                options={PREDEFINED_BANKS} 
                selected={targetBanks} 
                onChange={(banks) => {
                  setTargetBanks(banks);
                  // Optionally clear selected groups that no longer belong to selected banks
                  // but for now, we just update the banks.
                }} 
              />
              
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-zinc-400">Grupos Destino</label>
                  {targetBanks.length > 0 && availableGroups.length > 0 && (
                    <button 
                      type="button" 
                      onClick={() => setTargetGroups(availableGroups)}
                      className="text-[10px] text-indigo-400 hover:text-indigo-300 font-medium"
                    >
                      Seleccionar todos los grupos del banco
                    </button>
                  )}
                </div>
                <ComboMultiSelect 
                  label="" 
                  options={availableGroups} 
                  selected={targetGroups} 
                  onChange={setTargetGroups} 
                />
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
          <div className="glass rounded-xl w-full max-w-4xl max-h-[92vh] shadow-2xl flex flex-col border border-zinc-700/50 overflow-hidden">
            <div className="px-5 py-4 border-b border-zinc-800 bg-zinc-950/70 flex justify-between items-center shrink-0">
              <h3 className="text-sm font-semibold text-zinc-200 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4 text-indigo-400" />
                Detalle de Programación
              </h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteOrder(selectedOrder.id)}
                  disabled={isDeleting}
                  className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                  title="Eliminar programación"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-5 space-y-5 overflow-y-auto min-h-0">
              {/* Header con título y cambio interactivo de estado */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800/60">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xl font-extrabold text-white break-words">{selectedOrder.title}</h4>
                  <div className="flex items-center gap-2 text-xs text-zinc-400 mt-1">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" />
                    <span>{new Date(selectedOrder.scheduledAt).toLocaleString("es-AR")}</span>
                    {selectedOrder.createdBy && (
                      <span className="text-zinc-500">• Creado por: {selectedOrder.createdBy}</span>
                    )}
                  </div>
                </div>

                {/* Acciones y selector de estado */}
                <div className="flex items-center gap-2 shrink-0">
                  {selectedOrder.status === "PENDING" && (
                    <button
                      type="button"
                      onClick={() => handleUpdateStatus("IN_PROGRESS")}
                      disabled={isUpdatingStatus}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-blue-500/20"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Iniciar Ejecución
                    </button>
                  )}

                  {selectedOrder.status === "IN_PROGRESS" && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus("COMPLETED")}
                        disabled={isUpdatingStatus}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold transition-all shadow-lg shadow-emerald-500/20"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Completar
                      </button>
                      <button
                        type="button"
                        onClick={() => handleUpdateStatus("FAILED")}
                        disabled={isUpdatingStatus}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-rose-600/80 hover:bg-rose-600 disabled:opacity-50 text-white text-xs font-bold transition-all"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Fallar
                      </button>
                    </>
                  )}

                  {/* Selector rápido de estado */}
                  <div className="relative">
                    <select
                      value={selectedOrder.status}
                      disabled={isUpdatingStatus}
                      onChange={(e) => handleUpdateStatus(e.target.value)}
                      className="bg-zinc-800 border border-zinc-700 text-xs font-bold rounded-lg px-2.5 py-1.5 text-zinc-200 uppercase focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
                    >
                      <option value="PENDING">PENDING</option>
                      <option value="IN_PROGRESS">IN PROGRESS</option>
                      <option value="COMPLETED">COMPLETED</option>
                      <option value="FAILED">FAILED</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Grid de metadatos */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-800/80">
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Acción</span>
                  <p className="text-sm font-bold text-zinc-200 mt-0.5">{selectedOrder.actionType}</p>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Bancos Destino</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedOrderBanks.map(g => (
                      <span key={g} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">{g}</span>
                    ))}
                    {selectedOrderBanks.length === 0 && <span className="text-xs text-zinc-500">—</span>}
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase font-semibold">Grupos Destino</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {selectedOrderGroups.map(g => (
                      <span key={g} className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">{g}</span>
                    ))}
                    {selectedOrderGroups.length === 0 && <span className="text-xs text-zinc-500">—</span>}
                  </div>
                </div>
              </div>
              
              {/* Servidores list */}
              {selectedOrderServers.length > 0 && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-zinc-300">
                      Servidores Incluidos ({selectedOrderServers.length})
                    </span>
                    <span className="text-[10px] text-zinc-500">
                      {selectedOrderGroups.length > 0 ? `Filtrado por grupo: ${selectedOrderGroups.join(", ")}` : "Todos los servidores del banco"}
                    </span>
                  </div>
                  <div className="max-h-36 overflow-y-auto border border-zinc-800 rounded-lg">
                    <table className="w-full text-xs text-left">
                      <thead className="bg-zinc-950/90 sticky top-0 border-b border-zinc-800">
                        <tr>
                          <th className="px-3 py-1.5 text-zinc-400 font-medium">Servidor</th>
                          <th className="px-3 py-1.5 text-zinc-400 font-medium">Grupo</th>
                          <th className="px-3 py-1.5 text-zinc-400 font-medium">IP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800/50">
                        {selectedOrderServers.map((s, i) => (
                          <tr key={i} className="hover:bg-zinc-900/50">
                            <td className="px-3 py-1.5 font-medium text-zinc-300">{s.serverName}</td>
                            <td className="px-3 py-1.5 text-zinc-400">{s.grupo || getServerInfo(s.serverName)?.grupo || "—"}</td>
                            <td className="px-3 py-1.5 text-zinc-500">{s.ip || getServerInfo(s.serverName)?.ip || "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* MINI TERMINAL EN VIVO */}
              <div className="rounded-xl border border-zinc-800/90 bg-[#090d16] shadow-xl overflow-hidden">
                {/* Terminal Header estilo MacOS */}
                <div className="px-4 py-2.5 bg-zinc-950 border-b border-zinc-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block opacity-80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block opacity-80" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block opacity-80" />
                    </div>
                    <span className="text-zinc-600 text-xs">|</span>
                    <span className="text-xs font-mono font-medium text-zinc-300 flex items-center gap-1.5">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      wuu@patching-live:~$
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Live streaming badge */}
                    {selectedOrder.status === "IN_PROGRESS" && (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] font-bold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                        LIVE STREAM
                      </span>
                    )}
                    {selectedOrder.status === "PENDING" && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                        ESPERANDO INICIO
                      </span>
                    )}
                    {selectedOrder.status === "COMPLETED" && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                        EJECUCIÓN FINALIZADA
                      </span>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={handleRefreshOrder}
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
                        title="Recargar stream"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={handleCopyLog}
                        className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors flex items-center gap-1 text-[10px]"
                        title="Copiar log"
                      >
                        {isLogCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Terminal Console Output */}
                <div className="p-4 font-mono text-xs overflow-y-auto max-h-56 min-h-[140px] space-y-1 select-text">
                  {!selectedOrder.executionLog ? (
                    <div className="space-y-1 text-zinc-500 text-[11px]">
                      <p className="text-indigo-400 font-semibold">
                        [INIT] Centro de Control de Parcheo - Sesión de Monitoreo
                      </p>
                      <p className="text-zinc-400">
                        &gt; Tarea: {selectedOrder.title} ({selectedOrder.actionType})
                      </p>
                      <p className="text-zinc-400">
                        &gt; Destino: {selectedOrderBanks.join(", ") || "General"} | Grupos: {selectedOrderGroups.join(", ") || "Todos"}
                      </p>
                      <p className="text-zinc-400">
                        &gt; Servidores objetivo: {selectedOrderServers.length}
                      </p>
                      {selectedOrder.status === "IN_PROGRESS" ? (
                        <p className="text-emerald-400 animate-pulse mt-2">
                          &gt; Conectando con el agente PowerShell de WUU... Esperando salida en vivo...
                        </p>
                      ) : (
                        <p className="text-zinc-500 mt-2">
                          &gt; Haz click en &quot;Iniciar Ejecución&quot; para cambiar el estado a IN_PROGRESS y monitorear la tarea.
                        </p>
                      )}
                    </div>
                  ) : (
                    selectedOrder.executionLog.split("\n").map((line, idx) => {
                      let colorClass = "text-zinc-300";
                      if (line.includes("ERROR") || line.includes("FAILED") || line.toLowerCase().includes("fallo")) {
                        colorClass = "text-rose-400 font-semibold";
                      } else if (line.includes("WARN") || line.includes("Timeout")) {
                        colorClass = "text-amber-400";
                      } else if (line.includes("INFO") || line.includes("Iniciando") || line.includes("OK") || line.includes("exitosa")) {
                        colorClass = "text-emerald-300";
                      } else if (line.startsWith("[LIVE]")) {
                        colorClass = "text-blue-300";
                      }

                      return (
                        <div key={idx} className={`leading-relaxed break-all ${colorClass}`}>
                          {line}
                        </div>
                      );
                    })
                  )}

                  {/* Prompt parpadeante */}
                  <div className="flex items-center gap-1 text-emerald-400 pt-1">
                    <span>wuu@worker:~$</span>
                    <span className="w-2 h-4 bg-emerald-400 inline-block animate-pulse" />
                  </div>
                  <div ref={terminalEndRef} />
                </div>

                {/* Input para agregar notas o logs en vivo */}
                <form
                  onSubmit={handleSendLog}
                  className="px-3 py-2 bg-zinc-950/90 border-t border-zinc-800/80 flex items-center gap-2"
                >
                  <span className="text-[10px] font-mono text-zinc-500 shrink-0">&gt;</span>
                  <input
                    type="text"
                    value={logInput}
                    onChange={(e) => setLogInput(e.target.value)}
                    placeholder="Escribir registro o nota manual en el log en vivo..."
                    className="flex-1 bg-transparent text-xs font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={isSendingLog || !logInput.trim()}
                    className="p-1 px-2.5 rounded bg-indigo-600/80 hover:bg-indigo-600 disabled:opacity-40 text-white text-[11px] font-medium flex items-center gap-1 transition-all"
                  >
                    <Send className="w-3 h-3" />
                    Enviar
                  </button>
                </form>
              </div>
            </div>
            
            <div className="px-5 py-3 border-t border-zinc-800 bg-zinc-950/70 flex justify-end shrink-0">
              <button
                type="button"
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