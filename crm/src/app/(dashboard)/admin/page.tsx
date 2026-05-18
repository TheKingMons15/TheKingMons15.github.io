"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Usuario, UserRole } from "@/lib/types";
import toast from "react-hot-toast";
import { format } from "date-fns";
import {
  Users, UserPlus, Shield, User, Power, Edit2,
  X, Save, Mail, Eye, EyeOff, Check
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { profile } = useAuth();
  const router = useRouter();
  const supabase = createClient();
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<Usuario | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "vendedor" as UserRole,
    activo: true,
  });

  useEffect(() => {
    // Solo admin puede acceder
    if (profile && profile.rol !== "admin") {
      router.push("/dashboard");
      return;
    }
    fetchUsuarios();
  }, [profile]);

  const fetchUsuarios = async () => {
    setLoading(true);
    const { data } = await supabase
      .from("usuarios")
      .select("*")
      .order("created_at", { ascending: false });
    setUsuarios(data || []);
    setLoading(false);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormLoading(true);

    if (!editingUser) {
      // Crear usuario via Supabase Admin API (necesita service role)
      // En producción usar una API route
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
      });

      if (authError) {
        toast.error(authError.message);
        setFormLoading(false);
        return;
      }

      if (authData.user) {
        const { error } = await supabase.from("usuarios").insert({
          id: authData.user.id,
          nombre: form.nombre,
          email: form.email,
          rol: form.rol,
          activo: form.activo,
        });

        if (error) toast.error("Error al crear usuario en la base de datos");
        else toast.success("Usuario creado exitosamente");
      }
    } else {
      // Editar usuario existente
      const { error } = await supabase
        .from("usuarios")
        .update({ nombre: form.nombre, rol: form.rol, activo: form.activo })
        .eq("id", editingUser.id);

      if (error) toast.error("Error al actualizar usuario");
      else toast.success("Usuario actualizado");
    }

    setShowModal(false);
    setEditingUser(null);
    setForm({ nombre: "", email: "", password: "", rol: "vendedor", activo: true });
    fetchUsuarios();
    setFormLoading(false);
  };

  const toggleActivo = async (usuario: Usuario) => {
    const { error } = await supabase
      .from("usuarios")
      .update({ activo: !usuario.activo })
      .eq("id", usuario.id);

    if (error) toast.error("Error al cambiar estado");
    else {
      toast.success(usuario.activo ? "Usuario desactivado" : "Usuario activado");
      fetchUsuarios();
    }
  };

  const openEdit = (usuario: Usuario) => {
    setEditingUser(usuario);
    setForm({
      nombre: usuario.nombre,
      email: usuario.email,
      password: "",
      rol: usuario.rol,
      activo: usuario.activo,
    });
    setShowModal(true);
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

  if (profile?.rol !== "admin") {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <Shield size={48} className="mx-auto mb-3 opacity-30" style={{ color: "var(--text-muted)" }} />
          <p style={{ color: "var(--text-muted)" }}>Acceso restringido</p>
        </div>
      </div>
    );
  }

  // Stats
  const totalVendedores = usuarios.filter((u) => u.rol === "vendedor").length;
  const totalAdmins = usuarios.filter((u) => u.rol === "admin").length;
  const usuariosActivos = usuarios.filter((u) => u.activo).length;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
            Panel Administrativo
          </h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
            Gestión de usuarios y accesos
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => { setEditingUser(null); setForm({ nombre: "", email: "", password: "", rol: "vendedor", activo: true }); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold"
          style={{
            background: "linear-gradient(135deg, #3b82f6, #1d4ed8)",
            color: "white",
            boxShadow: "0 4px 15px rgba(59,130,246,0.35)",
          }}
        >
          <UserPlus size={16} />
          Nuevo Usuario
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Usuarios", value: usuarios.length, icon: Users, color: "#60a5fa", bg: "rgba(59,130,246,0.12)" },
          { label: "Activos", value: usuariosActivos, icon: Check, color: "#10b981", bg: "rgba(16,185,129,0.12)" },
          { label: "Administradores", value: totalAdmins, icon: Shield, color: "#a78bfa", bg: "rgba(139,92,246,0.12)" },
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

      {/* Users Table */}
      <div className="glass rounded-2xl overflow-hidden">
        <div
          className="px-6 py-4"
          style={{ borderBottom: "1px solid var(--border-glass)" }}
        >
          <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Usuarios del Sistema
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-glass)" }}>
                {["Usuario", "Email", "Rol", "Estado", "Registrado", "Acciones"].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-medium uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(4).fill(0).map((_, i) => (
                  <tr key={i} style={{ borderBottom: "1px solid var(--border-glass)" }}>
                    {Array(6).fill(0).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="skeleton h-4 rounded w-24" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                usuarios.map((usuario, i) => (
                  <motion.tr
                    key={usuario.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="transition-colors group"
                    style={{ borderBottom: "1px solid var(--border-glass)" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                  >
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                          style={{
                            background: usuario.rol === "admin"
                              ? "linear-gradient(135deg, #8b5cf6, #7c3aed)"
                              : "linear-gradient(135deg, #3b82f6, #1d4ed8)",
                            color: "white",
                          }}
                        >
                          {usuario.nombre?.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                          {usuario.nombre}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                      {usuario.email}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1 w-fit"
                        style={{
                          background: usuario.rol === "admin" ? "rgba(139,92,246,0.15)" : "rgba(59,130,246,0.15)",
                          color: usuario.rol === "admin" ? "#a78bfa" : "#60a5fa",
                        }}
                      >
                        {usuario.rol === "admin" ? <Shield size={10} /> : <User size={10} />}
                        {usuario.rol === "admin" ? "Admin" : "Vendedor"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className="px-2.5 py-1 rounded-full text-xs font-medium"
                        style={{
                          background: usuario.activo ? "rgba(16,185,129,0.15)" : "rgba(244,63,94,0.15)",
                          color: usuario.activo ? "#10b981" : "#f87171",
                        }}
                      >
                        {usuario.activo ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-sm" style={{ color: "var(--text-muted)" }}>
                      {format(new Date(usuario.created_at), "dd/MM/yyyy")}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openEdit(usuario)}
                          className="p-1.5 rounded-lg"
                          style={{ color: "var(--accent-amber)" }}
                          title="Editar"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => toggleActivo(usuario)}
                          className="p-1.5 rounded-lg"
                          style={{ color: usuario.activo ? "var(--accent-rose)" : "var(--accent-emerald)" }}
                          title={usuario.activo ? "Desactivar" : "Activar"}
                        >
                          <Power size={15} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
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
                  {editingUser ? "Editar Usuario" : "Nuevo Usuario"}
                </h3>
                <button onClick={() => setShowModal(false)} style={{ color: "var(--text-muted)" }}>
                  <X size={20} />
                </button>
              </div>

              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    Nombre completo *
                  </label>
                  <input
                    required
                    type="text"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    placeholder="Juan Pérez"
                    style={inputStyle}
                  />
                </div>

                {!editingUser && (
                  <>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                        Email *
                      </label>
                      <input
                        required
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        placeholder="usuario@neurotec.com"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                        Contraseña *
                      </label>
                      <div className="relative">
                        <input
                          required
                          type={showPassword ? "text" : "password"}
                          value={form.password}
                          onChange={(e) => setForm({ ...form, password: e.target.value })}
                          placeholder="Mínimo 8 caracteres"
                          style={{ ...inputStyle, paddingRight: "40px" }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-xs font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    Rol
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { value: "vendedor", label: "Vendedor", icon: User, color: "#60a5fa", bg: "rgba(59,130,246,0.15)" },
                      { value: "admin", label: "Administrador", icon: Shield, color: "#a78bfa", bg: "rgba(139,92,246,0.15)" },
                    ].map((rol) => {
                      const Icon = rol.icon;
                      return (
                        <button
                          key={rol.value}
                          type="button"
                          onClick={() => setForm({ ...form, rol: rol.value as UserRole })}
                          className="flex items-center gap-2 p-3 rounded-xl text-sm font-medium transition-all"
                          style={{
                            background: form.rol === rol.value ? rol.bg : "rgba(255,255,255,0.03)",
                            border: `1px solid ${form.rol === rol.value ? rol.color + "50" : "var(--border-glass)"}`,
                            color: form.rol === rol.value ? rol.color : "var(--text-muted)",
                          }}
                        >
                          <Icon size={15} />
                          {rol.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
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
                    {formLoading ? "Guardando..." : editingUser ? "Actualizar" : "Crear Usuario"}
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
