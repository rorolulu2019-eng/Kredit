"use client";

import { Star } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Testimonial } from "@/data/testimonials";

export function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${rating} von 5 Sternen`}>
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${i < rating ? "fill-gold-400 text-gold-400" : "text-text-muted"}`}
        />
      ))}
    </div>
  );
}

export function TestimonialCard({ t }: { t: Testimonial }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/[0.06] bg-vault-surface/60 p-6 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-credit-500/15 font-display text-sm font-bold text-credit-400">
            {t.avatar}
          </div>
          <div>
            <p className="font-semibold text-text-primary">{t.name}</p>
            <p className="text-xs text-text-muted">
              {t.city}, {t.country}
            </p>
          </div>
        </div>
        <StarRating rating={t.rating} />
      </div>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-text-secondary">{t.text}</p>
      <div className="mt-5 flex items-center justify-between text-xs text-text-muted">
        <span>
          {t.loanType} · {t.amount}
        </span>
        <span>{formatDate(t.date)}</span>
      </div>
    </article>
  );
}
