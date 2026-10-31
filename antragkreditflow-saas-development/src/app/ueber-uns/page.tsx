import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { COMPANY } from "@/lib/constants";
import { WhatsAppInline } from "@/components/layout/WhatsAppFAB";

export const metadata: Metadata = {
  title: "Über uns",
  description: "Über antragkreditflow – unabhängiges Vergleichs- und Informationsportal für Kreditprodukte.",
};

export default function UeberUnsPage() {
  return (
    <PageLayout>
      <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="text-sm uppercase tracking-[0.16em] text-credit-400">Unternehmen</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">Über antragkreditflow</h1>
        <div className="mt-8 space-y-6 text-text-secondary leading-relaxed">
          <p>
            antragkreditflow ist ein unabhängiges Vergleichs- und Informationsportal für Kreditprodukte im
            deutschsprachigen Raum. Unser Ziel ist es, Verbrauchern und Unternehmen den Zugang zu günstigen
            Kreditkonditionen zu erleichtern – transparent, unkompliziert und kostenlos.
          </p>
          <h2 className="font-display text-2xl font-bold text-text-primary">Wer wir sind</h2>
          <p>
            Hinter antragkreditflow steht die antragkreditflow AG mit Sitz in Sirnach, Kanton Thurgau, Schweiz (UID:{" "}
            {COMPANY.uid}). Gegründet und geführt von {COMPANY.representative}, verbinden wir Schweizer Gründlichkeit mit
            digitaler Innovation.
          </p>
          <h2 className="font-display text-2xl font-bold text-text-primary">Was wir tun</h2>
          <p>
            Wir vergeben selbst keine Kredite. Stattdessen vergleichen wir die Angebote führender Banken und
            Finanzdienstleister und leiten Ihre Anfrage an den passenden Partner weiter – zum Beispiel an Verivox oder
            direkt an spezialisierte Kreditinstitute. So erhalten Sie die bestmöglichen Konditionen, ohne dutzende
            Einzelanträge stellen zu müssen.
          </p>
          <h2 className="font-display text-2xl font-bold text-text-primary">Unsere Werte</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>Transparenz: Alle Beispielrechnungen und Konditionen werden klar gekennzeichnet.</li>
            <li>Unabhängigkeit: Wir sind an keine einzelne Bank gebunden.</li>
            <li>
              Datenschutz: Ihre Daten werden nach DSGVO und Schweizer DSG geschützt und nur mit Ihrer ausdrücklichen
              Einwilligung weitergegeben.
            </li>
            <li>Einfachheit: Unser 7-stufiger Antragsassistent führt Sie in wenigen Minuten zur optimalen Kreditlösung.</li>
          </ul>
          <h2 className="font-display text-2xl font-bold text-text-primary">antragkreditflow in Zahlen</h2>
          <ul className="list-disc space-y-2 pl-5">
            <li>10 Kreditarten im Vergleich</li>
            <li>Beträge von 2.000 € bis 50.000.000 €</li>
            <li>Laufzeiten von 3 bis 360 Monaten</li>
            <li>Ø 4,8 ★ Kundenbewertung</li>
            <li>100 % kostenlos für Nutzer</li>
          </ul>
          <h2 className="font-display text-2xl font-bold text-text-primary">Kontakt</h2>
          <p>
            {COMPANY.legalName}
            <br />
            {COMPANY.address}, {COMPANY.postalCode} {COMPANY.city}, {COMPANY.country}
            <br />
            E-Mail: {COMPANY.email}
            <br />
            Telefon / WhatsApp: {COMPANY.phoneFormatted}
          </p>
          <WhatsAppInline
            label="Per WhatsApp schreiben"
            className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-white"
          />
        </div>
      </article>
    </PageLayout>
  );
}
