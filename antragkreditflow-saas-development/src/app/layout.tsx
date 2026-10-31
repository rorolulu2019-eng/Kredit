import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { Providers } from "@/components/providers";
import { COMPANY, SITE_URL } from "@/lib/constants";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "antragkreditflow – Ihr unabhängiger Kreditvergleich",
    template: "%s – antragkreditflow",
  },
  description:
    "antragkreditflow – Ihr unabhängiger Kreditvergleich für Deutschland, Österreich und die Schweiz. Kostenlos, transparent und schnell.",
  keywords: [
    "Kreditvergleich",
    "Ratenkredit",
    "Deutschland",
    "Österreich",
    "Schweiz",
    "antragkreditflow",
  ],
  authors: [{ name: COMPANY.legalName }],
  openGraph: {
    title: "antragkreditflow – Kreditvergleich DACH",
    description:
      "Vergleichen Sie Kreditangebote führender Banken — transparent, unverbindlich und in wenigen Minuten.",
    url: SITE_URL,
    siteName: COMPANY.name,
    locale: "de_DE",
    type: "website",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    title: "antragkreditflow – Kreditvergleich DACH",
    description: COMPANY.slogan,
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de" className={`${inter.variable} ${jakarta.variable} ${jetbrains.variable}`}>
      <body className="bg-vault-black font-sans text-text-primary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
