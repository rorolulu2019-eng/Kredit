import { Badge } from "@/components/ui";
import { STATUS_COLORS, STATUS_LABELS, type ApplicationStatus } from "@/lib/status";

export function StatusBadge({ status }: { status: string }) {
  const key = status as ApplicationStatus;
  return <Badge className={STATUS_COLORS[key] ?? STATUS_COLORS.entwurf}>{STATUS_LABELS[key] ?? status}</Badge>;
}
