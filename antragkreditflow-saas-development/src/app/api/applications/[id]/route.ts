import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { amortizationSchedules, documents, existingCredits, loanApplications } from "@/db/schema";
import { jsonError, requireUser } from "@/lib/api";

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
  const application = rows[0];
  if (!application) return jsonError("Antrag nicht gefunden.", 404);
  const [schedule, docs, credits] = await Promise.all([
    db
      .select()
      .from(amortizationSchedules)
      .where(eq(amortizationSchedules.applicationId, id)),
    db.select().from(documents).where(eq(documents.applicationId, id)),
    db.select().from(existingCredits).where(eq(existingCredits.applicationId, id)),
  ]);
  return NextResponse.json({
    application,
    schedule,
    documents: docs.map((d) => ({
      id: d.id,
      documentType: d.documentType,
      fileName: d.fileName,
      uploadedAt: d.uploadedAt,
    })),
    credits,
  });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const { id } = await ctx.params;
  const rows = await db
    .select()
    .from(loanApplications)
    .where(and(eq(loanApplications.id, id), eq(loanApplications.userId, auth.user.id)))
    .limit(1);
  if (!rows[0]) return jsonError("Antrag nicht gefunden.", 404);
  if (rows[0].status !== "entwurf") {
    return jsonError("Nur Entwürfe können gelöscht werden.");
  }
  await db.delete(loanApplications).where(eq(loanApplications.id, id));
  return NextResponse.json({ ok: true });
}
