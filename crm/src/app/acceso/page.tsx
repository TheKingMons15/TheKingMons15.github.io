"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowRight, Lock, Mail } from "lucide-react";

export default function AccesoPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) toast.error(error.message === "Invalid login credentials" ? "Credenciales incorrectas" : error.message);
    else { toast.success("¡Bienvenido!"); router.push("/dashboard"); router.refresh(); }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: "var(--bg)" }}>
      {/* Fondo decorativo estilo macOS */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div style={{
          position: "absolute", top: "-20%", left: "-10%",
          width: "60vw", height: "60vw",
          background: "radial-gradient(circle, rgba(0,113,227,0.07) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", right: "-5%",
          width: "50vw", height: "50vw",
          background: "radial-gradient(circle, rgba(175,82,222,0.05) 0%, transparent 70%)",
          borderRadius: "50%",
        }} />
      </div>

      <div className="w-full max-w-5xl relative z-10 flex gap-6 items-center">

        {/* Panel izquierdo — info */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="hidden lg:flex flex-col justify-between flex-1 rounded-3xl p-10 overflow-hidden relative"
          style={{
            background: "linear-gradient(145deg, #0f0f1a 0%, #0d1b2e 50%, #0a1628 100%)",
            minHeight: "580px",
            boxShadow: "var(--shadow-xl)",
          }}
        >
          {/* Textura sutil */}
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: "radial-gradient(circle at 30% 20%, rgba(0,113,227,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(175,82,222,0.1) 0%, transparent 50%)",
          }} />

          {/* Logo + nombre */}
          <div className="relative z-10 flex items-center gap-3">
            <motion.div
              initial={{ scale: 0, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 15 }}
              className="w-11 h-11 rounded-2xl overflow-hidden flex items-center justify-center"
              style={{ background: "white", padding: "5px", boxShadow: "0 4px 16px rgba(0,113,227,0.4)" }}
            >
              <img src="/img/logo.png" alt="Neurotec" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </motion.div>
            <div>
              <p style={{ color: "white", fontWeight: 700, fontSize: "16px" }}>Neurotec CRM</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "12px" }}>Sistema Interno</p>
            </div>
          </div>

          {/* Headline */}
          <div className="relative z-10">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              style={{ color: "white", fontSize: "36px", fontWeight: 800, lineHeight: 1.15, marginBottom: "16px" }}
            >
              Gestiona tus ventas con precisión.
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px", lineHeight: 1.6 }}
            >
              Seguimiento de clientes, reportes diarios y estadísticas en tiempo real para todo tu equipo.
            </motion.p>
          </div>

          {/* Feature pills */}
          <div className="relative z-10 flex flex-col gap-3">
            {[
              { icon: "📊", text: "Dashboard con métricas en tiempo real" },
              { icon: "👥", text: "CRM completo de clientes" },
              { icon: "📋", text: "Reportes diarios automáticos" },
            ].map((f, i) => (
              <motion.div
                key={f.text}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.1 }}
                className="flex items-center gap-3 px-4 py-3 rounded-2xl"
                style={{ background: "rgba(255,255,255,0.06)", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <span style={{ fontSize: "18px" }}>{f.icon}</span>
                <span style={{ color: "rgba(255,255,255,0.75)", fontSize: "13px", fontWeight: 500 }}>{f.text}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Panel derecho — formulario */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="w-full lg:w-[400px] flex-shrink-0"
        >
          {/* Card del formulario */}
          <div
            className="rounded-3xl p-8"
            style={{
              background: "rgba(255,255,255,0.88)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255,255,255,0.9)",
              boxShadow: "0 32px 80px rgba(0,0,0,0.1), 0 0 0 0.5px rgba(0,0,0,0.06)",
            }}
          >
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-xl overflow-hidden" style={{ border: "1px solid var(--border)", padding: "3px" }}>
                <img src="/img/logo.png" alt="Neurotec" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
              </div>
              <span style={{ fontWeight: 700, color: "var(--text-primary)", fontSize: "15px" }}>Neurotec CRM</span>
            </div>

            <h2 style={{ fontSize: "24px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
              Iniciar sesión
            </h2>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "28px" }}>
              Accede a tu cuenta para continuar
            </p>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              {/* Email */}
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "7px" }}>
                  Correo electrónico
                </label>
                <div style={{ position: "relative" }}>
                  <Mail size={15} style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="nombre@neurotec.com"
                    className="input-base"
                    style={{ paddingLeft: "40px" }}
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "7px" }}>
                  <label style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)" }}>
                    Contraseña
                  </label>
                  <a href="/forgot-password" style={{ fontSize: "12px", color: "var(--accent)", fontWeight: 500, textDecoration: "none" }}>
                    ¿Olvidaste tu contraseña?
                  </a>
                </div>
                <div style={{ position: "relative" }}>
                  <Lock size={15} style={{ position: "absolute", left: "13px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none" }} />
                  <input
                    type={showPwd ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••"
                    className="input-base"
                    style={{ paddingLeft: "40px", paddingRight: "42px" }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPwd(!showPwd)}
                    style={{ position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)", background: "none", border: "none", cursor: "pointer", padding: "2px" }}
                  >
                    {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: loading ? 1 : 1.015 }}
                whileTap={{ scale: loading ? 1 : 0.985 }}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "13px",
                  fontSize: "15px",
                  marginTop: "6px",
                  borderRadius: "var(--r-full)",
                  opacity: loading ? 0.7 : 1,
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <div style={{ width: "16px", height: "16px", borderRadius: "50%", border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white", animation: "spin 0.8s linear infinite" }} />
                    Ingresando...
                  </>
                ) : (
                  <>
                    Ingresar
                    <ArrowRight size={16} />
                  </>
                )}
              </motion.button>
            </form>
          </div>

          <p style={{ textAlign: "center", fontSize: "12px", color: "var(--text-muted)", marginTop: "20px" }}>
            © 2024 Neurotec Ecuador · Sistema Interno
          </p>
        </motion.div>
      </div>
    </div>
  );
}
