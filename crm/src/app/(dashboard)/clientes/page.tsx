"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { Cliente, ClienteEstado } from "@/lib/types";
import { format } from "date-fns";
import toast from "react-hot-toast";
import {
  Plus, Search, Filter, Edit2, Trash2, Eye,
  Phone, Mail, User, ChevronDown, X
} from "lucide-react";
import ClienteModal from "@/components/clientes/ClienteModal";
import ClienteDetailModal from "@/components/clientes/ClienteDetailModal";

const estadoConfig: Record<ClienteEstado, { label: string; color: string; bg: string }> = {
  nuevo: { label: "Nuevo", color: "#60a5fa", bg: "rgba(59,130,246,0.15)" },
  contactado: { label: "Contactado", color: "#a78bfa", bg: "rgba(139,92,246,0.15)" },
  en_conversacion: { label: "En Conversación", color: "#34d399", bg: "rgba(52,211,153,0.15)" },
  interesado: { label: "Interesado", color: "#fbbf24", bg: "rgba(251,191,36,0.15)" },
  cerrado: { label: "Cerrado", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
  perdido: { label: "Perdido", color: "#f87171", bg: "rgba(248,113,113,0.15)" },
};

export default function ClientesPage() {
  const supabase = createClient();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [estadoFilter, setEstadoFilter] = useState<string>("todos");
  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [viewingCliente, setViewingCliente] = useState<Cliente | null>(null);

  useEffect(() => {
    fetchClientes();
  }, [estadoFilter]);

  const fetchClientes = async () => {
    setLoading(true);
    let query = supabase
      .from("clientes")
      .select("*, vendedor:usuarios(id, nombre, email)")
      .order("created_at", { ascending: false });

    if (estadoFilter !== "todos") {
      query = query.eq("estado", estadoFilter);
    }

    const { data, error } = await query;
    if (!error) setClientes(data || []);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Estás seguro de eliminar este cliente?")) return;
    const { error } = await supabase.from("clientes").delete().eq("id", id);
    if (error) {
      toast.error("Error al eliminar el cliente");
    } else {
      toast.success("Cliente eliminado");
      fetchClientes();
    }
  };

  const filtered = clientes.filter((c) =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    (c.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (c.telefono || "").includes(search)
  );

  const inputStyle = {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid var(--border-glass)",
    color: "var(--text-primary)",
    borderRadius: "10px",
    padding: "9px 14px 9px 38px",
    fontSize: "14px",
    outline: "none",
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Clientes
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            {filtered.length} clientes encontrados
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setEditingCliente(null); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            color: "white",
            boxShadow: "0 4px 15px rgba(59,130,246,0.35)",
          }}
        >
          <Plus size={16} />
          Nuevo Cliente
        </motion.button>
      </div>

      {/* Filters */}
      <div className="glass rounded-2xl p-4 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <input
            type="text"
            placeholder="Buscar por nombre, email o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={inputStyle}
            className="w-full"
          />
        </div>

        {/* Estado filter */}
        <div className="relative">
          <Filter size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
          <select
            value={estadoFilter}
            onChange={(e) => setEstadoFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 rounded-xl text-sm outline-none appearance-none"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid var(--border-glass)",
              color: "var(--text-primary)",
              cursor: "pointer",
            }}
          >
            <option value="todos" style={{ background: "#0f1e35" }}>Todos los estados</option>
            {Object.entries(estadoConfig).map(([key, val]) => (
              <option key={key} value={key} style={{ background: "#0f1e35" }}>{val.label}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: "var(--text-muted)" }} />
        </div>
      </div>

      {/* Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-glass)" }}>
                {["Cliente", "Teléfono", "Email", "Estado", "Último Contacto", "Vendedor", "Acciones"].map((h) => (
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
                    {Array(7).fill(0).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="skeleton h-4 rounded" style={{ width: j === 0 ? "160px" : "100px" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center" style={{ color: "var(--text-muted)" }}>
                    <User size={40} className="mx-auto mb-3 opacity-30" />
                    <p>No se encontraron clientes</p>
                  </td>
                </tr>
              ) : (
                filtered.map((cliente, i) => {
                  const badge = estadoConfig[cliente.estado];
                  return (
                    <motion.tr
                      key={cliente.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className="transition-colors group"
                      style={{ borderBottom: "1px solid var(--border-glass)" }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                            style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white" }}
                          >
                            {cliente.nombre.charAt(0).toUpperCase()}
                          </div>
                          <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                            {cliente.nombre}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                        {cliente.telefono || "—"}
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                        {cliente.email || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className="px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap"
                          style={{ background: badge.bg, color: badge.color }}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: "var(--text-muted)" }}>
                        {cliente.ultimo_contacto
                          ? format(new Date(cliente.ultimo_contacto), "dd/MM/yyyy")
                          : "—"}
                      </td>
                      <td className="px-5 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                        {(cliente.vendedor as any)?.nombre || "Sin asignar"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setViewingCliente(cliente)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: "var(--accent-blue-light)" }}
                            title="Ver detalle"
                          >
                            <Eye size={15} />
                          </button>
                          <button
                            onClick={() => { setEditingCliente(cliente); setShowModal(true); }}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: "var(--accent-amber)" }}
                            title="Editar"
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            onClick={() => handleDelete(cliente.id)}
                            className="p-1.5 rounded-lg transition-colors"
                            style={{ color: "var(--accent-rose)" }}
                            title="Eliminar"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal crear/editar */}
      {showModal && (
        <ClienteModal
          cliente={editingCliente}
          onClose={() => { setShowModal(false); setEditingCliente(null); }}
          onSaved={fetchClientes}
        />
      )}

      {/* Modal detalle */}
      {viewingCliente && (
        <ClienteDetailModal
          cliente={viewingCliente}
          onClose={() => setViewingCliente(null)}
        />
      )}
    </div>
  );
}
