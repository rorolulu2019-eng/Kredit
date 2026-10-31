import { ensureLoanProducts, pingDb } from "@/lib/seed-products";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await pingDb();
    await ensureLoanProducts();
    return Response.json({ ok: true });
  } catch {
    return Response.json({ ok: false }, { status: 500 });
  }
}
