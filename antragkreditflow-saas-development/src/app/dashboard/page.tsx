import type { Metadata } from "next";
import { OverviewView } from "@/components/dashboard/views";

export const metadata: Metadata = {
  title: "Mein Dashboard",
  robots: { index: false, follow: false },
};

export default function DashboardPage() {
  return <OverviewView />;
}
