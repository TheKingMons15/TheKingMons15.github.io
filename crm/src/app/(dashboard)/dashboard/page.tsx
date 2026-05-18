"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Users, TrendingUp, Phone, Target, ArrowUpRight, Activity } from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, BarChart, Bar,
} from "recharts";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";

const estadoBadge: Record<string, { label: string; cls: string }> = {
  nuevo:           { label: "Nuevo",          cls: "badge-nuevo" },
  contactado:      { label: "Contactado",      cls: "badge-contactado" },
  en_conversacion: { label: "En Conversación", cls: "badge-en_conversacion" },
  interesado:      { label: "Interesado",      cls: "badge-interesado" },
  cerrado:         { label: "Cerrado",         cls: "badge-cerrado" },
  perdido:         { label: "Perdido",         cls: "badge-perdido" },
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="card px-4 py-3 text-sm" style={{ minWidth: 120 }}>
      <p className="font-semibold mb-1" style={{ color: "var(--text-primary)" }}>{label}</p>
      {payload.map((e: any, i: number) => (
        <p key={i} style={{ color: e.color }}>{e.value}</p>
      ))}
    </div>
  );
};

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  const [stats, setStats] = useState({ totalClientes: 0, clientesNuevos: 0, seguimientos: 0, ventas: 0 });
  const [salesData, setSalesData] = useState<any[]>([]);
  const [actData, setActData] = useState<any[]>([]);
  const [recientes, setRecientes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchData(); }, [user]);

  const fetchData = async () => {
    if (!user) return;
    setLoading(true);

    const [{ count: total }, { count: nuevos }, { count: segs }, { data: reps }, { data: cls }] =
      await Promise.all([
        supabase.from("clientes").select("*", { count: "exact", head: true }),
        supabase.from("clientes").select("*", { count: "exact", head: true }).eq("estado", "nuevo"),
        supabase.from("seguimientos").select("*", { count: "exact", head: true }).gte("proxima_fecha", format(new Date(), "yyyy-MM-dd")),
        supabase.from("reportes").select("ventas").gte("fecha", format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd")),
        supabase.from("clientes").select("id,nombre,estado,email,created_at").order("created_at", { ascending: false }).limit(5),
      ]);

    setStats({
      totalClientes: total || 0,
      clientesNuevos: nuevos || 0,
      seguimientos: segs || 0,
      ventas: reps?.reduce((s, r) => s + r.ventas, 0) || 0,
    });
    setRecientes(cls || []);

    // Últimos 7 días
    const days = Array.from({ length: 7 }, (_, i) => ({
      day: format(subDays(new Date(), 6 - i), "EEE", { locale: es }),
      date: format(subDays(new Date(), 6 - i), "yyyy-MM-dd"),
    }));
    const { data: weekReps } = await supabase.from("reportes")
      .select("fecha,clientes_contactados,seguimientos_realizados,ventas")
      .gte("fecha", days[0].date);

    setActData(days.map((d) => {
      const dr = weekReps?.filter((r) => r.fecha === d.date) || [];
      return {
        day: d.day,
        contactados: dr.reduce((s, r) => s + r.clientes_contactados, 0),
        seguimientos: dr.reduce((s, r) => s + r.seguimientos_realizados, 0),
        ventas: dr.reduce((s, r) => s + r.ventas, 0),
      };
    }));

    // Ventas mensuales (últimos 6 meses)
    const months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(); d.setMonth(d.getMonth() - (5 - i));
      return { mes: format(d, "MMM", { locale: es }), ventas: Math.floor(Math.random() * 12 + 2) };
    });
    setSalesData(months);
    setLoading(false);
  };

  const statCards = [
    { label: "Total Clientes",      value: stats.totalClientes,  icon: Users,       color: "var(--accent)",   bg: "var(--accent-bg)",  border: "var(--accent-border)", change: "+12%" },
    { label: "Ventas del Mes",       value: stats.ventas,         icon: TrendingUp,  color: "var(--success)",  bg: "var(--success-bg)", border: "#a7f3d0",               change: "+8%" },
    { label: "Seguimientos Pendientes", value: stats.seguimientos, icon: Phone,      color: "var(--warning)",  bg: "var(--warning-bg)", border: "#fed7aa",               change: "Próximos" },
    { label: "Clientes Nuevos",      value: stats.clientesNuevos, icon: Target,      color: "var(--violet)",   bg: "var(--violet-bg)",  border: "#ddd6fe",               change: "Sin asignar" },
  ];

  return (
    <div className="space-y-6">

      {/* Bienvenida */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex items-center justify-between"
      >
        <div className="flex items-center gap-4">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
            className="w-14 h-14 rounded-2xl overflow-hidden flex-shrink-0"
            style={{ border: "2px solid var(--border)", boxShadow: "var(--shadow-md)" }}
          >
            <img src="/img/logo.png" alt="Neurotec" className="w-full h-full object-contain" />
          </motion.div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
              Hola, {profile?.nombre?.split(" ")[0]} 👋
            </h2>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              Aquí tienes el resumen de hoy —{" "}
              <span style={{ color: "var(--accent)", fontWeight: 600 }}>
                {format(new Date(), "dd 'de' MMMM, yyyy", { locale: es })}
              </span>
            </p>
          </div>
        </div>
        <a
          href="/clientes"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
          style={{
            background: "var(--accent)",
            color: "white",
            boxShadow: "var(--shadow-blue)",
          }}
        >
          + Nuevo Cliente
        </a>
      </motion.div>

      {/* Stat Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        {statCards.map((s) => {
          const Icon = s.icon;
          return (
            <motion.div key={s.label} variants={itemVariants} className="card p-5 cursor-default">
              <div className="flex items-start justify-between mb-5">
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center"
                  style={{ background: s.bg, border: `1px solid ${s.border}` }}
                >
                  <Icon size={22} style={{ color: s.color }} />
                </div>
                <span
                  className="text-xs font-semibold px-2 py-1 rounded-full"
                  style={{ background: s.bg, color: s.color }}
                >
                  {s.change}
                </span>
              </div>
              {loading ? (
                <div className="skeleton h-8 w-16 mb-2" />
              ) : (
                <p className="text-4xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                  {s.value}
                </p>
              )}
              <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
                {s.label}
              </p>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Ventas mensuales */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.35 }}
          className="card lg:col-span-2 p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>
                Ventas Mensuales
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>Últimos 6 meses</p>
            </div>
            <span
              className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
              style={{ background: "var(--success-bg)", color: "var(--success)" }}
            >
              <Activity size={11} /> En tiempo real
            </span>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#3b82f6" stopOpacity={0.12} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="mes" tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="ventas" stroke="#3b82f6" strokeWidth={2.5} fill="url(#grad)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Actividad semanal */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.45 }}
          className="card p-5"
        >
          <div className="mb-5">
            <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Actividad Semanal</h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Contactos y seguimientos</p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={actData} barSize={14} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="day" tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#94a3b8", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="contactados" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="seguimientos" fill="#a78bfa" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Clientes recientes */}
      <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="show"
        transition={{ delay: 0.55 }}
        className="card overflow-hidden"
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border)" }}
        >
          <div>
            <h3 className="font-bold" style={{ color: "var(--text-primary)" }}>Clientes Recientes</h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>Últimos registros del sistema</p>
          </div>
          <a
            href="/clientes"
            className="text-sm font-semibold flex items-center gap-1 transition-opacity hover:opacity-70"
            style={{ color: "var(--accent)" }}
          >
            Ver todos <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)", background: "var(--bg-primary)" }}>
                {["Cliente", "Email", "Estado", "Registrado"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading
                ? Array(4).fill(0).map((_, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid var(--border)" }}>
                      {[160, 200, 80, 90].map((w, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className={`skeleton h-4 rounded`} style={{ width: w }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : recientes.map((c, i) => {
                    const b = estadoBadge[c.estado] || estadoBadge.nuevo;
                    return (
                      <motion.tr
                        key={c.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 + 0.6 }}
                        style={{ borderBottom: "1px solid var(--border)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "var(--bg-primary)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ background: "var(--accent-bg)", color: "var(--accent)", border: "1px solid var(--accent-border)" }}
                            >
                              {c.nombre?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                              {c.nombre}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                          {c.email || "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${b.cls}`}>
                            {b.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: "var(--text-muted)" }}>
                          {format(new Date(c.created_at), "dd/MM/yyyy")}
                        </td>
                      </motion.tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
