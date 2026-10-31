import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { notifications } from "@/db/schema";
import { requireUser } from "@/lib/api";

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const rows = await db
    .select()
    .from(notifications)
    .where(eq(notifications.userId, auth.user.id))
    .orderBy(desc(notifications.createdAt));
  const unread = rows.filter((n) => !n.isRead).length;
  return NextResponse.json({ notifications: rows, unread });
}

export async function PATCH() {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, auth.user.id));
  return NextResponse.json({ ok: true });
}
