import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

/* Newsletter-Anmeldungen — lokale JSON-Ablage (sofort lauffähig).
   Für Live-Betrieb später an ESP (Klaviyo/Brevo) via ENV NEWSLETTER_WEBHOOK_URL. */
const DATEI = path.join(process.cwd(), "_data", "newsletter.json");

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !String(email).includes("@")) {
      return NextResponse.json({ fehler: "Ungültige E-Mail." }, { status: 400 });
    }
    let alle: unknown[] = [];
    try { alle = JSON.parse(fs.readFileSync(DATEI, "utf8")); } catch {}
    if (!alle.some((e) => (e as { email?: string })?.email === email)) {
      alle.push({ email, zeitpunkt: new Date().toISOString() });
      fs.mkdirSync(path.dirname(DATEI), { recursive: true });
      fs.writeFileSync(DATEI, JSON.stringify(alle, null, 1));
    }
    const webhook = process.env.NEWSLETTER_WEBHOOK_URL;
    if (webhook) fetch(webhook, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email }) }).catch(() => {});
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ fehler: "Fehler." }, { status: 500 });
  }
}
