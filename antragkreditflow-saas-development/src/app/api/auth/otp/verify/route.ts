import { NextResponse } from "next/server";
import { and, desc, eq, gt } from "drizzle-orm";
import { db } from "@/db";
import { otpCodes, profiles, users } from "@/db/schema";
import { createSession, hashPassword, sessionCookieOptions, verifyPassword } from "@/lib/auth";
import { SESSION_COOKIE, SESSION_DAYS } from "@/lib/constants";
import { otpVerifySchema } from "@/lib/validators";
import { jsonError } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = otpVerifySchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Ungültiger Code.");
  }
  const phone = parsed.data.phone.replace(/\s/g, "");
  const rows = await db
    .select()
    .from(otpCodes)
    .where(and(eq(otpCodes.phone, phone), eq(otpCodes.consumed, false), gt(otpCodes.expiresAt, new Date())))
    .orderBy(desc(otpCodes.createdAt))
    .limit(1);
  const otp = rows[0];
  if (!otp || !(await verifyPassword(parsed.data.code, otp.codeHash))) {
    return jsonError("Der Code ist ungültig oder abgelaufen.", 401);
  }
  await db.update(otpCodes).set({ consumed: true }).where(eq(otpCodes.id, otp.id));

  const existing = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
  let userId = existing[0]?.id;
  let email = existing[0]?.email ?? "";
  if (!userId) {
    email = `telefon.${phone.replace(/\D/g, "")}@antragkreditflow.de`;
    const passwordHash = await hashPassword(crypto.randomUUID());
    const [created] = await db.insert(users).values({ email, passwordHash, phone }).returning({ id: users.id });
    userId = created.id;
    await db.insert(profiles).values({ id: userId, phone });
  }
  const token = await createSession(userId);
  const profile = await db.select().from(profiles).where(eq(profiles.id, userId)).limit(1);
  const res = NextResponse.json({
    user: {
      id: userId,
      email,
      phone,
      firstName: profile[0]?.firstName ?? "",
      lastName: profile[0]?.lastName ?? "",
    },
  });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_DAYS * 24 * 60 * 60));
  return res;
}
