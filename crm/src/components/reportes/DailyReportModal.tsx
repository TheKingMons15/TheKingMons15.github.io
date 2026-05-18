"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { format } from "date-fns";
import { FileText, X, AlertTriangle } from "lucide-react";

interface Props {
  onClose: () => void;
}

export default function DailyReportModal({ onClose }: Props) {
  const { user } = useAuth();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    clientes_contactados: 0,
    seguimientos_realizados: 0,
    ventas: 0,
    problemas: "",
    objetivos: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const { error } = await supabase.from("reportes").insert({
      vendedor_id: user.id,
      fecha: format(new Date(), "yyyy-MM-dd"),
      ...form,
    });

    if (error) {
      toast.error("Error al guardar el reporte");
    } else {
      toast.success("✅ Reporte diario guardado correctamente");
      onClose();
    }

    setLoading(false);
  };

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border-glass)",
    color: "var(--text-primary)",
    borderRadius: "10px",
    padding: "10px 14px",
    fontSize: "14px",
    width: "100%",
    outline: "none",
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="w-full max-w-lg glass rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.7), 0 0 0 1px rgba(59,130,246,0.2)" }}
        >
          {/* Header */}
          <div
            className="px-6 py-4 flex items-center gap-3"
            style={{
              background: "linear-gradient(135deg, rgba(245,158,11,0.15), rgba(239,68,68,0.1))",
              borderBottom: "1px solid var(--border-glass)",
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(245,158,11,0.2)", border: "1px solid rgba(245,158,11,0.3)" }}
            >
              <AlertTriangle size={20} style={{ color: "#f59e0b" }} />
            </div>
            <div className="flex-1">
              <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
                Reporte Diario Obligatorio
              </h3>
              <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {format(new Date(), "dd/MM/yyyy")} · Debe completarse antes de continuar
              </p>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Clientes Contactados", key: "clientes_contactados" },
                { label: "Seguimientos", key: "seguimientos_realizados" },
                { label: "Ventas Cerradas", key: "ventas" },
              ].map(({ label, key }) => (
                <div key={key}>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    {label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={form[key as keyof typeof form] as number}
                    onChange={(e) => setForm({ ...form, [key]: parseInt(e.target.value) || 0 })}
                    style={inputStyle}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Problemas o dificultades del día
              </label>
              <textarea
                value={form.problemas}
                onChange={(e) => setForm({ ...form, problemas: e.target.value })}
                rows={2}
                placeholder="Describe los problemas encontrados..."
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>

            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Objetivos para mañana
              </label>
              <textarea
                value={form.objetivos}
                onChange={(e) => setForm({ ...form, objetivos: e.target.value })}
                rows={2}
                placeholder="¿Cuáles son tus objetivos para mañana?"
                style={{ ...inputStyle, resize: "none" }}
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(59,130,246,0.4)",
                }}
              >
                <FileText size={16} />
                {loading ? "Guardando..." : "Enviar Reporte Diario"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-3 rounded-xl text-sm transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid var(--border-glass)",
                  color: "var(--text-secondary)",
                }}
              >
                Luego
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
