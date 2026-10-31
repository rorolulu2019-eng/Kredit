import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/constants";
import { getUserBySessionToken, type SessionUser } from "@/lib/auth";
import { generateApplicationNumber as buildApplicationNumber } from "@/lib/ids";

export async function requireUser(): Promise<
  { user: SessionUser; error?: undefined } | { user?: undefined; error: NextResponse }
> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) {
    return { error: NextResponse.json({ error: "Bitte melden Sie sich an." }, { status: 401 }) };
  }
  const user = await getUserBySessionToken(token);
  if (!user) {
    return { error: NextResponse.json({ error: "Sitzung abgelaufen." }, { status: 401 }) };
  }
  return { user };
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function generateApplicationNumber(): string {
  return buildApplicationNumber();
}

export function toIsoDate(value: string | undefined | null): string | null {
  if (!value) return null;
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return d.toISOString().slice(0, 10);
}
