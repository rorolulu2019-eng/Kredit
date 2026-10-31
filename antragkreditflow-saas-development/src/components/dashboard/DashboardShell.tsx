"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Bell, FileText, Folder, Home, LogOut, Settings } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/components/auth-provider";
import { WhatsAppInline } from "@/components/layout/WhatsAppFAB";
import { Logo } from "@/components/layout/Navbar";
import { WhatsAppFAB } from "@/components/layout/WhatsAppFAB";
import { cn } from "@/components/ui";
import type { ReactNode } from "react";
import { useEffect } from "react";

const LINKS = [
  { href: "/dashboard", label: "Übersicht", icon: Home },
  { href: "/dashboard/antraege", label: "Meine Anträge", icon: FileText },
  { href: "/dashboard/dokumente", label: "Dokumente", icon: Folder },
  { href: "/dashboard/benachrichtigungen", label: "Benachrichtigungen", icon: Bell },
  { href: "/dashboard/einstellungen", label: "Einstellungen", icon: Settings },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const { user, loading, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const unread = useQuery({
    queryKey: ["notifications-unread"],
    queryFn: async () => {
      const res = await fetch("/api/notifications", { credentials: "include" });
      if (!res.ok) return 0;
      const data = (await res.json()) as { unread?: number };
      return data.unread ?? 0;
    },
    enabled: Boolean(user),
  });

  useEffect(() => {
    if (!loading && !user) {
      router.replace("/anmelden?next=/dashboard");
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-vault-black text-text-secondary">
        Wird geladen …
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-vault-black">
      <a href="#dash" className="skip-link">
        Zum Inhalt springen
      </a>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/[0.06] bg-vault-deep p-5 md:flex md:flex-col">
        <Logo />
        <nav className="mt-8 flex-1 space-y-1">
          {LINKS.map((l) => {
            const active = pathname === l.href || (l.href !== "/dashboard" && pathname.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition",
                  active ? "bg-credit-500/15 text-credit-400" : "text-text-secondary hover:bg-white/5",
                )}
              >
                <l.icon className="h-4 w-4" />
                {l.label}
                {l.href === "/dashboard/benachrichtigungen" && (unread.data ?? 0) > 0 && (
                  <span className="ml-auto rounded-full bg-credit-500 px-2 py-0.5 text-[10px] text-white">
                    {unread.data}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
        <WhatsAppInline
          label="Hilfe? Schreiben Sie uns"
          className="mb-3 inline-flex items-center gap-2 rounded-xl bg-[#25D366]/15 px-3 py-2.5 text-sm text-[#25D366]"
        />
        <button
          type="button"
          onClick={() => void logout().then(() => router.push("/"))}
          className="inline-flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-text-secondary hover:bg-white/5"
        >
          <LogOut className="h-4 w-4" /> Abmelden
        </button>
      </aside>
      <div className="md:pl-64">
        <header className="sticky top-0 z-20 flex items-center justify-between border-b border-white/[0.06] bg-vault-black/80 px-4 py-4 backdrop-blur-xl md:px-8">
          <p className="font-display font-bold">Willkommen zurück, {user.firstName || "Nutzer"}!</p>
          <Link href="/antrag" className="btn-primary py-2 text-sm">
            Neue Anfrage
          </Link>
        </header>
        <main id="dash" className="px-4 py-8 pb-24 md:px-8">
          {children}
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-white/10 bg-vault-deep/95 md:hidden">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={cn(
              "flex flex-col items-center gap-1 py-3 text-[10px]",
              pathname === l.href ? "text-credit-400" : "text-text-muted",
            )}
          >
            <l.icon className="h-4 w-4" />
            {l.label.split(" ")[0]}
          </Link>
        ))}
      </nav>
      <WhatsAppFAB />
    </div>
  );
}
