"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  X, ChevronRight, ChevronLeft, Ticket, Loader2, CheckCircle2,
  ExternalLink, Search, User, AlertCircle, Building2, ArrowRight,
  Zap, Copy, Check, Trash2, UserPlus,
} from "lucide-react";
import { getServerInfo } from "@/lib/serverTypeMap";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface JiraUser {
  accountId: string;
  displayName: string;
  emailAddress: string;
  avatarUrls?: { "48x48": string };
}

interface ErrorGroup {
  message: string;
  servers: string[];
  count: number;
}

interface JiraTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  errorGroup: ErrorGroup | null;
}

// ─── Reporter list persistence ────────────────────────────────────────────────

const STORAGE_KEY = "jira_reporters_list";

const DEFAULT_REPORTERS: JiraUser[] = [
  { accountId: "fscola",     displayName: "Franco Scola",     emailAddress: "fscola@algeiba.com" },
  { accountId: "mscialpini", displayName: "Matias Scialpini", emailAddress: "mscialpini@algeiba.com" },
  { accountId: "nfrance",    displayName: "Nicolas France",   emailAddress: "nfrance@algeiba.com" },
  { accountId: "mramirez",   displayName: "Marco Ramirez",    emailAddress: "mramirez@algeiba.com" },
];

function loadReporters(): JiraUser[] {
  if (typeof window === "undefined") return DEFAULT_REPORTERS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch { /* ignore */ }
  return DEFAULT_REPORTERS;
}

function persistReporters(list: JiraUser[]) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)); } catch { /* ignore */ }
}

// ─── Bank → Jira config ───────────────────────────────────────────────────────

const BANK_TO_JIRA: Record<string, { projectKey: string; orgLabel: string; spaceLabel: string }> = {
  BSC:              { projectKey: "GP",  orgLabel: "Banco Santa Cruz",      spaceLabel: "Grupo Petersen (GP)" },
  Corp:             { projectKey: "GP",  orgLabel: "Corporativo",            spaceLabel: "Grupo Petersen (GP)" },
  BSJ:              { projectKey: "GP",  orgLabel: "Banco San Juan",         spaceLabel: "Grupo Petersen (GP)" },
  NBSF:             { projectKey: "GP",  orgLabel: "Banco Santa Fe",         spaceLabel: "Grupo Petersen (GP)" },
  NBERSA:           { projectKey: "GP",  orgLabel: "Nuevo Banco Entre Ríos", spaceLabel: "Grupo Petersen (GP)" },
  QUALIA:           { projectKey: "GP",  orgLabel: "Qualia Seguros",         spaceLabel: "Grupo Petersen (GP)" },
  ASJ:              { projectKey: "ASJ", orgLabel: "Banco San Juan (ASJ)",   spaceLabel: "ASJ Servicios (ASJ)" },
  "Sin clasificar": { projectKey: "GP",  orgLabel: "Corporativo",            spaceLabel: "Grupo Petersen (GP)" },
};

const TYPE_COLORS: Record<string, string> = {
  ASJ: "#6366f1", BSC: "#06b6d4", BSJ: "#10b981",
  Corp: "#f59e0b", NBERSA: "#ef4444", NBSF: "#8b5cf6", QUALIA: "#ec4899",
  "Sin clasificar": "#71717a",
};

