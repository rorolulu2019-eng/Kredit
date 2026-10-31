"use client";

import { useEffect, useMemo, useState } from "react";
import {
  AMOUNT_PRESETS,
  amountToSlider,
  calculateDuration,
  calculateTotals,
  EXAMPLE_ANNUAL_RATE,
  formatDurationLabel,
  LOAN_AMOUNT_MAX,
  LOAN_AMOUNT_MIN,
  LOAN_DURATION_MAX_MONTHS,
  LOAN_DURATION_MIN_MONTHS,
  sliderToAmount,
} from "@/lib/financial-engine";
import { formatCurrencyExact, formatNumber, formatPercent, parseGermanNumber } from "@/lib/format";
import { DURATION_PRESETS } from "@/lib/constants";
import { AnimatedNumber } from "@/components/landing/AnimatedNumber";

function clampAmount(n: number): number {
  if (!Number.isFinite(n)) return LOAN_AMOUNT_MIN;
  return Math.min(LOAN_AMOUNT_MAX, Math.max(LOAN_AMOUNT_MIN, Math.round(n)));
}

function clampMonths(n: number): number {
  if (!Number.isFinite(n)) return LOAN_DURATION_MIN_MONTHS;
  return Math.min(LOAN_DURATION_MAX_MONTHS, Math.max(LOAN_DURATION_MIN_MONTHS, Math.round(n)));
}

