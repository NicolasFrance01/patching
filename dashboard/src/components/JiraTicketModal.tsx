"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  X, ChevronRight, ChevronLeft, Ticket, Loader2, CheckCircle2,
  ExternalLink, Search, User, AlertCircle, Building2,
} from "lucide-react";
import { getServerInfo } from "@/lib/serverTypeMap";

// ─── Types ────────────────────────────────────────────────────────────────────

interface JiraUser {
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

// ─── Constants ────────────────────────────────────────────────────────────────

const PREDEFINED_REPORTERS: JiraUser[] = [
  { accountId: "fscola", displayName: "Franco Scola", emailAddress: "fscola@algeiba.com" },
  { accountId: "mscialpini", displayName: "Matias Scialpini", emailAddress: "mscialpini@algeiba.com" },
  { accountId: "nfrance", displayName: "Nicolas France", emailAddress: "nfrance@algeiba.com" },
  { accountId: "mramirez", displayName: "Marco Ramirez", emailAddress: "mramirez@algeiba.com" },
];

// Map from bank code to Jira project key and organization label
const BANK_TO_JIRA: Record<string, { projectKey: string; orgLabel: string; spaceLabel: string }> = {
  BSC:      { projectKey: "GP",  orgLabel: "Banco Santa Cruz",       spaceLabel: "Grupo Petersen (GP)" },
  Corp:     { projectKey: "GP",  orgLabel: "Corporativo",             spaceLabel: "Grupo Petersen (GP)" },
  BSJ:      { projectKey: "GP",  orgLabel: "Banco San Juan",          spaceLabel: "Grupo Petersen (GP)" },
  NBSF:     { projectKey: "GP",  orgLabel: "Banco Santa Fe",          spaceLabel: "Grupo Petersen (GP)" },
  NBERSA:   { projectKey: "GP",  orgLabel: "Nuevo Banco Entre Ríos",  spaceLabel: "Grupo Petersen (GP)" },
  QUALIA:   { projectKey: "GP",  orgLabel: "Qualia Seguros",          spaceLabel: "Grupo Petersen (GP)" },
  ASJ:      { projectKey: "ASJ", orgLabel: "Banco San Juan (ASJ)",    spaceLabel: "ASJ Servicios (ASJ)" },
  "Sin clasificar": { projectKey: "GP", orgLabel: "Corporativo",      spaceLabel: "Grupo Petersen (GP)" },
};

const TYPE_COLORS: Record<string, string> = {
  ASJ: "#6366f1", BSC: "#06b6d4", BSJ: "#10b981",
  Corp: "#f59e0b", NBERSA: "#ef4444", NBSF: "#8b5cf6", QUALIA: "#ec4899",
  "Sin clasificar": "#71717a",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getBankGroupsFromServers(servers: string[]): Record<string, string[]> {
  const groups: Record<string, string[]> = {};
  for (const srv of servers) {
    const info = getServerInfo(srv);
    const bank = info?.type ?? "Sin clasificar";
    if (!groups[bank]) groups[bank] = [];
    groups[bank].push(srv);
  }
  return groups;
}

// ─── Step Indicator ───────────────────────────────────────────────────────────

function StepIndicator({ step }: { step: number }) {
  const steps = ["Banco", "Informador", "Confirmar"];
  return (
    <div className="flex items-center justify-center gap-0">
      {steps.map((label, i) => {
        const idx = i + 1;
        const isActive = step === idx;
        const isDone = step > idx;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  isDone
                    ? "bg-emerald-500 text-white"
                    : isActive
                    ? "bg-indigo-600 text-white ring-2 ring-indigo-400/40 shadow-lg"
                    : "bg-zinc-800 text-zinc-500 border border-zinc-700"
                }`}
              >
                {isDone ? <CheckCircle2 className="w-4 h-4" /> : idx}
              </div>
              <span
                className={`text-[10px] mt-1 font-medium ${
                  isActive ? "text-indigo-300" : isDone ? "text-emerald-400" : "text-zinc-600"
                }`}
              >
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div
                className={`w-16 h-0.5 mb-4 mx-1 transition-all duration-300 ${
                  step > idx ? "bg-emerald-500" : "bg-zinc-800"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Modal ───────────────────────────────────────────────────────────────

export default function JiraTicketModal({ isOpen, onClose, errorGroup }: JiraTicketModalProps) {
  const [step, setStep] = useState(1);
  const [selectedBank, setSelectedBank] = useState<string | null>(null);
  const [selectedReporter, setSelectedReporter] = useState<JiraUser | null>(null);
  const [customSearch, setCustomSearch] = useState("");
  const [searchResults, setSearchResults] = useState<JiraUser[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showCustomSearch, setShowCustomSearch] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [createdTicket, setCreatedTicket] = useState<{ key: string; url: string } | null>(null);
  const [createError, setCreateError] = useState<string | null>(null);
  const [customFields, setCustomFields] = useState<Record<string, any> | null>(null);
  const [isFetchingFields, setIsFetchingFields] = useState(false);
  const searchDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => {
        setStep(1);
        setSelectedBank(null);
        setSelectedReporter(null);
        setCustomSearch("");
        setSearchResults([]);
        setShowCustomSearch(false);
        setIsCreating(false);
        setCreatedTicket(null);
        setCreateError(null);
        setCustomFields(null);
      }, 300);
    }
  }, [isOpen]);

  // Fetch custom fields when bank is selected
  const fetchCustomFields = useCallback(async (projectKey: string) => {
    setIsFetchingFields(true);
    try {
      const res = await fetch(`/api/jira?action=get-fields&project=${projectKey}`);
      const data = await res.json();
      if (data.fields) {
        // Map field names to their keys
        const fieldMap: Record<string, string> = {};
        for (const [key, val] of Object.entries(data.fields as Record<string, { name: string }>)) {
          const name = val.name?.toLowerCase() ?? "";
          if (name.includes("informador") || name === "reporter name" || name.includes("informer")) {
            fieldMap.informadorField = key;
          } else if (name.includes("start date") || name === "fecha inicio") {
            fieldMap.startDateField = key;
          } else if (name === "area" || name.includes("área")) {
            fieldMap.areaField = key;
          } else if (name === "account" || name.includes("account")) {
            fieldMap.accountField = key;
          } else if (name.includes("organizacion gp") || name.includes("organización gp") || name.includes("organization gp")) {
            fieldMap.organizacionGPField = key;
          } else if (name === "provider" || name.includes("proveedor")) {
            fieldMap.providerField = key;
          } else if (name === "components" || name === "component" || name.includes("componente")) {
            fieldMap.componentsField = key;
          }
        }
        setCustomFields(fieldMap);
      }
    } catch {
      // silently fail, the API call will still try with the fields we have
      setCustomFields({});
    } finally {
      setIsFetchingFields(false);
    }
  }, []);

  if (!isOpen || !errorGroup) return null;

  const bankGroups = getBankGroupsFromServers(errorGroup.servers);
  const availableBanks = Object.keys(bankGroups).sort();

  // The servers for the selected bank
  const serversForBank = selectedBank ? (bankGroups[selectedBank] ?? []) : [];
  const jiraConfig = selectedBank ? BANK_TO_JIRA[selectedBank] ?? BANK_TO_JIRA["Corp"] : null;

  // ─── User search ────────────────────────────────────────────────────────────
  const handleCustomSearch = (val: string) => {
    setCustomSearch(val);
    if (searchDebounce.current) clearTimeout(searchDebounce.current);
    if (!val.trim()) { setSearchResults([]); return; }
    searchDebounce.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/jira?action=search-users&query=${encodeURIComponent(val)}`);
        const data = await res.json();
        setSearchResults(Array.isArray(data) ? data : []);
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  };

  // ─── Step 1: Bank Selection ──────────────────────────────────────────────────
  const handleSelectBank = (bank: string) => {
    setSelectedBank(bank);
    const cfg = BANK_TO_JIRA[bank] ?? BANK_TO_JIRA["Corp"];
    fetchCustomFields(cfg.projectKey);
  };

  // ─── Create Ticket ───────────────────────────────────────────────────────────
  const handleCreateTicket = async () => {
    if (!selectedBank || !selectedReporter || !jiraConfig) return;
    setIsCreating(true);
    setCreateError(null);

    // Build the assignee account ID: always gramirez@algeiba.com
    // We search for gramirez to get their accountId
    let assigneeAccountId: string | undefined;
    try {
      const res = await fetch(`/api/jira?action=search-users&query=gramirez`);
      const users: JiraUser[] = await res.json();
      const found = users.find(
        (u) => u.emailAddress?.toLowerCase().includes("gramirez") ||
               u.displayName?.toLowerCase().includes("gonzalo")
      );
      assigneeAccountId = found?.accountId;
    } catch { /* ignore */ }

    // For predefined reporters, search Jira to resolve their real accountId
    let reporterAccountId = selectedReporter.accountId;
    const isPredefined = PREDEFINED_REPORTERS.some(p => p.accountId === selectedReporter.accountId);
    if (isPredefined) {
      try {
        const res = await fetch(
          `/api/jira?action=search-users&query=${encodeURIComponent(selectedReporter.emailAddress)}`
        );
        const users: JiraUser[] = await res.json();
        const found = users.find(u =>
          u.emailAddress?.toLowerCase() === selectedReporter.emailAddress.toLowerCase()
        );
        if (found) reporterAccountId = found.accountId;
      } catch { /* ignore */ }
    }

    const payload = {
      projectKey: jiraConfig.projectKey,
      errorMessage: errorGroup.message,
      serversList: serversForBank,
      bankLabel: jiraConfig.orgLabel,
      bankCode: selectedBank,
      reporterAccountId,
      customFields: {
        ...(customFields ?? {}),
        assigneeAccountId,
      },
    };

    try {
      const res = await fetch("/api/jira", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        const errMsg = data?.error?.errorMessages?.join(", ") ||
          JSON.stringify(data?.error?.errors ?? data?.error ?? data);
        setCreateError(errMsg);
      } else {
        setCreatedTicket({ key: data.issueKey, url: data.issueUrl });
      }
    } catch (e: any) {
      setCreateError(e.message ?? "Error desconocido al crear el ticket");
    } finally {
      setIsCreating(false);
    }
  };

  // ─── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div
        className="glass rounded-2xl w-full max-w-lg flex flex-col border border-zinc-700/80 shadow-2xl overflow-hidden"
        style={{ maxHeight: "92vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/20">
              <Ticket className="w-4 h-4 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-zinc-100">Crear Ticket en Jira</h2>
              <p className="text-[11px] text-zinc-400 mt-0.5 max-w-xs truncate">
                {errorGroup.message}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
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

          {/* ── SUCCESS ── */}
          {createdTicket && (
            <div className="flex flex-col items-center justify-center p-10 gap-5 text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center animate-pulse-once">
                <CheckCircle2 className="w-9 h-9 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white mb-1">¡Ticket creado con éxito!</h3>
                <p className="text-sm text-zinc-400">
                  El ticket fue creado en Jira correctamente.
                </p>
              </div>
              <div className="glass rounded-xl px-5 py-3 border border-emerald-500/30 w-full max-w-xs">
                <p className="text-xs text-zinc-400 mb-1">Clave del ticket</p>
                <p className="text-xl font-extrabold text-emerald-400">{createdTicket.key}</p>
              </div>
              <a
                href={createdTicket.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg"
              >
                <ExternalLink className="w-4 h-4" />
                Ver ticket en Jira
              </a>
              <button
                onClick={onClose}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors mt-1"
              >
                Cerrar
              </button>
            </div>
          )}

          {/* ── STEP 1: BANK SELECTION ── */}
          {!createdTicket && step === 1 && (
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 mb-1">Seleccioná el banco</h3>
                <p className="text-xs text-zinc-400">
                  El error afecta a <strong className="text-white">{errorGroup.count}</strong> servidores en los siguientes bancos. Elegí el banco para el cual querés crear el ticket.
                </p>
              </div>

              <div className="space-y-2">
                {availableBanks.map((bank) => {
                  const color = TYPE_COLORS[bank] ?? "#6b7280";
                  const cfg = BANK_TO_JIRA[bank];
                  const srvList = bankGroups[bank];
                  const isSelected = selectedBank === bank;
                  return (
                    <button
                      key={bank}
                      onClick={() => handleSelectBank(bank)}
                      className={`w-full p-4 rounded-xl border text-left transition-all duration-200 flex items-center justify-between group ${
                        isSelected
                          ? "border-indigo-500/60 bg-indigo-500/10 shadow-md shadow-indigo-500/10"
                          : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600 hover:bg-zinc-900/70"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-3 h-3 rounded-full shrink-0"
                          style={{ backgroundColor: color, boxShadow: isSelected ? `0 0 8px ${color}80` : "none" }}
                        />
                        <div>
                          <p className="text-sm font-bold" style={{ color: isSelected ? "#fff" : color }}>
                            {bank}
                          </p>
                          {cfg && (
                            <p className="text-[10px] text-zinc-500 mt-0.5">
                              {cfg.spaceLabel} · {cfg.orgLabel}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="text-xs font-bold px-2 py-0.5 rounded-full border"
                          style={{
                            color,
                            borderColor: color + "44",
                            backgroundColor: color + "15",
                          }}
                        >
                          {srvList.length} srv
                        </span>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Preview of servers for selected bank */}
              {selectedBank && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/60 p-3 space-y-2">
                  <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider">
                    Servidores que se incluirán en el ticket ({serversForBank.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5 max-h-36 overflow-y-auto">
                    {serversForBank.map((s) => (
                      <span
                        key={s}
                        className="px-2 py-0.5 rounded text-[10px] bg-zinc-900 border border-zinc-800 text-zinc-300 font-medium"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 2: REPORTER SELECTION ── */}
          {!createdTicket && step === 2 && (
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 mb-1">Seleccioná el Informador</h3>
                <p className="text-xs text-zinc-400">
                  El informador es quien notifica el incidente. Elegí uno de la lista o buscá otro usuario de Jira.
                </p>
              </div>

              {/* Predefined reporters */}
              <div className="space-y-2">
                {PREDEFINED_REPORTERS.map((user) => {
                  const isSelected = selectedReporter?.accountId === user.accountId;
                  return (
                    <button
                      key={user.accountId}
                      onClick={() => { setSelectedReporter(user); setShowCustomSearch(false); }}
                      className={`w-full p-3.5 rounded-xl border text-left transition-all flex items-center gap-3 ${
                        isSelected
                          ? "border-indigo-500/60 bg-indigo-500/10"
                          : "border-zinc-800 bg-zinc-900/40 hover:border-zinc-600"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                          isSelected ? "bg-indigo-600" : "bg-zinc-700"
                        }`}
                      >
                        {user.displayName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-zinc-100">{user.displayName}</p>
                        <p className="text-[11px] text-zinc-400">{user.emailAddress}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Custom search toggle */}
              <button
                onClick={() => setShowCustomSearch(!showCustomSearch)}
                className="w-full py-2.5 px-4 rounded-xl border border-dashed border-zinc-700 text-zinc-400 text-sm hover:border-indigo-500/50 hover:text-indigo-300 transition-all flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                Buscar otro usuario en Jira
              </button>

              {showCustomSearch && (
                <div className="space-y-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Nombre o email del usuario..."
                      value={customSearch}
                      onChange={(e) => handleCustomSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-zinc-900 border border-zinc-700 rounded-xl text-sm text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500"
                      autoFocus
                    />
                    {isSearching && (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-indigo-400 animate-spin" />
                    )}
                  </div>

                  {searchResults.length > 0 && (
                    <div className="rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800/60">
                      {searchResults.map((user) => {
                        const isSelected = selectedReporter?.accountId === user.accountId;
                        return (
                          <button
                            key={user.accountId}
                            onClick={() => { setSelectedReporter(user); setShowCustomSearch(false); setCustomSearch(""); setSearchResults([]); }}
                            className={`w-full p-3 text-left flex items-center gap-3 transition-colors ${
                              isSelected ? "bg-indigo-500/10" : "bg-zinc-900/60 hover:bg-zinc-800/60"
                            }`}
                          >
                            {user.avatarUrls?.["48x48"] ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={user.avatarUrls["48x48"]}
                                alt={user.displayName}
                                className="w-7 h-7 rounded-full shrink-0"
                              />
                            ) : (
                              <div className="w-7 h-7 rounded-full bg-zinc-700 flex items-center justify-center shrink-0">
                                <User className="w-4 h-4 text-zinc-400" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-medium text-zinc-100">{user.displayName}</p>
                              <p className="text-[11px] text-zinc-400">{user.emailAddress}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {customSearch && !isSearching && searchResults.length === 0 && (
                    <p className="text-xs text-zinc-500 text-center py-3">
                      No se encontraron usuarios con ese nombre.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: CONFIRMATION ── */}
          {!createdTicket && step === 3 && (
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-bold text-zinc-100 mb-1">Revisá el ticket antes de crearlo</h3>
                <p className="text-xs text-zinc-400">Todos los campos serán enviados a Jira.</p>
              </div>

              {isFetchingFields && (
                <div className="flex items-center gap-2 text-xs text-indigo-300 px-3 py-2 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Cargando configuración de campos Jira...
                </div>
              )}

              <div className="space-y-2 rounded-xl border border-zinc-800 overflow-hidden divide-y divide-zinc-800/60">
                <FieldRow icon={<Building2 className="w-3.5 h-3.5" />} label="Espacio (Proyecto)" value={jiraConfig?.spaceLabel ?? "—"} accent="indigo" />
                <FieldRow label="Tipo de actividad" value="Actividad" />
                <FieldRow label="Resumen" value={`${errorGroup.message}\n\nServidores afectados (${selectedBank}):\n${serversForBank.join(", ")}`} multiline />
                <FieldRow label="Persona asignada" value="Gonzalo Ramirez (gramirez@algeiba.com)" />
                <FieldRow label="Informador" value={`${selectedReporter?.displayName} (${selectedReporter?.emailAddress})`} />
                <FieldRow label="Start Date" value={new Date().toLocaleDateString("es-AR")} />
                <FieldRow label="Area" value="SEC" />
                <FieldRow label="Account" value="GP | SEC | Abono" />
                <FieldRow label="Organización GP" value={jiraConfig?.orgLabel ?? "—"} />
                <FieldRow label="Descripción" value={`${errorGroup.message}\n\nServidores afectados (${selectedBank}):\n${serversForBank.join("\n")}`} multiline />
                <FieldRow label="Components" value="Sistemas Operativos" />
                <FieldRow label="Provider" value="Microsoft" />
              </div>

              {createError && (
                <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold mb-0.5">Error al crear el ticket</p>
                    <p className="text-rose-400/80 font-mono text-[10px] break-all">{createError}</p>
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
              onClick={() => {
                if (step === 1) onClose();
                else setStep((s) => s - 1);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-zinc-400 hover:text-zinc-200 text-sm font-medium transition-colors hover:bg-white/5"
            >
              <ChevronLeft className="w-4 h-4" />
              {step === 1 ? "Cancelar" : "Atrás"}
            </button>

            {step < 3 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                disabled={
                  (step === 1 && !selectedBank) ||
                  (step === 2 && !selectedReporter)
                }
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all shadow-lg disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Siguiente
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleCreateTicket}
                disabled={isCreating || isFetchingFields}
                className="flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Creando ticket...</>
                ) : (
                  <><Ticket className="w-4 h-4" /> Crear Ticket</>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Field Row Helper ─────────────────────────────────────────────────────────

function FieldRow({
  icon,
  label,
  value,
  accent,
  multiline,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
  accent?: string;
  multiline?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 px-4 py-3 bg-zinc-900/30">
      <div className="w-36 shrink-0 flex items-center gap-1.5 pt-0.5">
        {icon && <span className="text-zinc-500">{icon}</span>}
        <span className="text-[11px] text-zinc-500 font-medium leading-tight">{label}</span>
      </div>
      <div className="flex-1">
        {multiline ? (
          <pre className="text-xs text-zinc-300 whitespace-pre-wrap font-sans leading-relaxed max-h-24 overflow-y-auto">
            {value}
          </pre>
        ) : (
          <span className="text-xs text-zinc-200 font-medium">{value}</span>
        )}
      </div>
    </div>
  );
}
