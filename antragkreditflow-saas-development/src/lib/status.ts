export const APPLICATION_STATUSES = [
  "entwurf",
  "eingereicht",
  "in_pruefung",
  "dokumente_angefordert",
  "an_partner_uebermittelt",
  "vom_partner_genehmigt",
  "vom_partner_abgelehnt",
  "vertrag_bereit",
  "vertrag_unterschrieben",
  "ausgezahlt",
  "storniert",
] as const;

export type ApplicationStatus = (typeof APPLICATION_STATUSES)[number];

export const STATUS_LABELS: Record<ApplicationStatus, string> = {
  entwurf: "Entwurf",
  eingereicht: "Eingereicht",
  in_pruefung: "In Prüfung",
  dokumente_angefordert: "Dokumente angefordert",
  an_partner_uebermittelt: "An Partner übermittelt",
  vom_partner_genehmigt: "Genehmigt",
  vom_partner_abgelehnt: "Abgelehnt",
  vertrag_bereit: "Vertrag bereit",
  vertrag_unterschrieben: "Vertrag unterschrieben",
  ausgezahlt: "Ausgezahlt",
  storniert: "Storniert",
};

export const STATUS_COLORS: Record<ApplicationStatus, string> = {
  entwurf: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  eingereicht: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  in_pruefung: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  dokumente_angefordert: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  an_partner_uebermittelt: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  vom_partner_genehmigt: "bg-green-500/15 text-green-300 border-green-500/30",
  vom_partner_abgelehnt: "bg-red-500/15 text-red-300 border-red-500/30",
  vertrag_bereit: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  vertrag_unterschrieben: "bg-emerald-600/15 text-emerald-200 border-emerald-600/30",
  ausgezahlt: "bg-green-600/15 text-green-200 border-green-600/30",
  storniert: "bg-gray-500/15 text-gray-300 border-gray-500/30",
};

export const STATUS_DOT: Record<ApplicationStatus, string> = {
  entwurf: "bg-slate-500",
  eingereicht: "bg-blue-500",
  in_pruefung: "bg-amber-500",
  dokumente_angefordert: "bg-orange-500",
  an_partner_uebermittelt: "bg-purple-500",
  vom_partner_genehmigt: "bg-green-500",
  vom_partner_abgelehnt: "bg-red-500",
  vertrag_bereit: "bg-emerald-500",
  vertrag_unterschrieben: "bg-emerald-600",
  ausgezahlt: "bg-green-600",
  storniert: "bg-gray-500",
};

export const LOAN_TYPE_IDS = [
  "privatkredit",
  "immobilienkredit",
  "autokredit",
  "renovierungskredit",
  "geschaeftskredit",
  "liquiditaetskredit",
  "studienkredit",
  "reisekredit",
  "gesundheitskredit",
  "umschuldung",
] as const;

export type LoanTypeId = (typeof LOAN_TYPE_IDS)[number];
