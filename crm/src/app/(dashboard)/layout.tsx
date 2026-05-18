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
      <div className="min-h-screen flex items-center justify-center" style={{ background: "var(--bg-primary)" }}>
        <div className="text-center">
          <div
            className="w-12 h-12 rounded-full border-2 border-blue-500 border-t-transparent mx-auto mb-4"
            style={{ animation: "spin 0.8s linear infinite" }}
          />
          <p style={{ color: "var(--text-secondary)" }}>Cargando sistema...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <Sidebar />
      <Navbar />

      <main
        style={{
          marginLeft: "var(--sidebar-width)",
          paddingTop: "var(--navbar-height)",
          minHeight: "100vh",
        }}
      >
        <div className="p-6 animate-fade-in">{children}</div>
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
