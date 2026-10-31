import type { Metadata } from "next";
import { LegalPageLayout } from "@/components/legal/LegalPageLayout";

export const metadata: Metadata = {
  title: "Widerrufsbelehrung",
  description: "Widerrufsbelehrung zur Einwilligung in die Weiterleitung Ihrer Kreditanfrage.",
};

export default function WiderrufPage() {
  return (
    <LegalPageLayout title="Widerrufsbelehrung">
      <section>
        <h2>Widerrufsrecht</h2>
        <p>
          Sie haben das Recht, Ihre Einwilligung zur Weiterleitung Ihrer Kreditanfrage an Partnerunternehmen innerhalb von
          vierzehn Tagen ohne Angabe von Gründen zu widerrufen. Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag der
          Erteilung der Einwilligung.
        </p>
        <p>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns</p>
        <p>
          antragkreditflow AG
          <br />
          Breitholzstrasse 17
          <br />
          8370 Sirnach, Schweiz
          <br />
          E-Mail: webmail.antrag.kredit.sofort@gmail.com
          <br />
          Telefon / WhatsApp: +49 15511 241487
        </p>
        <p>
          mittels einer eindeutigen Erklärung (z. B. ein mit der Post gesandter Brief oder eine E-Mail) über Ihren
          Entschluss, die Einwilligung zu widerrufen, informieren.
        </p>
        <p>
          Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor
          Ablauf der Widerrufsfrist absenden.
        </p>
      </section>
      <section>
        <h2>Folgen des Widerrufs</h2>
        <p>
          Wenn Sie Ihre Einwilligung widerrufen, werden wir Ihre Daten nicht mehr an Partnerunternehmen weiterleiten.
          Bereits erfolgte Weiterleitungen können nicht rückgängig gemacht werden; Sie müssen sich in diesem Fall direkt
          an den jeweiligen Partner wenden.
        </p>
      </section>
      <section>
        <h2>Hinweis zum Kreditvertrag</h2>
        <p>
          Das Widerrufsrecht bezüglich des Kreditvertrags selbst richtet sich nach § 495 BGB i. V. m. §§ 355 ff. BGB und
          den Bedingungen des jeweiligen Kreditgebers. Bitte beachten Sie die Widerrufsbelehrung in Ihrem Kreditvertrag.
        </p>
      </section>
      <section>
        <h2>Muster-Widerrufsformular</h2>
        <p>(Wenn Sie die Einwilligung widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)</p>
        <p>
          An: antragkreditflow AG, Breitholzstrasse 17, 8370 Sirnach, Schweiz
          <br />
          E-Mail: webmail.antrag.kredit.sofort@gmail.com
        </p>
        <p>
          Hiermit widerrufe(n) ich/wir (*) die von mir/uns (*) erteilte Einwilligung zur Weiterleitung meiner/unserer (*)
          Kreditanfrage an Partnerunternehmen.
        </p>
        <p>
          Eingereicht am: _______________
          <br />
          Name des/der Verbraucher(s): _______________
          <br />
          Anschrift des/der Verbraucher(s): _______________
          <br />
          Unterschrift (nur bei Mitteilung auf Papier): _______________
          <br />
          Datum: _______________
        </p>
        <p>(*) Unzutreffendes streichen.</p>
      </section>
    </LegalPageLayout>
  );
}
