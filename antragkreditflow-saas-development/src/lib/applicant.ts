import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles, users } from "@/db/schema";
import { createSession, getSessionUser, hashPassword } from "@/lib/auth";
import { randomBytes } from "crypto";
import { toIsoDate } from "@/lib/api";

export type ApplicantIdentity = {
  userId: string;
  sessionToken: string | null;
  signedIn: boolean;
};

export async function resolveApplicant(data: {
  email: string;
  phone: string;
  firstName: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: string;
  maritalStatus?: string;
  nationality?: string;
  street?: string;
  houseNumber?: string;
  postalCode?: string;
  city?: string;
  country?: string;
  employmentStatus?: string;
  employerName?: string;
  jobTitle?: string;
  monthlyNetIncome?: number | null;
  employmentSince?: string;
  iban?: string;
  bic?: string;
  accountHolder?: string;
}): Promise<ApplicantIdentity> {
  const session = await getSessionUser();
  if (session) return { userId: session.id, sessionToken: null, signedIn: true };

  const email = data.email.trim().toLowerCase();
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (existing[0]) {
    return { userId: existing[0].id, sessionToken: null, signedIn: false };
  }

  const passwordHash = await hashPassword(randomBytes(24).toString("hex"));
  const [user] = await db
    .insert(users)
    .values({
      email,
      passwordHash,
      phone: data.phone,
    })
    .returning({ id: users.id });

  await db.insert(profiles).values({
    id: user.id,
    firstName: data.firstName,
    lastName: data.lastName,
    gender: data.gender ?? null,
    dateOfBirth: toIsoDate(data.dateOfBirth),
    nationality: data.nationality ?? "DE",
    maritalStatus: data.maritalStatus ?? null,
    phone: data.phone,
    street: data.street ?? null,
    houseNumber: data.houseNumber ?? null,
    postalCode: data.postalCode ?? null,
    city: data.city ?? null,
    country: data.country ?? "DE",
    employmentStatus: data.employmentStatus ?? null,
    employerName: data.employerName ?? null,
    jobTitle: data.jobTitle ?? null,
    monthlyNetIncome: data.monthlyNetIncome != null ? data.monthlyNetIncome.toFixed(2) : null,
    employmentSince: toIsoDate(data.employmentSince),
    iban: data.iban ?? null,
    bic: data.bic ?? null,
    accountHolder: data.accountHolder ?? null,
    onboardingCompleted: true,
  });

  const sessionToken = await createSession(user.id);
  return { userId: user.id, sessionToken, signedIn: true };
}
