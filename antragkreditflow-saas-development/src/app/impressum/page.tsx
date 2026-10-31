import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";
import { COMPANY } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Impressum",
  description: "Impressum der antragkreditflow AG.",
};

export default function ImpressumPage() {
  return (
    <LegalPageLayout title="Impressum" subtitle="Angaben gemäß § 5 DDG">
      <section>
        <p>
          {COMPANY.legalName}
          <br />
          {COMPANY.address}
          <br />
          {COMPANY.postalCode} {COMPANY.city}
          <br />
          {COMPANY.country}
        </p>
      </section>
      <section>
        <h2>Vertretungsberechtigt</h2>
        <p>{COMPANY.representative}</p>
      </section>
      <section>
        <h2>Kontakt</h2>
        <p>
          Telefon: {COMPANY.phone}
          <br />
          E-Mail: {COMPANY.email}
        </p>
      </section>
      <section>
        <h2>Registereintrag</h2>
        <p>
          Eingetragen im Handelsregister des Kantons Thurgau (Schweiz)
          <br />
          Unternehmens-Identifikationsnummer (UID): {COMPANY.uid}
        </p>
      </section>
      <section>
        <h2>Verantwortlich für den Inhalt nach § 18 Abs. 2 MStV</h2>
        <p>
          {COMPANY.representative}
          <br />
          {COMPANY.legalName}, {COMPANY.address}, {COMPANY.postalCode} {COMPANY.city}, {COMPANY.country}
        </p>
      </section>
      <section>
        <h2>Hinweis zu unserem Angebot</h2>
        <p>
          antragkreditflow.de ist ein unabhängiges Vergleichs- und Informationsportal. Wir vergeben selbst keine Kredite;
          Anfragen werden an Partner (z. B. Verivox) weitergeleitet. Für vermittelte Anfragen können wir eine Provision
          erhalten.
        </p>
      </section>
      <section>
        <h2>Verbraucherstreitbeilegung</h2>
        <p>
          Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </p>
      </section>
      <section>
        <h2>Haftung für Inhalte</h2>
        <p>
          Die Inhalte dieser Website werden mit größtmöglicher Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und
          Aktualität der Inhalte – insbesondere von Zinssätzen, Konditionen und Beispielrechnungen – können wir jedoch
          keine Gewähr übernehmen. Als Diensteanbieter sind wir für eigene Inhalte auf diesen Seiten nach den allgemeinen
          Gesetzen verantwortlich. Wir sind jedoch nicht verpflichtet, übermittelte oder gespeicherte fremde Informationen
          zu überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige Tätigkeit hinweisen. Sobald uns eine
          konkrete Rechtsverletzung bekannt wird, entfernen wir die betreffenden Inhalte umgehend.
        </p>
      </section>
      <section>
        <h2>Haftung für Links</h2>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, insbesondere unserer Vergleichspartner und Banken, auf
          deren Inhalte wir keinen Einfluss haben. Für die Inhalte der verlinkten Seiten ist stets der jeweilige Anbieter
          oder Betreiber verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der Verlinkung auf mögliche
          Rechtsverstöße überprüft; rechtswidrige Inhalte waren nicht erkennbar. Bei Bekanntwerden von Rechtsverletzungen
          entfernen wir derartige Links umgehend.
        </p>
      </section>
      <section>
        <h2>Urheberrecht</h2>
        <p>
          Die auf dieser Website veröffentlichten Texte, Bilder, Grafiken und sonstigen Inhalte unterliegen dem
          Urheberrecht. Jede Vervielfältigung, Bearbeitung, Verbreitung oder sonstige Verwertung außerhalb der Grenzen des
          Urheberrechts bedarf der vorherigen schriftlichen Zustimmung der AntragKreditFlow bzw. des jeweiligen
          Rechteinhabers. Soweit Inhalte von Dritten stammen, werden deren Urheberrechte beachtet und entsprechend
          gekennzeichnet.
        </p>
      </section>
    </LegalPageLayout>
  );
}
