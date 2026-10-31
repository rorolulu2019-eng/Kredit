"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Check,
  Lock,
  Scale,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";
import { LoanSimulator } from "@/components/landing/LoanSimulator";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { WhatsAppInline } from "@/components/layout/WhatsAppFAB";
import { LoanIcon } from "@/components/icons";
import { LOAN_PRODUCTS } from "@/data/loan-products";
import { TESTIMONIALS } from "@/data/testimonials";
import { formatCurrency } from "@/lib/format";
import { useWizardStore } from "@/stores/wizardStore";

const fade = {
  hidden: { opacity: 0, y: 32 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const },
  }),
};

function ParticleBackground() {
  const dots = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    left: `${(i * 37) % 100}%`,
    top: `${(i * 53) % 100}%`,
    delay: `${(i % 10) * 0.6}s`,
    size: 2 + (i % 3),
  }));
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.08),transparent_65%)]" />
      <div className="dot-grid absolute inset-0 opacity-70" />
      <div className="spin-slow absolute left-1/2 top-1/2 h-[720px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 [background:conic-gradient(from_0deg,transparent,rgba(99,102,241,0.18),transparent_40%)]" />
      {dots.map((d) => (
        <span
          key={d.id}
          className="absolute rounded-full bg-credit-500/20"
          style={{
            left: d.left,
            top: d.top,
            width: d.size,
            height: d.size,
            animation: `float-y ${8 + (d.id % 5)}s ease-in-out ${d.delay} infinite`,
          }}
        />
      ))}
    </div>
  );
}

