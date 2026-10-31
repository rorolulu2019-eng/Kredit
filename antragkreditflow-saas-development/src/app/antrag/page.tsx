import { Suspense } from "react";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { Wizard } from "@/components/wizard/Wizard";

export const metadata: Metadata = {
  title: "Kreditanfrage stellen",
  description: "Stellen Sie in sieben Schritten Ihre unverbindliche Kreditanfrage bei antragkreditflow.",
};

export default function AntragPage() {
  return (
    <PageLayout showSupport={false}>
      <Suspense fallback={<div className="py-24 text-center text-text-muted">Wird geladen …</div>}>
        <Wizard />
      </Suspense>
    </PageLayout>
  );
}