function getBankGroups(servers: string[]): Record<string, string[]> {
  const g: Record<string, string[]> = {};
  for (const s of servers) {
    const info = getServerInfo(s);
    const bank = info?.type ?? "Sin clasificar";
    if (!g[bank]) g[bank] = [];
    g[bank].push(s);
  }
  return g;
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center justify-center">
      {["Banco", "Informador", "Confirmar"].map((label, i) => {
        const idx = i + 1;
        const isDone = step > idx;
        const isActive = step === idx;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                isDone ? "bg-emerald-500 text-white" :
                isActive ? "bg-indigo-600 text-white ring-2 ring-indigo-400/40 shadow-lg" :
                "bg-zinc-800 text-zinc-500 border border-zinc-700"
              }`}>
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx}
              </div>
              <span className={`text-[10px] mt-1 font-medium ${isActive ? "text-indigo-300" : isDone ? "text-emerald-400" : "text-zinc-600"}`}>
                {label}
              </span>
            </div>
            {i < 2 && <div className={`w-14 h-0.5 mb-4 mx-1 transition-all duration-300 ${step > idx ? "bg-emerald-500" : "bg-zinc-800"}`} />}
          </div>
        );
      })}
    </div>
  );
}

// ─── Success Screen ───────────────────────────────────────────────────────────

function SuccessScreen({ ticketKey, ticketUrl, transitioned, onClose }: {
  ticketKey: string; ticketUrl: string; transitioned: boolean; onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="flex flex-col items-center justify-center p-10 gap-6 text-center">
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 flex items-center justify-center">
          <CheckCircle2 className="w-10 h-10 text-emerald-400" />
        </div>
        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-indigo-600 border-2 border-zinc-900 flex items-center justify-center">
          <Zap className="w-3 h-3 text-white" />
        </div>
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2">¡Ticket creado exitosamente!</h3>
        <p className="text-sm text-zinc-400">El ticket fue generado en Jira y asignado a Gonzalo Ramirez.</p>
      </div>
      <div className="w-full max-w-sm glass rounded-xl border border-emerald-500/30 overflow-hidden">
        <div className="px-4 py-2 bg-emerald-500/5 border-b border-emerald-500/20">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold">Ticket creado</p>
        </div>
        <div className="px-5 py-4 flex items-center justify-between">
          <span className="text-3xl font-extrabold text-emerald-400 tracking-wide">{ticketKey}</span>
          <button onClick={() => { navigator.clipboard.writeText(ticketUrl); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
            className="p-2 rounded-lg hover:bg-white/10 text-zinc-400 hover:text-zinc-200 transition-colors">
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${
        transitioned ? "bg-blue-500/10 border-blue-500/30 text-blue-300" : "bg-zinc-800 border-zinc-700 text-zinc-400"
      }`}>
        <ArrowRight className="w-3.5 h-3.5" />
        {transitioned ? "Estado → Work in Progress ✓" : "Estado: no se pudo cambiar automáticamente"}
      </div>
      <div className="flex flex-col gap-3 w-full max-w-sm">
        <a href={ticketUrl} target="_blank" rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg hover:shadow-indigo-500/25">
          <ExternalLink className="w-4 h-4" />
          Abrir ticket en Jira
        </a>
        <button onClick={onClose}
          className="px-6 py-2.5 rounded-xl border border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:border-zinc-600 text-sm font-medium transition-colors">
          Cerrar
        </button>
      </div>
    </div>
  );
}

// ─── Reporter Avatar ──────────────────────────────────────────────────────────

