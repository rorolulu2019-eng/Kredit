export const COMPANY = {
  name: "antragkreditflow",
  legalName: "antragkreditflow AG",
  address: "Breitholzstrasse 17",
  postalCode: "8370",
  city: "Sirnach",
  country: "Schweiz",
  representative: "Christian SCHENNACH",
  uid: "CHE-410.470.148",
  register: "Handelsregister Kanton Thurgau",
  email: "webmail.antrag.kredit.sofort@gmail.com",
  phone: "+49 15511 241487",
  phoneFormatted: "+49 15511 241487",
  domain: "antragkreditflow.de",
  copyrightHolder: "AntragKreditFlow",
  slogan: "Ihr unabhängiger Kreditvergleich – transparent, schnell, kostenlos.",
  tagline: "Kreditvergleich für Deutschland, Österreich und die Schweiz",
} as const;

export const WHATSAPP = {
  number: "4915511241487",
  displayNumber: "+49 15511 241487",
  baseURL: "https://wa.me/4915511241487",
} as const;

export const LOAN = {
  amountMin: 2_000,
  amountMax: 50_000_000,
  durationMinMonths: 3,
  durationMaxMonths: 360,
  exampleAnnualRate: 2.2,
} as const;

export const IBAN_PLACEHOLDER = "DE89 3704 0044 0532 0130 00";

export const DISCLAIMER_DE =
  "antragkreditflow.de ist ein unabhängiges Vergleichsportal und vergibt selbst keine Kredite. Die angezeigten Konditionen sind Beispielwerte. Die tatsächlichen Konditionen hängen von der Bonitätsprüfung unseres Kreditpartners ab." as const;

export const SESSION_COOKIE = "akf_session";
export const SESSION_DAYS = 7;

export const COUNTRIES = [
  { code: "DE", name: "Deutschland" },
  { code: "AT", name: "Österreich" },
  { code: "CH", name: "Schweiz" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LU", name: "Luxemburg" },
  { code: "BE", name: "Belgien (DG)" },
] as const;

export const NATIONALITIES = [
  { code: "DE", name: "Deutschland" },
  { code: "AT", name: "Österreich" },
  { code: "CH", name: "Schweiz" },
  { code: "LI", name: "Liechtenstein" },
  { code: "LU", name: "Luxemburg" },
  { code: "BE", name: "Belgien" },
  { code: "FR", name: "Frankreich" },
  { code: "IT", name: "Italien" },
  { code: "NL", name: "Niederlande" },
  { code: "PL", name: "Polen" },
  { code: "OTHER", name: "Andere" },
] as const;

export const MARITAL_STATUS = [
  { value: "ledig", label: "Ledig" },
  { value: "verheiratet", label: "Verheiratet" },
  { value: "geschieden", label: "Geschieden" },
  { value: "verwitwet", label: "Verwitwet" },
  { value: "eingetragene_partnerschaft", label: "Eingetragene Partnerschaft" },
] as const;

export const EMPLOYMENT_STATUS = [
  { value: "angestellt", label: "Angestellt" },
  { value: "selbstaendig", label: "Selbstständig" },
  { value: "beamter", label: "Beamter" },
  { value: "rentner", label: "Rentner" },
  { value: "student", label: "Student" },
  { value: "arbeitslos", label: "Arbeitslos" },
  { value: "freiberufler", label: "Freiberufler" },
] as const;

export const GENDERS = [
  { value: "maennlich", label: "Herr" },
  { value: "weiblich", label: "Frau" },
  { value: "divers", label: "Divers" },
] as const;

export const DOCUMENT_TYPES = [
  { value: "personalausweis_vorne", label: "Personalausweis (Vorderseite)" },
  { value: "personalausweis_rueckseite", label: "Personalausweis (Rückseite)" },
  { value: "reisepass", label: "Reisepass" },
  { value: "gehaltsabrechnung_1", label: "Gehaltsabrechnung (Monat 1)" },
  { value: "gehaltsabrechnung_2", label: "Gehaltsabrechnung (Monat 2)" },
  { value: "gehaltsabrechnung_3", label: "Gehaltsabrechnung (Monat 3)" },
  { value: "kontoauszug", label: "Kontoauszug" },
  { value: "schufa_auskunft", label: "SCHUFA-Auskunft" },
  { value: "arbeitsvertrag", label: "Arbeitsvertrag" },
  { value: "steuererklaerung", label: "Steuererklärung" },
  { value: "gewerbeanmeldung", label: "Gewerbeanmeldung" },
  { value: "sonstiges", label: "Sonstiges" },
] as const;

export const DURATION_PRESETS = [6, 12, 24, 36, 60, 120, 240, 360] as const;

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://antragkreditflow.de";
