export const LOAN_AMOUNT_MIN = 2_000;
export const LOAN_AMOUNT_MAX = 50_000_000;
export const LOAN_DURATION_MIN_MONTHS = 3;
export const LOAN_DURATION_MAX_MONTHS = 360;
export const EXAMPLE_ANNUAL_RATE = 2.2;

export function calculateMonthlyPayment(
  principal: number,
  annualRatePercent: number,
  durationMonths: number,
): number {
  if (principal <= 0 || durationMonths <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return principal / durationMonths;
  const factor = Math.pow(1 + r, durationMonths);
  return Math.round(((principal * (r * factor)) / (factor - 1)) * 100) / 100;
}

export function calculateDuration(
  principal: number,
  annualRatePercent: number,
  desiredMonthlyPayment: number,
): number {
  if (principal <= 0 || desiredMonthlyPayment <= 0) return 0;
  const r = annualRatePercent / 100 / 12;
  if (r === 0) return Math.ceil(principal / desiredMonthlyPayment);
  const minPayment = principal * r;
  if (desiredMonthlyPayment <= minPayment) return LOAN_DURATION_MAX_MONTHS;
  const n = Math.ceil(
    Math.log(desiredMonthlyPayment / (desiredMonthlyPayment - principal * r)) /
      Math.log(1 + r),
  );
  return Math.min(Math.max(n, LOAN_DURATION_MIN_MONTHS), LOAN_DURATION_MAX_MONTHS);
}

export interface AmortizationRow {
  month: number;
  date: string;
  payment: number;
  principalPart: number;
  interestPart: number;
  remainingBalance: number;
}

export function generateAmortizationSchedule(
  principal: number,
  annualRatePercent: number,
  durationMonths: number,
  startDate: Date = new Date(),
): AmortizationRow[] {
  const r = annualRatePercent / 100 / 12;
  const monthlyPayment = calculateMonthlyPayment(principal, annualRatePercent, durationMonths);
  let balance = principal;
  const schedule: AmortizationRow[] = [];

  for (let m = 1; m <= durationMonths; m++) {
    const interestPart = Math.round(balance * r * 100) / 100;
    const principalPart = Math.min(
      Math.round((monthlyPayment - interestPart) * 100) / 100,
      Math.round(balance * 100) / 100,
    );
    balance = Math.max(0, Math.round((balance - principalPart) * 100) / 100);
    const paymentDate = new Date(startDate);
    paymentDate.setMonth(paymentDate.getMonth() + m);

    schedule.push({
      month: m,
      date: paymentDate.toLocaleDateString("de-DE"),
      payment: Math.round((principalPart + interestPart) * 100) / 100,
      principalPart,
      interestPart,
      remainingBalance: balance,
    });
  }
  return schedule;
}

export function calculateTotals(
  principal: number,
  annualRatePercent: number,
  durationMonths: number,
) {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRatePercent, durationMonths);
  const totalRepayment = Math.round(monthlyPayment * durationMonths * 100) / 100;
  const totalInterest = Math.round((totalRepayment - principal) * 100) / 100;
  return { monthlyPayment, totalRepayment, totalInterest };
}

export interface ExistingCredit {
  creditorName: string;
  remainingDebt: number;
  monthlyPayment: number;
  annualRate: number;
  remainingMonths: number;
}

export interface BuybackResult {
  totalDebt: number;
  currentMonthlyTotal: number;
  newMonthlyPayment: number;
  monthlySavings: number;
  totalSavings: number;
  suggestedDuration: number;
}

export function calculateBuybackSavings(
  credits: ExistingCredit[],
  newRate: number = EXAMPLE_ANNUAL_RATE,
): BuybackResult {
  const totalDebt = credits.reduce((s, c) => s + c.remainingDebt, 0);
  const currentMonthlyTotal = credits.reduce((s, c) => s + c.monthlyPayment, 0);
  const maxDuration = Math.min(
    Math.max(...credits.map((c) => c.remainingMonths), LOAN_DURATION_MIN_MONTHS),
    LOAN_DURATION_MAX_MONTHS,
  );
  const newMonthlyPayment = calculateMonthlyPayment(totalDebt, newRate, maxDuration);
  const monthlySavings = Math.round((currentMonthlyTotal - newMonthlyPayment) * 100) / 100;
  const oldTotalCost = credits.reduce((s, c) => s + c.monthlyPayment * c.remainingMonths, 0);
  const newTotalCost = newMonthlyPayment * maxDuration;

  return {
    totalDebt: Math.round(totalDebt * 100) / 100,
    currentMonthlyTotal: Math.round(currentMonthlyTotal * 100) / 100,
    newMonthlyPayment: Math.round(newMonthlyPayment * 100) / 100,
    monthlySavings: Math.max(0, monthlySavings),
    totalSavings: Math.max(0, Math.round((oldTotalCost - newTotalCost) * 100) / 100),
    suggestedDuration: maxDuration,
  };
}

const LOG_MIN = Math.log10(LOAN_AMOUNT_MIN);
const LOG_MAX = Math.log10(LOAN_AMOUNT_MAX);

export function sliderToAmount(sliderValue: number): number {
  const log = LOG_MIN + (sliderValue / 1000) * (LOG_MAX - LOG_MIN);
  const raw = Math.pow(10, log);
  if (raw < 10_000) return Math.round(raw / 100) * 100;
  if (raw < 100_000) return Math.round(raw / 1_000) * 1_000;
  if (raw < 1_000_000) return Math.round(raw / 5_000) * 5_000;
  if (raw < 10_000_000) return Math.round(raw / 50_000) * 50_000;
  return Math.round(raw / 100_000) * 100_000;
}

export function amountToSlider(amount: number): number {
  const log = Math.log10(Math.max(LOAN_AMOUNT_MIN, Math.min(LOAN_AMOUNT_MAX, amount)));
  return Math.round(((log - LOG_MIN) / (LOG_MAX - LOG_MIN)) * 1000);
}

export const AMOUNT_PRESETS = [
  { label: "2.000 €", value: 2_000 },
  { label: "10.000 €", value: 10_000 },
  { label: "50.000 €", value: 50_000 },
  { label: "100.000 €", value: 100_000 },
  { label: "500.000 €", value: 500_000 },
  { label: "1 Mio. €", value: 1_000_000 },
  { label: "5 Mio. €", value: 5_000_000 },
  { label: "10 Mio. €", value: 10_000_000 },
  { label: "50 Mio. €", value: 50_000_000 },
] as const;

export function formatDurationLabel(months: number): string {
  const years = Math.floor(months / 12);
  const rest = months % 12;
  if (years === 0) return `${months} Monate`;
  if (rest === 0) return `${months} Monate (${years} ${years === 1 ? "Jahr" : "Jahre"})`;
  return `${months} Monate (${years} ${years === 1 ? "Jahr" : "Jahre"}, ${rest} ${rest === 1 ? "Monat" : "Monate"})`;
}
