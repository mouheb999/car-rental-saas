"use client";

import { motion } from "framer-motion";
import { User } from "lucide-react";
import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";
import type { ReservationWithCar } from "@/lib/reservationsDb";

interface ReservationRowProps {
  reservation: ReservationWithCar;
  index: number;
  onConfirm: (id: string) => void;
  onCancel: (id: string) => void;
}

function formatDateRange(start: string, end: string) {
  const opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "2-digit" };
  try {
    const s = new Date(start + "T00:00:00").toLocaleDateString("fr-FR", opts);
    const e = new Date(end + "T00:00:00").toLocaleDateString("fr-FR", opts);
    return `${s} → ${e}`;
  } catch {
    return `${start} → ${end}`;
  }
}

export default function ReservationRow({
  reservation,
  index,
  onConfirm,
  onCancel,
}: ReservationRowProps) {
  const { id, name, phone, cars, start_date, end_date, status } = reservation;
  const carName = cars?.name ?? "—";
  const shortId = id.slice(0, 4).toUpperCase();

  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="border-b border-white/5 last:border-b-0 hover:bg-white/[0.02] transition-colors"
    >
      <td className="px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
            <User size={15} className="text-accent" />
          </div>
          <div>
            <p className="font-medium text-cream">{name}</p>
            <p className="text-xs text-cream/40">#{shortId}</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-5">
        <a
          href={`tel:${phone}`}
          className="text-sm text-cream/70 hover:text-accent transition-colors font-mono"
        >
          +216 {phone}
        </a>
      </td>
      <td className="px-6 py-5">
        <p className="text-sm text-cream">{carName}</p>
      </td>
      <td className="px-6 py-5">
        <p className="text-sm text-cream/70 font-mono">
          {formatDateRange(start_date, end_date)}
        </p>
      </td>
      <td className="px-6 py-5">
        <StatusBadge status={status} />
      </td>
      <td className="px-6 py-5">
        <ActionButtons
          phone={phone}
          status={status}
          onConfirm={() => onConfirm(id)}
          onCancel={() => onCancel(id)}
        />
      </td>
    </motion.tr>
  );
}
