import { Clock, CheckCircle2, XCircle } from "lucide-react";

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

interface StatusBadgeProps {
  status: ReservationStatus;
  size?: "sm" | "md";
}

const STATUS_MAP = {
  pending: {
    label: "En attente",
    cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/30",
    Icon: Clock,
  },
  confirmed: {
    label: "Confirmée",
    cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    Icon: CheckCircle2,
  },
  cancelled: {
    label: "Annulée",
    cls: "bg-red-500/10 text-red-400 border-red-500/30",
    Icon: XCircle,
  },
};

export default function StatusBadge({
  status,
  size = "md",
}: StatusBadgeProps) {
  const { label, cls, Icon } = STATUS_MAP[status];
  const pad = size === "sm" ? "px-2.5 py-1 text-[11px]" : "px-3 py-1.5 text-xs";
  const iconSize = size === "sm" ? 11 : 12;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${pad} ${cls}`}
    >
      <Icon size={iconSize} />
      {label}
    </span>
  );
}
