"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "forgot_password", email }),
      });

      if (!res.ok) {
        setError("Ocurrió un error al procesar tu solicitud.");
        setLoading(false);
        return;
      }

      setSuccess(true);
    } catch (err) {
      setError("Error de conexión");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#111113] border border-zinc-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-500" />
        
        <Link href="/login" className="inline-flex items-center text-sm text-zinc-500 hover:text-zinc-300 transition-colors mb-6">
          <ArrowLeft className="w-4 h-4 mr-1" />
          Volver al Login
        </Link>
        
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-4">
            <Mail className="w-8 h-8 text-indigo-400" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center">Recuperar Contraseña</h1>
          <p className="text-sm text-zinc-400 mt-2 text-center max-w-sm">
            Ingresa el correo electrónico asociado a tu cuenta para recibir una nueva contraseña temporal.
          </p>
        </div>

        {success ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-center">
            <p className="text-emerald-400 font-medium">¡Correo enviado!</p>
            <p className="text-sm text-emerald-500/70 mt-1">Revisa tu bandeja de entrada.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-400 uppercase tracking-wider">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all placeholder:text-zinc-600"
                  placeholder="juan@empresa.com"
                />
              </div>
            </div>
            
            {error && <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">{error}</div>}
            
            <button
              type="submit"
              disabled={loading || !email}
              className="flex items-center justify-center w-full py-3 mt-4 bg-indigo-500 hover:bg-indigo-600 text-white font-bold rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Enviando..." : (
                <>
                  Enviar Contraseña Temporal
                  <Send className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
