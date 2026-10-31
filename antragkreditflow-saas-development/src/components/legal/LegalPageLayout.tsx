import type { ReactNode } from "react";
import { PageLayout } from "@/components/layout/PageLayout";
import { DISCLAIMER_DE } from "@/lib/constants";

export function LegalPageLayout({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
}) {
  return (
    <PageLayout>
      <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
        <p className="text-sm uppercase tracking-[0.16em] text-credit-400">Rechtliches</p>
        <h1 className="mt-2 font-display text-4xl font-extrabold tracking-tight">{title}</h1>
        {subtitle && <p className="mt-3 text-text-secondary">{subtitle}</p>}
        <div className="section-divider my-8" />
        <div className="space-y-8 text-sm leading-relaxed text-text-secondary [&_h2]:font-display [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-text-primary [&_h3]:mt-4 [&_h3]:font-semibold [&_h3]:text-text-primary [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
          {children}
        </div>
        <p className="mt-12 rounded-2xl border border-white/10 bg-vault-surface/50 p-4 text-xs text-text-muted">
          {DISCLAIMER_DE}
        </p>
      </article>
    </PageLayout>
  );
}
