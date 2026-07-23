"use client";
import { useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const weiter = params.get("weiter") || "/admin";
  const [passwort, setPasswort] = useState("");
  const [fehler, setFehler] = useState("");
  const [laedt, setLaedt] = useState(false);

  const absenden = async (e: React.FormEvent) => {
    e.preventDefault();
    setLaedt(true); setFehler("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ passwort }),
    });
    setLaedt(false);
    if (res.ok) {
      router.push(weiter);
      router.refresh();
    } else {
      setFehler("Falsches Passwort.");
      setPasswort("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f6f6f7] px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2">
            <span className="font-display text-[24px] text-ink-strong">Homedeko</span>
            <span className="text-[11px] font-semibold uppercase tracking-wide text-bordeaux bg-bordeaux-soft px-1.5 py-0.5 rounded">Admin</span>
          </div>
          <p className="mt-2 text-[13.5px] text-muted">Bitte melde dich an, um den Shop zu verwalten.</p>
        </div>
        <form onSubmit={absenden} className="bg-white rounded-xl border border-[#e5e2dc] p-6 shadow-sm">
          <label className="block text-[13px] font-semibold text-ink-strong mb-1.5">Admin-Passwort</label>
          <input
            type="password" autoFocus value={passwort} onChange={(e) => setPasswort(e.target.value)}
            className="w-full rounded-md border border-[#dcd8d0] px-3 py-2.5 text-[15px] outline-none focus:border-bordeaux focus:ring-2 focus:ring-bordeaux/15"
            placeholder="••••••••" />
          {fehler && <p className="mt-2 text-[13px] text-bordeaux font-medium">{fehler}</p>}
          <button type="submit" disabled={laedt || !passwort}
            className="mt-4 w-full rounded-md bg-bordeaux text-white font-semibold py-2.5 text-[14.5px] disabled:opacity-50 transition-opacity">
            {laedt ? "Wird geprüft …" : "Anmelden"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
