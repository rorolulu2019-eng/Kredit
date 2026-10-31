import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { db } from "@/db";
import { users } from "@/db/schema";
import { destroySession, sessionCookieOptions } from "@/lib/auth";
import { SESSION_COOKIE } from "@/lib/constants";
import { requireUser } from "@/lib/api";

export async function POST() {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) await destroySession(token);
  await db.delete(users).where(eq(users.id, auth.user.id));
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, "", sessionCookieOptions(0));
  return res;
}
