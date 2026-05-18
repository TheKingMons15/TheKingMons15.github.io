"use client";

import { useEffect, useState } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";
import DailyReportModal from "@/components/reportes/DailyReportModal";
import { createClient } from "@/lib/supabase/client";
import { format } from "date-fns";

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth();
  const [showReportModal, setShowReportModal] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!user || !profile) return;

    const checkDailyReport = async () => {
      const today = format(new Date(), "yyyy-MM-dd");
      const { data } = await supabase
        .from("reportes")
        .select("id")
        .eq("vendedor_id", user.id)
        .eq("fecha", today)
        .single();

      if (!data) {
        // Mostrar modal después de 2 segundos para no interrumpir carga
        setTimeout(() => setShowReportModal(true), 2000);
      }
    };

    checkDailyReport();
  }, [user, profile]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#f8fafc" }}>
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4"
            style={{ border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.08)", padding: "6px" }}
          >
            <img src="/img/logo.png" alt="Neurotec" className="w-full h-full object-contain" />
          </div>
          <div
            className="w-8 h-8 rounded-full border-2 border-t-transparent mx-auto mb-3"
            style={{ borderColor: "#3b82f6", borderTopColor: "transparent", animation: "spin 0.8s linear infinite" }}
          />
          <p className="text-sm font-medium" style={{ color: "#64748b" }}>Cargando...</p>
        </div>
      </div>
    );
  }


  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Sidebar />
      <Navbar />

      <main
        style={{
          marginLeft: "var(--sidebar-w)",
          paddingTop: "calc(var(--navbar-h) + 28px)",
          paddingBottom: "40px",
          paddingLeft: "28px",
          paddingRight: "28px",
          minHeight: "100vh",
        }}
      >
        {children}
      </main>

      {showReportModal && (
        <DailyReportModal onClose={() => setShowReportModal(false)} />
      )}
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <DashboardContent>{children}</DashboardContent>
    </AuthProvider>
  );
}