function ReporterAvatar({ user, size = "md" }: { user: JiraUser; size?: "sm" | "md" }) {
  const cls = size === "sm" ? "w-7 h-7 text-[10px]" : "w-9 h-9 text-xs";
  const initials = user.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2);
  if (user.avatarUrls?.["48x48"]) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={user.avatarUrls["48x48"]} alt={user.displayName} className={`${cls} rounded-full shrink-0 object-cover`} />;
  }
  return (
    <div className={`${cls} rounded-full bg-indigo-700 flex items-center justify-center font-bold text-white shrink-0`}>
      {initials}
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function JiraTicketModal({ isOpen, onClose, errorGroup }: JiraTicketModalProps) {
  const [step, setStep] = useState(1);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedReporter, setSelectedReporter] = useState<JiraUser | null>(null);

  // Reporter list management
  const [reporters, setReporters] = useState<JiraUser[]>(DEFAULT_REPORTERS);
  const [showAddSearch, setShowAddSearch] = useState(false);

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<JiraUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Creation state
  const [isCreating, setIsCreating] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<{ key: string; url: string; transitioned: boolean } | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [fieldMapping, setFieldMapping] = useState<Record<string, string>>({});
  const [isFetchingFields, setIsFetchingFields] = useState(false);

  // Load reporters from localStorage on mount
  useEffect(() => {
    setReporters(loadReporters());
  }, []);

  // Reset on close
  useEffect(() => {
    if (!isOpen) {
      const t = setTimeout(() => {
        setStep(1); setSelectedBank(null); setSelectedReporter(null);
        setSearchQuery(""); setSearchResults([]); setShowAddSearch(false);
        setIsCreating(false); setCreatedTicket(null); setCreateError(null);
        setFieldMapping({});
      }, 300);
      return () => clearTimeout(t);
    }
  }, [isOpen]);

  // Reporter management
  const addReporter = useCallback((user: JiraUser) => {
    setReporters((prev) => {
      if (prev.some((r) => r.accountId === user.accountId)) return prev;
      const next = [...prev, user];
      persistReporters(next);
      return next;
    });
    setShowAddSearch(false);
    setSearchQuery("");
    setSearchResults([]);
  }, []);

  const removeReporter = useCallback((accountId: string) => {
    setReporters((prev) => {
      const next = prev.filter((r) => r.accountId !== accountId);
      persistReporters(next);
      return next;
    });
    if (selectedReporter?.accountId === accountId) setSelectedReporter(null);
  }, [selectedReporter]);

  // Field discovery
  const fetchFieldMapping = useCallback(async (projectKey: string) => {
    setIsFetchingFields(true);
    try {
      const res = await fetch(`/api/jira?action=get-fields&project=${projectKey}`);
      const data = await res.json();
      if (data.mapping) setFieldMapping(data.mapping);
    } catch { setFieldMapping({}); }
    finally { setIsFetchingFields(false); }
  }, []);

  // User search
  const handleSearch = (val: string) => {
    setSearchQuery(val);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    if (!val.trim()) { setSearchResults([]); return; }
    searchDebounce.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/jira?action=search-users&query=${encodeURIComponent(val)}`);
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch { setSearchResults([]); }
      finally { setIsSearching(false); }
    }, 400);
  };

  if (!isOpen || !errorGroup) return null;

  const bankGroups = getBankGroups(errorGroup.servers);
  const availableBanks = Object.keys(bankGroups).sort();
  const serversForBank = selectedBank ? (bankGroups[selectedBank] ?? []) : [];
  const jiraConfig = selectedBank ? BANK_TO_JIRA[selectedBank] ?? BANK_TO_JIRA["Corp"] : null;

  const handleSelectBank = (bank: string) => {
    setSelectedBank(bank);
    fetchFieldMapping((BANK_TO_JIRA[bank] ?? BANK_TO_JIRA["Corp"]).projectKey);
  };

  // ─── Create ticket ──────────────────────────────────────────────────────────
  const handleCreateTicket = async () => {
    if (!selectedBank || !selectedReporter || !jiraConfig) return;
    setIsCreating(true);
    setCreateError(null);

    // Resolve real accountId for users with placeholder IDs
    let reporterAccountId = selectedReporter.accountId;
    const isPredefinedPlaceholder = DEFAULT_REPORTERS.some(
      (p) => p.accountId === selectedReporter.accountId && !selectedReporter.accountId.includes(":")
    );
    if (isPredefinedPlaceholder) {
      try {
        const res = await fetch(`/api/jira?action=search-users&query=${encodeURIComponent(selectedReporter.emailAddress)}`);
        const users: JiraUser[] = await res.json();
        const found = users.find((u) => u.emailAddress?.toLowerCase() === selectedReporter.emailAddress.toLowerCase());
        if (found) reporterAccountId = found.accountId;
      } catch { /* ignore */ }
    }

    try {
      const res = await fetch("/api/jira", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          projectKey: jiraConfig.projectKey,
          errorMessage: errorGroup.message,
          serversList: serversForBank,
          bankLabel: jiraConfig.orgLabel,
          bankCode: selectedBank,
          reporterAccountId,
          fieldMapping,
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        const errors: string[] = [];
        if (data?.error?.errorMessages?.length) errors.push(...data.error.errorMessages);
        if (data?.error?.errors) {
          Object.entries(data.error.errors as Record<string, string>).forEach(([k, v]) => errors.push(`${k}: ${v}`));
        }
        setCreateError(errors.length ? errors.join("\n") : JSON.stringify(data?.error ?? data));
      } else {
        setCreatedTicket({ key: data.issueKey, url: data.issueUrl, transitioned: !!data.transitioned });
      }
    } catch (e: any) {
      setCreateError(e.message ?? "Error desconocido");
    } finally {
      setIsCreating(false);
    }
  };

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center sm:p-2 bg-black/80 backdrop-blur-sm">
      <div
        className="glass w-full h-full sm:rounded-2xl sm:h-[98vh] sm:max-w-6xl flex flex-col border border-zinc-700/80 shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20">
              <Ticket className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100">Crear Ticket en Jira</h2>
              <p className="text-[11px] text-zinc-400 mt-0.5 max-w-lg truncate">{errorGroup.message}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        {!createdTicket && (
          <div className="px-6 py-4 border-b border-zinc-800/50 bg-black/10 shrink-0">
            <StepIndicator step={step} />
          </div>
        )}

        {/* Body */}
        <div className="flex-1 overflow-y-auto">

          {/* SUCCESS */}
          {createdTicket && (
            <SuccessScreen
              ticketKey={createdTicket.key}
              ticketUrl={createdTicket.url}
              transitioned={createdTicket.transitioned}
              onClose={onClose}
            />
          )}

          {/* STEP 1: BANK */}
          {!createdTicket && step === 1 && (
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 mb-1">Seleccioná el banco</h3>
                <p className="text-xs text-zinc-400">
                  El error afecta <strong className="text-white">{errorGroup.count}</strong> servidores. Elegí el banco para el ticket.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {availableBanks.map((bank) => {
                  const color = TYPE_COLORS[bank] ?? "#6b7280";
                  const cfg = BANK_TO_JIRA[bank];
                  const count = bankGroups[bank].length;
                  const isSelected = selectedBank === bank;
                  return (
                    <button key={bank} onClick={() => handleSelectBank(bank)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected ? "border-indigo-500/60 bg-indigo-500/10 shadow-md" : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900/70"
                      }`}>
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: color, boxShadow: isSelected ? `0 0 8px ${color}80` : "none" }} />
                        <div>
                          <p className="text-sm font-bold" style={{ color: isSelected ? "#fff" : color }}>{bank}</p>
                          {cfg && <p className="text-[10px] text-zinc-500 mt-0.5">{cfg.spaceLabel} · {cfg.orgLabel}</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full border" style={{ color, borderColor: color+"44", backgroundColor: color+"15" }}>
                          {count} srv
                        </span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400" />}
                      </div>
                    </button>
                  );
                })}
              </div>
              {selectedBank && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 space-y-2">
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Servidores en el ticket ({serversForBank.length})
                  </p>
                  <div className="flex flex-wrap gap-2 max-h-72 overflow-y-auto pr-2">
                    {serversForBank.map((s) => (
                      <span key={s} className="px-2 py-1 rounded-md text-[11px] bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium">{s}</span>
                    ))}
                  </div>
                  {isFetchingFields && (
                    <div className="flex items-center gap-1.5 text-xs text-indigo-400 mt-2">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Cargando configuración de Jira...
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* STEP 2: INFORMADOR */}
          {!createdTicket && step === 2 && (
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-zinc-100 mb-1">Seleccioná el Informador</h3>
                  <p className="text-xs text-zinc-400">Podés agregar o eliminar usuarios de la lista.</p>
                </div>
                <button
                  onClick={() => { setShowAddSearch(!showAddSearch); setSearchQuery(""); setSearchResults([]); }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 border border-indigo-500/40 text-indigo-300 text-xs font-bold transition-all"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  Agregar
                </button>
              </div>

              {/* Add user search panel */}
              {showAddSearch && (
                <div className="rounded-xl border border-indigo-500/30 bg-indigo-500/5 p-3 space-y-2">
                  <p className="text-[11px] text-indigo-300 font-semibold flex items-center gap-1.5">
                    <Search className="w-3.5 h-3.5" /> Buscar usuario en Jira para agregar a la lista
                  </p>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Nombre o email..."
                      value={searchQuery}
                      onChange={(e) => handleSearch(e.target.value)}
                      className="w-full pl-3 pr-8 py-2.5 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                      autoFocus
                    />
                    {isSearching && <Loader2 className="absolute right-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 animate-spin" />}
                  </div>
                  {searchResults.length > 0 && (
                    <div className="rounded-lg border border-zinc-800 overflow-hidden divide-y divide-zinc-800/60 max-h-44 overflow-y-auto">
                      {searchResults.map((user) => {
                        const alreadyInList = reporters.some((r) => r.accountId === user.accountId);
                        return (
                          <div key={user.accountId} className="flex items-center gap-3 px-3 py-2.5 bg-zinc-900/80 hover:bg-zinc-800/60 transition-colors">
                            <ReporterAvatar user={user} size="sm" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-zinc-100 truncate">{user.displayName}</p>
                              <p className="text-[11px] text-zinc-400 truncate">{user.emailAddress}</p>
                            </div>
                            {alreadyInList ? (
                              <span className="text-[10px] text-zinc-500 px-2">En lista</span>
                            ) : (
                              <button
                                onClick={() => addReporter(user)}
                                className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600/30 hover:bg-indigo-600/60 border border-indigo-500/40 text-indigo-300 text-[11px] font-bold transition-all"
                              >
                                <UserPlus className="w-3 h-3" /> Agregar
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                  {searchQuery && !isSearching && searchResults.length === 0 && (
                    <p className="text-xs text-zinc-500 text-center py-2">No se encontraron usuarios.</p>
                  )}
                </div>
              )}

              {/* Reporter list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {reporters.map((user) => {
                  const isSelected = selectedReporter?.accountId === user.accountId;
                  return (
                    <div key={user.accountId}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                        isSelected ? "border-indigo-500/60 bg-indigo-500/10" : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600"
                      }`}>
                      {/* Select area */}
                      <button className="flex items-center gap-3 flex-1 text-left" onClick={() => setSelectedReporter(user)}>
                        <ReporterAvatar user={user} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-zinc-100 truncate">{user.displayName}</p>
                          <p className="text-[11px] text-zinc-400 truncate">{user.emailAddress}</p>
                        </div>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                      </button>
                      {/* Remove button */}
                      <button
                        onClick={() => removeReporter(user.accountId)}
                        title="Eliminar de la lista"
                        className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-colors shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  );
                })}
              </div>
              {reporters.length === 0 && (
                <p className="text-sm text-zinc-500 text-center py-6">
                  No hay informadores en la lista. Agregá uno con el botón de arriba.
                </p>
              )}
            </div>
          )}

          {/* STEP 3: CONFIRM */}
          {!createdTicket && step === 3 && (
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 mb-1">Revisá el ticket antes de crearlo</h3>
                <p className="text-xs text-zinc-400">
                  El estado se cambiará a <strong className="text-blue-300">Work in Progress</strong> automáticamente al crear.
                </p>
              </div>

              <div className="rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800/60">
                {/* 2-column rows for short fields */}
                <div className="grid grid-cols-2 divide-x divide-zinc-800/60">
                  <FieldRow icon={<Building2 className="w-3.5 h-3.5" />} label="Espacio" value={jiraConfig?.spaceLabel ?? "—"} />
                  <FieldRow label="Tipo de actividad" value="Actividad" />
                </div>
                <div className="grid grid-cols-2 divide-x divide-zinc-800/60">
                  <FieldRow label="Start Date" value={new Date().toLocaleDateString("es-AR")} />
                  <FieldRow label="Area" value="SEC" />
                </div>
                <div className="grid grid-cols-2 divide-x divide-zinc-800/60">
                  <FieldRow label="Account" value="GP | SEC | Abono" />
                  <FieldRow label="Organización GP" value={jiraConfig?.orgLabel ?? "—"} />
                </div>
                <div className="grid grid-cols-2 divide-x divide-zinc-800/60">
                  <FieldRow label="Components" value="Sistemas Operativos" />
                  <FieldRow label="Provider" value="Microsoft" />
                </div>
                <div className="grid grid-cols-2 divide-x divide-zinc-800/60">
                  <FieldRow label="Persona asignada" value="Gonzalo Ramirez" />
                  <FieldRow label="Informador" value={selectedReporter?.displayName ?? "—"} />
                </div>
                {/* Full-width rows for long content */}
                <FieldRow label="Resumen" value={errorGroup.message + "\n\nServidores (" + selectedBank + "):\n" + serversForBank.join(", ")} multiline />
                <FieldRow label="Descripción" value={errorGroup.message + "\n\nServidores (" + selectedBank + "):\n" + serversForBank.join("\n")} multiline />
                <FieldRow label="Estado inicial" value="→ Work in Progress (automático)" accent />
              </div>

              {Object.keys(fieldMapping).length > 0 && (
                <p className="text-[10px] text-zinc-600">✓ {Object.keys(fieldMapping).length} campos custom detectados en Jira</p>
              )}

              {createError && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-0.5">Error al crear el ticket</p>
                    <pre className="text-rose-400/80 font-mono text-[10px] break-all whitespace-pre-wrap">{createError}</pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {!createdTicket && (
          <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-900/80 flex items-center justify-between shrink-0">
            <button
              onClick={() => { if (step === 1) onClose(); else setStep((s) => s - 1); }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-colors hover:bg-white/5"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? "Cancelar" : "Atrás"}
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={(step === 1 && !selectedBank) || (step === 2 && !selectedReporter)}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Siguiente <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCreateTicket}
                disabled={isCreating || isFetchingFields}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? <><Loader2 className="w-4 h-4 animate-spin" /> Creando ticket...</> : <><Ticket className="w-4 h-4" /> Crear Ticket</>}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Field Row ────────────────────────────────────────────────────────────────

function FieldRow({ icon, label, value, multiline, accent }: {
  icon?: React.ReactNode; label: string; value: string; multiline?: boolean; accent?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-2.5 bg-zinc-900/30">
      <div className="w-32 shrink-0 flex items-center gap-1.5 pt-0.5">
        {icon && <span className="text-zinc-500">{icon}</span>}
        <span className="text-[11px] text-zinc-500 font-medium leading-tight">{label}</span>
      </div>
      <div className="flex-1">
        {multiline
          ? <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed max-h-56 overflow-y-auto pr-2">{value}</pre>
          : <span className={`text-xs font-medium ${accent ? "text-blue-300" : "text-zinc-200"}`}>{value}</span>
        }
      </div>
    </div>
  );
}
