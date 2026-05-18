"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Users,
  Phone,
  FileText,
  Settings,
  LogOut,
  Zap,
  ChevronRight,
  Shield,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    adminOnly: false,
  },
  {
    label: "Clientes",
    href: "/clientes",
    icon: Users,
    adminOnly: false,
  },
  {
    label: "Seguimientos",
    href: "/seguimientos",
    icon: Phone,
    adminOnly: false,
  },
  {
    label: "Reportes",
    href: "/reportes",
    icon: FileText,
    adminOnly: false,
  },
  {
    label: "Administración",
    href: "/admin",
    icon: Shield,
    adminOnly: true,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Sesión cerrada");
    router.push("/login");
  };

  const filteredItems = navItems.filter(
    (item) => !item.adminOnly || profile?.rol === "admin"
  );

  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col z-40"
      style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border-glass)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-6 py-5"
        style={{ borderBottom: "1px solid var(--border-glass)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
            boxShadow: "0 0 15px rgba(59,130,246,0.4)",
          }}
        >
          <Zap size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            Neurotec CRM
          </h1>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {profile?.rol === "admin" ? "Administrador" : "Vendedor"}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-xs font-semibold uppercase tracking-wider px-3 mb-3" style={{ color: "var(--text-muted)" }}>
          Menú Principal
        </p>
        {filteredItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ x: 3 }}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all relative group"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, rgba(59,130,246,0.2), rgba(59,130,246,0.1))"
                    : "transparent",
                  color: isActive ? "var(--accent-blue-light)" : "var(--text-secondary)",
                  border: isActive ? "1px solid rgba(59,130,246,0.2)" : "1px solid transparent",
                }}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                    style={{ background: "var(--accent-blue)" }}
                  />
                )}
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && (
                  <ChevronRight size={14} className="ml-auto opacity-60" />
                )}
              </motion.div>
            </Link>
          );
        })}
      </nav>

      {/* User info + logout */}
      <div className="px-3 py-4" style={{ borderTop: "1px solid var(--border-glass)" }}>
        {profile && (
          <div
            className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2"
            style={{ background: "rgba(255,255,255,0.03)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold"
              style={{
                background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                color: "white",
              }}
            >
              {profile.nombre?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)" }}>
                {profile.nombre}
              </p>
              <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                {profile.email}
              </p>
            </div>
          </div>
        )}
        <motion.button
          whileHover={{ x: 3 }}
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "#f43f5e";
            (e.currentTarget as HTMLButtonElement).style.background = "rgba(244,63,94,0.08)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
          }}
        >
          <LogOut size={16} />
          Cerrar sesión
        </motion.button>
      </div>
    </aside>
  );
}
