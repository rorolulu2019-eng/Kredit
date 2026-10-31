"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Bell, Download, FileText, Trash2 } from "lucide-react";
import { StatusBadge } from "@/components/dashboard/StatusBadge";
import { Button, Input, Label, Select } from "@/components/ui";
import { formatCurrencyExact, formatDate, formatDateTime } from "@/lib/format";
import { getLoanProduct } from "@/data/loan-products";
import { APPLICATION_STATUSES, STATUS_LABELS, type ApplicationStatus } from "@/lib/status";
import { DISCLAIMER_DE, COUNTRIES, EMPLOYMENT_STATUS, GENDERS, MARITAL_STATUS } from "@/lib/constants";
import { DOCUMENT_TYPES } from "@/lib/constants";
import { useAuth } from "@/components/auth-provider";

type AppRow = {
  id: string;
  applicationNumber: string;
  loanType: string;
  requestedAmount: string;
  durationMonths: number;
  status: string;
  createdAt: string;
  submittedAt: string | null;
};

export function OverviewView() {
  const apps = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const res = await fetch("/api/applications", { credentials: "include" });
      const data = (await res.json()) as { applications: AppRow[] };
      return data.applications ?? [];
    },
  });
  const list = apps.data ?? [];
  const active = list.filter((a) => !["storniert", "ausgezahlt", "vom_partner_abgelehnt"].includes(a.status));
  const last = list[0];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Stat title="Aktive Anfragen" value={String(active.length)} />
        <Stat
          title="Letzte Anfrage"
          value={last ? last.applicationNumber : "–"}
          hint={last ? STATUS_LABELS[last.status as ApplicationStatus] : "Noch keine Anfrage"}
        />
        <Stat title="Nächster Schritt" value={last ? "Status prüfen" : "Neue Anfrage starten"} />
      </div>
      <div className="flex justify-end">
        <Link href="/antrag" className="btn-primary">
          Neue Anfrage starten →
        </Link>
      </div>
      <div className="rounded-2xl border border-white/[0.06] bg-vault-surface/60 p-6">
        <h2 className="font-display text-xl font-bold">Aktuelle Anträge</h2>
        <div className="mt-4 space-y-3">
          {list.slice(0, 5).map((a) => (
            <Link
              key={a.id}
              href={`/dashboard/antrag/${a.id}`}
              className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3 hover:bg-white/5"
            >
              <div>
                <p className="font-mono text-sm text-credit-400">{a.applicationNumber}</p>
                <p className="text-sm text-text-secondary">
                  {getLoanProduct(a.loanType).nameDe} · {formatCurrencyExact(Number(a.requestedAmount))}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StatusBadge status={a.status} />
                <ArrowRight className="h-4 w-4 text-text-muted" />
              </div>
            </Link>
          ))}
          {list.length === 0 && <p className="text-sm text-text-muted">Noch keine Anträge vorhanden.</p>}
        </div>
      </div>
    </div>
  );
}

function Stat({ title, value, hint }: { title: string; value: string; hint?: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-vault-surface/60 p-5">
      <p className="text-xs uppercase tracking-wider text-text-muted">{title}</p>
      <p className="mt-2 font-display text-2xl font-bold">{value}</p>
      {hint && <p className="mt-1 text-xs text-text-secondary">{hint}</p>}
    </div>
  );
}

