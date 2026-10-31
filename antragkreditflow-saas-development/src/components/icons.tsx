import {
  Briefcase,
  Car,
  GraduationCap,
  HeartPulse,
  Home,
  Paintbrush,
  Plane,
  RefreshCw,
  TrendingUp,
  Wallet,
  type LucideIcon,
} from "lucide-react";

export const LOAN_ICONS: Record<string, LucideIcon> = {
  wallet: Wallet,
  home: Home,
  car: Car,
  paintbrush: Paintbrush,
  briefcase: Briefcase,
  "trending-up": TrendingUp,
  "graduation-cap": GraduationCap,
  plane: Plane,
  "heart-pulse": HeartPulse,
  "refresh-cw": RefreshCw,
};

export function LoanIcon({ name, className }: { name: string; className?: string }) {
  const Icon = LOAN_ICONS[name] ?? Wallet;
  return <Icon className={className} strokeWidth={1.5} />;
}
