import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login | CRM Neurotec",
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      {children}
    </div>
  );
}