export function ApplicationsView() {
  const [status, setStatus] = useState("");
  const [type, setType] = useState("");
  const qc = useQueryClient();
  const apps = useQuery({
    queryKey: ["applications"],
    queryFn: async () => {
      const res = await fetch("/api/applications", { credentials: "include" });
      const data = (await res.json()) as { applications: AppRow[] };
      return data.applications ?? [];
    },
  });
  const filtered = (apps.data ?? []).filter((a) => (!status || a.status === status) && (!type || a.loanType === type));

  async function removeDraft(id: string) {
    await fetch(`/api/applications/${id}`, { method: "DELETE", credentials: "include" });
    await qc.invalidateQueries({ queryKey: ["applications"] });
  }

  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold">Meine Anträge</h1>
      <div className="mt-4 flex flex-wrap gap-3">
        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">Alle Status</option>
          {APPLICATION_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </Select>
        <Select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Alle Kreditarten</option>
          {["privatkredit", "immobilienkredit", "autokredit", "renovierungskredit", "geschaeftskredit", "liquiditaetskredit", "studienkredit", "reisekredit", "gesundheitskredit", "umschuldung"].map(
            (id) => (
              <option key={id} value={id}>
                {getLoanProduct(id).nameDe}
              </option>
            ),
          )}
        </Select>
      </div>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-vault-deep text-text-muted">
            <tr>
              <th className="px-4 py-3">Antragsnummer</th>
              <th className="px-4 py-3">Kreditart</th>
              <th className="px-4 py-3">Betrag</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Datum</th>
              <th className="px-4 py-3">Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((a) => (
              <tr key={a.id} className="border-t border-white/5">
                <td className="px-4 py-3 font-mono text-credit-400">{a.applicationNumber}</td>
                <td className="px-4 py-3">{getLoanProduct(a.loanType).nameDe}</td>
                <td className="px-4 py-3 font-mono">{formatCurrencyExact(Number(a.requestedAmount))}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={a.status} />
                </td>
                <td className="px-4 py-3">{formatDate(a.createdAt)}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link href={`/dashboard/antrag/${a.id}`} className="text-credit-400">
                      Details
                    </Link>
                    {a.status === "entwurf" && (
                      <button type="button" onClick={() => void removeDraft(a.id)} className="text-rejected">
                        Löschen
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="p-6 text-sm text-text-muted">Keine Anträge gefunden.</p>}
      </div>
    </div>
  );
}

type Detail = {
  application: AppRow & {
    purpose: string | null;
    exampleAnnualRate: string;
    exampleMonthlyPayment: string | null;
    exampleTotalRepayment: string | null;
    exampleTotalInterest: string | null;
    partnerName: string | null;
    partnerReference: string | null;
    partnerOfferRate: string | null;
    partnerOfferMonthly: string | null;
    personalSnapshot: string | null;
  };
  schedule: Array<{
    monthNumber: number;
    paymentDate: string;
    principalPart: string;
    interestPart: string;
    totalPayment: string;
    remainingBalance: string;
  }>;
  documents: Array<{ id: string; documentType: string; fileName: string; uploadedAt: string }>;
  credits: Array<{
    id: string;
    creditorName: string;
    remainingDebt: string;
    monthlyPayment: string;
    annualInterestRate: string;
    remainingMonths: number;
  }>;
};

export function DetailView({ id }: { id: string }) {
  const [tab, setTab] = useState<"overview" | "plan" | "docs">("overview");
  const q = useQuery({
    queryKey: ["application", id],
    queryFn: async () => {
      const res = await fetch(`/api/applications/${id}`, { credentials: "include" });
      if (!res.ok) throw new Error("not found");
      return (await res.json()) as Detail;
    },
  });
  if (q.isLoading) return <p className="text-text-muted">Wird geladen …</p>;
  if (!q.data) return <p>Antrag nicht gefunden.</p>;
  const a = q.data.application;
  const snapshot = a.personalSnapshot ? (JSON.parse(a.personalSnapshot) as Record<string, string>) : {};
  const statuses = APPLICATION_STATUSES.filter((s) => s !== "storniert");
  const idx = statuses.findIndex((s) => s === a.status);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-mono text-credit-400">{a.applicationNumber}</p>
          <h1 className="font-display text-3xl font-extrabold">{getLoanProduct(a.loanType).nameDe}</h1>
          <p className="mt-1 text-text-secondary">
            {formatCurrencyExact(Number(a.requestedAmount))} · {a.durationMonths} Monate
          </p>
        </div>
        <StatusBadge status={a.status} />
      </div>
      <div className="flex flex-wrap gap-2">
        {statuses.map((s, i) => (
          <span
            key={s}
            className={`rounded-full px-3 py-1 text-xs ${i <= idx ? "bg-credit-500/20 text-credit-400" : "bg-white/5 text-text-muted"}`}
          >
            {STATUS_LABELS[s]}
          </span>
        ))}
      </div>
      {a.partnerName && (
        <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 text-sm">
          Partner: {a.partnerName}
          {a.partnerReference ? ` · Ref. ${a.partnerReference}` : ""}
          {a.partnerOfferRate ? ` · Angebot ${a.partnerOfferRate} %` : ""}
        </div>
      )}
      <div className="flex gap-2">
        {(["overview", "plan", "docs"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={`rounded-xl px-4 py-2 text-sm ${tab === t ? "bg-credit-500 text-white" : "bg-white/5"}`}
          >
            {t === "overview" ? "Übersicht" : t === "plan" ? "Tilgungsplan" : "Dokumente"}
          </button>
        ))}
        <a href={`/api/applications/${id}/summary`} className="btn-ghost py-2 text-sm">
          <Download className="h-4 w-4" /> Zusammenfassung
        </a>
      </div>
      {tab === "overview" && (
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-white/10 p-5">
            <h3 className="font-display font-bold">Konditionen (Beispiel)</h3>
            <p className="mt-2 font-mono">Rate: {formatCurrencyExact(Number(a.exampleMonthlyPayment ?? 0))}</p>
            <p className="font-mono">Gesamt: {formatCurrencyExact(Number(a.exampleTotalRepayment ?? 0))}</p>
            <p className="font-mono">Zinsen: {formatCurrencyExact(Number(a.exampleTotalInterest ?? 0))}</p>
            <p className="mt-3 text-xs text-text-muted">{DISCLAIMER_DE}</p>
          </div>
          <div className="rounded-2xl border border-white/10 p-5">
            <h3 className="font-display font-bold">Antragsteller</h3>
            <p className="mt-2 text-sm text-text-secondary">
              {snapshot.firstName} {snapshot.lastName}
              <br />
              {snapshot.email}
              <br />
              {snapshot.city}
            </p>
          </div>
        </div>
      )}
      {tab === "plan" && <Amortization data={q.data.schedule} />}
      {tab === "docs" && (
        <ul className="space-y-2">
          {q.data.documents.map((d) => (
            <li key={d.id} className="flex items-center gap-3 rounded-xl border border-white/10 px-4 py-3">
              <FileText className="h-4 w-4 text-credit-400" />
              <div>
                <p className="text-sm">{d.fileName}</p>
                <p className="text-xs text-text-muted">
                  {DOCUMENT_TYPES.find((t) => t.value === d.documentType)?.label} · {formatDate(d.uploadedAt)}
                </p>
              </div>
            </li>
          ))}
          {q.data.documents.length === 0 && <p className="text-sm text-text-muted">Keine Dokumente hinterlegt.</p>}
        </ul>
      )}
    </div>
  );
}

function Amortization({
  data,
}: {
  data: Detail["schedule"];
}) {
  const max = Math.max(...data.map((d) => Number(d.remainingBalance)), 1);
  return (
    <div className="space-y-6">
      <div className="flex h-40 items-end gap-1 overflow-x-auto rounded-2xl border border-white/10 p-4">
        {data.slice(0, 36).map((d) => (
          <div
            key={d.monthNumber}
            className="w-2 shrink-0 rounded-t bg-credit-500/70"
            style={{ height: `${Math.max(8, (Number(d.remainingBalance) / max) * 100)}%` }}
            title={`Monat ${d.monthNumber}`}
          />
        ))}
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-left text-sm">
          <thead className="bg-vault-deep text-text-muted">
            <tr>
              <th className="px-3 py-2">Monat</th>
              <th className="px-3 py-2">Datum</th>
              <th className="px-3 py-2">Rate</th>
              <th className="px-3 py-2">Zins</th>
              <th className="px-3 py-2">Tilgung</th>
              <th className="px-3 py-2">Restschuld</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.monthNumber} className="border-t border-white/5">
                <td className="px-3 py-2 font-mono">{row.monthNumber}</td>
                <td className="px-3 py-2">{formatDate(row.paymentDate)}</td>
                <td className="px-3 py-2 font-mono">{formatCurrencyExact(Number(row.totalPayment))}</td>
                <td className="px-3 py-2 font-mono">{formatCurrencyExact(Number(row.interestPart))}</td>
                <td className="px-3 py-2 font-mono">{formatCurrencyExact(Number(row.principalPart))}</td>
                <td className="px-3 py-2 font-mono">{formatCurrencyExact(Number(row.remainingBalance))}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export function NotificationsView() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await fetch("/api/notifications", { credentials: "include" });
      return (await res.json()) as {
        notifications: Array<{
          id: string;
          title: string;
          message: string;
          type: string;
          link: string | null;
          isRead: boolean;
          createdAt: string;
        }>;
      };
    },
  });
  const grouped = useMemo(() => {
    const map = new Map<string, NonNullable<typeof q.data>["notifications"]>();
    for (const n of q.data?.notifications ?? []) {
      const key = formatDate(n.createdAt);
      const arr = map.get(key) ?? [];
      arr.push(n);
      map.set(key, arr);
    }
    return Array.from(map.entries());
  }, [q.data]);

  async function markAll() {
    await fetch("/api/notifications", { method: "PATCH", credentials: "include" });
    await qc.invalidateQueries({ queryKey: ["notifications"] });
    await qc.invalidateQueries({ queryKey: ["notifications-unread"] });
  }

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-extrabold">Benachrichtigungen</h1>
        <Button variant="ghost" onClick={() => void markAll()}>
          Alle als gelesen markieren
        </Button>
      </div>
      <div className="mt-6 space-y-6">
        {grouped.map(([day, items]) => (
          <div key={day}>
            <p className="mb-2 text-xs uppercase tracking-wider text-text-muted">{day}</p>
            <div className="space-y-2">
              {items.map((n) => (
                <article
                  key={n.id}
                  className={`rounded-xl border px-4 py-3 ${n.isRead ? "border-white/5" : "border-credit-500/30 bg-credit-500/5"}`}
                >
                  <div className="flex items-start gap-3">
                    <Bell className="mt-0.5 h-4 w-4 text-credit-400" />
                    <div>
                      <p className="font-medium">{n.title}</p>
                      <p className="text-sm text-text-secondary">{n.message}</p>
                      <p className="mt-1 text-xs text-text-muted">{formatDateTime(n.createdAt)}</p>
                      {n.link && (
                        <Link href={n.link} className="text-sm text-credit-400">
                          Öffnen →
                        </Link>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
        {grouped.length === 0 && <p className="text-sm text-text-muted">Keine Benachrichtigungen.</p>}
      </div>
    </div>
  );
}

export function DocumentsView() {
  const q = useQuery({
    queryKey: ["documents"],
    queryFn: async () => {
      const res = await fetch("/api/documents", { credentials: "include" });
      return (await res.json()) as {
        documents: Array<{ id: string; documentType: string; fileName: string; uploadedAt: string }>;
      };
    },
  });
  return (
    <div>
      <h1 className="font-display text-2xl font-extrabold">Dokumente</h1>
      <ul className="mt-6 space-y-2">
        {(q.data?.documents ?? []).map((d) => (
          <li key={d.id} className="flex items-center justify-between rounded-xl border border-white/10 px-4 py-3">
            <div>
              <p>{d.fileName}</p>
              <p className="text-xs text-text-muted">
                {DOCUMENT_TYPES.find((t) => t.value === d.documentType)?.label} · {formatDate(d.uploadedAt)}
              </p>
            </div>
          </li>
        ))}
      </ul>
      {(q.data?.documents.length ?? 0) === 0 && <p className="mt-4 text-sm text-text-muted">Noch keine Dokumente.</p>}
    </div>
  );
}

export function SettingsView() {
  const { user, refresh, logout } = useAuth();
  const [form, setForm] = useState({
    firstName: user?.firstName ?? "",
    lastName: user?.lastName ?? "",
    phone: user?.phone ?? "",
    street: "",
    houseNumber: "",
    postalCode: "",
    city: "",
    country: "DE",
    gender: "",
    maritalStatus: "",
    employmentStatus: "",
  });
  const [msg, setMsg] = useState("");
  const [confirm, setConfirm] = useState(false);

  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      const res = await fetch("/api/profile", { credentials: "include" });
      return (await res.json()) as { profile: Record<string, string | null> };
    },
  });

  useEffect(() => {
    const loaded = profile.data?.profile;
    if (!loaded) return;
    setForm((f) => ({
      ...f,
      firstName: loaded.firstName ?? f.firstName,
      lastName: loaded.lastName ?? f.lastName,
      phone: loaded.phone ?? f.phone,
      street: loaded.street ?? "",
      houseNumber: loaded.houseNumber ?? "",
      postalCode: loaded.postalCode ?? "",
      city: loaded.city ?? "",
      country: loaded.country ?? "DE",
      gender: loaded.gender ?? "",
      maritalStatus: loaded.maritalStatus ?? "",
      employmentStatus: loaded.employmentStatus ?? "",
    }));
  }, [profile.data]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMsg("Profil gespeichert.");
      await refresh();
    } else setMsg("Speichern fehlgeschlagen.");
  }

  async function removeAccount() {
    await fetch("/api/auth/delete", { method: "POST", credentials: "include" });
    await logout();
    window.location.href = "/";
  }

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-extrabold">Einstellungen</h1>
      <form onSubmit={(e) => void save(e)} className="mt-6 space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label>Vorname</Label>
            <Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
          </div>
          <div>
            <Label>Nachname</Label>
            <Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
          </div>
          <div>
            <Label>Telefon</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </div>
          <div>
            <Label>Anrede</Label>
            <Select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="">–</option>
              {GENDERS.map((g) => (
                <option key={g.value} value={g.value}>
                  {g.label}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Straße</Label>
            <Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} />
          </div>
          <div>
            <Label>Hausnummer</Label>
            <Input value={form.houseNumber} onChange={(e) => setForm({ ...form, houseNumber: e.target.value })} />
          </div>
          <div>
            <Label>PLZ</Label>
            <Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
          </div>
          <div>
            <Label>Ort</Label>
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </div>
          <div>
            <Label>Land</Label>
            <Select value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.name}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label>Familienstand</Label>
            <Select value={form.maritalStatus} onChange={(e) => setForm({ ...form, maritalStatus: e.target.value })}>
              <option value="">–</option>
              {MARITAL_STATUS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </div>
          <div className="md:col-span-2">
            <Label>Beschäftigung</Label>
            <Select
              value={form.employmentStatus}
              onChange={(e) => setForm({ ...form, employmentStatus: e.target.value })}
            >
              <option value="">–</option>
              {EMPLOYMENT_STATUS.map((m) => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <p className="text-sm text-text-muted">E-Mail: {user?.email}</p>
        <Button type="submit">Speichern</Button>
        {msg && <p className="text-sm text-approved">{msg}</p>}
      </form>
      <div className="mt-12 rounded-2xl border border-rejected/30 p-5">
        <h2 className="font-display font-bold text-rejected">Konto löschen</h2>
        <p className="mt-2 text-sm text-text-secondary">Diese Aktion ist unwiderruflich.</p>
        {!confirm ? (
          <Button variant="danger" className="mt-4" onClick={() => setConfirm(true)}>
            Konto löschen
          </Button>
        ) : (
          <Button variant="danger" className="mt-4" onClick={() => void removeAccount()}>
            <Trash2 className="h-4 w-4" /> Endgültig löschen
          </Button>
        )}
      </div>
    </div>
  );
}
