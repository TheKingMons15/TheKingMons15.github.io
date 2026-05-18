"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Seguimiento, SeguimientoTipo, Cliente } from "@/lib/types";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  Plus, Phone, MessageSquare, Video, Mail,
  Calendar, X, Save, Search
} from "lucide-react";

const tipoConfig: Record<SeguimientoTipo, { label: string; icon: any; color: string; bg: string }> = {
  llamada: { label: "Llamada", icon: Phone, color: "#60a5fa", bg: "rgba(59,130,246,0.15)" },
  whatsapp: { label: "WhatsApp", icon: MessageSquare, color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  reunion: { label: "Reunión", icon: Video, color: "#a78bfa", bg: "rgba(139,92,246,0.15)" },
  correo: { label: "Correo", icon: Mail, color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
};

export default function SeguimientosPage() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  const [seguimientos, setSeguimientos] = useState<Seguimiento[]>([]);
  const [clientes, setClientes] = useState<Pick<Cliente, "id" | "nombre">[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({
    cliente_id: "",
    tipo: "llamada" as SeguimientoTipo,
    comentarios: "",
    proxima_fecha: "",
  });
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    // Seguimientos
    let sqQuery = supabase
      .from("seguimientos")
      .select("*, cliente:clientes(id, nombre), vendedor:usuarios(id, nombre)")
      .order("created_at", { ascending: false });

    if (profile?.rol === "vendedor") {
      sqQuery = sqQuery.eq("vendedor_id", user.id);
    }

    const { data: segs } = await sqQuery;
    setSeguimientos(segs || []);

    // Clientes para el form
    let clQuery = supabase.from("clientes").select("id, nombre").order("nombre");
    if (profile?.rol === "vendedor") {
      clQuery = clQuery.eq("vendedor_id", user.id);
    }
    const { data: cls } = await clQuery;
    setClientes(cls || []);

    setLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setFormLoading(true);

    const { error } = await supabase.from("seguimientos").insert({
      ...form,
      vendedor_id: user.id,
      proxima_fecha: form.proxima_fecha || null,
    });

    if (error) {
      toast.error("Error al guardar el seguimiento");
    } else {
      toast.success("Seguimiento registrado");
      setShowModal(false);
      setForm({ cliente_id: "", tipo: "llamada", comentarios: "", proxima_fecha: "" });
      fetchData();
    }
    setFormLoading(false);
  };

  const filtered = seguimientos.filter((s) => {
    const nombre = (s.cliente as any)?.nombre?.toLowerCase() || "";
    return nombre.includes(search.toLowerCase());
  });

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
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Seguimientos
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {filtered.length} registros
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            color: "white",
            boxShadow: "0 4px 15px rgba(59,130,246,0.35)",
          }}
        >
          <Plus size={16} />
          Nuevo Seguimiento
        </motion.button>
      </div>

      {/* Search */}
      <div className="glass rounded-2xl p-4">
        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Buscar por cliente..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={inputStyle}
          />
        </div>
      </div>

      {/* Seguimientos Grid */}
      <div className="grid gap-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <div key={i} className="skeleton rounded-2xl h-24" />
          ))
        ) : filtered.length === 0 ? (
          <div className="glass rounded-2xl p-12 text-center">
            <Phone size={48} className="mx-auto mb-3 opacity-20" style={{ color: "var(--text-muted)" }} />
            <p style={{ color: "var(--text-muted)" }}>No hay seguimientos registrados</p>
          </div>
        ) : (
          filtered.map((seg, i) => {
            const tipo = tipoConfig[seg.tipo];
            const Icon = tipo.icon;
            return (
              <motion.div
                key={seg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="glass rounded-2xl p-4 glass-hover"
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: tipo.bg }}
                  >
                    <Icon size={18} style={{ color: tipo.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <h4 className="font-semibold text-sm" style={{ color: "var(--text-primary)" }}>
                          {(seg.cliente as any)?.nombre || "Cliente"}
                        </h4>
                        <span
                          className="text-xs px-2 py-0.5 rounded-full"
                          style={{ background: tipo.bg, color: tipo.color }}
                        >
                          {tipo.label}
                        </span>
                      </div>
                      <div className="text-right">
                        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                          {format(new Date(seg.created_at), "dd/MM/yyyy HH:mm")}
                        </p>
                        {seg.proxima_fecha && (
                          <p className="text-xs mt-1 flex items-center gap-1 justify-end" style={{ color: "#f59e0b" }}>
                            <Calendar size={11} />
                            Próximo: {format(new Date(seg.proxima_fecha), "dd/MM/yyyy")}
                          </p>
                        )}
                      </div>
                    </div>
                    {seg.comentarios && (
                      <p className="text-sm mt-2" style={{ color: "var(--text-secondary)" }}>
                        {seg.comentarios}
                      </p>
                    )}
                    {profile?.rol === "admin" && (
                      <p className="text-xs mt-2" style={{ color: "var(--text-muted)" }}>
                        Vendedor: {(seg.vendedor as any)?.nombre || "—"}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Modal Nuevo Seguimiento */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full max-w-md glass rounded-2xl overflow-hidden"
              style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.7)" }}
            >
              <div
                className="flex items-center justify-between px-6 py-4"
                style={{ borderBottom: "1px solid var(--border-glass)" }}
              >
                <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                  Nuevo Seguimiento
                </h3>
                <button onClick={() => setShowModal(false)} style={{ color: "var(--text-muted)" }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    Cliente *
                  </label>
                  <select
                    required
                    value={form.cliente_id}
                    onChange={(e) => setForm({ ...form, cliente_id: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="" style={{ background: "#0f1e35" }}>Seleccionar cliente...</option>
                    {clientes.map((c) => (
                      <option key={c.id} value={c.id} style={{ background: "#0f1e35" }}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    Tipo de Contacto
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {(Object.entries(tipoConfig) as [SeguimientoTipo, any][]).map(([key, val]) => {
                      const Icon = val.icon;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setForm({ ...form, tipo: key })}
                          className="flex flex-col items-center gap-1.5 p-3 rounded-xl text-xs font-medium transition-all"
                          style={{
                            background: form.tipo === key ? val.bg : "rgba(255,255,255,0.03)",
                            border: `1px solid ${form.tipo === key ? val.color + "50" : "var(--border-glass)"}`,
                            color: form.tipo === key ? val.color : "var(--text-muted)",
                          }}
                        >
                          <Icon size={16} />
                          {val.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    Próxima Fecha de Contacto
                  </label>
                  <input
                    type="date"
                    value={form.proxima_fecha}
                    onChange={(e) => setForm({ ...form, proxima_fecha: e.target.value })}
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    Comentarios
                  </label>
                  <textarea
                    value={form.comentarios}
                    onChange={(e) => setForm({ ...form, comentarios: e.target.value })}
                    rows={3}
                    placeholder="Notas del seguimiento..."
                    style={{ ...inputStyle, resize: "none" }}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                    style={{
                      background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                      color: "white",
                      boxShadow: "0 4px 15px rgba(59,130,246,0.4)",
                    }}
                  >
                    <Save size={15} />
                    {formLoading ? "Guardando..." : "Guardar"}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-2.5 rounded-xl text-sm"
                    style={{
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid var(--border-glass)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
