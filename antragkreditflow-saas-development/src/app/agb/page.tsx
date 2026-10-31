import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "AGB",
  description: "Allgemeine Geschäftsbedingungen von antragkreditflow.",
};

export default function AGBPage() {
  return (
    <LegalPageLayout title="Allgemeine Geschäftsbedingungen (AGB)" subtitle="Stand: 01.07.2025">
      <section>
        <h2>§ 1 Geltungsbereich</h2>
        <p>
          Diese AGB gelten für die Nutzung der Website antragkreditflow.de und aller darauf angebotenen Dienste.
          Betreiberin ist die antragkreditflow AG, Breitholzstrasse 17, 8370 Sirnach, Schweiz.
        </p>
      </section>
      <section>
        <h2>§ 2 Leistungsgegenstand</h2>
        <p>
          (1) antragkreditflow.de ist ein unabhängiges Vergleichs- und Informationsportal für Kreditprodukte. Wir
          vermitteln und vergeben selbst keine Kredite und sind kein Kreditgeber im Sinne des Kreditwesengesetzes (KWG)
          oder des Schweizer Obligationenrechts (OR).
        </p>
        <p>
          (2) Unsere Leistungen umfassen: Bereitstellung eines Kreditrechners, Informationen zu Kreditprodukten,
          Entgegennahme von Kreditanfragen und deren Weiterleitung an Partnerunternehmen (z. B. Verivox, Banken).
        </p>
        <p>
          (3) Ein Kreditvertrag kommt ausschließlich zwischen dem Nutzer und dem jeweiligen Partnerunternehmen zustande.
          antragkreditflow ist nicht Vertragspartei des Kreditvertrags.
        </p>
      </section>
      <section>
        <h2>§ 3 Registrierung und Nutzerkonto</h2>
        <p>
          (1) Für die Nutzung des Antragsassistenten ist eine Registrierung erforderlich. Der Nutzer verpflichtet sich,
          wahrheitsgemäße und vollständige Angaben zu machen.
        </p>
        <p>(2) Der Nutzer ist für die Geheimhaltung seiner Zugangsdaten verantwortlich.</p>
        <p>
          (3) Wir behalten uns vor, Nutzerkonten bei Verdacht auf Missbrauch oder unrichtige Angaben zu sperren.
        </p>
      </section>
      <section>
        <h2>§ 4 Vergütung</h2>
        <p>(1) Die Nutzung von antragkreditflow.de ist für den Nutzer kostenlos.</p>
        <p>
          (2) antragkreditflow erhält ggf. eine Provision von Partnerunternehmen für erfolgreich vermittelte Anfragen.
          Dies hat keinen Einfluss auf die Konditionen des Nutzers.
        </p>
      </section>
      <section>
        <h2>§ 5 Beispielzinssätze</h2>
        <p>
          (1) Die auf der Website angezeigten Zinssätze, Raten und Laufzeiten sind unverbindliche Beispielrechnungen
          (Beispielzins). Sie stellen kein verbindliches Angebot dar.
        </p>
        <p>
          (2) Die tatsächlichen Konditionen werden vom jeweiligen Kreditpartner nach individueller Bonitätsprüfung
          festgelegt.
        </p>
      </section>
      <section>
        <h2>§ 6 Haftung</h2>
        <p>
          (1) Für die Richtigkeit, Vollständigkeit und Aktualität der bereitgestellten Informationen übernehmen wir keine
          Gewähr.
        </p>
        <p>
          (2) Die Haftung für Schäden aus der Nutzung der Website ist auf Vorsatz und grobe Fahrlässigkeit beschränkt.
        </p>
        <p>(3) Für die Inhalte und Leistungen der Partnerunternehmen übernehmen wir keine Haftung.</p>
      </section>
      <section>
        <h2>§ 7 Datenschutz</h2>
        <p>Es gilt unsere Datenschutzerklärung unter antragkreditflow.de/datenschutz.</p>
      </section>
      <section>
        <h2>§ 8 Schlussbestimmungen</h2>
        <p>
          (1) Es gilt Schweizer Recht unter Ausschluss des Kollisionsrechts. Für Verbraucher in der EU gelten zusätzlich
          die zwingenden Verbraucherschutzvorschriften ihres Wohnsitzlandes.
        </p>
        <p>
          (2) Gerichtsstand ist Sirnach, Kanton Thurgau, Schweiz, soweit gesetzlich zulässig.
        </p>
        <p>
          (3) Sollten einzelne Bestimmungen unwirksam sein, bleibt die Wirksamkeit der übrigen Bestimmungen unberührt.
        </p>
      </section>
    </LegalPageLayout>
  );
}
