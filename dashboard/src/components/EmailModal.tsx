"use client";

import { useState, useEffect } from "react";
import { X, Send, Loader2 } from "lucide-react";

export interface EmailPayload {
  attachmentType: "history" | "report" | "dashboard";
  summaryText: string;
  defaultMessage?: string;
  data: any[];
}

interface EmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: EmailPayload | null;
}

export default function EmailModal({ isOpen, onClose, payload }: EmailModalProps) {
  const [to, setTo] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (isOpen && payload) {
      setMessage(payload.defaultMessage || "");
    }
  }, [isOpen, payload]);

  if (!isOpen || !payload) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!to || !subject) return;

    setIsSending(true);
    setStatus("idle");
    setErrorMessage("");

    try {
      const res = await fetch("/api/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          to,
          subject,
          message,
          attachmentType: payload.attachmentType,
          payload: payload.data,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("success");
        setTimeout(() => {
          onClose();
          setStatus("idle");
          setTo("");
          setSubject("");
          setMessage("");
        }, 2000);
      } else {
        setStatus("error");
        setErrorMessage(data.error || "Error al enviar el correo");
      }
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Error de red al enviar el correo");
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="px-5 py-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
          <h3 className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
            <Send className="w-4 h-4 text-indigo-400" />
            Enviar por Correo
          </h3>
          <button onClick={onClose} className="text-zinc-500 hover:text-zinc-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSend} className="p-5 space-y-4">
          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1">Para (separados por coma)</label>
            <input
              type="text"
              required
              value={to}
              onChange={(e) => setTo(e.target.value)}
              placeholder="ejemplo@empresa.com, otro@empresa.com"
              className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1">Asunto</label>
            <input
              type="text"
              required
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Reporte de Parcheo..."
              className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-zinc-400 mb-1">Mensaje (opcional)</label>
            <textarea
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Escribí un mensaje personalizado aquí..."
              className="w-full bg-zinc-900 border border-zinc-700/60 rounded-lg px-3 py-2 text-xs text-zinc-200 focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Attachment Preview */}
          <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-lg px-4 py-3 flex items-start gap-3">
            <div className="mt-0.5">
              <svg className="w-4 h-4 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </div>
            <div>
              <p className="text-[11px] font-semibold text-indigo-300">Datos a adjuntar</p>
              <p className="text-[11px] text-zinc-400 mt-0.5">{payload.summaryText}</p>
            </div>
          </div>

          {/* Status Message */}
          {status === "success" && (
            <p className="text-xs text-emerald-400 text-center font-medium">¡Correo enviado con éxito!</p>
          )}
          {status === "error" && (
            <p className="text-xs text-rose-400 text-center font-medium">{errorMessage}</p>
          )}

          {/* Footer Actions */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSending}
              className="px-4 py-2 rounded-lg text-xs font-medium text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSending || !to || !subject}
              className="px-4 py-2 rounded-lg text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {isSending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  Enviar Correo
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
