import { Suspense } from "react";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { LoginForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = {
  title: "Anmelden",
  description: "Melden Sie sich bei antragkreditflow an.",
};

export default function AnmeldenPage() {
  return (
    <PageLayout showSupport={false}>
      <Suspense fallback={<div className="py-24 text-center text-text-muted">Wird geladen …</div>}>
        <LoginForm />
      </Suspense>
    </PageLayout>
  );
}
