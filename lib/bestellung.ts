/* Gemeinsame Bestell-Logik: Bestellung in Supabase speichern, Rabatt
   serverseitig verifizieren, Bestätigungs-Mails versenden. Wird sowohl vom
   Vorkasse-Flow als auch vom Stripe-Webhook genutzt. Nur serverseitig. */
import "server-only";
import { supabaseServer } from "./supabase";
import { resendClient, mailAbsender } from "./zahlung";
import { ladeSettings } from "./settings";

export type BestellItem = { produktId: string; name: string; variante: string; preis: number; menge: number; bild?: string };
export type BestellKunde = Record<string, string>;
export type BestellEingang = {
  kunde: BestellKunde;
  items: BestellItem[];
  summe: number;
  versand: number;
  rabattCode?: string | null;
  zahlart: "vorkasse" | "stripe";
  bezahlt?: boolean;
};

const euro = (n: number) => (n ?? 0).toLocaleString("de-DE", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " €";

/* Rabatt serverseitig prüfen + Betrag berechnen (nie dem Client vertrauen). */
async function pruefeRabatt(code: string, summe: number) {
  const sb = supabaseServer();
  if (!sb || !code) return { code: null as string | null, betrag: 0, rcId: null as string | null };
  const { data: rc } = await sb.from("rabattcodes").select("*").eq("code", code.toUpperCase()).maybeSingle();
  if (!rc || !rc.aktiv || summe < Number(rc.mindestwert || 0)) return { code: null, betrag: 0, rcId: null };
  if (rc.gueltig_bis && new Date(rc.gueltig_bis) < new Date()) return { code: null, betrag: 0, rcId: null };
  if (rc.max_nutzungen != null && rc.genutzt >= rc.max_nutzungen) return { code: null, betrag: 0, rcId: null };
  const betrag = rc.typ === "prozent"
    ? Math.round(summe * (Number(rc.wert) / 100) * 100) / 100
    : Math.min(summe, Number(rc.wert));
  return { code: rc.code as string, betrag, rcId: rc.id as string };
}

/** Speichert die Bestellung, erhöht Rabatt-Zähler, verschickt Mails. */
export async function bestellungAnlegen(e: BestellEingang): Promise<{ ok: boolean; nummer?: string; gesamt?: number; fehler?: string }> {
  const sb = supabaseServer();
  if (!sb) return { ok: false, fehler: "Speicher nicht verfügbar." };

  const summe = Number(e.summe) || 0;
  const versand = Number(e.versand) || 0;
  const rab = await pruefeRabatt(e.rabattCode || "", summe);
  const gesamt = Math.max(0, summe - rab.betrag) + versand;
  const nummer = "HD-" + Date.now().toString(36).toUpperCase();

  const status = e.bezahlt ? "bezahlt" : "neu";
  const { error } = await sb.from("bestellungen").insert({
    nummer, status,
    kunde: e.kunde, items: e.items,
    summe, versand, rabatt_code: rab.code, rabatt_betrag: rab.betrag, gesamt,
  });
  if (error) return { ok: false, fehler: error.message };

  if (rab.rcId) {
    const { data: rc } = await sb.from("rabattcodes").select("genutzt").eq("id", rab.rcId).maybeSingle();
    if (rc) await sb.from("rabattcodes").update({ genutzt: Number(rc.genutzt) + 1 }).eq("id", rab.rcId);
  }

  await sendeMails({ nummer, kunde: e.kunde, items: e.items, summe, versand, rabattBetrag: rab.betrag, rabattCode: rab.code, gesamt, zahlart: e.zahlart, bezahlt: !!e.bezahlt });

  return { ok: true, nummer, gesamt };
}

type MailDaten = {
  nummer: string; kunde: BestellKunde; items: BestellItem[];
  summe: number; versand: number; rabattBetrag: number; rabattCode: string | null;
  gesamt: number; zahlart: string; bezahlt: boolean;
};

async function sendeMails(d: MailDaten) {
  const resend = resendClient();
  const from = mailAbsender();
  if (!resend || !from) return; // ohne Resend-Key: keine Mails (Shop läuft trotzdem)

  const settings = await ladeSettings();
  const artikel = d.items.map((i) => `<tr><td style="padding:6px 0">${i.menge}× ${i.name}<br><span style="color:#888;font-size:13px">${i.variante}</span></td><td style="text-align:right;padding:6px 0">${euro(i.preis * i.menge)}</td></tr>`).join("");

  const bank = settings.zahlung;
  const zahlblock = d.bezahlt
    ? `<p style="color:#2e7d43"><b>Deine Zahlung ist eingegangen.</b> Wir produzieren und versenden deine Bestellung.</p>`
    : `<div style="background:#f7f3ea;border-radius:8px;padding:16px;margin:16px 0">
         <p style="margin:0 0 8px"><b>Bitte überweise ${euro(d.gesamt)} auf folgendes Konto:</b></p>
         <p style="margin:0;line-height:1.7">
           ${bank.bank_inhaber ? `Kontoinhaber: ${bank.bank_inhaber}<br>` : ""}
           ${bank.bank_iban ? `IBAN: <b>${bank.bank_iban}</b><br>` : ""}
           ${bank.bank_bic ? `BIC: ${bank.bank_bic}<br>` : ""}
           ${bank.bank_name ? `Bank: ${bank.bank_name}<br>` : ""}
           Verwendungszweck: <b>${d.nummer}</b>
         </p>
       </div>`;

  const kundeMail = `
    <div style="font-family:Arial,sans-serif;max-width:560px;margin:0 auto;color:#262019">
      <h2 style="color:#7c2237">Danke für deine Bestellung!</h2>
      <p>Hallo ${d.kunde.vorname ?? ""}, wir haben deine Bestellung <b>${d.nummer}</b> erhalten.</p>
      ${zahlblock}
      <table style="width:100%;border-collapse:collapse;border-top:1px solid #eee;margin-top:8px">${artikel}</table>
      <table style="width:100%;border-top:1px solid #eee;margin-top:8px;font-size:14px">
        <tr><td style="padding:3px 0;color:#888">Zwischensumme</td><td style="text-align:right">${euro(d.summe)}</td></tr>
        ${d.rabattBetrag > 0 ? `<tr><td style="padding:3px 0;color:#2e7d43">Rabatt ${d.rabattCode ?? ""}</td><td style="text-align:right;color:#2e7d43">−${euro(d.rabattBetrag)}</td></tr>` : ""}
        <tr><td style="padding:3px 0;color:#888">Versand</td><td style="text-align:right">${d.versand === 0 ? "kostenlos" : euro(d.versand)}</td></tr>
        <tr><td style="padding:6px 0;font-weight:bold;font-size:16px">Gesamt</td><td style="text-align:right;font-weight:bold;font-size:16px">${euro(d.gesamt)}</td></tr>
      </table>
      <p style="color:#888;font-size:13px;margin-top:24px">${settings.firma.name || "Homedeko Store"}</p>
    </div>`;

  try {
    await resend.emails.send({
      from, to: d.kunde.email, subject: `Bestellbestätigung ${d.nummer}`, html: kundeMail,
    });
  } catch { /* Mail-Fehler nie die Bestellung scheitern lassen */ }

  const an = process.env.BESTELL_BENACHRICHTIGUNG_AN;
  if (an && an.includes("@")) {
    try {
      await resend.emails.send({
        from, to: an, subject: `🛒 Neue Bestellung ${d.nummer} — ${euro(d.gesamt)}`,
        html: `<div style="font-family:Arial,sans-serif"><h3>Neue Bestellung ${d.nummer}</h3>
          <p><b>${d.kunde.vorname ?? ""} ${d.kunde.nachname ?? ""}</b><br>${d.kunde.email ?? ""}<br>
          ${d.kunde.strasse ?? ""} ${d.kunde.hausnummer ?? ""}, ${d.kunde.plz ?? ""} ${d.kunde.ort ?? ""}</p>
          <p>Zahlart: ${d.zahlart}${d.bezahlt ? " (bezahlt)" : " (Vorkasse — Zahlung ausstehend)"}</p>
          <table style="width:100%">${artikel}</table>
          <p style="font-size:16px"><b>Gesamt: ${euro(d.gesamt)}</b></p></div>`,
      });
    } catch { /* ignore */ }
  }
}
