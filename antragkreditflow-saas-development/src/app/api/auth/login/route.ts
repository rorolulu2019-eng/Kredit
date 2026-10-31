import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { profiles, users } from "@/db/schema";
import { createSession, sessionCookieOptions, verifyPassword } from "@/lib/auth";
import { SESSION_COOKIE, SESSION_DAYS } from "@/lib/constants";
import { loginSchema } from "@/lib/validators";
import { jsonError } from "@/lib/api";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Ungültige Angaben.");
  }

  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      passwordHash: users.passwordHash,
      phone: users.phone,
      firstName: profiles.firstName,
      lastName: profiles.lastName,
    })
    .from(users)
    .innerJoin(profiles, eq(profiles.id, users.id))
    .where(eq(users.email, parsed.data.email))
    .limit(1);
  const user = rows[0];
  if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
    return jsonError("E-Mail oder Passwort ist ungültig.", 401);
  }
  const token = await createSession(user.id);
  const res = NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.firstName,
      lastName: user.lastName,
    },
  });
  res.cookies.set(SESSION_COOKIE, token, sessionCookieOptions(SESSION_DAYS * 24 * 60 * 60));
  return res;
}
