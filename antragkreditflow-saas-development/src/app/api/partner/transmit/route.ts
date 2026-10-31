import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { loanApplications, notifications, profiles } from "@/db/schema";
import { jsonError, requireUser } from "@/lib/api";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const body = (await request.json().catch(() => null)) as { applicationId?: string } | null;
  if (!body?.applicationId) return jsonError("Antrag fehlt.");

  const rows = await db
    .select()
    .from(loanApplications)
    .where(eq(loanApplications.id, body.applicationId))
    .limit(1);
  const app = rows[0];
  if (!app || app.userId !== auth.user.id) return jsonError("Antrag nicht gefunden.", 404);

  const payload = {
    applicationNumber: app.applicationNumber,
    loanType: app.loanType,
    amount: app.requestedAmount,
    durationMonths: app.durationMonths,
    partner: "Verivox (Beispiel-Endpoint)",
  };

  const partnerConfigured = Boolean(env.partnerApiUrl);
  let partnerReference = `PENDING-${app.applicationNumber}`;
  let notes = "Partner-API noch nicht konfiguriert. Anfrage intern protokolliert.";

  if (partnerConfigured) {
    try {
      const res = await fetch(env.partnerApiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${env.partnerApiKey}` },
        body: JSON.stringify(payload),
      });
      const json = (await res.json().catch(() => ({}))) as { reference?: string };
      partnerReference = json.reference ?? partnerReference;
      notes = "An Partner übermittelt.";
    } catch {
      notes = "Übermittlung fehlgeschlagen, erneuter Versuch erforderlich.";
    }
  }

  await db
    .update(loanApplications)
    .set({
      status: "an_partner_uebermittelt",
      partnerName: "Verivox",
      partnerReference,
      notes,
      updatedAt: new Date(),
    })
    .where(eq(loanApplications.id, app.id));

  await db.insert(notifications).values({
    userId: auth.user.id,
    title: "An Partner übermittelt",
    message: `Ihre Anfrage ${app.applicationNumber} wurde an unseren Kreditpartner weitergeleitet.`,
    type: "info",
    link: `/dashboard/antrag/${app.id}`,
  });

  const profile = await db.select().from(profiles).where(eq(profiles.id, auth.user.id)).limit(1);
  if (env.resendApiKey && profile[0]) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.resendFrom,
        to: [auth.user.email],
        subject: "Ihre Kreditanfrage wurde weitergeleitet",
        html: `<p>Guten Tag ${profile[0].firstName},</p><p>Ihre Anfrage ${app.applicationNumber} wurde an einen Partner weitergeleitet.</p><p>antragkreditflow vergibt selbst keine Kredite.</p>`,
      }),
    }).catch(() => undefined);
  }

  return NextResponse.json({ ok: true, partnerReference, notes });
}
