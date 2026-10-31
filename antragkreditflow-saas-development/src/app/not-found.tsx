import Link from "next/link";
import { PageLayout } from "@/components/layout/PageLayout";

export default function NotFound() {
  return (
    <PageLayout>
      <div className="mx-auto max-w-xl px-4 py-24 text-center">
        <p className="font-mono text-credit-400">404</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold">Seite nicht gefunden</h1>
        <p className="mt-3 text-text-secondary">
          Die angeforderte Seite existiert nicht oder wurde verschoben.
        </p>
        <Link href="/" className="btn-primary mt-8 inline-flex">
          Zur Startseite
        </Link>
      </div>
    </PageLayout>
  );
}
