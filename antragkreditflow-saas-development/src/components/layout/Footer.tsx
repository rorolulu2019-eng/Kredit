import Link from "next/link";
import { COMPANY, DISCLAIMER_DE } from "@/lib/constants";
import { LOAN_PRODUCTS } from "@/data/loan-products";
import { WhatsAppInline } from "@/components/layout/WhatsAppFAB";
import { Logo } from "@/components/layout/Navbar";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-vault-deep">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 md:grid-cols-2 md:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-secondary">
            Unabhängiges Vergleichsportal für Kreditprodukte im DACH-Raum. Transparent, kostenlos und unverbindlich.
          </p>
          <WhatsAppInline
            label="WhatsApp"
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#25D366] hover:underline"
          />
          <a href={`mailto:${COMPANY.email}`} className="mt-2 block text-sm text-text-muted hover:text-text-primary">
            {COMPANY.email}
          </a>
        </div>
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">Kreditarten</h3>
          <ul className="mt-4 space-y-2">
            {LOAN_PRODUCTS.map((p) => (
              <li key={p.id}>
                <Link href={`/antrag?type=${p.id}`} className="text-sm text-text-secondary hover:text-credit-400">
                  {p.nameDe}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">Unternehmen</h3>
          <ul className="mt-4 space-y-2 text-sm text-text-secondary">
            <li>
              <Link href="/ueber-uns" className="hover:text-credit-400">
                Über uns
              </Link>
            </li>
            <li>
              <Link href="/kundenstimmen" className="hover:text-credit-400">
                Kundenstimmen
              </Link>
            </li>
            <li>
              <Link href="/#rechner" className="hover:text-credit-400">
                Kreditrechner
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h3 className="font-display text-sm font-bold uppercase tracking-wider text-text-primary">Rechtliches</h3>
          <ul className="mt-4 space-y-2 text-sm text-text-secondary">
            <li>
              <Link href="/impressum" className="hover:text-credit-400">
                Impressum
              </Link>
            </li>
            <li>
              <Link href="/datenschutz" className="hover:text-credit-400">
                Datenschutzerklärung
              </Link>
            </li>
            <li>
              <Link href="/agb" className="hover:text-credit-400">
                AGB
              </Link>
            </li>
            <li>
              <Link href="/widerruf" className="hover:text-credit-400">
                Widerrufsbelehrung
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="section-divider" />
      <div className="mx-auto max-w-7xl px-4 py-6 text-center text-xs leading-relaxed text-text-muted md:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} {COMPANY.copyrightHolder}. Alle Rechte vorbehalten.
        </p>
        <p className="mt-2">{DISCLAIMER_DE}</p>
        <p className="mt-2">antragkreditflow vergibt selbst keine Kredite.</p>
      </div>
    </footer>
  );
}
