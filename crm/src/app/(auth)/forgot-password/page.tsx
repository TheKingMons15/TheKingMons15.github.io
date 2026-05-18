"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import toast from "react-hot-toast";
import { Mail, ArrowLeft, Send } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const supabase = createClient();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback`,
    });
    if (error) toast.error("Error al enviar el correo. Verifica el email.");
    else { setSent(true); toast.success("Correo de recuperación enviado"); }
    setLoading(false);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-6"
      style={{ background: "var(--bg)" }}
    >
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px" }}>
          <div style={{
            width: "40px", height: "40px", borderRadius: "12px",
            overflow: "hidden", padding: "5px",
            background: "white", border: "1px solid var(--border)",
            boxShadow: "var(--shadow-sm)",
          }}>
            <img src="/img/logo.png" alt="Neurotec" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
          </div>
          <p style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>
            Neurotec CRM
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: "rgba(255,255,255,0.88)",
          backdropFilter: "blur(40px)",
          WebkitBackdropFilter: "blur(40px)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderRadius: "var(--r-xl)",
          padding: "32px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.1), 0 0 0 0.5px rgba(0,0,0,0.06)",
        }}>
          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              style={{ textAlign: "center" }}
            >
              <div style={{
                width: "56px", height: "56px", borderRadius: "16px",
                background: "var(--green-bg)", border: "1px solid rgba(52,199,89,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 16px",
              }}>
                <Send size={22} style={{ color: "var(--green)" }} />
              </div>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>
                Correo enviado
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
                Revisa tu bandeja de entrada y sigue las instrucciones para restablecer tu contraseña.
              </p>
              <Link
                href="/acceso"
                style={{
                  display: "inline-flex", alignItems: "center", gap: "6px",
                  fontSize: "14px", fontWeight: 600, color: "var(--accent)",
                  textDecoration: "none",
                }}
              >
                <ArrowLeft size={14} /> Volver al inicio de sesión
              </Link>
            </motion.div>
          ) : (
            <>
              <h2 style={{ fontSize: "22px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                Recuperar contraseña
              </h2>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "24px", lineHeight: 1.6 }}>
                Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
              </p>

              <form onSubmit={handleReset} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "7px" }}>
                    Correo electrónico
                  </label>
                  <div style={{ position: "relative" }}>
                    <Mail size={15} style={{
                      position: "absolute", left: "13px", top: "50%",
                      transform: "translateY(-50%)", color: "var(--text-muted)", pointerEvents: "none",
                    }} />
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

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{
                    width: "100%", padding: "13px",
                    borderRadius: "var(--r-full)", fontSize: "14px",
                    opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer",
                    marginTop: "4px",
                  }}
                >
                  {loading ? "Enviando..." : "Enviar enlace de recuperación"}
                </button>

                <Link
                  href="/acceso"
                  style={{
                    display: "flex", alignItems: "center", justifyContent: "center",
                    gap: "6px", fontSize: "13px", fontWeight: 500,
                    color: "var(--text-secondary)", textDecoration: "none",
                    paddingTop: "4px",
                  }}
                >
                  <ArrowLeft size={13} /> Volver al inicio de sesión
                </Link>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
