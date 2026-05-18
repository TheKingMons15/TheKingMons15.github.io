"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Eye, EyeOff, LogIn, Mail, Lock } from "lucide-react";

export default function AccesoPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message === "Invalid login credentials" ? "Credenciales incorrectas." : error.message);
    } else {
      toast.success("¡Bienvenido!");
      router.push("/dashboard");
      router.refresh();
    }
    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    background: "#f8fafc",
    border: "1.5px solid #e2e8f0",
    borderRadius: "12px",
    padding: "12px 14px 12px 42px",
    fontSize: "14px",
    color: "#0f172a",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  };

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "#f8fafc" }}
    >
      {/* Panel izquierdo decorativo */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: "#0f172a" }}
      >
        {/* Patrón de fondo */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #8b5cf6 0%, transparent 50%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
            className="w-24 h-24 rounded-3xl overflow-hidden mx-auto mb-8"
            style={{
              background: "white",
              boxShadow: "0 20px 60px rgba(59,130,246,0.3)",
              padding: "8px",
            }}
          >
            <img src="/img/logo.png" alt="Neurotec" className="w-full h-full object-contain" />
          </motion.div>

          <h1 className="text-4xl font-bold text-white mb-3">
            Neurotec CRM
          </h1>
          <p className="text-lg mb-10" style={{ color: "#94a3b8" }}>
            Sistema Administrativo de Ventas
          </p>

          {/* Features */}
          {[
            { icon: "👥", text: "Gestión completa de clientes" },
            { icon: "📊", text: "Dashboard con estadísticas en tiempo real" },
            { icon: "📋", text: "Reportes diarios automáticos" },
            { icon: "🔔", text: "Seguimientos y recordatorios" },
          ].map((f, i) => (
            <motion.div
              key={f.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="flex items-center gap-3 mb-4 text-left"
            >
              <span className="text-xl w-8 flex-shrink-0">{f.icon}</span>
              <p className="text-sm" style={{ color: "#cbd5e1" }}>{f.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Panel de login */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-sm"
        >
          {/* Logo mobile */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl overflow-hidden" style={{ border: "1px solid #e2e8f0" }}>
              <img src="/img/logo.png" alt="Neurotec" className="w-full h-full object-contain" />
            </div>
            <p className="font-bold text-lg" style={{ color: "#0f172a" }}>Neurotec CRM</p>
          </div>

          <h2 className="text-2xl font-bold mb-2" style={{ color: "#0f172a" }}>
            Bienvenido
          </h2>
          <p className="text-sm mb-8" style={{ color: "#64748b" }}>
            Ingresa tus credenciales para acceder al sistema
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            {/* Email */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
                Correo electrónico
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="usuario@neurotec.com"
                  style={inputStyle}
                  onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px #eff6ff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-semibold mb-2" style={{ color: "#374151" }}>
                Contraseña
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: "44px" }}
                  onFocus={(e) => { e.target.style.borderColor = "#3b82f6"; e.target.style.boxShadow = "0 0 0 3px #eff6ff"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; }}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "#94a3b8" }}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex justify-end">
              <a href="/forgot-password" className="text-sm font-medium" style={{ color: "#3b82f6" }}>
                ¿Olvidaste tu contraseña?
              </a>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.01 }}
              whileTap={{ scale: loading ? 1 : 0.99 }}
              className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 text-white transition-all"
              style={{
                background: loading ? "#93c5fd" : "#2563eb",
                boxShadow: loading ? "none" : "0 4px 14px rgba(37,99,235,0.35)",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? (
                <><div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent" style={{ animation: "spin 0.8s linear infinite" }} /> Ingresando...</>
              ) : (
                <><LogIn size={16} /> Ingresar al Sistema</>
              )}
            </motion.button>
          </form>

          <p className="text-center text-xs mt-8" style={{ color: "#94a3b8" }}>
            © 2024 Neurotec Ecuador · Sistema Interno
          </p>
        </motion.div>
      </div>
    </div>
  );
}
