"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserPlus, Trash2, Shield, User } from "lucide-react";

interface UserRow {
  id: string;
  username: string;
  role: string;
  createdAt: string;
}

export default function UsuariosView({ users: initial }: { users: UserRow[] }) {
  const router = useRouter();
  const [users, setUsers] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/usuarios", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Error al crear usuario");
      return;
    }
    setUsers((prev) => [{ ...data, createdAt: data.createdAt }, ...prev]);
    setUsername("");
    setPassword("");
    setRole("user");
    setShowForm(false);
    router.refresh();
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
    }
  }

  return (
    <div className="space-y-5">
      {/* Header actions */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowForm((v) => !v)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          Nuevo Usuario
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="glass rounded-2xl p-5">
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">Crear nuevo usuario</h2>
          <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Usuario</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500"
                placeholder="nombre.usuario"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-zinc-400">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-3 py-2 text-sm bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-200 focus:outline-none focus:border-indigo-500"
                placeholder="••••••••"
              />
            </div>
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
            <div className="flex gap-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Creando..." : "Crear"}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-3 py-2 rounded-lg text-zinc-400 hover:text-zinc-200 text-sm transition-colors border border-zinc-700"
              >
                Cancel
              </button>
            </div>
            {error && <p className="sm:col-span-4 text-xs text-rose-400">{error}</p>}
          </form>
        </div>
      )}

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="text-zinc-400 uppercase text-xs border-b border-zinc-800 bg-zinc-950">
            <tr>
              <th className="px-4 py-3 font-medium">Usuario</th>
              <th className="px-4 py-3 font-medium">Rol</th>
              <th className="px-4 py-3 font-medium hidden sm:table-cell">Creado</th>
              <th className="px-4 py-3 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/60">
            {users.map((u) => (
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
                <td className="px-4 py-3">
                  <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${
                    u.role === "admin"
                      ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                      : "bg-zinc-500/10 text-zinc-400 border-zinc-600/30"
                  }`}>
                    {u.role === "admin" ? "Admin" : "Usuario"}
                  </span>
                </td>
                <td className="px-4 py-3 text-zinc-500 text-xs hidden sm:table-cell">
                  {new Date(u.createdAt).toLocaleDateString("es-AR")}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => handleDelete(u.id, u.username)}
                    className="p-1.5 rounded-lg text-zinc-600 hover:text-rose-400 hover:bg-rose-500/5 transition-colors"
                    title="Eliminar usuario"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-zinc-600">No hay usuarios registrados.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
