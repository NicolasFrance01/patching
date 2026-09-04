"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  History,
  BarChart2,
  Users,
  LogOut,
  Shield,
  Ticket,
  ClipboardList
} from "lucide-react";
import ProfileModal from "./ProfileModal";
import { useState } from "react";

interface SidebarProps {
  role?: string;
  username?: string;
}

const navItems = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/historial", label: "Historial", icon: History },
  { href: "/reportes", label: "Reportes", icon: BarChart2 },
  { href: "/jira", label: "Jira", icon: Ticket },
  { href: "/mis-tickets", label: "Mis Tickets", icon: ClipboardList },
];

export default function Sidebar({ role, username }: SidebarProps) {
  const pathname = usePathname();
  const [showProfileModal, setShowProfileModal] = useState(false);

  return (
    <aside className="fixed inset-y-0 left-0 w-56 flex flex-col bg-zinc-950 border-r border-zinc-800/60 z-40">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-zinc-800/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center">
            <Shield className="w-4 h-4 text-indigo-400" />
          </div>
          <div>
            <p className="text-xs font-semibold text-white leading-tight">Centro de</p>
            <p className="text-xs font-semibold text-indigo-400 leading-tight">Parcheo</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                  : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              {label}
            </Link>
          );
        })}

        {role === "admin" && (
          <Link
            href="/usuarios"
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
              pathname.startsWith("/usuarios")
                ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-white/[0.04]"
            }`}
          >
            <Users className="w-4 h-4 shrink-0" />
            Usuarios
          </Link>
        )}
      </nav>

      {/* User */}
      <div className="px-2 py-3 border-t border-zinc-800/60">
        <button
          onClick={() => setShowProfileModal(true)}
          className="w-full flex items-center justify-between px-3 py-2 mb-1 rounded-lg text-left hover:bg-white/[0.04] transition-colors"
        >
          <div className="flex flex-col overflow-hidden mr-2">
            <p className="text-xs font-medium text-zinc-300 truncate">{username ?? "Usuario"}</p>
            <p className="text-[10px] text-zinc-600 capitalize">{role ?? "user"}</p>
          </div>
          <div className="px-2 py-1 rounded bg-indigo-500/10 text-[10px] font-bold text-indigo-400 border border-indigo-500/20 whitespace-nowrap">
            Mi Perfil
          </div>
        </button>
        <button
          onClick={() => signOut({ callbackUrl: "https://patching.algeiba.com/login" })}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-500 hover:text-rose-400 hover:bg-rose-500/5 transition-colors"
        >
          <LogOut className="w-4 h-4 shrink-0" />
          Cerrar sesión
        </button>
      </div>

      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </aside>
  );
}
