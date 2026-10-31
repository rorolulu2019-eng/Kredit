import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { users } from "@/db/schema";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase();

  if (email && env.resendApiKey) {
    const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
    if (existing[0]) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${env.resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: env.resendFrom,
          to: [email],
          subject: "Passwort zurücksetzen – antragkreditflow",
          html: `<p>Guten Tag,</p><p>Sie haben eine Zurücksetzung Ihres Passworts angefordert. Bitte kontaktieren Sie uns, falls Sie diese Anfrage nicht gestellt haben.</p><p>antragkreditflow vergibt selbst keine Kredite.</p>`,
        }),
      }).catch(() => undefined);
    }
  }

  return NextResponse.json({
    ok: true,
    message:
      "Falls ein Konto mit dieser Adresse existiert, senden wir eine Nachricht. Transaktionale E-Mails werden über den konfigurierten Versanddienstleister zugestellt.",
  });
}
