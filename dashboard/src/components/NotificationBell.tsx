"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  Bell,
  Check,
  CheckCheck,
  Clock,
  History,
  Calendar,
  Play,
  CheckCircle2,
  X,
  Trash2,
  ExternalLink,
  Loader2,
} from "lucide-react";

export interface AppNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  metadata?: {
    taskName?: string;
    cliente?: string;
    periodo?: string;
    fechaHora?: string;
    grupo?: string;
    servidores?: number | string;
    equipo?: string;
    orderId?: string;
    total?: number;
    success?: number;
    errors?: number;
    noData?: number;
  };
  isRead: boolean;
  createdAt: string;
}

export default function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=25");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      }
    } catch (e) {
      // Silently fail on network glitches
    }
  }, []);

  // Polling cada 20 segundos
  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 20000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Cerrar al hacer click fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const handleMarkAllRead = async () => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-all-read" }),
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkOneRead = async (id: string) => {
    try {
      await fetch("/api/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "mark-read", id }),
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await fetch("/api/notifications", { method: "DELETE" });
      setNotifications([]);
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "SYNC_NEW":
        return <History className="w-4 h-4 text-emerald-400" />;
      case "CALENDAR_SCHEDULED":
        return <Calendar className="w-4 h-4 text-amber-400" />;
      case "EXECUTION_STARTED":
        return <Play className="w-4 h-4 text-blue-400 fill-blue-400/20" />;
      case "EXECUTION_COMPLETED":
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Clock className="w-4 h-4 text-indigo-400" />;
    }
  };

  const getBadgeColor = (type: string) => {
    switch (type) {
      case "SYNC_NEW":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
      case "CALENDAR_SCHEDULED":
        return "bg-amber-500/10 text-amber-300 border-amber-500/20";
      case "EXECUTION_STARTED":
        return "bg-blue-500/10 text-blue-300 border-blue-500/20";
      case "EXECUTION_COMPLETED":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/20";
      default:
        return "bg-zinc-800 text-zinc-300 border-zinc-700";
    }
  };

  const formatRelativeTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const diffMs = Date.now() - date.getTime();
      const diffMin = Math.floor(diffMs / 60000);
      if (diffMin < 1) return "Recién";
      if (diffMin < 60) return `Hace ${diffMin}m`;
      const diffHrs = Math.floor(diffMin / 60);
      if (diffHrs < 24) return `Hace ${diffHrs}h`;
      return date.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit" });
    } catch {
      return "";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Botón de la campanita */}
      <button
        type="button"
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) fetchNotifications();
        }}
        className="relative p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/80 transition-colors focus:outline-none"
        title="Notificaciones"
        aria-label="Notificaciones"
      >
        <Bell className="w-4 h-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-indigo-500 text-[9px] font-bold text-white ring-2 ring-zinc-950 animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Menú desplegable flotante */}
      {isOpen && (
        <div className="fixed left-[232px] top-4 w-96 max-h-[85vh] bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl flex flex-col z-50 overflow-hidden backdrop-blur-md">
          {/* Header */}
          <div className="p-3.5 border-b border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
                <Bell className="w-3.5 h-3.5 text-indigo-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">Notificaciones</h4>
                <p className="text-[10px] text-zinc-400">
                  {unreadCount > 0 ? `${unreadCount} sin leer` : "Todo al día"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllRead}
                  className="px-2 py-1 text-[10px] font-medium rounded hover:bg-zinc-800 text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                  title="Marcar todas como leídas"
                >
                  <CheckCheck className="w-3 h-3" />
                  Leídas
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  onClick={handleDeleteAll}
                  className="p-1 rounded hover:bg-zinc-800 text-zinc-500 hover:text-rose-400 transition-colors"
                  title="Limpiar todas"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors ml-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Lista de Notificaciones */}
          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60 max-h-[460px]">
            {notifications.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center text-zinc-500">
                <Bell className="w-8 h-8 stroke-[1.5] mb-2 text-zinc-600" />
                <p className="text-xs font-medium text-zinc-400">No hay notificaciones</p>
                <p className="text-[11px] text-zinc-600 mt-1">
                  Aquí verás las sincronizaciones, ejecuciones y tareas programadas.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const meta = item.metadata || {};
                return (
                  <div
                    key={item.id}
                    onClick={() => !item.isRead && handleMarkOneRead(item.id)}
                    className={`p-3 transition-colors cursor-pointer text-left flex gap-3 ${
                      !item.isRead
                        ? "bg-indigo-950/20 hover:bg-indigo-950/30"
                        : "hover:bg-zinc-800/40"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700/60 flex items-center justify-center">
                        {getNotificationIcon(item.type)}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <span
                          className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase tracking-wider ${getBadgeColor(
                            item.type
                          )}`}
                        >
                          {item.type.replace("_", " ")}
                        </span>
                        <div className="flex items-center gap-1.5 text-[10px] text-zinc-500">
                          <span>{formatRelativeTime(item.createdAt)}</span>
                          {!item.isRead && (
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                          )}
                        </div>
                      </div>

                      <p className="text-xs font-semibold text-zinc-200 leading-snug line-clamp-1">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed line-clamp-2">
                        {item.message}
                      </p>

                      {/* Detalles específicos estructurados */}
                      {(meta.taskName || meta.cliente || meta.grupo || meta.servidores) && (
                        <div className="mt-2 p-2 rounded bg-zinc-950/70 border border-zinc-800/80 text-[10px] space-y-0.5">
                          {meta.taskName && (
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Tarea:</span>
                              <span className="font-medium text-zinc-300 truncate max-w-[180px]">
                                {meta.taskName}
                              </span>
                            </div>
                          )}
                          {meta.cliente && (
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Cliente:</span>
                              <span className="font-medium text-indigo-300">{meta.cliente}</span>
                            </div>
                          )}
                          {meta.periodo && (
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Periodo:</span>
                              <span className="font-medium text-zinc-300">{meta.periodo}</span>
                            </div>
                          )}
                          {meta.fechaHora && (
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Fecha/Hora:</span>
                              <span className="font-medium text-zinc-300">{meta.fechaHora}</span>
                            </div>
                          )}
                          {meta.grupo && (
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Grupo:</span>
                              <span className="font-medium text-zinc-300">{meta.grupo}</span>
                            </div>
                          )}
                          {meta.servidores !== undefined && meta.servidores !== null && (
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Servidores:</span>
                              <span className="font-bold text-emerald-400">{meta.servidores}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
