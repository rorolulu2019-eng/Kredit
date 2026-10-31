import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles, users } from "@/db/schema";
import { createSession, hashPassword, sessionCookieOptions } from "@/lib/auth";
import { SESSION_COOKIE, SESSION_DAYS } from "@/lib/constants";
import { registerSchema } from "@/lib/validators";
import { jsonError } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = registerSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Ungültige Angaben.");
  }
  const data = parsed.data;
  const existing = await db.select({ id: users.id }).from(users).where(eq(users.email, data.email)).limit(1);
  if (existing.length > 0) {
    return jsonError("Für diese E-Mail-Adresse existiert bereits ein Konto.");
  }
  const passwordHash = await hashPassword(data.password);
  const [user] = await db
    .insert(users)
    .values({ email: data.email, passwordHash })
    .returning({ id: users.id, email: users.email });
  await db.insert(profiles).values({
    id: user.id,
    firstName: data.firstName,
    lastName: data.lastName,
  });
  const token = await createSession(user.id);
  const res = NextResponse.json({
    user: { id: user.id, email: user.email, firstName: data.firstName, lastName: data.lastName, phone: null },
  });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_DAYS * 24 * 60 * 60));
  return res;
}
