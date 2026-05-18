"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Eye, EyeOff, ArrowRight, Lock, Mail, CheckCircle } from "lucide-react";

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

  const features = [
    "Dashboard con métricas en tiempo real",
    "Gestión completa del ciclo de ventas",
    "Reportes diarios por vendedor",
    "Historial de seguimientos y contactos",
  ];

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>

      {/* ── LADO IZQUIERDO — Azul ───────────────────────────────── */}
      <motion.div
        initial={{ x: -40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "48px",
          background: "linear-gradient(160deg, #0057c2 0%, #003a8c 50%, #00256e 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Círculos decorativos */}
        <div style={{
          position: "absolute", top: "-80px", right: "-80px",
          width: "320px", height: "320px", borderRadius: "50%",
          background: "rgba(255,255,255,0.05)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-60px", left: "-60px",
          width: "280px", height: "280px", borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: "40%", right: "10%",
          width: "140px", height: "140px", borderRadius: "50%",
          background: "rgba(255,255,255,0.04)",
          pointerEvents: "none",
        }} />

        {/* Logo + nombre */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          style={{ display: "flex", alignItems: "center", gap: "14px", position: "relative", zIndex: 1 }}
        >
          <div style={{
            width: "52px", height: "52px", borderRadius: "16px",
            background: "white", padding: "7px",
            boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
            flexShrink: 0,
          }}>
            <img src="/img/logo.png" alt="Neurotec" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <div>
            <p style={{ color: "white", fontWeight: 800, fontSize: "20px", lineHeight: 1.2 }}>
              Neurotec CRM
            </p>
            <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "13px", marginTop: "2px" }}>
              Sistema Administrativo
            </p>
          </div>
        </motion.div>

        {/* Headline central */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          style={{ position: "relative", zIndex: 1 }}
        >
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "13px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "16px" }}>
            Plataforma de Ventas
          </p>
          <h1 style={{
            color: "white", fontSize: "42px", fontWeight: 800,
            lineHeight: 1.12, marginBottom: "20px",
          }}>
            Controla cada venta con precisión.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.6)", fontSize: "16px", lineHeight: 1.65, maxWidth: "420px" }}>
            Una herramienta diseñada para que tu equipo de ventas trabaje de forma organizada, medible y eficiente.
          </p>
        </motion.div>

        {/* Features list */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          style={{ display: "flex", flexDirection: "column", gap: "12px", position: "relative", zIndex: 1 }}
        >
          {features.map((f, i) => (
            <motion.div
              key={f}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.08 }}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <div style={{
                width: "20px", height: "20px", borderRadius: "50%",
                background: "rgba(255,255,255,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                <CheckCircle size={12} color="white" />
              </div>
              <span style={{ color: "rgba(255,255,255,0.8)", fontSize: "14px", fontWeight: 500 }}>
                {f}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* ── LADO DERECHO — Blanco ──────────────────────────────── */}
      <motion.div
        initial={{ x: 40, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{
          width: "480px",
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 52px",
          background: "white",
          borderLeft: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <div style={{ maxWidth: "340px", width: "100%" }}>
          {/* Bienvenida */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            style={{ marginBottom: "36px" }}
          >
            <h2 style={{ fontSize: "28px", fontWeight: 800, color: "#0f172a", marginBottom: "8px", lineHeight: 1.2 }}>
              Bienvenido
            </h2>
            <p style={{ fontSize: "15px", color: "#64748b", lineHeight: 1.6 }}>
              Ingresa tus credenciales para acceder al sistema
            </p>
          </motion.div>

          {/* Formulario */}
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            onSubmit={handleLogin}
            style={{ display: "flex", flexDirection: "column", gap: "18px" }}
          >
            {/* Email */}
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "8px" }}>
                Correo electrónico
              </label>
              <div style={{ position: "relative" }}>
                <Mail size={15} style={{
                  position: "absolute", left: "14px", top: "50%",
                  transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none",
                }} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nombre@neurotec.com"
                  style={{
                    width: "100%", paddingLeft: "42px", paddingRight: "16px",
                    paddingTop: "12px", paddingBottom: "12px",
                    background: "#f8fafc", border: "1.5px solid #e2e8f0",
                    borderRadius: "12px", fontSize: "14px", color: "#0f172a",
                    outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#0071e3"; e.target.style.boxShadow = "0 0 0 3px rgba(0,113,227,0.1)"; e.target.style.background = "white"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fafc"; }}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <label style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>
                  Contraseña
                </label>
                <a href="/forgot-password" style={{ fontSize: "12px", color: "#0071e3", fontWeight: 500, textDecoration: "none" }}>
                  ¿Olvidaste tu contraseña?
                </a>
              </div>
              <div style={{ position: "relative" }}>
                <Lock size={15} style={{
                  position: "absolute", left: "14px", top: "50%",
                  transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none",
                }} />
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••••"
                  style={{
                    width: "100%", paddingLeft: "42px", paddingRight: "44px",
                    paddingTop: "12px", paddingBottom: "12px",
                    background: "#f8fafc", border: "1.5px solid #e2e8f0",
                    borderRadius: "12px", fontSize: "14px", color: "#0f172a",
                    outline: "none", transition: "border-color 0.15s, box-shadow 0.15s",
                    fontFamily: "inherit",
                  }}
                  onFocus={(e) => { e.target.style.borderColor = "#0071e3"; e.target.style.boxShadow = "0 0 0 3px rgba(0,113,227,0.1)"; e.target.style.background = "white"; }}
                  onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.boxShadow = "none"; e.target.style.background = "#f8fafc"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  style={{
                    position: "absolute", right: "12px", top: "50%",
                    transform: "translateY(-50%)", color: "#9ca3af",
                    background: "none", border: "none", cursor: "pointer",
                  }}
                >
                  {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {/* Botón */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.015, boxShadow: loading ? undefined : "0 8px 24px rgba(0,86,185,0.4)" }}
              whileTap={{ scale: loading ? 1 : 0.985 }}
              style={{
                width: "100%", padding: "13px 24px",
                background: loading ? "#93c5fd" : "linear-gradient(135deg, #0071e3 0%, #0056b9 100%)",
                color: "white", fontWeight: 700, fontSize: "15px",
                border: "none", borderRadius: "999px",
                cursor: loading ? "not-allowed" : "pointer",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: "8px", marginTop: "4px",
                boxShadow: "0 4px 16px rgba(0,113,227,0.3)",
                fontFamily: "inherit",
                transition: "background 0.15s",
              }}
            >
              {loading ? (
                <>
                  <div style={{
                    width: "16px", height: "16px", borderRadius: "50%",
                    border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "white",
                    animation: "spin 0.8s linear infinite",
                  }} />
                  Ingresando...
                </>
              ) : (
                <>Ingresar <ArrowRight size={16} /></>
              )}
            </motion.button>
          </motion.form>

          <p style={{ textAlign: "center", fontSize: "12px", color: "#94a3b8", marginTop: "32px" }}>
            © 2024 Neurotec Ecuador · Sistema Interno
          </p>
        </div>
      </motion.div>
    </div>
  );
}
