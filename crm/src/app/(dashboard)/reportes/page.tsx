"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Reporte } from "@/lib/types";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FileText, Calendar, TrendingUp, Phone, AlertCircle, Plus } from "lucide-react";
import DailyReportModal from "@/components/reportes/DailyReportModal";

export default function ReportesPage() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  const [reportes, setReportes] = useState<Reporte[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [todayReport, setTodayReport] = useState<Reporte | null>(null);

  useEffect(() => {
    fetchReportes();
  }, [user]);

  const fetchReportes = async () => {
    if (!user) return;
    setLoading(true);

    let query = supabase
      .from("reportes")
      .select("*, vendedor:usuarios(nombre, email)")
      .order("fecha", { ascending: false })
      .order("created_at", { ascending: false });

    if (profile?.rol === "vendedor") {
      query = query.eq("vendedor_id", user.id);
    }

    const { data } = await query.limit(50);
    setReportes(data || []);

    // Verificar reporte de hoy
    const today = format(new Date(), "yyyy-MM-dd");
    const hoy = data?.find((r) => r.fecha === today && r.vendedor_id === user.id);
    setTodayReport(hoy || null);

    setLoading(false);
  };

  const totales = reportes.reduce(
    (acc, r) => ({
      contactados: acc.contactados + r.clientes_contactados,
      seguimientos: acc.seguimientos + r.seguimientos_realizados,
      ventas: acc.ventas + r.ventas,
    }),
    { contactados: 0, seguimientos: 0, ventas: 0 }
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Reportes Diarios
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {reportes.length} reportes registrados
          </p>
        </div>
        {!todayReport && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #d97706)",
              color: "white",
              boxShadow: "0 4px 15px rgba(245,158,11,0.35)",
            }}
          >
            <Plus size={16} />
            Llenar Reporte de Hoy
          </motion.button>
        )}
      </div>

      {/* Alerta si no hay reporte */}
      {!todayReport && !loading && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 p-4 rounded-2xl"
          style={{
            background: "rgba(245,158,11,0.1)",
            border: "1px solid rgba(245,158,11,0.3)",
          }}
        >
          <AlertCircle size={20} style={{ color: "#f59e0b", flexShrink: 0 }} />
          <p className="text-sm" style={{ color: "#fbbf24" }}>
            <strong>¡Reporte pendiente!</strong> No has llenado tu reporte del día de hoy.
          </p>
          <button
            onClick={() => setShowModal(true)}
            className="ml-auto px-3 py-1.5 rounded-lg text-xs font-semibold"
            style={{ background: "rgba(245,158,11,0.2)", color: "#f59e0b" }}
          >
            Llenar ahora
          </button>
        </motion.div>
      )}

      {/* Totales */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Clientes Contactados", value: totales.contactados, icon: Phone, color: "#60a5fa", bg: "rgba(59,130,246,0.12)" },
          { label: "Seguimientos", value: totales.seguimientos, icon: Calendar, color: "#a78bfa", bg: "rgba(139,92,246,0.12)" },
          { label: "Ventas Totales", value: totales.ventas, icon: TrendingUp, color: "#10b981", bg: "rgba(16,185,129,0.12)" },
        ].map((s, i) => {
          const Icon = s.icon;
          return (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-2xl p-4"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: s.bg }}
              >
                <Icon size={18} style={{ color: s.color }} />
              </div>
              <p className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>{s.value}</p>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>{s.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Tabla de Reportes */}
      <div className="glass rounded-2xl overflow-hidden">
        <div
          className="px-6 py-4"
          style={{ borderBottom: "1px solid var(--border-glass)" }}
        >
          <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Historial de Reportes
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-glass)" }}>
                {["Fecha", profile?.rol === "admin" ? "Vendedor" : null, "Contactados", "Seguimientos", "Ventas", "Objetivos"].filter(Boolean).map((h) => (
                  <th
                    key={h}
                    className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border-glass)" }}>
                    {Array(5).fill(0).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="skeleton h-4 rounded w-20" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : reportes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center" style={{ color: "var(--text-muted)" }}>
                    <FileText size={40} className="mx-auto mb-3 opacity-30" />
                    <p>No hay reportes registrados</p>
                  </td>
                </tr>
              ) : (
                reportes.map((reporte, i) => (
                  <motion.tr
                    key={reporte.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    className="transition-colors"
                    style={{ borderBottom: "1px solid var(--border-glass)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-5 py-4">
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          {format(new Date(reporte.fecha), "dd/MM/yyyy")}
                        </p>
                        <p className="text-xs capitalize" style={{ color: "var(--text-muted)" }}>
                          {format(new Date(reporte.fecha), "EEEE", { locale: es })}
                        </p>
                      </div>
                    </td>
                    {profile?.rol === "admin" && (
                      <td className="px-5 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                        {(reporte.vendedor as any)?.nombre || "—"}
                      </td>
                    )}
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold" style={{ color: "#60a5fa" }}>
                        {reporte.clientes_contactados}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold" style={{ color: "#a78bfa" }}>
                        {reporte.seguimientos_realizados}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span className="text-sm font-bold" style={{ color: "#10b981" }}>
                        {reporte.ventas}
                      </span>
                    </td>
                    <td className="px-5 py-4 max-w-xs">
                      <p className="text-xs truncate" style={{ color: "var(--text-secondary)" }}>
                        {reporte.objetivos || "—"}
                      </p>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showModal && (
        <DailyReportModal onClose={() => { setShowModal(false); fetchReportes(); }} />
      )}
    </div>
  );
}
