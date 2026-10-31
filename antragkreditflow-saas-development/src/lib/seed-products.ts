import { db } from "@/db";
import { loanProducts } from "@/db/schema";
import { LOAN_PRODUCTS } from "@/data/loan-products";
import { sql } from "drizzle-orm";

export async function ensureLoanProducts() {
  for (const p of LOAN_PRODUCTS) {
    await db
      .insert(loanProducts)
      .values({
        id: p.id,
        nameDe: p.nameDe,
        descriptionDe: p.descriptionDe,
        minAmount: String(p.minAmount),
        maxAmount: String(p.maxAmount),
        minDurationMonths: p.minDurationMonths,
        maxDurationMonths: p.maxDurationMonths,
        exampleAnnualRate: p.exampleAnnualRate.toFixed(3),
        insuranceRateMonthly: p.insuranceRateMonthly.toFixed(4),
        iconName: p.iconName,
        sortOrder: p.sortOrder,
        isActive: true,
      })
      .onConflictDoUpdate({
        target: loanProducts.id,
        set: {
          exampleAnnualRate: p.exampleAnnualRate.toFixed(3),
          minAmount: String(p.minAmount),
          maxAmount: String(p.maxAmount),
        },
      });
  }
}

export async function pingDb() {
  await db.execute(sql`select 1`);
}
