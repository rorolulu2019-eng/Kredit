export type LoanProduct = {
  id: string;
  nameDe: string;
  descriptionDe: string;
  minAmount: number;
  maxAmount: number;
  minDurationMonths: number;
  maxDurationMonths: number;
  exampleAnnualRate: number;
  insuranceRateMonthly: number;
  iconName: string;
  sortOrder: number;
};

export const LOAN_PRODUCTS: LoanProduct[] = [
  {
    id: "privatkredit",
    nameDe: "Privatkredit",
    descriptionDe:
      "Flexibler Ratenkredit für Ihre persönlichen Wünsche – von der Einrichtung bis zur Hochzeit.",
    minAmount: 2000,
    maxAmount: 75000,
    minDurationMonths: 3,
    maxDurationMonths: 120,
    exampleAnnualRate: 2.2,
    insuranceRateMonthly: 0,
    iconName: "wallet",
    sortOrder: 1,
  },
  {
    id: "immobilienkredit",
    nameDe: "Immobilienkredit",
    descriptionDe:
      "Günstige Baufinanzierung für Kauf, Neubau oder Anschlussfinanzierung Ihrer Traumimmobilie.",
    minAmount: 50000,
    maxAmount: 5000000,
    minDurationMonths: 12,
    maxDurationMonths: 360,
    exampleAnnualRate: 2.2,
    insuranceRateMonthly: 0,
    iconName: "home",
    sortOrder: 2,
  },
  {
    id: "autokredit",
    nameDe: "Autokredit",
    descriptionDe: "Finanzierung für Neu- und Gebrauchtwagen zu attraktiven Beispielkonditionen.",
    minAmount: 2000,
    maxAmount: 150000,
    minDurationMonths: 3,
    maxDurationMonths: 96,
    exampleAnnualRate: 2.2,
    insuranceRateMonthly: 0,
    iconName: "car",
    sortOrder: 3,
  },
  {
    id: "renovierungskredit",
    nameDe: "Renovierungskredit",
    descriptionDe: "Modernisierung, Sanierung oder Umbau – steigern Sie den Wert Ihrer Immobilie.",
    minAmount: 2000,
    maxAmount: 500000,
    minDurationMonths: 3,
    maxDurationMonths: 180,
    exampleAnnualRate: 2.2,
    insuranceRateMonthly: 0,
    iconName: "paintbrush",
    sortOrder: 4,
  },
  {
    id: "geschaeftskredit",
    nameDe: "Geschäftskredit",
    descriptionDe: "Wachstumsfinanzierung für Selbstständige, Freiberufler und Unternehmen jeder Größe.",
    minAmount: 5000,
    maxAmount: 10000000,
    minDurationMonths: 3,
    maxDurationMonths: 240,
    exampleAnnualRate: 2.2,
    insuranceRateMonthly: 0,
    iconName: "briefcase",
    sortOrder: 5,
  },
  {
    id: "liquiditaetskredit",
    nameDe: "Liquiditätskredit",
    descriptionDe: "Kurzfristige Überbrückung für saisonale Schwankungen und unerwartete Ausgaben.",
    minAmount: 5000,
    maxAmount: 5000000,
    minDurationMonths: 3,
    maxDurationMonths: 60,
    exampleAnnualRate: 2.2,
    insuranceRateMonthly: 0,
    iconName: "trending-up",
    sortOrder: 6,
  },
  {
    id: "studienkredit",
    nameDe: "Studienkredit",
    descriptionDe: "Investieren Sie in Ihre Zukunft – flexible Studienfinanzierung zu fairen Konditionen.",
    minAmount: 2000,
    maxAmount: 80000,
    minDurationMonths: 6,
    maxDurationMonths: 180,
    exampleAnnualRate: 2.2,
    insuranceRateMonthly: 0,
    iconName: "graduation-cap",
    sortOrder: 7,
  },
  {
    id: "reisekredit",
    nameDe: "Reisekredit",
    descriptionDe: "Erfüllen Sie sich Ihren Reisewunsch – flexibel und unkompliziert.",
    minAmount: 2000,
    maxAmount: 50000,
    minDurationMonths: 3,
    maxDurationMonths: 84,
    exampleAnnualRate: 2.2,
    insuranceRateMonthly: 0,
    iconName: "plane",
    sortOrder: 8,
  },
  {
    id: "gesundheitskredit",
    nameDe: "Gesundheitskredit",
    descriptionDe: "Zahnarzt, OP, Kur oder Therapie – Gesundheit sollte keine Frage des Geldes sein.",
    minAmount: 2000,
    maxAmount: 100000,
    minDurationMonths: 3,
    maxDurationMonths: 120,
    exampleAnnualRate: 2.2,
    insuranceRateMonthly: 0,
    iconName: "heart-pulse",
    sortOrder: 9,
  },
  {
    id: "umschuldung",
    nameDe: "Umschuldung",
    descriptionDe:
      "Fassen Sie mehrere teure Kredite zu einem günstigen zusammen und senken Sie Ihre monatliche Belastung.",
    minAmount: 5000,
    maxAmount: 50000000,
    minDurationMonths: 6,
    maxDurationMonths: 360,
    exampleAnnualRate: 2.2,
    insuranceRateMonthly: 0,
    iconName: "refresh-cw",
    sortOrder: 10,
  },
];

export function getLoanProduct(id: string): LoanProduct {
  return LOAN_PRODUCTS.find((p) => p.id === id) ?? LOAN_PRODUCTS[0];
}
