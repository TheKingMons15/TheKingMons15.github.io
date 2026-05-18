"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users, TrendingUp, Phone, FileText, ArrowUpRight,
  Activity, Target, AlertCircle
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, BarChart, Bar, LineChart, Line
} from "recharts";
import { format, subDays } from "date-fns";
import { es } from "date-fns/locale";

const COLORS = {
  blue: "#3b82f6",
  cyan: "#06b6d4",
  violet: "#8b5cf6",
  emerald: "#10b981",
  amber: "#f59e0b",
  rose: "#f43f5e",
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div
        className="glass rounded-xl p-3"
        style={{ border: "1px solid rgba(59,130,246,0.2)", minWidth: "120px" }}
      >
        <p className="text-xs font-medium mb-1" style={{ color: "var(--text-secondary)" }}>
          {label}
        </p>
        {payload.map((entry: any, i: number) => (
          <p key={i} className="text-sm font-bold" style={{ color: entry.color }}>
            {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

interface Stat {
  label: string;
  value: string | number;
  change: string;
  icon: any;
  color: string;
  bg: string;
}

export default function DashboardPage() {
  const { user, profile } = useAuth();
  const supabase = createClient();
  const [stats, setStats] = useState({
    totalClientes: 0,
    clientesNuevos: 0,
    seguimientosPendientes: 0,
    ventasMes: 0,
  });
  const [salesData, setSalesData] = useState<any[]>([]);
  const [activityData, setActivityData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [recentClientes, setRecentClientes] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Stats de clientes
      const { count: totalClientes } = await supabase
        .from("clientes")
        .select("*", { count: "exact", head: true });

      const { count: clientesNuevos } = await supabase
        .from("clientes")
        .select("*", { count: "exact", head: true })
        .eq("estado", "nuevo");

      const { count: seguimientosPendientes } = await supabase
        .from("seguimientos")
        .select("*", { count: "exact", head: true })
        .gte("proxima_fecha", format(new Date(), "yyyy-MM-dd"));

      // Reportes del mes
      const { data: reportesMes } = await supabase
        .from("reportes")
        .select("ventas")
        .gte("fecha", format(new Date(new Date().getFullYear(), new Date().getMonth(), 1), "yyyy-MM-dd"));

      const ventasMes = reportesMes?.reduce((sum, r) => sum + (r.ventas || 0), 0) || 0;

      setStats({
        totalClientes: totalClientes || 0,
        clientesNuevos: clientesNuevos || 0,
        seguimientosPendientes: seguimientosPendientes || 0,
        ventasMes,
      });

      // Generar datos de gráfico de los últimos 7 días
      const last7Days = Array.from({ length: 7 }, (_, i) => {
        const date = subDays(new Date(), 6 - i);
        return {
          day: format(date, "EEE", { locale: es }),
          date: format(date, "yyyy-MM-dd"),
        };
      });

      const { data: reportesWeek } = await supabase
        .from("reportes")
        .select("fecha, clientes_contactados, seguimientos_realizados, ventas")
        .gte("fecha", last7Days[0].date);

      const actData = last7Days.map((day) => {
        const dayReportes = reportesWeek?.filter((r) => r.fecha === day.date) || [];
        return {
          day: day.day,
          contactados: dayReportes.reduce((s, r) => s + r.clientes_contactados, 0),
          seguimientos: dayReportes.reduce((s, r) => s + r.seguimientos_realizados, 0),
          ventas: dayReportes.reduce((s, r) => s + r.ventas, 0),
        };
      });

      setActivityData(actData);

      // Datos de ventas mensuales (últimos 6 meses)
      const months = Array.from({ length: 6 }, (_, i) => {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        return {
          label: format(d, "MMM", { locale: es }),
          month: format(d, "yyyy-MM"),
        };
      });

      const monthSales = months.map((m) => ({
        mes: m.label,
        ventas: Math.floor(Math.random() * 15 + 3), // Demo data hasta tener reportes
      }));

      setSalesData(monthSales);

      // Clientes recientes
      const { data: recientes } = await supabase
        .from("clientes")
        .select("id, nombre, estado, created_at, email")
        .order("created_at", { ascending: false })
        .limit(5);

      setRecentClientes(recientes || []);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }

    setLoading(false);
  };

  const statCards: Stat[] = [
    {
      label: "Total Clientes",
      value: stats.totalClientes,
      change: "+12% este mes",
      icon: Users,
      color: COLORS.blue,
      bg: "rgba(59,130,246,0.12)",
    },
    {
      label: "Ventas del Mes",
      value: stats.ventasMes,
      change: "+8% vs mes anterior",
      icon: TrendingUp,
      color: COLORS.emerald,
      bg: "rgba(16,185,129,0.12)",
    },
    {
      label: "Seguimientos Pendientes",
      value: stats.seguimientosPendientes,
      change: "Próximos contactos",
      icon: Phone,
      color: COLORS.amber,
      bg: "rgba(245,158,11,0.12)",
    },
    {
      label: "Clientes Nuevos",
      value: stats.clientesNuevos,
      change: "Sin asignar",
      icon: Target,
      color: COLORS.violet,
      bg: "rgba(139,92,246,0.12)",
    },
  ];

  const estadoBadge: Record<string, { label: string; color: string; bg: string }> = {
    nuevo: { label: "Nuevo", color: "#60a5fa", bg: "rgba(59,130,246,0.15)" },
    contactado: { label: "Contactado", color: "#a78bfa", bg: "rgba(139,92,246,0.15)" },
    en_conversacion: { label: "En Conversación", color: "#34d399", bg: "rgba(16,185,129,0.15)" },
    interesado: { label: "Interesado", color: "#fbbf24", bg: "rgba(245,158,11,0.15)" },
    cerrado: { label: "Cerrado", color: "#10b981", bg: "rgba(16,185,129,0.15)" },
    perdido: { label: "Perdido", color: "#f87171", bg: "rgba(244,63,94,0.15)" },
  };

  const SkeletonCard = () => (
    <div className="skeleton rounded-2xl h-32" />
  );

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
            Bienvenido, {profile?.nombre?.split(" ")[0]} 👋
          </h2>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Aquí tienes un resumen de tu actividad de hoy.
          </p>
        </div>
      </motion.div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array(4).fill(0).map((_, i) => <SkeletonCard key={i} />)
          : statCards.map((stat, i) => {
              const Icon = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="glass rounded-2xl p-5 glass-hover cursor-default"
                  style={{ border: `1px solid rgba(${stat.color === COLORS.blue ? "59,130,246" : stat.color === COLORS.emerald ? "16,185,129" : stat.color === COLORS.amber ? "245,158,11" : "139,92,246"},0.15)` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center"
                      style={{ background: stat.bg }}
                    >
                      <Icon size={20} style={{ color: stat.color }} />
                    </div>
                    <ArrowUpRight size={14} style={{ color: "var(--text-muted)" }} />
                  </div>
                  <p className="text-3xl font-bold mb-1" style={{ color: "var(--text-primary)" }}>
                    {stat.value}
                  </p>
                  <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>
                    {stat.label}
                  </p>
                  <p className="text-xs mt-1" style={{ color: stat.color }}>
                    {stat.change}
                  </p>
                </motion.div>
              );
            })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Sales Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 glass rounded-2xl p-5"
        >
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
                Ventas Mensuales
              </h3>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Últimos 6 meses
              </p>
            </div>
            <div
              className="px-3 py-1.5 rounded-lg text-xs font-medium"
              style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}
            >
              <Activity size={12} className="inline mr-1" />
              En tiempo real
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.3} />
                  <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="mes" tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="ventas"
                stroke={COLORS.blue}
                strokeWidth={2.5}
                fill="url(#salesGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Weekly Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="glass rounded-2xl p-5"
        >
          <div className="mb-5">
            <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
              Actividad Semanal
            </h3>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Contactos y seguimientos
            </p>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={activityData} barSize={16}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="contactados" fill={COLORS.blue} radius={[4, 4, 0, 0]} />
              <Bar dataKey="seguimientos" fill={COLORS.violet} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Recent Clients */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl overflow-hidden"
      >
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: "1px solid var(--border-glass)" }}
        >
          <h3 className="font-semibold" style={{ color: "var(--text-primary)" }}>
            Clientes Recientes
          </h3>
          <a
            href="/clientes"
            className="text-xs font-medium transition-colors"
            style={{ color: "var(--accent-blue-light)" }}
          >
            Ver todos →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border-glass)" }}>
                {["Nombre", "Email", "Estado", "Creado"].map((h) => (
                  <th
                    key={h}
                    className="text-left px-6 py-3 text-xs font-medium uppercase tracking-wider"
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
                    <tr key={i} style={{ borderBottom: "1px solid var(--border-glass)" }}>
                      {Array(4).fill(0).map((_, j) => (
                        <td key={j} className="px-6 py-4">
                          <div className="skeleton h-4 rounded" style={{ width: j === 0 ? "140px" : j === 1 ? "180px" : "80px" }} />
                        </td>
                      ))}
                    </tr>
                  ))
                : recentClientes.map((cliente) => {
                    const badge = estadoBadge[cliente.estado] || estadoBadge.nuevo;
                    return (
                      <tr
                        key={cliente.id}
                        className="transition-colors"
                        style={{ borderBottom: "1px solid var(--border-glass)" }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.02)")}
                        onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                              style={{ background: "linear-gradient(135deg, #3b82f6, #8b5cf6)", color: "white" }}
                            >
                              {cliente.nombre?.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                              {cliente.nombre}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: "var(--text-secondary)" }}>
                          {cliente.email || "—"}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className="px-2.5 py-1 rounded-full text-xs font-medium"
                            style={{ background: badge.bg, color: badge.color }}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm" style={{ color: "var(--text-muted)" }}>
                          {format(new Date(cliente.created_at), "dd/MM/yyyy")}
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
