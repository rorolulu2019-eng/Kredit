"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { Button, FieldError, Input, Label } from "@/components/ui";
import { useAuth } from "@/components/auth-provider";
import { WhatsAppInline } from "@/components/layout/WhatsAppFAB";
import { Logo } from "@/components/layout/Navbar";

function CardShell({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-md px-4 py-16">
      <div className="mb-8 flex justify-center">
        <Logo />
      </div>
      <div className="glass-hero p-8">
        <h1 className="font-display text-2xl font-extrabold">{title}</h1>
        <p className="mt-2 text-sm text-text-secondary">{subtitle}</p>
        <div className="mt-6">{children}</div>
      </div>
    </div>
  );
}

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [otpMode, setOtpMode] = useState(false);
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Anmeldung fehlgeschlagen.");
        return;
      }
      await refresh();
      router.push(next);
    } finally {
      setLoading(false);
    }
  }

  async function requestOtp() {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Code konnte nicht gesendet werden.");
        return;
      }
      setOtpSent(true);
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone, code }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Code ungültig.");
        return;
      }
      await refresh();
      router.push(next);
    } finally {
      setLoading(false);
    }
  }

  if (otpMode) {
    return (
      <CardShell title="Anmeldung per Telefon" subtitle="Wir senden Ihnen einen 6-stelligen Code.">
        <form onSubmit={(e) => void verifyOtp(e)} className="space-y-4">
          <div>
            <Label htmlFor="phone">Telefonnummer</Label>
            <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+49 ..." />
          </div>
          <Button type="button" variant="ghost" className="w-full" onClick={() => void requestOtp()} disabled={loading}>
            Code anfordern
          </Button>
          {otpSent && (
            <p className="rounded-lg bg-credit-500/10 px-3 py-2 text-xs text-credit-400">
              Ein Bestätigungscode wurde an Ihre Nummer gesendet.
            </p>
          )}
          <div>
            <Label htmlFor="code">Bestätigungscode</Label>
            <Input id="code" value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} />
          </div>
          <FieldError>{error}</FieldError>
          <Button type="submit" className="w-full" disabled={loading}>
            Anmelden
          </Button>
          <button type="button" className="w-full text-sm text-credit-400" onClick={() => setOtpMode(false)}>
            Zurück zur E-Mail-Anmeldung
          </button>
        </form>
      </CardShell>
    );
  }

  return (
    <CardShell title="Anmelden" subtitle="Willkommen zurück bei antragkreditflow.">
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
        <div>
          <Label htmlFor="email">E-Mail</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div>
          <Label htmlFor="password">Passwort</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
        </div>
        <div className="text-right">
          <Link href="/passwort-vergessen" className="text-sm text-credit-400">
            Passwort vergessen?
          </Link>
        </div>
        <FieldError>{error}</FieldError>
        <Button type="submit" className="w-full" disabled={loading}>
          Anmelden
        </Button>
      </form>
      <button type="button" className="mt-4 w-full text-sm text-text-secondary" onClick={() => setOtpMode(true)}>
        Oder per Telefon anmelden
      </button>
      <p className="mt-6 text-center text-sm text-text-secondary">
        Noch kein Konto?{" "}
        <Link href={`/registrieren?next=${encodeURIComponent(next)}`} className="text-credit-400">
          Jetzt registrieren →
        </Link>
      </p>
      <WhatsAppInline
        label="Probleme? Schreiben Sie uns per WhatsApp"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 text-sm text-[#25D366]"
      />
    </CardShell>
  );
}

export function RegisterForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") || "/dashboard";
  const { refresh } = useAuth();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const strength =
    password.length >= 12 && /[A-Z]/.test(password) && /\d/.test(password)
      ? 3
      : password.length >= 8
        ? 2
        : password.length > 0
          ? 1
          : 0;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password, confirmPassword, accepted }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        setError(data.error ?? "Registrierung fehlgeschlagen.");
        return;
      }
      await refresh();
      router.push(next);
    } finally {
      setLoading(false);
    }
  }

  return (
    <CardShell title="Konto erstellen" subtitle="In wenigen Schritten zum Kreditvergleich.">
      <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label htmlFor="fn">Vorname</Label>
            <Input id="fn" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="ln">Nachname</Label>
            <Input id="ln" value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
        </div>
        <div>
          <Label htmlFor="email">E-Mail</Label>
          <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <Label htmlFor="pw">Passwort</Label>
          <Input id="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
            <div
              className={`h-full ${strength === 1 ? "w-1/3 bg-rejected" : strength === 2 ? "w-2/3 bg-warning" : strength === 3 ? "w-full bg-approved" : "w-0"}`}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="pw2">Passwort bestätigen</Label>
          <Input id="pw2" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </div>
        <label className="flex items-start gap-2 text-sm text-text-secondary">
          <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)} className="mt-1 accent-credit-500" />
          <span>
            Ich habe die{" "}
            <Link href="/datenschutz" className="text-credit-400">
              Datenschutzerklärung
            </Link>{" "}
            und{" "}
            <Link href="/agb" className="text-credit-400">
              AGB
            </Link>{" "}
            gelesen.
          </span>
        </label>
        <FieldError>{error}</FieldError>
        <Button type="submit" className="w-full" disabled={loading}>
          Konto erstellen →
        </Button>
      </form>
      <p className="mt-6 text-center text-sm text-text-secondary">
        Bereits registriert?{" "}
        <Link href={`/anmelden?next=${encodeURIComponent(next)}`} className="text-credit-400">
          Jetzt anmelden →
        </Link>
      </p>
      <WhatsAppInline
        label="Probleme? Schreiben Sie uns per WhatsApp"
        className="mt-4 inline-flex w-full items-center justify-center gap-2 text-sm text-[#25D366]"
      />
    </CardShell>
  );
}

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/auth/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setSent(true);
  }
  return (
    <CardShell title="Passwort vergessen" subtitle="Wir senden Ihnen einen Link zum Zurücksetzen.">
      {sent ? (
        <p className="text-sm text-text-secondary">
          Falls ein Konto mit dieser Adresse existiert, haben wir eine Nachricht versendet.
        </p>
      ) : (
        <form onSubmit={(e) => void onSubmit(e)} className="space-y-4">
          <div>
            <Label htmlFor="email">E-Mail</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <Button type="submit" className="w-full">
            Link anfordern
          </Button>
        </form>
      )}
      <Link href="/anmelden" className="mt-6 block text-center text-sm text-credit-400">
        Zurück zur Anmeldung
      </Link>
    </CardShell>
  );
}
