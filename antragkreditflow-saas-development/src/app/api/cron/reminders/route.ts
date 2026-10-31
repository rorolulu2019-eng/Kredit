import { NextResponse } from "next/server";
import { and, eq, lt } from "drizzle-orm";
import { db } from "@/db";
import { loanApplications, notifications } from "@/db/schema";

export async function GET() {
  const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000);
  const drafts = await db
    .select()
    .from(loanApplications)
    .where(and(eq(loanApplications.status, "entwurf"), lt(loanApplications.createdAt, cutoff)));

  for (const app of drafts) {
    await db.insert(notifications).values({
      userId: app.userId,
      title: "Ihr Entwurf wartet",
      message: `Ihre Kreditanfrage ${app.applicationNumber} ist noch ein Entwurf. Schließen Sie sie bei Bedarf ab.`,
      type: "warning",
      link: "/antrag",
    });
  }

  return NextResponse.json({ processed: drafts.length });
}
