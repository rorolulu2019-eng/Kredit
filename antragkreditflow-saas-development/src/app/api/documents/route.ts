import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { documents } from "@/db/schema";
import { requireUser } from "@/lib/api";

export async function GET() {
  const auth = await requireUser();
  if (auth.error) return auth.error;
  const rows = await db
    .select({
      id: documents.id,
      documentType: documents.documentType,
      fileName: documents.fileName,
      uploadedAt: documents.uploadedAt,
    })
    .from(documents)
    .where(eq(documents.userId, auth.user.id))
    .orderBy(desc(documents.uploadedAt));
  return NextResponse.json({ documents: rows });
}
