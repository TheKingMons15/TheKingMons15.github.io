"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { LayoutDashboard, Users, Phone, FileText, Shield, LogOut, ChevronRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const navItems = [
  { label: "Dashboard",      href: "/dashboard",    icon: LayoutDashboard, adminOnly: false },
  { label: "Clientes",       href: "/clientes",     icon: Users,           adminOnly: false },
  { label: "Seguimientos",   href: "/seguimientos", icon: Phone,           adminOnly: false },
  { label: "Reportes",       href: "/reportes",     icon: FileText,        adminOnly: false },
  { label: "Administración", href: "/admin",        icon: Shield,          adminOnly: true  },
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
        width: "var(--sidebar-w)",
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderRight: "1px solid var(--border)",
      }}
    >
      {/* Logo + app name */}
      <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{
            width: "36px", height: "36px", borderRadius: "10px",
            overflow: "hidden", padding: "4px",
            background: "white", border: "1px solid var(--border)",
            boxShadow: "var(--shadow-xs)",
            flexShrink: 0,
          }}>
            <img src="/img/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
              Neurotec CRM
            </p>
            <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "2px" }}>
              {profile?.rol === "admin" ? "Administrador" : "Vendedor"}
            </p>
          </div>
        </div>
      </div>

      {/* Nav items */}
      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        <p style={{ fontSize: "10px", fontWeight: 700, color: "var(--text-light)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "4px 8px 10px" }}>
          Navegación
        </p>

        {items.map((item, i) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <motion.div
              key={item.href}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
            >
              <Link href={item.href} style={{ textDecoration: "none" }}>
                <div
                  style={{
                    display: "flex", alignItems: "center", gap: "9px",
                    padding: "8px 10px", borderRadius: "var(--r-sm)",
                    marginBottom: "2px", cursor: "pointer",
                    background: isActive ? "var(--accent-bg)" : "transparent",
                    color: isActive ? "var(--accent)" : "var(--text-secondary)",
                    fontWeight: isActive ? 600 : 500,
                    fontSize: "13.5px",
                    transition: "all 0.15s ease",
                  }}
                  onMouseEnter={(e) => { if (!isActive) { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-primary)"; } }}
                  onMouseLeave={(e) => { if (!isActive) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-secondary)"; } }}
                >
                  <Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {isActive && <ChevronRight size={12} style={{ opacity: 0.5 }} />}
                </div>
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer — user info */}
      <div style={{ padding: "10px", borderTop: "1px solid var(--border)" }}>
        {profile && (
          <div style={{
            display: "flex", alignItems: "center", gap: "9px",
            padding: "9px 10px", borderRadius: "var(--r-sm)",
            marginBottom: "4px",
            background: "var(--bg-hover)",
          }}>
            <div style={{
              width: "30px", height: "30px", borderRadius: "50%",
              background: "var(--accent-bg)", border: "1px solid var(--accent-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 700, color: "var(--accent)",
              flexShrink: 0,
            }}>
              {profile.nombre?.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {profile.nombre}
              </p>
              <p style={{ fontSize: "11px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {profile.email}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={handleSignOut}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: "9px",
            padding: "8px 10px", borderRadius: "var(--r-sm)",
            background: "none", border: "none", cursor: "pointer",
            fontSize: "13.5px", fontWeight: 500, color: "var(--text-secondary)",
            transition: "all 0.15s",
          }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "var(--red-bg)"; (e.currentTarget as HTMLButtonElement).style.color = "var(--red)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = "none"; (e.currentTarget as HTMLButtonElement).style.color = "var(--text-secondary)"; }}
        >
          <LogOut size={15} strokeWidth={1.8} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
