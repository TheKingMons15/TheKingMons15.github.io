"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  LayoutDashboard, Users, Phone, FileText, Shield, LogOut, ChevronRight,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Image from "next/image";

const navItems = [
  { label: "Dashboard",      href: "/dashboard",   icon: LayoutDashboard, adminOnly: false },
  { label: "Clientes",       href: "/clientes",    icon: Users,           adminOnly: false },
  { label: "Seguimientos",   href: "/seguimientos",icon: Phone,           adminOnly: false },
  { label: "Reportes",       href: "/reportes",    icon: FileText,        adminOnly: false },
  { label: "Administración", href: "/admin",       icon: Shield,          adminOnly: true  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const { profile, signOut } = useAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    await signOut();
    toast.success("Sesión cerrada");
    router.push("/acceso");
  };

  const items = navItems.filter((i) => !i.adminOnly || profile?.rol === "admin");

  return (
    <aside
      className="fixed left-0 top-0 h-full flex flex-col z-40"
      style={{
        width: "var(--sidebar-width)",
        background: "var(--bg-secondary)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo */}
      <div
        className="flex items-center gap-3 px-5 py-5"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div
          className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center"
          style={{ background: "#f1f5f9", border: "1px solid var(--border)" }}
        >
          <img src="/img/logo.png" alt="Neurotec" className="w-9 h-9 object-contain" />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
            Neurotec CRM
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {profile?.rol === "admin" ? "Administrador" : "Vendedor"}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
        <p
          className="text-xs font-semibold uppercase tracking-widest px-3 mb-3"
          style={{ color: "var(--text-light)" }}
        >
          Menú
        </p>

        {items.map((item, i) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
            >
              <Link href={item.href}>
                <div
                  className="flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer relative"
                  style={{
                    background: isActive ? "var(--accent-bg)" : "transparent",
                    color: isActive ? "var(--accent)" : "var(--text-secondary)",
                    border: isActive ? "1px solid var(--accent-border)" : "1px solid transparent",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "var(--bg-hover)";
                      e.currentTarget.style.color = "var(--text-primary)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-secondary)";
                    }
                  }}
                >
                  {isActive && (
                    <div
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-full"
                      style={{ background: "var(--accent)" }}
                    />
                  )}
                  <Icon size={17} />
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                  {isActive && <ChevronRight size={13} className="opacity-50" />}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Usuario + logout */}
      <div className="px-3 pb-4" style={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
        {profile && (
          <div
            className="flex items-center gap-3 px-3 py-3 rounded-xl mb-2"
            style={{ background: "var(--bg-primary)" }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0"
              style={{ background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}
            >
              {profile.nombre?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate" style={{ color: "var(--text-primary)" }}>
                {profile.nombre}
              </p>
              <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                {profile.email}
              </p>
            </div>
          </div>
        )}
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
          style={{ color: "var(--text-muted)" }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--danger-bg)";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--danger)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            (e.currentTarget as HTMLButtonElement).style.color = "var(--text-muted)";
          }}
        >
          <LogOut size={16} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
