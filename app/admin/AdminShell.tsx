"use client";
import { usePathname } from "next/navigation";
import AdminNav from "./AdminNav";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const path = usePathname();

  // Login-Seite: Vollbild ohne Sidebar
  if (path === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-[#f6f6f7] text-ink">
      <AdminNav />
      <main className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-4 py-6 lg:px-8 lg:py-8">{children}</div>
      </main>
    </div>
  );
}
