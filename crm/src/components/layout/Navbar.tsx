"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";

const pageTitles: Record<string, string> = {
  "/dashboard":   "Dashboard",
  "/clientes":    "Clientes",
  "/seguimientos":"Seguimientos",
  "/reportes":    "Reportes Diarios",
  "/admin":       "Administración",
};

export default function Navbar() {
  const { profile } = useAuth();
  const pathname = usePathname();
  const [search, setSearch] = useState("");

  const title = Object.entries(pageTitles)
    .find(([key]) => pathname.startsWith(key))?.[1] ?? "Panel";

  const today = new Date().toLocaleDateString("es-EC", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between px-6"
      style={{
        left: "var(--sidebar-width)",
        height: "var(--navbar-height)",
        background: "var(--bg-secondary)",
        borderBottom: "1px solid var(--border)",
        boxShadow: "0 1px 0 var(--border)",
      }}
    >
      {/* Título */}
      <div>
        <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
          {title}
        </h2>
        <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>
          {today}
        </p>
      </div>

      {/* Barra de búsqueda + acciones */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 text-sm rounded-xl outline-none transition-all"
            style={{
              width: "200px",
              background: "var(--bg-primary)",
              border: "1px solid var(--border)",
              color: "var(--text-primary)",
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "var(--accent-light)";
              e.target.style.boxShadow = "0 0 0 3px var(--accent-bg)";
              e.target.style.width = "240px";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "var(--border)";
              e.target.style.boxShadow = "none";
              e.target.style.width = "200px";
            }}
          />
        </div>

        {/* Notificaciones */}
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: "var(--bg-primary)",
            border: "1px solid var(--border)",
            color: "var(--text-secondary)",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-hover)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "var(--bg-primary)";
          }}
        >
          <Bell size={15} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "var(--danger)", animation: "pulse-dot 2s infinite" }}
          />
        </button>

        {/* Avatar usuario */}
        {profile && (
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-default"
            style={{
              background: "var(--bg-primary)",
              border: "1px solid var(--border)",
            }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}
            >
              {profile.nombre?.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold leading-none" style={{ color: "var(--text-primary)" }}>
                {profile.nombre?.split(" ")[0]}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {profile.rol === "admin" ? "Admin" : "Vendedor"}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