export function LandingView() {
  const patch = useWizardStore((s) => s.patch);

  return (
    <>
      <section className="relative overflow-hidden">
        <ParticleBackground />
        <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-16 md:px-6 md:pt-24 lg:px-8 lg:pt-28">
          <motion.div initial="hidden" animate="visible" variants={fade} className="mx-auto max-w-4xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-sm text-text-secondary">
              <BadgeCheck className="h-4 w-4 text-approved" />
              Unabhängig · Kostenlos · DSGVO-konform
            </div>
            <h1 className="font-display text-4xl font-extrabold tracking-tight text-text-primary sm:text-5xl lg:text-6xl">
              Finden Sie den Kredit,
              <br />
              <span className="bg-gradient-to-r from-credit-400 to-credit-600 bg-clip-text text-transparent">
                der wirklich zu Ihnen passt.
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-text-secondary">
              Vergleichen Sie Angebote führender Banken in Echtzeit — transparent, unverbindlich und in wenigen
              Minuten.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/antrag" className="btn-primary">
                Kreditvergleich starten <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#rechner" className="btn-ghost">
                Mehr erfahren
              </Link>
              <WhatsAppInline
                label="WhatsApp"
                className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-6 py-3.5 font-semibold text-white shadow-lg shadow-[#25D366]/25 transition hover:bg-[#128C7E]"
              />
            </div>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-text-secondary">
              <span>Über 50.000 zufriedene Nutzer</span>
              <span>Ø 4,8 ★ Bewertung</span>
              <span>100 % kostenlos</span>
            </div>
          </motion.div>
        </div>
      </section>

      <LoanSimulator />

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-credit-400">So funktioniert&apos;s</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">In drei Schritten zum Vergleich</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              title: "Vergleichen",
              text: "Nutzen Sie unseren Kreditrechner und sehen Sie sofort Ihre Beispielrate.",
            },
            {
              n: "02",
              title: "Anfrage stellen",
              text: "Füllen Sie unseren 7-Stufen-Antrag aus – sicher, strukturiert und in wenigen Minuten.",
            },
            {
              n: "03",
              title: "Angebot erhalten",
              text: "Erhalten Sie das passende Angebot unseres Partners – unverbindlich und transparent.",
            },
          ].map((s, i) => (
            <motion.div
              key={s.n}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fade}
              className="rounded-3xl border border-white/[0.08] bg-gradient-to-br from-vault-surface/80 to-vault-deep/60 p-8"
            >
              <p className="font-mono text-sm text-credit-400">{s.n}</p>
              <h3 className="mt-3 font-display text-2xl font-bold">{s.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-text-secondary">{s.text}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="kreditarten" className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-credit-400">Kreditarten</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Zehn Wege zur passenden Finanzierung</h2>
          <p className="mt-3 text-text-secondary">
            Wählen Sie die Kreditart, die zu Ihrem Vorhaben passt. Alle Beträge sind Beispielspannen.
          </p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {LOAN_PRODUCTS.map((p) => (
            <Link
              key={p.id}
              href={`/antrag?type=${p.id}`}
              onClick={() => patch({ loanType: p.id, requestedAmount: p.minAmount })}
              className="group rounded-2xl border border-white/[0.06] bg-vault-surface/60 p-5 transition hover:-translate-y-1 hover:border-credit-500/40 hover:shadow-[0_8px_32px_rgba(99,102,241,0.15)]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-credit-500/10 text-credit-400">
                <LoanIcon name={p.iconName} className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display font-bold">{p.nameDe}</h3>
              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-text-secondary">{p.descriptionDe}</p>
              <p className="mt-4 font-mono text-xs text-text-muted">
                ab {formatCurrency(p.minAmount)} bis {formatCurrency(p.maxAmount)}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-medium uppercase tracking-[0.18em] text-credit-400">Warum antragkreditflow?</p>
          <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Vertrauen, das Sie sehen können</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Scale, title: "Unabhängig & neutral", text: "Wir sind an keine einzelne Bank gebunden." },
            { icon: Sparkles, title: "100 % kostenlos", text: "Für Sie entstehen keine Gebühren – niemals." },
            { icon: ShieldCheck, title: "DSGVO & DSG konform", text: "Ihre Daten bleiben geschützt und nachvollziehbar." },
            { icon: Zap, title: "Schnell & unkompliziert", text: "Vom Rechner bis zur Partneranfrage in wenigen Minuten." },
          ].map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/[0.06] bg-vault-surface/60 p-6">
              <item.icon className="h-6 w-6 text-gold-500" strokeWidth={1.5} />
              <h3 className="mt-4 font-display text-lg font-bold">{item.title}</h3>
              <p className="mt-2 text-sm text-text-secondary">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 md:px-6 lg:px-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.18em] text-credit-400">Kundenstimmen</p>
            <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight">Das sagen unsere Nutzer</h2>
          </div>
          <Link href="/kundenstimmen" className="hidden text-sm font-medium text-credit-400 hover:text-credit-500 md:inline">
            Alle Bewertungen ansehen →
          </Link>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {TESTIMONIALS.slice(0, 5).map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>
        <Link href="/kundenstimmen" className="mt-6 inline-flex text-sm font-medium text-credit-400 md:hidden">
          Alle Bewertungen ansehen →
        </Link>
      </section>

      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-credit-700 via-credit-500 to-credit-600 opacity-90" />
        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <Lock className="mx-auto h-8 w-8 text-white/80" />
          <h2 className="mt-4 font-display text-3xl font-extrabold md:text-4xl">Bereit für Ihren Kreditvergleich?</h2>
          <p className="mt-3 text-white/80">Unverbindlich, kostenlos und in wenigen Minuten erledigt.</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/antrag" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-credit-700 shadow-xl">
              Jetzt starten <ArrowRight className="h-4 w-4" />
            </Link>
            <WhatsAppInline
              label="Fragen? Schreiben Sie uns"
              className="inline-flex items-center gap-2 rounded-xl border border-white/30 px-6 py-3.5 font-semibold text-white"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-text-muted">
          <span className="inline-flex items-center gap-2">
            <Check className="h-4 w-4 text-approved" /> Unabhängig
          </span>
          <span className="inline-flex items-center gap-2">
            <Check className="h-4 w-4 text-approved" /> Keine Kredite von uns selbst
          </span>
          <span className="inline-flex items-center gap-2">
            <Check className="h-4 w-4 text-approved" /> Beispielzins 2,20 % p.a.
          </span>
        </div>
      </section>
    </>
  );
}
