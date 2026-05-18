"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const pageTitles: Record<string, { title: string; sub: string }> = {
  "/dashboard":    { title: "Dashboard",        sub: "Resumen general" },
  "/clientes":     { title: "Clientes",          sub: "Gestión del CRM" },
  "/seguimientos": { title: "Seguimientos",      sub: "Actividad de contacto" },
  "/reportes":     { title: "Reportes Diarios",  sub: "Registro de actividad" },
  "/admin":        { title: "Administración",    sub: "Gestión de usuarios" },
};

export default function Navbar() {
  const { profile } = useAuth();
  const pathname = usePathname();
  const [focused, setFocused] = useState(false);

  const page = Object.entries(pageTitles).find(([key]) => pathname.startsWith(key))?.[1]
    ?? { title: "Panel", sub: "Neurotec CRM" };

  const today = new Date().toLocaleDateString("es-EC", {
    weekday: "long", day: "numeric", month: "long",
  });

  return (
    <header
      style={{
        position: "fixed", top: 0, right: 0, zIndex: 30,
        left: "var(--sidebar-w)",
        height: "var(--navbar-h)",
        background: "rgba(245,245,247,0.85)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
        display: "flex", alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
      }}
    >
      {/* Título */}
      <div>
        <h1 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", lineHeight: 1.2 }}>
          {page.title}
        </h1>
        <p style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "1px", textTransform: "capitalize" }}>
          {today}
        </p>
      </div>

      {/* Acciones */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Buscador */}
        <div style={{ position: "relative" }}>
          <Search
            size={13}
            style={{
              position: "absolute", left: "11px", top: "50%",
              transform: "translateY(-50%)", color: "var(--text-muted)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Buscar..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            style={{
              paddingLeft: "32px", paddingRight: "12px",
              paddingTop: "7px", paddingBottom: "7px",
              width: focused ? "220px" : "160px",
              background: "rgba(0,0,0,0.05)",
              border: `1px solid ${focused ? "var(--accent)" : "transparent"}`,
              borderRadius: "var(--r-full)",
              fontSize: "13px", color: "var(--text-primary)",
              outline: "none",
              transition: "all 0.2s ease",
              boxShadow: focused ? "0 0 0 3px var(--accent-bg)" : "none",
            }}
          />
        </div>

        {/* Notificación */}
        <button
          style={{
            width: "34px", height: "34px", borderRadius: "50%",
            background: "rgba(0,0,0,0.04)", border: "1px solid var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", position: "relative", color: "var(--text-secondary)",
            transition: "background 0.15s",
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.07)")}
          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.background = "rgba(0,0,0,0.04)")}
        >
          <Bell size={15} strokeWidth={1.8} />
          <span style={{
            position: "absolute", top: "7px", right: "7px",
            width: "7px", height: "7px", borderRadius: "50%",
            background: "var(--red)", border: "1.5px solid var(--bg)",
          }} />
        </button>

        {/* Avatar */}
        {profile && (
          <div
            style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "5px 12px 5px 6px",
              background: "rgba(0,0,0,0.04)",
              border: "1px solid var(--border)",
              borderRadius: "var(--r-full)",
              cursor: "default",
            }}
          >
            <div style={{
              width: "26px", height: "26px", borderRadius: "50%",
              background: "var(--accent-bg)", border: "1.5px solid var(--accent-border)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "11px", fontWeight: 700, color: "var(--accent)",
            }}>
              {profile.nombre?.charAt(0).toUpperCase()}
            </div>
            <span style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>
              {profile.nombre?.split(" ")[0]}
            </span>
          </div>
        )}
      </div>
    </header>
  );
}
