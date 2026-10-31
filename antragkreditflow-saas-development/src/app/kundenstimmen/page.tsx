import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { TestimonialCard } from "@/components/testimonials/TestimonialCard";
import { TESTIMONIALS } from "@/data/testimonials";

export const metadata: Metadata = {
  title: "Kundenstimmen",
  description: "Lesen Sie Erfahrungen echter Nutzer von antragkreditflow aus Deutschland, Österreich und der Schweiz.",
};

export default function KundenstimmenPage() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-7xl px-4 py-16 md:px-6 lg:px-8">
        <p className="text-sm uppercase tracking-[0.16em] text-credit-400">Kundenstimmen</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">Das sagen unsere Nutzer</h1>
        <p className="mt-3 max-w-2xl text-text-secondary">
          Ø 4,8 ★ aus authentischen Rückmeldungen. Acht Bewertungen mit 5 Sternen, zwei mit 4 Sternen – bewusst ehrlich.
        </p>
        <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <TestimonialCard key={t.id} t={t} />
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
