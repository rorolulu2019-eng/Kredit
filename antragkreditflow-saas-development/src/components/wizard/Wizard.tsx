"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  FileText,
  Loader2,
  PartyPopper,
  Plus,
  Trash2,
  Upload,
} from "lucide-react";
import { LOAN_PRODUCTS, getLoanProduct } from "@/data/loan-products";
import { LoanIcon } from "@/components/icons";
import { Button, Checkbox, FieldError, Input, Label, Select, Textarea } from "@/components/ui";
import { useWizardStore, type DocumentInput, type ExistingCreditInput } from "@/stores/wizardStore";
import {
  calculateBuybackSavings,
  calculateTotals,
  EXAMPLE_ANNUAL_RATE,
  formatDurationLabel,
  generateAmortizationSchedule,
  LOAN_AMOUNT_MAX,
  LOAN_AMOUNT_MIN,
} from "@/lib/financial-engine";
import { formatCurrency, formatCurrencyExact, formatIBAN, formatPercent } from "@/lib/format";
import {
  COUNTRIES,
  DISCLAIMER_DE,
  DOCUMENT_TYPES,
  EMPLOYMENT_STATUS,
  GENDERS,
  IBAN_PLACEHOLDER,
  MARITAL_STATUS,
  NATIONALITIES,
} from "@/lib/constants";
import { LoanCalculatorFields } from "@/components/landing/LoanCalculatorFields";
import { detectBICFromIBAN, formatIBANInput, validateEmail, validateIBAN, validatePhoneDACH } from "@/lib/iban";
import { useAuth } from "@/components/auth-provider";
import { AnimatedNumber } from "@/components/landing/AnimatedNumber";

const STEPS = [
  { n: 1, label: "Kreditart" },
  { n: 2, label: "Betrag" },
  { n: 3, label: "Persönliches" },
  { n: 4, label: "Beruf" },
  { n: 5, label: "Bank & Adresse" },
  { n: 6, label: "Dokumente" },
  { n: 7, label: "Absenden" },
];

