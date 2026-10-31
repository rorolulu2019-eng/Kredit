import type { Metadata } from "next";
import { PageLayout } from "@/components/layout/PageLayout";
import { ForgotForm } from "@/components/auth/AuthForms";

export const metadata: Metadata = {
  title: "Passwort vergessen",
};

export default function PasswortPage() {
  return (
    <PageLayout showSupport={false}>
      <ForgotForm />
    </PageLayout>
  );
}
