import type { Metadata } from "next";
import AdminShell from "./AdminShell";

export const metadata: Metadata = {
  title: "Admin — Homedeko Store",
  robots: { index: false, follow: false },
};

/* AdminShell (Client) entscheidet pfadabhängig: Login-Seite ohne Sidebar,
   alle anderen /admin-Seiten mit Sidebar + Content-Container. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <AdminShell>{children}</AdminShell>;
}
