import { z } from "zod";
import { validateEmail, validateIBAN, validatePhoneDACH } from "@/lib/iban";
import { LOAN_TYPE_IDS } from "@/lib/status";

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(2, "Bitte geben Sie Ihren Vornamen an."),
    lastName: z.string().trim().min(2, "Bitte geben Sie Ihren Nachnamen an."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .refine(validateEmail, "Bitte geben Sie eine gültige E-Mail-Adresse an."),
    password: z.string().min(8, "Das Passwort muss mindestens 8 Zeichen umfassen."),
    confirmPassword: z.string(),
    accepted: z.boolean().refine((v) => v === true, "Bitte akzeptieren Sie Datenschutz und AGB."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Die Passwörter stimmen nicht überein.",
    path: ["confirmPassword"],
  });

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .toLowerCase()
    .refine(validateEmail, "Bitte geben Sie eine gültige E-Mail-Adresse an."),
  password: z.string().min(1, "Bitte geben Sie Ihr Passwort ein."),
});

export const otpRequestSchema = z.object({
  phone: z.string().refine(validatePhoneDACH, "Bitte geben Sie eine gültige Telefonnummer (+49/+43/+41) an."),
});

export const otpVerifySchema = z.object({
  phone: z.string().refine(validatePhoneDACH, "Bitte geben Sie eine gültige Telefonnummer an."),
  code: z.string().regex(/^\d{6}$/, "Bitte geben Sie den 6-stelligen Code ein."),
});

export const personalSchema = z.object({
  gender: z.enum(["maennlich", "weiblich", "divers"]),
  firstName: z.string().trim().min(2, "Vorname ist erforderlich."),
  lastName: z.string().trim().min(2, "Nachname ist erforderlich."),
  dateOfBirth: z.string().min(8, "Geburtsdatum ist erforderlich."),
  maritalStatus: z.enum([
    "ledig",
    "verheiratet",
    "geschieden",
    "verwitwet",
    "eingetragene_partnerschaft",
  ]),
  nationality: z.string().min(2),
  email: z.string().refine(validateEmail, "Ungültige E-Mail-Adresse."),
  phone: z.string().refine(validatePhoneDACH, "Ungültige Telefonnummer."),
});

export const employmentSchema = z.object({
  employmentStatus: z.enum([
    "angestellt",
    "selbstaendig",
    "beamter",
    "rentner",
    "student",
    "arbeitslos",
    "freiberufler",
  ]),
  employerName: z.string().optional(),
  jobTitle: z.string().optional(),
  monthlyNetIncome: z.number().positive("Bitte geben Sie Ihr Nettoeinkommen an."),
  employmentSince: z.string().optional(),
});

export const bankAddressSchema = z.object({
  iban: z.string().refine((v) => validateIBAN(v), "Bitte geben Sie eine gültige IBAN an."),
  bic: z.string().optional(),
  accountHolder: z.string().min(2, "Kontoinhaber ist erforderlich."),
  street: z.string().min(2, "Straße ist erforderlich."),
  houseNumber: z.string().min(1, "Hausnummer ist erforderlich."),
  postalCode: z.string().min(4, "PLZ ist erforderlich."),
  city: z.string().min(2, "Ort ist erforderlich."),
  country: z.string().min(2),
});

export const applicationSubmitSchema = z.object({
  loanType: z.enum(LOAN_TYPE_IDS),
  requestedAmount: z.number().min(2000).max(50_000_000),
  durationMonths: z.number().int().min(3).max(360),
  purpose: z.string().optional(),
  gender: z.string(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  dateOfBirth: z.string(),
  maritalStatus: z.string(),
  nationality: z.string(),
  email: z.string(),
  phone: z.string(),
  employmentStatus: z.string(),
  employerName: z.string().optional(),
  jobTitle: z.string().optional(),
  monthlyNetIncome: z.number().nullable(),
  employmentSince: z.string().optional(),
  iban: z.string(),
  bic: z.string().optional(),
  accountHolder: z.string(),
  street: z.string(),
  houseNumber: z.string(),
  postalCode: z.string(),
  city: z.string(),
  country: z.string(),
  existingCredits: z
    .array(
      z.object({
        creditorName: z.string(),
        remainingDebt: z.number(),
        monthlyPayment: z.number(),
        annualRate: z.number(),
        remainingMonths: z.number(),
      }),
    )
    .optional(),
  documents: z
    .array(
      z.object({
        documentType: z.string(),
        fileName: z.string(),
        fileSizeBytes: z.number(),
        mimeType: z.string(),
        dataUrl: z.string().optional(),
      }),
    )
    .optional(),
  consents: z.object({
    truthful: z.boolean().refine((v) => v === true),
    privacy: z.boolean().refine((v) => v === true),
    partner: z.boolean().refine((v) => v === true),
    terms: z.boolean().refine((v) => v === true),
  }),
});

export const profileUpdateSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  phone: z.string().optional(),
  street: z.string().optional(),
  houseNumber: z.string().optional(),
  postalCode: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  gender: z.string().optional(),
  dateOfBirth: z.string().optional(),
  maritalStatus: z.string().optional(),
  nationality: z.string().optional(),
  employmentStatus: z.string().optional(),
  employerName: z.string().optional(),
  jobTitle: z.string().optional(),
  monthlyNetIncome: z.number().nullable().optional(),
  iban: z.string().optional(),
  bic: z.string().optional(),
  accountHolder: z.string().optional(),
});
