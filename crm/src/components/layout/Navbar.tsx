"use client";

import { usePathname } from "next/navigation";
import { Bell, Search } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/clientes": "Clientes",
  "/seguimientos": "Seguimientos",
  "/reportes": "Reportes Diarios",
  "/admin": "Administración",
  "/admin/usuarios": "Gestión de Usuarios",
};

export default function Navbar() {
  const { profile } = useAuth();
  const pathname = usePathname();

  const title = Object.entries(pageTitles).find(([key]) =>
    pathname.startsWith(key) && (key === pathname || pathname.startsWith(key + "/"))
  )?.[1] || "Panel";

  const today = new Date().toLocaleDateString("es-EC", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header
      className="fixed top-0 right-0 z-30 flex items-center justify-between px-6"
      style={{
        left: "var(--sidebar-width)",
        height: "var(--navbar-height)",
        background: "rgba(6, 13, 31, 0.8)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--border-glass)",
      }}
    >
      {/* Left: Title */}
      <div>
        <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
          {title}
        </h2>
        <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>
          {today}
        </p>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative w-9 h-9 rounded-xl flex items-center justify-center transition-all"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid var(--border-glass)",
            color: "var(--text-secondary)",
          }}
          title="Notificaciones"
        >
          <Bell size={16} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: "var(--accent-rose)" }}
          />
        </button>

        {/* User badge */}
        {profile && (
          <div
            className="flex items-center gap-2.5 px-3 py-2 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-glass)",
            }}
          >
            <div
              className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white" }}
            >
              {profile.nombre?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium leading-none" style={{ color: "var(--text-primary)" }}>
                {profile.nombre?.split(" ")[0]}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                {profile.rol === "admin" ? "Administrador" : "Vendedor"}
              </p>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
