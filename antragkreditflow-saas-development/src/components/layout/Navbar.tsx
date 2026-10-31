"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X, ChevronDown, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { useAuth } from "@/components/auth-provider";
import { WhatsAppInline } from "@/components/layout/WhatsAppFAB";
import { cn } from "@/components/ui";

const NAV = [
  { href: "/#rechner", label: "Kreditrechner" },
  { href: "/#kreditarten", label: "Kreditarten" },
  { href: "/kundenstimmen", label: "Kundenstimmen" },
  { href: "/ueber-uns", label: "Über uns" },
];

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-credit-500/40 bg-credit-500/10 text-sm text-credit-400">
        a
      </span>
      {!compact && (
        <span>
          antrag<span className="text-credit-400">kredit</span>flow
        </span>
      )}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setMenu(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-40 transition-all duration-300",
        scrolled ? "border-b border-white/[0.06] bg-vault-black/80 backdrop-blur-xl" : "bg-transparent",
      )}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6 lg:px-8">
        <Logo />
        <nav className="hidden items-center gap-8 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-text-secondary transition hover:text-text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden items-center gap-3 lg:flex">
          <WhatsAppInline
            label=""
            className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366]/15 text-[#25D366] transition hover:bg-[#25D366]/25"
          />
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenu((v) => !v)}
                className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 py-2 text-sm"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-credit-500/20 text-xs font-bold text-credit-400">
                  {(user.firstName[0] ?? user.email[0] ?? "A").toUpperCase()}
                </span>
                {user.firstName || "Konto"}
                <ChevronDown className="h-4 w-4 text-text-muted" />
              </button>
              {menu && (
                <div className="absolute right-0 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-vault-elevated shadow-2xl">
                  <Link href="/dashboard" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-white/5">
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link href="/dashboard/einstellungen" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-white/5">
                    <Settings className="h-4 w-4" /> Einstellungen
                  </Link>
                  <button
                    type="button"
                    onClick={() => void logout()}
                    className="flex w-full items-center gap-2 px-4 py-3 text-left text-sm text-rejected hover:bg-white/5"
                  >
                    <LogOut className="h-4 w-4" /> Abmelden
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/anmelden" className="btn-ghost py-2.5 text-sm">
              Anmelden
            </Link>
          )}
          <Link href="/antrag" className="btn-primary py-2.5 text-sm">
            Kreditvergleich starten →
          </Link>
        </div>
        <button
          type="button"
          className="rounded-lg border border-white/10 p-2 lg:hidden"
          aria-label={open ? "Menü schließen" : "Menü öffnen"}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <div className="border-t border-white/10 bg-vault-deep lg:hidden">
          <div className="flex flex-col gap-1 px-4 py-4">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-lg px-3 py-3 text-text-secondary hover:bg-white/5">
                {item.label}
              </Link>
            ))}
            {user ? (
              <Link href="/dashboard" className="rounded-lg px-3 py-3 hover:bg-white/5">
                Dashboard
              </Link>
            ) : (
              <Link href="/anmelden" className="rounded-lg px-3 py-3 hover:bg-white/5">
                Anmelden
              </Link>
            )}
            <Link href="/antrag" className="btn-primary mt-2 text-center">
              Kreditvergleich starten →
            </Link>
            <WhatsAppInline
              label="WhatsApp schreiben"
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 font-semibold text-white"
            />
          </div>
        </div>
      )}
    </header>
  );
}