function Stepper({ step }: { step: number }) {
  return (
    <ol className="mb-10 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      {STEPS.map((s) => {
        const done = step > s.n;
        const active = step === s.n;
        return (
          <li key={s.n} className="flex items-center gap-2 md:flex-1">
            <span
              aria-current={active ? "step" : undefined}
              className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                done
                  ? "bg-approved text-white"
                  : active
                    ? "bg-credit-500 text-white shadow-lg shadow-credit-500/40"
                    : "border border-white/10 bg-vault-deep text-text-muted"
              }`}
            >
              {done ? <Check className="h-4 w-4" /> : s.n}
            </span>
            <span className={`text-xs md:text-sm ${active ? "text-text-primary" : "text-text-muted"}`}>{s.label}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function Wizard() {
  const search = useSearchParams();
  const store = useWizardStore();
  const { user } = useAuth();
  const [error, setError] = useState<string>("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<{ number: string; id: string } | null>(null);

  useEffect(() => {
    const type = search.get("type");
    if (type && LOAN_PRODUCTS.some((p) => p.id === type) && !store.loanType) {
      store.patch({ loanType: type });
    }
  }, [search, store]);

  useEffect(() => {
    if (user && (!store.firstName || !store.email)) {
      store.patch({
        firstName: store.firstName || user.firstName,
        lastName: store.lastName || user.lastName,
        email: store.email || user.email,
        phone: store.phone || user.phone || "",
      });
    }
  }, [user, store]);

  function validateStep(): boolean {
    setError("");
    if (store.step === 1 && !store.loanType) {
      setError("Bitte wählen Sie eine Kreditart.");
      return false;
    }
    if (store.step === 2) {
      if (store.requestedAmount < LOAN_AMOUNT_MIN || store.requestedAmount > LOAN_AMOUNT_MAX) {
        setError("Der Betrag muss zwischen 2.000 € und 50.000.000 € liegen.");
        return false;
      }
    }
    if (store.step === 3) {
      if (!store.gender || store.firstName.length < 2 || store.lastName.length < 2 || !store.dateOfBirth) {
        setError("Bitte füllen Sie alle Pflichtfelder aus.");
        return false;
      }
      if (!validateEmail(store.email)) {
        setError("Bitte geben Sie eine gültige E-Mail-Adresse an.");
        return false;
      }
      if (!validatePhoneDACH(store.phone)) {
        setError("Bitte geben Sie eine gültige Telefonnummer mit Ländervorwahl (+49/+43/+41) an.");
        return false;
      }
    }
    if (store.step === 4) {
      if (!store.employmentStatus || !store.monthlyNetIncome || store.monthlyNetIncome <= 0) {
        setError("Bitte geben Sie Beschäftigungsstatus und Nettoeinkommen an.");
        return false;
      }
    }
    if (store.step === 5) {
      if (!validateIBAN(store.iban)) {
        setError("Bitte geben Sie eine gültige IBAN an.");
        return false;
      }
      if (!store.accountHolder || !store.street || !store.houseNumber || !store.postalCode || !store.city) {
        setError("Bitte vervollständigen Sie Bankverbindung und Adresse.");
        return false;
      }
    }
    return true;
  }

  async function submit() {
    if (!store.consents.truthful || !store.consents.privacy || !store.consents.partner || !store.consents.terms) {
      setError("Bitte bestätigen Sie alle erforderlichen Einwilligungen.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      const res = await fetch("/api/applications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          loanType: store.loanType,
          requestedAmount: store.requestedAmount,
          durationMonths: store.durationMonths,
          purpose: store.purpose,
          gender: store.gender,
          firstName: store.firstName,
          lastName: store.lastName,
          dateOfBirth: store.dateOfBirth,
          maritalStatus: store.maritalStatus,
          nationality: store.nationality,
          email: store.email,
          phone: store.phone,
          employmentStatus: store.employmentStatus,
          employerName: store.employerName,
          jobTitle: store.jobTitle,
          monthlyNetIncome: store.monthlyNetIncome,
          employmentSince: store.employmentSince,
          iban: store.iban,
          bic: store.bic,
          accountHolder: store.accountHolder,
          street: store.street,
          houseNumber: store.houseNumber,
          postalCode: store.postalCode,
          city: store.city,
          country: store.country,
          existingCredits: store.existingCredits,
          documents: store.documents.map((d) => ({
            documentType: d.documentType,
            fileName: d.fileName,
            fileSizeBytes: d.fileSizeBytes,
            mimeType: d.mimeType,
            dataUrl: d.dataUrl.startsWith("data:") ? d.dataUrl : undefined,
          })),
          consents: store.consents,
        }),
      });
      const data = (await res.json()) as { error?: string; applicationNumber?: string; id?: string };
      if (!res.ok) {
        setError(data.error ?? "Die Anfrage konnte nicht gesendet werden.");
        return;
      }
      setSuccess({ number: data.applicationNumber ?? "", id: data.id ?? "" });
      store.reset();
    } catch {
      setError("Netzwerkfehler. Bitte versuchen Sie es erneut.");
    } finally {
      setSubmitting(false);
    }
  }

  if (!store.hydrated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-credit-400" />
      </div>
    );
  }

  if (success) {
    return <SuccessScreen number={success.number} id={success.id} />;
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 lg:px-8">
      <p className="text-sm uppercase tracking-[0.16em] text-credit-400">Kreditanfrage</p>
      <h1 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Ihr 7-Stufen-Antrag</h1>
      <p className="mt-2 text-text-secondary">
        Unverbindlich und kostenlos. antragkreditflow vergibt selbst keine Kredite.
      </p>
      <div className="mt-8 rounded-3xl border border-white/[0.08] bg-vault-surface/50 p-6 backdrop-blur-xl md:p-10">
        <Stepper step={store.step} />
        {store.step === 1 && <Step1 />}
        {store.step === 2 && <Step2 />}
        {store.step === 3 && <Step3 />}
        {store.step === 4 && <Step4 />}
        {store.step === 5 && <Step5 />}
        {store.step === 6 && <Step6 />}
        {store.step === 7 && <Step7 onEdit={(s) => store.setStep(s)} />}
        {error && (
          <p role="alert" className="mt-6 rounded-xl border border-rejected/30 bg-rejected/10 px-4 py-3 text-sm text-rejected">
            {error}
          </p>
        )}
        <div className="mt-8 flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="ghost"
            disabled={store.step === 1}
            onClick={() => store.setStep(Math.max(1, store.step - 1))}
          >
            <ArrowLeft className="h-4 w-4" /> Zurück
          </Button>
          {store.step < 7 ? (
            <Button
              type="button"
              onClick={() => {
                if (validateStep()) store.setStep(store.step + 1);
              }}
            >
              Weiter <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="button" onClick={() => void submit()} disabled={submitting}>
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              Anfrage verbindlich absenden →
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function Step1() {
  const { loanType, patch } = useWizardStore();
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      {LOAN_PRODUCTS.map((p) => {
        const selected = loanType === p.id;
        return (
          <button
            key={p.id}
            type="button"
            onClick={() =>
              patch({
                loanType: p.id,
                requestedAmount: Math.min(Math.max(useWizardStore.getState().requestedAmount, p.minAmount), p.maxAmount),
              })
            }
            className={`rounded-2xl border p-4 text-left transition hover:scale-[1.02] ${
              selected
                ? "border-credit-500 bg-credit-500/10"
                : "border-white/10 bg-vault-deep/50 hover:border-white/20"
            }`}
          >
            <div className="flex items-center justify-between">
              <LoanIcon name={p.iconName} className="h-5 w-5 text-credit-400" />
              {selected && <Check className="h-4 w-4 text-approved" />}
            </div>
            <p className="mt-3 font-display font-bold">{p.nameDe}</p>
            <p className="mt-1 line-clamp-3 text-xs text-text-secondary">{p.descriptionDe}</p>
            <p className="mt-3 font-mono text-[11px] text-text-muted">
              {formatCurrency(p.minAmount)} – {formatCurrency(p.maxAmount)}
            </p>
          </button>
        );
      })}
    </div>
  );
}

function Step2() {
  const store = useWizardStore();
  const amount = Math.min(Math.max(store.requestedAmount, LOAN_AMOUNT_MIN), LOAN_AMOUNT_MAX);

  return (
    <div className="space-y-8">
      <LoanCalculatorFields
        amount={amount}
        months={store.durationMonths}
        onAmountChange={(value) => store.patch({ requestedAmount: value })}
        onMonthsChange={(value) => store.patch({ durationMonths: value })}
      />
      <p className="text-xs text-text-muted">* {DISCLAIMER_DE}</p>
      <div>
        <Label htmlFor="purpose">Verwendungszweck (optional)</Label>
        <Textarea
          id="purpose"
          value={store.purpose}
          onChange={(e) => store.patch({ purpose: e.target.value })}
          placeholder="z. B. Modernisierung der Küche"
        />
      </div>
      {store.loanType === "umschuldung" && <ExistingCreditsEditor />}
    </div>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-vault-deep/70 p-4">
      <p className="text-xs uppercase tracking-wider text-text-muted">{label}</p>
      <p className="mt-1 font-mono text-xl tabular text-credit-400">
        <AnimatedNumber value={value} />
      </p>
    </div>
  );
}

function ExistingCreditsEditor() {
  const { existingCredits, patch } = useWizardStore();
  function add() {
    const row: ExistingCreditInput = {
      id: crypto.randomUUID(),
      creditorName: "",
      remainingDebt: 0,
      monthlyPayment: 0,
      annualRate: 0,
      remainingMonths: 12,
    };
    patch({ existingCredits: [...existingCredits, row] });
  }
  function update(id: string, partial: Partial<ExistingCreditInput>) {
    patch({ existingCredits: existingCredits.map((c) => (c.id === id ? { ...c, ...partial } : c)) });
  }
  const savings =
    existingCredits.length > 0
      ? calculateBuybackSavings(
          existingCredits.map((c) => ({
            creditorName: c.creditorName,
            remainingDebt: c.remainingDebt,
            monthlyPayment: c.monthlyPayment,
            annualRate: c.annualRate,
            remainingMonths: c.remainingMonths,
          })),
        )
      : null;

  return (
    <div className="rounded-2xl border border-gold-500/20 bg-gold-500/5 p-5">
      <h3 className="font-display font-bold">Bestehende Kredite (Umschuldung)</h3>
      <div className="mt-4 space-y-4">
        {existingCredits.map((c) => (
          <div key={c.id} className="grid gap-3 rounded-xl border border-white/10 p-3 md:grid-cols-6">
            <Input
              placeholder="Gläubiger"
              value={c.creditorName}
              onChange={(e) => update(c.id, { creditorName: e.target.value })}
            />
            <Input
              type="number"
              placeholder="Restschuld"
              value={c.remainingDebt || ""}
              onChange={(e) => update(c.id, { remainingDebt: Number(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Rate"
              value={c.monthlyPayment || ""}
              onChange={(e) => update(c.id, { monthlyPayment: Number(e.target.value) })}
            />
            <Input
              type="number"
              step="0.01"
              placeholder="Zins % p.a."
              value={c.annualRate || ""}
              onChange={(e) => update(c.id, { annualRate: Number(e.target.value) })}
            />
            <Input
              type="number"
              placeholder="Restlaufzeit"
              value={c.remainingMonths || ""}
              onChange={(e) => update(c.id, { remainingMonths: Number(e.target.value) })}
            />
            <button
              type="button"
              onClick={() => patch({ existingCredits: existingCredits.filter((x) => x.id !== c.id) })}
              className="inline-flex items-center justify-center rounded-xl border border-rejected/30 text-rejected"
              aria-label="Kredit entfernen"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
      <Button type="button" variant="ghost" className="mt-4" onClick={add}>
        <Plus className="h-4 w-4" /> Weiteren Kredit hinzufügen
      </Button>
      {savings && savings.totalDebt > 0 && (
        <div className="mt-5 grid gap-3 md:grid-cols-3">
          <Metric label="Gesamtschuld" value={savings.totalDebt} />
          <Metric label="Neue Rate (Beispiel)" value={savings.newMonthlyPayment} />
          <Metric label="Monatliche Ersparnis" value={savings.monthlySavings} />
        </div>
      )}
    </div>
  );
}

function Step3() {
  const s = useWizardStore();
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <Label htmlFor="gender">Anrede*</Label>
        <Select id="gender" value={s.gender} onChange={(e) => s.patch({ gender: e.target.value })}>
          <option value="">Bitte wählen</option>
          {GENDERS.map((g) => (
            <option key={g.value} value={g.value}>
              {g.label}
            </option>
          ))}
        </Select>
      </div>
      <div />
      <div>
        <Label htmlFor="firstName">Vorname*</Label>
        <Input id="firstName" value={s.firstName} onChange={(e) => s.patch({ firstName: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="lastName">Nachname*</Label>
        <Input id="lastName" value={s.lastName} onChange={(e) => s.patch({ lastName: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="dob">Geburtsdatum*</Label>
        <Input id="dob" type="date" value={s.dateOfBirth} onChange={(e) => s.patch({ dateOfBirth: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="ms">Familienstand</Label>
        <Select id="ms" value={s.maritalStatus} onChange={(e) => s.patch({ maritalStatus: e.target.value })}>
          {MARITAL_STATUS.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="nat">Staatsangehörigkeit</Label>
        <Select id="nat" value={s.nationality} onChange={(e) => s.patch({ nationality: e.target.value })}>
          {NATIONALITIES.map((n) => (
            <option key={n.code} value={n.code}>
              {n.name}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="email">E-Mail-Adresse*</Label>
        <Input id="email" type="email" value={s.email} onChange={(e) => s.patch({ email: e.target.value })} />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="phone">Telefonnummer*</Label>
        <Input
          id="phone"
          placeholder="+49 15511 241487"
          value={s.phone}
          onChange={(e) => s.patch({ phone: e.target.value })}
        />
      </div>
    </div>
  );
}

function Step4() {
  const s = useWizardStore();
  const needsEmployer = s.employmentStatus === "angestellt" || s.employmentStatus === "beamter";
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div>
        <Label htmlFor="emp">Beschäftigungsstatus*</Label>
        <Select id="emp" value={s.employmentStatus} onChange={(e) => s.patch({ employmentStatus: e.target.value })}>
          <option value="">Bitte wählen</option>
          {EMPLOYMENT_STATUS.map((e) => (
            <option key={e.value} value={e.value}>
              {e.label}
            </option>
          ))}
        </Select>
      </div>
      <div>
        <Label htmlFor="income">Monatliches Nettoeinkommen*</Label>
        <Input
          id="income"
          type="number"
          min={0}
          value={s.monthlyNetIncome ?? ""}
          onChange={(e) => s.patch({ monthlyNetIncome: e.target.value ? Number(e.target.value) : null })}
        />
      </div>
      {needsEmployer && (
        <div>
          <Label htmlFor="employer">Arbeitgeber</Label>
          <Input id="employer" value={s.employerName} onChange={(e) => s.patch({ employerName: e.target.value })} />
        </div>
      )}
      <div>
        <Label htmlFor="job">Berufsbezeichnung</Label>
        <Input id="job" value={s.jobTitle} onChange={(e) => s.patch({ jobTitle: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="since">Beschäftigt seit</Label>
        <Input
          id="since"
          type="date"
          value={s.employmentSince}
          onChange={(e) => s.patch({ employmentSince: e.target.value })}
        />
      </div>
    </div>
  );
}

function Step5() {
  const s = useWizardStore();
  return (
    <div className="grid gap-5 md:grid-cols-2">
      <div className="md:col-span-2">
        <Label htmlFor="iban">IBAN*</Label>
        <Input
          id="iban"
          placeholder={IBAN_PLACEHOLDER}
          value={formatIBAN(s.iban)}
          onChange={(e) => {
            const formatted = formatIBANInput(e.target.value);
            const bic = detectBICFromIBAN(formatted);
            s.patch({ iban: formatted, bic: bic || s.bic });
          }}
        />
        {s.iban && !validateIBAN(s.iban) && <FieldError>Die IBAN scheint ungültig zu sein.</FieldError>}
      </div>
      <div>
        <Label htmlFor="bic">BIC (optional)</Label>
        <Input id="bic" value={s.bic} onChange={(e) => s.patch({ bic: e.target.value.toUpperCase() })} />
      </div>
      <div>
        <Label htmlFor="holder">Kontoinhaber*</Label>
        <Input
          id="holder"
          value={s.accountHolder}
          onChange={(e) => s.patch({ accountHolder: e.target.value })}
          onFocus={() => {
            if (!s.accountHolder) s.patch({ accountHolder: `${s.firstName} ${s.lastName}`.trim() });
          }}
        />
      </div>
      <div>
        <Label htmlFor="street">Straße*</Label>
        <Input id="street" value={s.street} onChange={(e) => s.patch({ street: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="hnr">Hausnummer*</Label>
        <Input id="hnr" value={s.houseNumber} onChange={(e) => s.patch({ houseNumber: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="plz">PLZ*</Label>
        <Input id="plz" value={s.postalCode} onChange={(e) => s.patch({ postalCode: e.target.value })} />
      </div>
      <div>
        <Label htmlFor="city">Ort*</Label>
        <Input id="city" value={s.city} onChange={(e) => s.patch({ city: e.target.value })} />
      </div>
      <div className="md:col-span-2">
        <Label htmlFor="country">Land*</Label>
        <Select id="country" value={s.country} onChange={(e) => s.patch({ country: e.target.value })}>
          {COUNTRIES.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </Select>
      </div>
    </div>
  );
}

function Step6() {
  const { documents, patch, loanType } = useWizardStore();

  async function onFiles(type: string, files: FileList | null) {
    if (!files) return;
    const next: DocumentInput[] = [];
    for (const file of Array.from(files)) {
      if (file.size > 10 * 1024 * 1024) {
        alert(`${file.name} überschreitet 10 MB.`);
        continue;
      }
      const allowed = ["application/pdf", "image/jpeg", "image/png", "image/jpg"];
      if (!allowed.includes(file.type)) {
        alert("Nur PDF, JPG und PNG sind zulässig.");
        continue;
      }
      const dataUrl = await readFile(file);
      next.push({
        id: crypto.randomUUID(),
        documentType: type,
        fileName: file.name,
        fileSizeBytes: file.size,
        mimeType: file.type,
        dataUrl,
      });
    }
    patch({ documents: [...documents, ...next] });
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-text-secondary">
        Laden Sie Nachweise hoch (PDF, JPG, PNG – max. 10 MB). Die Übermittlung erfolgt ausschließlich an uns und – nach
        Ihrer Einwilligung – an den Kreditpartner.
      </p>
      <div className="grid gap-4 md:grid-cols-2">
        {DOCUMENT_TYPES.filter((d) =>
          [
            "personalausweis_vorne",
            "personalausweis_rueckseite",
            "reisepass",
            "gehaltsabrechnung_1",
            "gehaltsabrechnung_2",
            "gehaltsabrechnung_3",
            "kontoauszug",
          ].includes(d.value),
        ).map((d) => (
          <label
            key={d.value}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-white/15 bg-vault-deep/50 px-4 py-8 text-center hover:border-credit-500/40"
          >
            <Upload className="h-6 w-6 text-credit-400" />
            <span className="mt-2 text-sm font-medium">{d.label}</span>
            <span className="mt-1 text-xs text-text-muted">Datei hierher ziehen oder klicken</span>
            <input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={(e) => void onFiles(d.value, e.target.files)}
            />
          </label>
        ))}
      </div>
      {documents.length > 0 && (
        <ul className="space-y-2">
          {documents.map((doc) => (
            <li key={doc.id} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
              <div className="flex items-center gap-3">
                <FileText className="h-4 w-4 text-credit-400" />
                <div>
                  <p className="text-sm">{doc.fileName}</p>
                  <p className="text-xs text-text-muted">
                    {DOCUMENT_TYPES.find((t) => t.value === doc.documentType)?.label} ·{" "}
                    {Math.round(doc.fileSizeBytes / 1024)} KB
                  </p>
                </div>
              </div>
              <button
                type="button"
                aria-label="Dokument entfernen"
                onClick={() => patch({ documents: documents.filter((d) => d.id !== doc.id) })}
                className="text-rejected"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
      )}
      {loanType === "umschuldung" && <ExistingCreditsEditor />}
    </div>
  );
}

function readFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

function Step7({ onEdit }: { onEdit: (step: number) => void }) {
  const s = useWizardStore();
  const { user } = useAuth();
  const product = getLoanProduct(s.loanType || "privatkredit");
  const totals = calculateTotals(s.requestedAmount, EXAMPLE_ANNUAL_RATE, s.durationMonths);
  const schedule = generateAmortizationSchedule(s.requestedAmount, EXAMPLE_ANNUAL_RATE, s.durationMonths).slice(0, 12);
  const sections: Array<{ title: string; step: number; rows: Array<[string, string]> }> = [
    {
      title: "Kredit",
      step: 1,
      rows: [
        ["Kreditart", product.nameDe],
        ["Betrag", formatCurrencyExact(s.requestedAmount)],
        ["Laufzeit", formatDurationLabel(s.durationMonths)],
        ["Beispielzins", formatPercent(EXAMPLE_ANNUAL_RATE)],
      ],
    },
    {
      title: "Persönliche Angaben",
      step: 3,
      rows: [
        ["Name", `${s.firstName} ${s.lastName}`],
        ["Geburtsdatum", s.dateOfBirth],
        ["E-Mail", s.email],
        ["Telefon", s.phone],
      ],
    },
    {
      title: "Beruf",
      step: 4,
      rows: [
        ["Status", EMPLOYMENT_STATUS.find((e) => e.value === s.employmentStatus)?.label ?? s.employmentStatus],
        ["Nettoeinkommen", s.monthlyNetIncome ? formatCurrencyExact(s.monthlyNetIncome) : "–"],
      ],
    },
    {
      title: "Adresse & Bank",
      step: 5,
      rows: [
        ["Adresse", `${s.street} ${s.houseNumber}, ${s.postalCode} ${s.city}`],
        ["IBAN", s.iban],
        ["Kontoinhaber", s.accountHolder],
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {sections.map((sec) => (
        <div key={sec.title} className="rounded-2xl border border-white/10 p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-display font-bold">{sec.title}</h3>
            <button type="button" onClick={() => onEdit(sec.step)} className="text-sm text-credit-400">
              Bearbeiten
            </button>
          </div>
          <dl className="grid gap-2 md:grid-cols-2">
            {sec.rows.map(([k, v]) => (
              <div key={k}>
                <dt className="text-xs text-text-muted">{k}</dt>
                <dd className="text-sm">{v || "–"}</dd>
              </div>
            ))}
          </dl>
        </div>
      ))}
      <div className="grid gap-4 md:grid-cols-3">
        <Metric label="Monatliche Rate*" value={totals.monthlyPayment} />
        <Metric label="Gesamtbetrag" value={totals.totalRepayment} />
        <Metric label="Zinskosten" value={totals.totalInterest} />
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-vault-deep text-text-muted">
            <tr>
              <th className="px-3 py-2">Monat</th>
              <th className="px-3 py-2">Datum</th>
              <th className="px-3 py-2">Zins</th>
              <th className="px-3 py-2">Tilgung</th>
              <th className="px-3 py-2">Restschuld</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row) => (
              <tr key={row.month} className="border-t border-white/5">
                <td className="px-3 py-2 font-mono">{row.month}</td>
                <td className="px-3 py-2">{row.date}</td>
                <td className="px-3 py-2 font-mono">{formatCurrencyExact(row.interestPart)}</td>
                <td className="px-3 py-2 font-mono">{formatCurrencyExact(row.principalPart)}</td>
                <td className="px-3 py-2 font-mono">{formatCurrencyExact(row.remainingBalance)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-text-muted">{DISCLAIMER_DE}</p>
      <div className="space-y-3 rounded-2xl border border-white/10 p-5">
        <Checkbox
          id="c1"
          checked={s.consents.truthful}
          onChange={(v) => s.patch({ consents: { ...s.consents, truthful: v } })}
          label="Ich bestätige, dass meine Angaben vollständig und wahrheitsgemäß sind."
        />
        <Checkbox
          id="c2"
          checked={s.consents.privacy}
          onChange={(v) => s.patch({ consents: { ...s.consents, privacy: v } })}
          label={
            <>
              Ich habe die{" "}
              <Link href="/datenschutz" className="text-credit-400 underline">
                Datenschutzerklärung
              </Link>{" "}
              gelesen und stimme der Verarbeitung meiner Daten zu.
            </>
          }
        />
        <Checkbox
          id="c3"
          checked={s.consents.partner}
          onChange={(v) => s.patch({ consents: { ...s.consents, partner: v } })}
          label="Ich willige ein, dass meine Anfrage an einen Kreditpartner weitergeleitet wird. Antragkreditflow vergibt selbst keine Kredite."
        />
        <Checkbox
          id="c4"
          checked={s.consents.terms}
          onChange={(v) => s.patch({ consents: { ...s.consents, terms: v } })}
          label={
            <>
              Ich habe die{" "}
              <Link href="/agb" className="text-credit-400 underline">
                AGB
              </Link>{" "}
              gelesen und akzeptiere diese.
            </>
          }
        />
      </div>
      <p className="text-xs text-text-muted">
        Ein Benutzerkonto ist nicht erforderlich. Nach dem Absenden erhalten Sie Ihre Antragsnummer zur Bestätigung.
      </p>
    </div>
  );
}

function SuccessScreen({ number }: { number: string; id: string }) {
  return (
    <div className="mx-auto max-w-xl px-4 py-20 text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-approved/20 text-approved">
        <PartyPopper className="h-8 w-8" />
      </div>
      <h1 className="mt-6 font-display text-3xl font-extrabold">Ihre Anfrage wurde übermittelt</h1>
      <p className="mt-3 text-text-secondary">
        Vielen Dank. Wir haben Ihre Anfrage entgegengenommen und leiten sie an einen Partner weiter. Eine Anmeldung war
        dafür nicht erforderlich.
      </p>
      <p className="mt-6 font-mono text-lg text-credit-400">{number}</p>
      <p className="mt-2 text-xs text-text-muted">{DISCLAIMER_DE}</p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Link href="/" className="btn-primary inline-flex">
          Zur Startseite
        </Link>
        <Link href="/antrag" className="btn-ghost inline-flex">
          Weitere Anfrage
        </Link>
      </div>
    </div>
  );
}
