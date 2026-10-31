import type { ReactNode } from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { SupportBanner } from "@/components/layout/SupportBanner";

export function PageLayout({ children, showSupport = true }: { children: ReactNode; showSupport?: boolean }) {
  return (
    <div className="flex min-h-screen flex-col bg-vault-black">
      <a href="#content" className="skip-link">
        Zum Inhalt springen
      </a>
      <Navbar />
      <main id="content" className="flex-1">
        {children}
      </main>
      {showSupport && <SupportBanner />}
      <Footer />
      <WhatsAppFAB />
    </div>
  );
}