export function LoanCalculatorFields({
  amount,
  months,
  onAmountChange,
  onMonthsChange,
}: {
  amount: number;
  months: number;
  onAmountChange: (value: number) => void;
  onMonthsChange: (value: number) => void;
}) {
  const totals = useMemo(
    () => calculateTotals(amount, EXAMPLE_ANNUAL_RATE, months),
    [amount, months],
  );

  const [amountText, setAmountText] = useState(formatNumber(amount));
  const [monthsText, setMonthsText] = useState(String(months));
  const [paymentText, setPaymentText] = useState(formatNumber(totals.monthlyPayment));
  const [editingAmount, setEditingAmount] = useState(false);
  const [editingMonths, setEditingMonths] = useState(false);
  const [editingPayment, setEditingPayment] = useState(false);

  useEffect(() => {
    if (!editingAmount) setAmountText(formatNumber(amount));
  }, [amount, editingAmount]);

  useEffect(() => {
    if (!editingMonths) setMonthsText(String(months));
  }, [months, editingMonths]);

  useEffect(() => {
    if (!editingPayment) setPaymentText(formatNumber(totals.monthlyPayment));
  }, [totals.monthlyPayment, editingPayment]);

  function commitAmount() {
    const next = clampAmount(parseGermanNumber(amountText));
    onAmountChange(next);
    setAmountText(formatNumber(next));
    setEditingAmount(false);
  }

  function commitMonths() {
    const next = clampMonths(parseGermanNumber(monthsText));
    onMonthsChange(next);
    setMonthsText(String(next));
    setEditingMonths(false);
  }

  function commitPayment() {
    const desired = parseGermanNumber(paymentText);
    const nextMonths = calculateDuration(amount, EXAMPLE_ANNUAL_RATE, desired);
    onMonthsChange(nextMonths);
    const actual = calculateTotals(amount, EXAMPLE_ANNUAL_RATE, nextMonths).monthlyPayment;
    setPaymentText(formatNumber(actual));
    setEditingPayment(false);
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-text-secondary">
        Geben Sie Betrag, Laufzeit oder Wunschrate manuell ein – oder nutzen Sie die Schieberegler. Spanne:{" "}
        {formatNumber(LOAN_AMOUNT_MIN)} € bis {formatNumber(LOAN_AMOUNT_MAX)} €, {LOAN_DURATION_MIN_MONTHS}–
        {LOAN_DURATION_MAX_MONTHS} Monate, Beispielzins {formatPercent(EXAMPLE_ANNUAL_RATE)} p.a.
      </p>

      <div>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label htmlFor="loan-amount" className="text-sm font-medium text-text-secondary">
            Nettokreditbetrag
          </label>
          <div className="relative w-full sm:w-64">
            <input
              id="loan-amount"
              inputMode="decimal"
              value={amountText}
              onFocus={() => setEditingAmount(true)}
              onChange={(e) => {
                setEditingAmount(true);
                setAmountText(e.target.value);
              }}
              onBlur={commitAmount}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              className="field-input pr-10 text-right font-mono text-lg tabular"
              aria-label="Kreditbetrag manuell eingeben"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
              €
            </span>
          </div>
        </div>
        <input
          type="range"
          min={0}
          max={1000}
          value={amountToSlider(amount)}
          onChange={(e) => onAmountChange(sliderToAmount(Number(e.target.value)))}
          className="akf-range"
          aria-valuemin={LOAN_AMOUNT_MIN}
          aria-valuemax={LOAN_AMOUNT_MAX}
          aria-valuenow={amount}
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {AMOUNT_PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => onAmountChange(p.value)}
              className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                amount === p.value
                  ? "border-credit-500 bg-credit-500/15 text-credit-400"
                  : "border-white/10 text-text-secondary hover:border-white/20"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label htmlFor="loan-duration" className="text-sm font-medium text-text-secondary">
            Laufzeit in Monaten
          </label>
          <div className="flex w-full items-center gap-3 sm:w-auto">
            <input
              id="loan-duration"
              inputMode="numeric"
              value={monthsText}
              onFocus={() => setEditingMonths(true)}
              onChange={(e) => {
                setEditingMonths(true);
                setMonthsText(e.target.value);
              }}
              onBlur={commitMonths}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              className="field-input w-28 text-right font-mono tabular"
              aria-label="Laufzeit in Monaten manuell eingeben"
            />
            <span className="text-sm text-text-muted">{formatDurationLabel(months)}</span>
          </div>
        </div>
        <input
          id="duration-slider"
          type="range"
          min={LOAN_DURATION_MIN_MONTHS}
          max={LOAN_DURATION_MAX_MONTHS}
          value={months}
          onChange={(e) => onMonthsChange(Number(e.target.value))}
          className="akf-range"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {DURATION_PRESETS.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => onMonthsChange(d)}
              className={`rounded-lg border px-3 py-1.5 text-xs transition ${
                months === d
                  ? "border-credit-500 bg-credit-500/15 text-credit-400"
                  : "border-white/10 text-text-secondary hover:border-white/20"
              }`}
            >
              {d} Monate
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <label htmlFor="loan-payment" className="text-sm font-medium text-text-secondary">
            Wunsch-Monatsrate (berechnet die Laufzeit)
          </label>
          <div className="relative w-full sm:w-64">
            <input
              id="loan-payment"
              inputMode="decimal"
              value={paymentText}
              onFocus={() => setEditingPayment(true)}
              onChange={(e) => {
                setEditingPayment(true);
                setPaymentText(e.target.value);
              }}
              onBlur={commitPayment}
              onKeyDown={(e) => {
                if (e.key === "Enter") (e.target as HTMLInputElement).blur();
              }}
              className="field-input pr-10 text-right font-mono text-lg tabular"
              aria-label="Monatliche Rate manuell eingeben"
            />
            <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-text-muted">
              €
            </span>
          </div>
        </div>
        <p className="text-xs text-text-muted">
          Wenn Sie eine Rate eintragen, passen wir die Laufzeit automatisch an (zwischen {LOAN_DURATION_MIN_MONTHS} und{" "}
          {LOAN_DURATION_MAX_MONTHS} Monaten).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3" aria-live="polite">
        <div className="rounded-2xl border border-white/10 bg-vault-deep/70 p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">Monatliche Rate*</p>
          <p className="mt-1 font-mono text-xl tabular text-credit-400">
            <AnimatedNumber value={totals.monthlyPayment} />
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-vault-deep/70 p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">Gesamtbetrag</p>
          <p className="mt-1 font-mono text-xl tabular text-credit-400">
            <AnimatedNumber value={totals.totalRepayment} />
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-vault-deep/70 p-4">
          <p className="text-xs uppercase tracking-wider text-text-muted">Zinskosten</p>
          <p className="mt-1 font-mono text-xl tabular text-credit-400">
            <AnimatedNumber value={totals.totalInterest} />
          </p>
        </div>
      </div>
      <p className="text-xs text-text-muted">
        Berechnet mit {formatPercent(EXAMPLE_ANNUAL_RATE)} p.a. Beispielzins. Angezeigte Rate:{" "}
        {formatCurrencyExact(totals.monthlyPayment)}.
      </p>
    </div>
  );
}
