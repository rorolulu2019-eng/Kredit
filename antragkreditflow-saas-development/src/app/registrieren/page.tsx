import { Suspense } from "react";
import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { RegisterForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = {
  title: "Registrieren",
  description: "Erstellen Sie Ihr kostenloses Konto bei antragkreditflow.",
};

export default function RegistrierenPage() {
  return (
    <PageLayout showSupport={false}>
      <Suspense fallback={<div className="py-24 text-center text-text-muted">Wird geladen …</div>}>
        <RegisterForm />
      </Suspense>
    </PageLayout>
  );
}
