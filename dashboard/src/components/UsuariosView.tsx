"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Trash2, Shield, User, Mail, Send, Edit, X } from "lucide-react";

interface UserRow {
  id: string;
  username: string;
  role: string;
  email?: string | null;
  isConfirmed?: boolean;
  passwordExpiry?: string | null;
  createdAt: string;
}

export default function UsuariosView({ users: initial }: { users: UserRow[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  
  // Create / Edit Form State
  const [showForm, setShowForm] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setEmail("");
    setUsername("");
    setPassword("");
    setRole("user");
    setEditingUserId(null);
    setShowForm(false);
    setError("");
  };

  const openEdit = (user: UserRow) => {
    setEditingUserId(user.id);
    setEmail(user.email || "");
    setUsername(user.username);
    setPassword(""); // Can't edit password directly, only reset
    setRole(user.role);
    setShowForm(true);
  };

  const getStatus = (u: UserRow) => {
    if (u.isConfirmed) return { label: "Activo", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
    if (!u.passwordExpiry) return { label: "Activo", color: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" }; // fallback
    const isExpired = new Date(u.passwordExpiry) <= new Date();
    if (isExpired) return { label: "Expirado", color: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
    return { label: "Pendiente", color: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    try {
      if (!editingUserId) {
        // Create
        const res = await fetch("/api/usuarios", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: email || null, username, password, role }),
        });
        
        let data;
        try { data = await res.json(); } catch(e) { throw new Error("Error en el servidor"); }
        
        setLoading(false);
        if (!res.ok) {
          setError(data.error ?? "Error al crear usuario");
          return;
        }
        setUsers((prev) => [{ ...data, createdAt: data.createdAt }, ...prev]);
      } else {
        // Edit
        const res = await fetch("/api/usuarios", {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: editingUserId, email: email || null, username, role }),
        });
        
        let data;
        try { data = await res.json(); } catch(e) { throw new Error("Error en el servidor"); }
        
        setLoading(false);
        if (!res.ok) {
          setError(data.error ?? "Error al editar usuario");
          return;
        }
        setUsers((prev) => prev.map(u => u.id === editingUserId ? { ...u, ...data } : u));
      }
      
      resetForm();
      router.refresh();
    } catch (err: any) {
      setLoading(false);
      setError(err.message ?? "Ocurrió un error inesperado.");
    }
  }

  async function handleDelete(id: string, uname: string) {
    if (!confirm(`¿Eliminar usuario "${uname}"?`)) return;
    const res = await fetch("/api/usuarios", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
      router.refresh();
    }
  }

  async function handleResend(id: string, uname: string) {
    if (!confirm(`¿Reenviar nueva contraseña aleatoria por correo a "${uname}"?`)) return;
    const res = await fetch("/api/usuarios", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "resend", id }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Nueva contraseña enviada correctamente.");
      router.refresh();
    } else {
      alert(data.error ?? "Error al enviar");
    }
  }

  return (
    <div className="space-y-5">
      {/* Header actions */}
      <div className="flex justify-end">
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass rounded-2xl p-5">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-sm font-semibold text-zinc-200">
              {editingUserId ? "Editar Usuario" : "Crear nuevo usuario"}
            </h2>
            <button onClick={resetForm} className="text-zinc-500 hover:text-zinc-300">
              <X className="w-4 h-4" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end">
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Correo</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500"
                placeholder="juan@empresa.com"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Usuario (Opcional si hay correo)</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required={!email}
                className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500"
                placeholder="nombre.usuario"
              />
            </div>
            {!editingUserId && (
              <div className="space-y-1">
                <label className="text-xs text-zinc-400">Contraseña {email && "(Auto-generada)"}</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required={!email}
                  disabled={!!email}
                  className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
                  placeholder={email ? "Aleatoria via Email" : "••••••••"}
                />
              </div>
            )}
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Rol</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500"
              >
                <option value="user">Usuario</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="flex gap-2 w-full lg:col-span-1 sm:col-span-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Guardando..." : "Guardar"}
              </button>
            </div>
            {error && <p className="sm:col-span-2 lg:col-span-5 text-xs text-rose-400 mt-2">{error}</p>}
          </form>
        </div>
      )}

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-zinc-400 uppercase text-xs border-b border-zinc-800 bg-zinc-950">
            <tr>
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Correo</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium">Estado</th>
              <th className="px-4 py-3 font-medium hidden md:table-cell">Creado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {users.map((u) => {
              const status = getStatus(u);
              return (
                <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-zinc-800 flex items-center justify-center">
                        {u.role === "admin"
                          ? <Shield className="w-3.5 h-3.5 text-indigo-400" />
                          : <User className="w-3.5 h-3.5 text-zinc-500" />}
                      </div>
                      <span className="font-medium text-zinc-200">{u.username}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell">
                    {u.email ? (
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5 opacity-50" />
                        {u.email}
                      </div>
                    ) : <span className="opacity-40">No asignado</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${
                      u.role === "admin"
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                        : "bg-zinc-500/10 text-zinc-400 border-zinc-600/30"
                    }`}>
                      {u.role === "admin" ? "Admin" : "Usuario"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${status.color}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-zinc-500 text-xs hidden md:table-cell">
                    {new Date(u.createdAt).toLocaleDateString("es-AR")}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-1">
                      {u.email && !u.isConfirmed && (
                        <button
                          onClick={() => handleResend(u.id, u.username)}
                          className="p-1.5 rounded-lg text-zinc-400 hover:text-amber-400 hover:bg-amber-400/10 transition-colors"
                          title="Reenviar clave aleatoria"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => openEdit(u)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-indigo-400 hover:bg-indigo-400/10 transition-colors"
                        title="Editar usuario"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(u.id, u.username)}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Eliminar usuario"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-zinc-600">No hay usuarios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
