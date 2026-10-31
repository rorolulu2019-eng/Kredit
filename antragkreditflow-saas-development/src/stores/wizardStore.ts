"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ExistingCreditInput = {
  id: string;
  creditorName: string;
  remainingDebt: number;
  monthlyPayment: number;
  annualRate: number;
  remainingMonths: number;
};

export type DocumentInput = {
  id: string;
  documentType: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
  dataUrl: string;
};

export type WizardData = {
  step: number;
  loanType: string;
  requestedAmount: number;
  durationMonths: number;
  purpose: string;
  gender: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  maritalStatus: string;
  nationality: string;
  email: string;
  phone: string;
  employmentStatus: string;
  employerName: string;
  jobTitle: string;
  monthlyNetIncome: number | null;
  employmentSince: string;
  iban: string;
  bic: string;
  accountHolder: string;
  street: string;
  houseNumber: string;
  postalCode: string;
  city: string;
  country: string;
  existingCredits: ExistingCreditInput[];
  documents: DocumentInput[];
  consents: {
    truthful: boolean;
    privacy: boolean;
    partner: boolean;
    terms: boolean;
  };
};

const defaults: WizardData = {
  step: 1,
  loanType: "",
  requestedAmount: 10_000,
  durationMonths: 36,
  purpose: "",
  gender: "",
  firstName: "",
  lastName: "",
  dateOfBirth: "",
  maritalStatus: "ledig",
  nationality: "DE",
  email: "",
  phone: "",
  employmentStatus: "",
  employerName: "",
  jobTitle: "",
  monthlyNetIncome: null,
  employmentSince: "",
  iban: "",
  bic: "",
  accountHolder: "",
  street: "",
  houseNumber: "",
  postalCode: "",
  city: "",
  country: "DE",
  existingCredits: [],
  documents: [],
  consents: {
    truthful: false,
    privacy: false,
    partner: false,
    terms: false,
  },
};

type WizardStore = WizardData & {
  hydrated: boolean;
  setHydrated: (v: boolean) => void;
  setStep: (step: number) => void;
  patch: (partial: Partial<WizardData>) => void;
  reset: () => void;
};

export const useWizardStore = create<WizardStore>()(
  persist(
    (set) => ({
      ...defaults,
      hydrated: false,
      setHydrated: (v) => set({ hydrated: v }),
      setStep: (step) => set({ step }),
      patch: (partial) => set(partial),
      reset: () => set({ ...defaults, hydrated: true }),
    }),
    {
      name: "akf-wizard",
      partialize: (state) => {
        const { hydrated: _h, setHydrated: _s, setStep: _st, patch: _p, reset: _r, documents, ...rest } =
          state;
        return { ...rest, documents: documents.map((d) => ({ ...d, dataUrl: d.dataUrl.slice(0, 80) })) };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
