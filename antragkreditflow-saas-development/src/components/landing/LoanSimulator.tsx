"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { LOAN_PRODUCTS, getLoanProduct } from "@/data/loan-products";
import { LoanIcon } from "@/components/icons";
import { EXAMPLE_ANNUAL_RATE, LOAN_AMOUNT_MAX, LOAN_AMOUNT_MIN } from "@/lib/financial-engine";
import { formatPercent } from "@/lib/format";
import { DISCLAIMER_DE } from "@/lib/constants";
import { useWizardStore } from "@/stores/wizardStore";
import { LoanCalculatorFields } from "@/components/landing/LoanCalculatorFields";

export function LoanSimulator() {
  const patch = useWizardStore((s) => s.patch);
  const [loanType, setLoanType] = useState("privatkredit");
  const product = getLoanProduct(loanType);
  const [amount, setAmount] = useState(10_000);
  const [months, setMonths] = useState(36);

  const clampedAmount = Math.min(Math.max(amount, LOAN_AMOUNT_MIN), LOAN_AMOUNT_MAX);

  function applyToWizard() {
    patch({
      loanType,
      requestedAmount: clampedAmount,
      durationMonths: months,
    });
  }

  return (
    <section id="rechner" className="relative mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8">
      <div className="glass-hero border-credit-500/20 p-6 md:p-10">
        <p className="text-sm font-medium uppercase tracking-[0.18em] text-credit-400">Kreditrechner</p>
        <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight md:text-4xl">Ihre monatliche Rate</h2>
        <p className="mt-2 max-w-3xl text-text-secondary">
          Berechnen Sie in Echtzeit Ihre Beispielrate. Sie können Betrag, Laufzeit und Wunsch-Monatsrate direkt eintippen
          oder die Regler nutzen. Kreditbeträge von 2.000 € bis 50.000.000 €, Beispielzins{" "}
          {formatPercent(EXAMPLE_ANNUAL_RATE)} p.a.
        </p>

        <div className="mt-8">
          <label htmlFor="loan-type" className="mb-2 block text-sm font-medium text-text-secondary">
            Kreditart
          </label>
          <div className="relative max-w-md">
            <select
              id="loan-type"
              value={loanType}
              onChange={(e) => setLoanType(e.target.value)}
              className="field-input appearance-none pr-10"
            >
              {LOAN_PRODUCTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nameDe}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
          </div>
          <div className="mt-3 flex items-center gap-2 text-sm text-text-muted">
            <LoanIcon name={product.iconName} className="h-4 w-4 text-credit-400" />
            {product.descriptionDe}
          </div>
        </div>

        <div className="mt-8">
          <LoanCalculatorFields
            amount={clampedAmount}
            months={months}
            onAmountChange={setAmount}
            onMonthsChange={setMonths}
          />
        </div>

        <p className="mt-6 text-xs leading-relaxed text-text-muted">* {DISCLAIMER_DE}</p>
        <Link href="/antrag" onClick={applyToWizard} className="btn-primary mt-6 inline-flex">
          Unverbindlich anfragen →
        </Link>
      </div>
    </section>
  );
}
