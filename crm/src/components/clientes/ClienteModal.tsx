"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Cliente, ClienteEstado, Usuario } from "@/lib/types";
import { useAuth } from "@/contexts/AuthContext";
import toast from "react-hot-toast";
import { X, Save, User } from "lucide-react";

interface Props {
  cliente: Cliente | null;
  onClose: () => void;
  onSaved: () => void;
}

const estados: ClienteEstado[] = [
  "nuevo", "contactado", "en_conversacion", "interesado", "cerrado", "perdido"
];

const estadoLabels: Record<ClienteEstado, string> = {
  nuevo: "Nuevo",
  contactado: "Contactado",
  en_conversacion: "En Conversación",
  interesado: "Interesado",
  cerrado: "Cerrado",
  perdido: "Perdido",
};

export default function ClienteModal({ cliente, onClose, onSaved }: Props) {
  const { profile } = useAuth();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [vendedores, setVendedores] = useState<Pick<Usuario, "id" | "nombre" | "email">[]>([]);
  const [form, setForm] = useState({
    nombre: cliente?.nombre || "",
    telefono: cliente?.telefono || "",
    email: cliente?.email || "",
    estado: cliente?.estado || "nuevo" as ClienteEstado,
    observaciones: cliente?.observaciones || "",
    vendedor_id: cliente?.vendedor_id || "",
    ultimo_contacto: cliente?.ultimo_contacto || "",
  });

  useEffect(() => {
    if (profile?.rol === "admin") {
      fetchVendedores();
    }
  }, [profile]);

  const fetchVendedores = async () => {
    const { data } = await supabase
      .from("usuarios")
      .select("id, nombre, email")
      .eq("activo", true);
    setVendedores(data || []);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...form,
      vendedor_id: form.vendedor_id || null,
      ultimo_contacto: form.ultimo_contacto || null,
      updated_at: new Date().toISOString(),
    };

    let error;
    if (cliente) {
      ({ error } = await supabase.from("clientes").update(payload).eq("id", cliente.id));
    } else {
      ({ error } = await supabase.from("clientes").insert(payload));
    }

    if (error) {
      toast.error("Error al guardar el cliente");
    } else {
      toast.success(cliente ? "Cliente actualizado" : "Cliente creado");
      onSaved();
      onClose();
    }

    setLoading(false);
  };

  const inputClass = "w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all";
  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border-glass)",
    color: "var(--text-primary)",
  };

  const LabelInput = ({ label, children }: { label: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
        {label}
      </label>
      {children}
    </div>
  );

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)" }}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="w-full max-w-lg glass rounded-2xl overflow-hidden"
          style={{ boxShadow: "0 25px 50px rgba(0,0,0,0.7)" }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ borderBottom: "1px solid var(--border-glass)" }}
          >
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(59,130,246,0.15)" }}
              >
                <User size={18} style={{ color: "var(--accent-blue)" }} />
              </div>
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                {cliente ? "Editar Cliente" : "Nuevo Cliente"}
              </h3>
            </div>
            <button onClick={onClose} style={{ color: "var(--text-muted)" }}>
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <LabelInput label="Nombre completo *">
                  <input
                    required
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Juan Pérez"
                    className={inputClass}
                    style={inputStyle}
                  />
                </LabelInput>
              </div>

              <LabelInput label="Teléfono">
                <input
                  type="tel"
                  value={form.telefono}
                  onChange={(e) => setForm({ ...form, telefono: e.target.value })}
                  placeholder="+593 99..."
                  className={inputClass}
                  style={inputStyle}
                />
              </LabelInput>

              <LabelInput label="Email">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="juan@email.com"
                  className={inputClass}
                  style={inputStyle}
                />
              </LabelInput>

              <LabelInput label="Estado">
                <select
                  value={form.estado}
                  onChange={(e) => setForm({ ...form, estado: e.target.value as ClienteEstado })}
                  className={inputClass}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  {estados.map((e) => (
                    <option key={e} value={e} style={{ background: "#0f1e35" }}>
                      {estadoLabels[e]}
                    </option>
                  ))}
                </select>
              </LabelInput>

              <LabelInput label="Último Contacto">
                <input
                  type="date"
                  value={form.ultimo_contacto}
                  onChange={(e) => setForm({ ...form, ultimo_contacto: e.target.value })}
                  className={inputClass}
                  style={inputStyle}
                />
              </LabelInput>

              {profile?.rol === "admin" && (
                <div className="col-span-2">
                  <LabelInput label="Vendedor Asignado">
                    <select
                      value={form.vendedor_id}
                      onChange={(e) => setForm({ ...form, vendedor_id: e.target.value })}
                      className={inputClass}
                      style={{ ...inputStyle, cursor: "pointer" }}
                    >
                      <option value="" style={{ background: "#0f1e35" }}>Sin asignar</option>
                      {vendedores.map((v) => (
                        <option key={v.id} value={v.id} style={{ background: "#0f1e35" }}>
                          {v.nombre}
                        </option>
                      ))}
                    </select>
                  </LabelInput>
                </div>
              )}

              <div className="col-span-2">
                <LabelInput label="Observaciones">
                  <textarea
                    value={form.observaciones}
                    onChange={(e) => setForm({ ...form, observaciones: e.target.value })}
                    rows={3}
                    placeholder="Notas sobre el cliente..."
                    className={inputClass}
                    style={{ ...inputStyle, resize: "none" }}
                  />
                </LabelInput>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2"
                style={{
                  background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                  color: "white",
                  boxShadow: "0 4px 15px rgba(59,130,246,0.4)",
                }}
              >
                <Save size={15} />
                {loading ? "Guardando..." : "Guardar Cliente"}
              </button>
              <button
                type="button"
                onClick={onClose}
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
    </AnimatePresence>
  );
}
