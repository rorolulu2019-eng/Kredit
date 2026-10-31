import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles } from "@/db/schema";
import { jsonError, requireUser, toIsoDate } from "@/lib/api";
import { profileUpdateSchema } from "@/lib/validators";

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const rows = await db.select().from(profiles).where(eq(profiles.id, auth.user.id)).limit(1);
  return NextResponse.json({ profile: rows[0] ?? null });
}

export async function PATCH(request: Request) {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const body = await request.json().catch(() => null);
  const parsed = profileUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Ungültige Angaben.");
  }
  const d = parsed.data;
  await db
    .update(profiles)
    .set({
      firstName: d.firstName,
      lastName: d.lastName,
      phone: d.phone ?? null,
      street: d.street ?? null,
      houseNumber: d.houseNumber ?? null,
      postalCode: d.postalCode ?? null,
      city: d.city ?? null,
      country: d.country ?? null,
      gender: d.gender ?? null,
      dateOfBirth: toIsoDate(d.dateOfBirth),
      maritalStatus: d.maritalStatus ?? null,
      nationality: d.nationality ?? null,
      employmentStatus: d.employmentStatus ?? null,
      employerName: d.employerName ?? null,
      jobTitle: d.jobTitle ?? null,
      monthlyNetIncome: d.monthlyNetIncome != null ? d.monthlyNetIncome.toFixed(2) : undefined,
      iban: d.iban ?? null,
      bic: d.bic ?? null,
      accountHolder: d.accountHolder ?? null,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, auth.user.id));
  return NextResponse.json({ ok: true });
}
