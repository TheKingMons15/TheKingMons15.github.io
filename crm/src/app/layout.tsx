import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CRM Neurotec | Panel Administrativo",
  description: "Sistema CRM administrativo para gestión de clientes y ventas de Neurotec Ecuador",
  robots: "noindex, nofollow",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: "#0f1e35",
              color: "#f0f4ff",
              border: "1px solid rgba(59, 130, 246, 0.2)",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#0f1e35",
              },
            },
            error: {
              iconTheme: {
                primary: "#f43f5e",
                secondary: "#0f1e35",
              },
            },
          }}
        />
      </body>
    </html>
  );
}
