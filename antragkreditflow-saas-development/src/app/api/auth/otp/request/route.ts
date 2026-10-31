import { NextResponse } from "next/server";
import { db } from "@/db";
import { otpCodes } from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { otpRequestSchema } from "@/lib/validators";
import { jsonError } from "@/lib/api";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = otpRequestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Ungültige Telefonnummer.");
  }
  const phone = parsed.data.phone.replace(/\s/g, "");
  const code = String(Math.floor(100000 + Math.random() * 900000));
  const codeHash = await hashPassword(code);
  await db.insert(otpCodes).values({
    phone,
    codeHash,
    expiresAt: new Date(Date.now() + 10 * 60 * 1000),
  });

  if (env.smsApiUrl && env.smsApiKey) {
    await fetch(env.smsApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.smsApiKey}`,
      },
      body: JSON.stringify({
        to: phone,
        text: `Ihr antragkreditflow Bestätigungscode lautet ${code}. Er ist 10 Minuten gültig.`,
      }),
    }).catch(() => undefined);
  }

  return NextResponse.json({
    ok: true,
    message: "Falls die Nummer gültig ist, erhalten Sie in Kürze einen Bestätigungscode.",
  });
}
