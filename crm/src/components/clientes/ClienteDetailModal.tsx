"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Cliente, Seguimiento, ClienteEstado } from "@/lib/types";
import { format } from "date-fns";
import { X, Phone, MessageSquare, Video, Mail, Calendar, Clock } from "lucide-react";

interface Props {
  cliente: Cliente;
  onClose: () => void;
}

const estadoConfig: Record<ClienteEstado, { label: string; color: string; bg: string }> = {
  nuevo: { label: "Nuevo", color: "#60a5fa", bg: "rgba(59,130,246,0.15)" },
  contactado: { label: "Contactado", color: "#a78bfa", bg: "rgba(139,92,246,0.15)" },
  en_conversacion: { label: "En Conversación", color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  interesado: { label: "Interesado", color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
  cerrado: { label: "Cerrado", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  perdido: { label: "Perdido", color: "#f87171", bg: "rgba(248,113,113,0.15)" },
};

const tipoIcons: Record<string, any> = {
  llamada: Phone,
  whatsapp: MessageSquare,
  reunion: Video,
  correo: Mail,
};

export default function ClienteDetailModal({ cliente, onClose }: Props) {
  const supabase = createClient();
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
  const badge = estadoConfig[cliente.estado];

  useEffect(() => {
    const fetchSeguimientos = async () => {
      const { data } = await supabase
        .from("seguimientos")
        .select("*, vendedor:usuarios(nombre)")
        .eq("cliente_id", cliente.id)
        .order("created_at", { ascending: false });
      setSeguimientos(data || []);
    };
    fetchSeguimientos();
  }, [cliente.id]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 40 }}
          className="w-full max-w-lg glass rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.7)", maxHeight: "85vh" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid var(--border-glass)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-lg font-bold"
                style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white" }}
              >
                {cliente.nombre.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  {cliente.nombre}
                </h3>
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-medium"
                  style={{ background: badge.bg, color: badge.color }}
                >
                  {badge.label}
                </span>
              </div>
            </div>
            <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
              <X size={20} />
            </button>
          </div>

          <div className="overflow-y-auto" style={{ maxHeight: "calc(85vh - 80px)" }}>
            {/* Info */}
            <div className="p-6 space-y-3">
              {[
                { label: "Teléfono", value: cliente.telefono, icon: Phone },
                { label: "Email", value: cliente.email, icon: Mail },
                { label: "Último Contacto", value: cliente.ultimo_contacto ? format(new Date(cliente.ultimo_contacto), "dd/MM/yyyy") : null, icon: Calendar },
                { label: "Registrado", value: format(new Date(cliente.created_at), "dd/MM/yyyy HH:mm"), icon: Clock },
              ].map(({ label, value, icon: Icon }) => (
                <div key={label} className="flex items-center gap-3">
                  <Icon size={15} style={{ color: "var(--text-muted)" }} />
                  <span className="text-sm" style={{ color: "var(--text-secondary)" }}>{label}:</span>
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                    {value || "—"}
                  </span>
                </div>
              ))}

              {cliente.observaciones && (
                <div
                  className="mt-4 p-4 rounded-xl"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)" }}
                >
                  <p className="text-xs font-medium mb-2" style={{ color: "var(--text-muted)" }}>OBSERVACIONES</p>
                  <p className="text-sm" style={{ color: "var(--text-secondary)" }}>{cliente.observaciones}</p>
                </div>
              )}
            </div>

            {/* Historial de Seguimientos */}
            <div style={{ borderTop: "1px solid var(--border-glass)" }}>
              <div className="px-6 py-4">
                <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                  Historial de Seguimientos ({seguimientos.length})
                </h4>
              </div>
              <div className="px-6 pb-6 space-y-3">
                {seguimientos.length === 0 ? (
                  <p className="text-sm text-center py-4" style={{ color: "var(--text-muted)" }}>
                    Sin seguimientos registrados
                  </p>
                ) : (
                  seguimientos.map((seg) => {
                    const Icon = tipoIcons[seg.tipo] || Phone;
                    return (
                      <div
                        key={seg.id}
                        className="flex gap-3 p-3 rounded-xl"
                        style={{ background: "rgba(255,255,255,0.03)", border: "1px solid var(--border-glass)" }}
                      >
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "rgba(59,130,246,0.15)" }}
                        >
                          <Icon size={14} style={{ color: "var(--accent-blue)" }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold capitalize" style={{ color: "var(--text-primary)" }}>
                              {seg.tipo}
                            </span>
                            <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                              {format(new Date(seg.created_at), "dd/MM/yyyy")}
                            </span>
                          </div>
                          {seg.comentarios && (
                            <p className="text-xs" style={{ color: "var(--text-secondary)" }}>{seg.comentarios}</p>
                          )}
                          {seg.proxima_fecha && (
                            <p className="text-xs mt-1" style={{ color: "var(--accent-amber)" }}>
                              📅 Próximo: {format(new Date(seg.proxima_fecha), "dd/MM/yyyy")}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
