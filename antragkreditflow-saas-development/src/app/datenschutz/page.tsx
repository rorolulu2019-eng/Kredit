import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung von antragkreditflow gemäß DSGVO und Schweizer DSG.",
};

export default function DatenschutzPage() {
  return (
    <LegalPageLayout title="Datenschutzerklärung" subtitle="Stand: 01.07.2025">
      <section>
        <h2>1. Verantwortliche Stelle</h2>
        <p>
          Verantwortlich für die Datenverarbeitung auf dieser Website im Sinne der Datenschutz-Grundverordnung (DSGVO)
          und des Schweizer Bundesgesetzes über den Datenschutz (DSG) ist:
        </p>
        <p>
          antragkreditflow AG
          <br />
          Breitholzstrasse 17, 8370 Sirnach, Schweiz
          <br />
          E-Mail: webmail.antrag.kredit.sofort@gmail.com
          <br />
          Telefon / WhatsApp: +49 15511 241487
          <br />
          UID: CHE-410.470.148
          <br />
          Vertretungsberechtigter: Christian SCHENNACH
        </p>
      </section>
      <section>
        <h2>2. Rechtsgrundlagen der Verarbeitung</h2>
        <ul>
          <li>Art. 6 Abs. 1 lit. a DSGVO – Einwilligung (Weiterleitung an Partner, optionale Cookies)</li>
          <li>Art. 6 Abs. 1 lit. b DSGVO – Vertragserfüllung/vorvertragliche Maßnahmen (Kreditanfrage)</li>
          <li>Art. 6 Abs. 1 lit. c DSGVO – Rechtliche Verpflichtung (HGB, AO, GwG, OR)</li>
          <li>Art. 6 Abs. 1 lit. f DSGVO – Berechtigtes Interesse (Sicherheit, Betrugsprävention)</li>
        </ul>
      </section>
      <section>
        <h2>3. Hosting und Bereitstellung der Website</h2>
        <p>
          Beim Aufruf der Website werden automatisch Server-Logfiles erfasst: IP-Adresse (anonymisiert nach 7 Tagen),
          Datum/Uhrzeit, URL, Referrer, Browser/OS. Diese Daten dienen dem sicheren Betrieb (Art. 6 Abs. 1 lit. f DSGVO).
          Eine Zusammenführung mit anderen Datenquellen findet nicht statt.
        </p>
      </section>
      <section>
        <h2>4. Cookies und lokale Speicherung</h2>
        <p>
          Essenziell: Authentifizierung (Sitzungscookie), CSRF-Schutz. Dauer: bis 1 Stunde nach Abmeldung. Funktional:
          Zwischenspeicherung des Antragsentwurfs (localStorage). Dauer: bis Einreichung oder manuellem Löschen. Analyse:
          Keine Tracking-Cookies im Einsatz.
        </p>
      </section>
      <section>
        <h2>5. Kreditanfrage und personenbezogene Daten</h2>
        <p>Bei Nutzung unseres Antragsassistenten erheben wir:</p>
        <ul>
          <li>Stammdaten: Vorname, Nachname, Geburtsdatum, Geschlecht, Familienstand, Staatsangehörigkeit</li>
          <li>Kontaktdaten: E-Mail, Telefon, Wohnadresse</li>
          <li>Berufliche Angaben: Beschäftigungsstatus, Arbeitgeber, Beruf, Nettoeinkommen, Beschäftigungsdauer</li>
          <li>Finanzdaten: IBAN, BIC, Kontoinhaber, gewünschter Betrag, Laufzeit, Kreditart</li>
          <li>Bestehende Verbindlichkeiten (bei Umschuldung): Gläubiger, Restschuld, Rate, Zins, Restlaufzeit</li>
          <li>Dokumente: Ausweis, Gehaltsabrechnungen, Kontoauszüge</li>
        </ul>
        <p>
          Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO. Die Bereitstellung ist für die Bearbeitung Ihrer Anfrage
          erforderlich.
        </p>
      </section>
      <section>
        <h2>6. Weiterleitung an Kreditpartner</h2>
        <p>
          Da antragkreditflow selbst keine Kredite vergibt, werden Ihre Anfragedaten nach Ihrer ausdrücklichen
          Einwilligung an einen oder mehrere unserer Partner (z. B. Verivox, angeschlossene Banken und
          Finanzdienstleister) weitergeleitet. Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO. Sie können Ihre Einwilligung
          jederzeit widerrufen. Die Partner verarbeiten Ihre Daten nach deren eigenen Datenschutzbestimmungen.
        </p>
      </section>
      <section>
        <h2>7. Datenverarbeitung durch den Hosting- und Datenbankdienst</h2>
        <p>
          Wir nutzen PostgreSQL in der Europäischen Union zur Speicherung Ihrer Daten. Zugriff erfolgt ausschließlich
          über authentifizierte Schnittstellen. Datenbanken sind durch Zugriffskontrollen geschützt.
        </p>
      </section>
      <section>
        <h2>8. E-Mail-Versand</h2>
        <p>
          Transaktionale E-Mails können über einen Versanddienstleister (z. B. Resend) erfolgen. Rechtsgrundlage: Art. 6
          Abs. 1 lit. b DSGVO.
        </p>
      </section>
      <section>
        <h2>9. WhatsApp-Integration</h2>
        <p>
          WhatsApp-Kontakt (+49 15511 241487) über Meta Platforms Ireland Ltd. (Dublin). Rechtsgrundlage: Art. 6 Abs. 1
          lit. a DSGVO (Einwilligung durch aktives Anklicken). Alternativen: E-Mail oder Telefon.
          https://www.whatsapp.com/legal/privacy-policy
        </p>
      </section>
      <section>
        <h2>10. Speicherdauer und Löschung</h2>
        <ul>
          <li>Kreditanfragen (nicht vermittelt): 6 Monate</li>
          <li>Vermittelte Anfragen: 12 Monate (sofern keine gesetzliche Pflicht)</li>
          <li>Vertragsdaten: 10 Jahre nach Vertragsende (§ 257 HGB, § 147 AO)</li>
          <li>Identifikationsdokumente (GwG): 5 Jahre (§ 8 GwG)</li>
          <li>Server-Logfiles: IP-Anonymisierung nach 7 Tagen</li>
        </ul>
      </section>
      <section>
        <h2>11. Ihre Rechte</h2>
        <p>
          Auskunft (Art. 15), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung (Art. 18), Datenübertragbarkeit
          (Art. 20), Widerspruch (Art. 21), Widerruf (Art. 7 Abs. 3) DSGVO. Kontakt:
          webmail.antrag.kredit.sofort@gmail.com oder WhatsApp +49 15511 241487. Antwortfrist: 30 Tage.
        </p>
      </section>
      <section>
        <h2>12. Datensicherheit</h2>
        <p>
          TLS 1.3, Passwort-Hashing (scrypt), serverseitige Sitzungen, verschlüsselte Übertragung, Zugriff nur für
          authentifizierte Nutzer auf eigene Daten.
        </p>
      </section>
      <section>
        <h2>13. Beschwerderecht</h2>
        <p>
          Schweiz: Eidgenössischer Datenschutz- und Öffentlichkeitsbeauftragter (EDÖB), Feldeggweg 1, 3003 Bern,
          www.edoeb.admin.ch. EU: Aufsichtsbehörde Ihres Wohnsitzlandes (Art. 77 DSGVO).
        </p>
      </section>
      <section>
        <h2>14. Änderungen</h2>
        <p>
          Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen. Die aktuelle Version ist stets auf
          dieser Seite abrufbar.
        </p>
      </section>
    </LegalPageLayout>
  );
}
