import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { amortizationSchedules, loanApplications } from "@/db/schema";
import { COMPANY, DISCLAIMER_DE } from "@/lib/constants";
import { requireUser } from "@/lib/api";
import { getLoanProduct } from "@/data/loan-products";
import { formatCurrencyExact, formatDate } from "@/lib/format";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { id } = await ctx.params;
  const rows = await db
    .select()
    .from(loanApplications)
    .where(and(eq(loanApplications.id, id), eq(loanApplications.userId, auth.user.id)))
    .limit(1);
  const app = rows[0];
  if (!app) return new Response("Nicht gefunden", { status: 404 });
  const schedule = await db
    .select()
    .from(amortizationSchedules)
    .where(eq(amortizationSchedules.applicationId, id));
  const product = getLoanProduct(app.loanType);
  const snapshot = app.personalSnapshot ? (JSON.parse(app.personalSnapshot) as Record<string, string>) : {};
  const firstMonths = schedule.slice(0, 12);
  const html = `<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="utf-8" />
  <title>Zusammenfassung ${app.applicationNumber}</title>
  <style>
    body { font-family: Inter, system-ui, sans-serif; background: #08090A; color: #F8FAFC; padding: 40px; }
    h1 { font-size: 28px; }
    table { width: 100%; border-collapse: collapse; margin-top: 16px; }
    th, td { border-bottom: 1px solid #222; padding: 8px; text-align: left; font-size: 13px; }
    .muted { color: #94A3B8; font-size: 12px; }
    .card { background: #16181D; border: 1px solid #222; border-radius: 16px; padding: 24px; margin: 16px 0; }
  </style>
</head>
<body>
  <h1>antragkreditflow – Zusammenfassung</h1>
  <p class="muted">${formatDate(new Date())} · ${app.applicationNumber}</p>
  <div class="card">
    <p><strong>${snapshot.firstName ?? ""} ${snapshot.lastName ?? ""}</strong><br/>${snapshot.email ?? ""}</p>
    <p>${product.nameDe}<br/>${formatCurrencyExact(Number(app.requestedAmount))} · ${app.durationMonths} Monate</p>
    <p>Beispielrate: ${formatCurrencyExact(Number(app.exampleMonthlyPayment ?? 0))}</p>
  </div>
  <h2>Tilgungsplan (erste 12 Monate, Beispiel)</h2>
  <table>
    <thead><tr><th>Monat</th><th>Zins</th><th>Tilgung</th><th>Restschuld</th></tr></thead>
    <tbody>
      ${firstMonths
        .map(
          (r) =>
            `<tr><td>${r.monthNumber}</td><td>${formatCurrencyExact(Number(r.interestPart))}</td><td>${formatCurrencyExact(Number(r.principalPart))}</td><td>${formatCurrencyExact(Number(r.remainingBalance))}</td></tr>`,
        )
        .join("")}
    </tbody>
  </table>
  <p class="muted" style="margin-top:24px">Dies ist eine unverbindliche Zusammenfassung. antragkreditflow vergibt selbst keine Kredite.</p>
  <p class="muted">${DISCLAIMER_DE}</p>
  <p class="muted">${COMPANY.legalName} · ${COMPANY.address}, ${COMPANY.postalCode} ${COMPANY.city} · UID ${COMPANY.uid}</p>
</body>
</html>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": `inline; filename="${app.applicationNumber}.html"`,
    },
  });
}
