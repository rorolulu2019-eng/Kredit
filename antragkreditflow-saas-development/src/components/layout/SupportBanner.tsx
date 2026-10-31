"use client";

import { MessageCircle } from "lucide-react";
import { WhatsAppInline } from "@/components/layout/WhatsAppFAB";

export function SupportBanner() {
  return (
    <section className="border-y border-white/[0.06] bg-vault-deep/80">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 md:flex-row md:px-6 lg:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#25D366]/15 text-[#25D366]">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-lg font-bold">Fragen? Wir sind für Sie da.</p>
            <p className="text-sm text-text-secondary">
              Schreiben Sie uns jederzeit per WhatsApp – persönlich, diskret und ohne Wartezeit.
            </p>
          </div>
        </div>
        <WhatsAppInline
          label="Jetzt schreiben"
          className="inline-flex items-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-white shadow-lg shadow-[#25D366]/25 transition hover:bg-[#128C7E]"
        />
      </div>
    </section>
  );
}
