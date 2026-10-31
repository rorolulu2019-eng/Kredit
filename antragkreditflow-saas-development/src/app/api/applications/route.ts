import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  amortizationSchedules,
  documents,
  existingCredits,
  loanApplications,
  notifications,
  profiles,
} from "@/db/schema";
import { requireUser, generateApplicationNumber, jsonError, toIsoDate } from "@/lib/api";
import { applicationSubmitSchema } from "@/lib/validators";
import { calculateTotals, generateAmortizationSchedule } from "@/lib/financial-engine";
import { EXAMPLE_ANNUAL_RATE } from "@/lib/financial-engine";
import { ensureLoanProducts } from "@/lib/seed-products";
import { resolveApplicant } from "@/lib/applicant";
import { sessionCookieOptions } from "@/lib/auth";
import { SESSION_COOKIE, SESSION_DAYS } from "@/lib/constants";
import { env } from "@/lib/env";

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  await ensureLoanProducts();
  const applications = await db
    .select()
    .from(loanApplications)
    .where(eq(loanApplications.userId, auth.user.id))
    .orderBy(desc(loanApplications.createdAt));
  return NextResponse.json({ applications });
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = applicationSubmitSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Die Angaben sind unvollständig.");
  }
  const data = parsed.data;
  if (data.requestedAmount < 2_000 || data.requestedAmount > 50_000_000) {
    return jsonError("Der Betrag muss zwischen 2.000 € und 50.000.000 € liegen.");
  }

  const applicant = await resolveApplicant(data);
  const userId = applicant.userId;
  const totals = calculateTotals(data.requestedAmount, EXAMPLE_ANNUAL_RATE, data.durationMonths);
  const applicationNumber = generateApplicationNumber();
  const snapshot = JSON.stringify({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    city: data.city,
    street: data.street,
    gender: data.gender,
  });

  const [app] = await db
    .insert(loanApplications)
    .values({
      userId,
      applicationNumber,
      loanType: data.loanType,
      requestedAmount: data.requestedAmount.toFixed(2),
      durationMonths: data.durationMonths,
      exampleAnnualRate: EXAMPLE_ANNUAL_RATE.toFixed(3),
      exampleMonthlyPayment: totals.monthlyPayment.toFixed(2),
      exampleTotalRepayment: totals.totalRepayment.toFixed(2),
      exampleTotalInterest: totals.totalInterest.toFixed(2),
      purpose: data.purpose ?? null,
      status: "eingereicht",
      personalSnapshot: snapshot,
      submittedAt: new Date(),
      notes: "Anfrage zur Weiterleitung an einen Kreditpartner erfasst.",
    })
    .returning({ id: loanApplications.id, applicationNumber: loanApplications.applicationNumber });

  if (data.existingCredits && data.existingCredits.length > 0) {
    await db.insert(existingCredits).values(
      data.existingCredits.map((c) => ({
        applicationId: app.id,
        creditorName: c.creditorName || "Unbekannt",
        remainingDebt: c.remainingDebt.toFixed(2),
        monthlyPayment: c.monthlyPayment.toFixed(2),
        annualInterestRate: c.annualRate.toFixed(3),
        remainingMonths: c.remainingMonths,
      })),
    );
  }

  if (data.documents && data.documents.length > 0) {
    await db.insert(documents).values(
      data.documents.map((d) => ({
        userId,
        applicationId: app.id,
        documentType: d.documentType,
        fileName: d.fileName,
        fileSizeBytes: d.fileSizeBytes,
        mimeType: d.mimeType,
        fileData: d.dataUrl?.startsWith("data:") ? d.dataUrl : null,
      })),
    );
  }

  const schedule = generateAmortizationSchedule(
    data.requestedAmount,
    EXAMPLE_ANNUAL_RATE,
    data.durationMonths,
  );
  if (schedule.length > 0) {
    await db.insert(amortizationSchedules).values(
      schedule.map((row) => {
        const [day, month, year] = row.date.split(".");
        const iso = `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
        return {
          applicationId: app.id,
          monthNumber: row.month,
          paymentDate: iso,
          principalPart: row.principalPart.toFixed(2),
          interestPart: row.interestPart.toFixed(2),
          totalPayment: row.payment.toFixed(2),
          remainingBalance: row.remainingBalance.toFixed(2),
        };
      }),
    );
  }

  await db.insert(notifications).values({
    userId,
    title: "Anfrage eingereicht",
    message: `Ihre Kreditanfrage ${applicationNumber} wurde erfolgreich eingereicht und wird geprüft.`,
    type: "success",
    link: `/dashboard/antrag/${app.id}`,
  });

  await db
    .update(profiles)
    .set({
      firstName: data.firstName,
      lastName: data.lastName,
      gender: data.gender,
      dateOfBirth: toIsoDate(data.dateOfBirth),
      nationality: data.nationality,
      maritalStatus: data.maritalStatus,
      phone: data.phone,
      street: data.street,
      houseNumber: data.houseNumber,
      postalCode: data.postalCode,
      city: data.city,
      country: data.country,
      employmentStatus: data.employmentStatus,
      employerName: data.employerName ?? null,
      jobTitle: data.jobTitle ?? null,
      monthlyNetIncome: data.monthlyNetIncome != null ? data.monthlyNetIncome.toFixed(2) : null,
      employmentSince: toIsoDate(data.employmentSince),
      iban: data.iban,
      bic: data.bic ?? null,
      accountHolder: data.accountHolder,
      onboardingCompleted: true,
      updatedAt: new Date(),
    })
    .where(eq(profiles.id, userId));

  if (env.resendApiKey) {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: env.resendFrom,
        to: [data.email],
        subject: `Ihre Kreditanfrage ${applicationNumber}`,
        html: `<p>Guten Tag ${data.firstName},</p><p>wir haben Ihre Anfrage <strong>${applicationNumber}</strong> erhalten und leiten sie an einen Kreditpartner weiter.</p><p>antragkreditflow vergibt selbst keine Kredite.</p>`,
      }),
    }).catch(() => undefined);
  }

  const res = NextResponse.json({
    id: app.id,
    applicationNumber: app.applicationNumber,
    signedIn: applicant.signedIn,
  });
  if (applicant.sessionToken) {
    res.cookies.set(SESSION_COOKIE, applicant.sessionToken, sessionCookieOptions(SESSION_DAYS * 24 * 60 * 60));
  }
  return res;
}
