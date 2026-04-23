"use client";

import { motion } from "framer-motion";
import { User, Phone, Car as CarIcon, Calendar } from "lucide-react";
import StatusBadge from "./StatusBadge";
import ActionButtons from "./ActionButtons";
import type { ReservationWithCar } from "@/lib/reservationsDb";

interface ReservationCardProps {
  reservation: ReservationWithCar;
  index: number;
  onContact: (id: string) => void;
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

export default function ReservationCard({
  reservation,
  index,
  onContact,
  onConfirm,
  onCancel,
}: ReservationCardProps) {
  const { id, name, phone, cars, start_date, end_date, status } = reservation;
  const carName = cars?.name ?? "—";
  const shortId = id.slice(0, 4).toUpperCase();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="bg-navy-900 border border-white/5 rounded-2xl p-5 hover:border-accent/20 transition-colors"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
            <User size={16} className="text-accent" />
          </div>
          <div className="min-w-0">
            <p className="font-medium text-cream truncate">{name}</p>
            <p className="text-[11px] text-cream/40">#{shortId}</p>
          </div>
        </div>
        <StatusBadge status={status} size="sm" />
      </div>

      {/* Details */}
      <div className="space-y-2.5 mb-5 text-sm">
        <div className="flex items-center gap-2.5 text-cream/70">
          <Phone size={13} className="text-accent shrink-0" />
          <a
            href={`tel:${phone}`}
            className="hover:text-accent transition-colors font-mono"
          >
            +216 {phone}
          </a>
        </div>
        <div className="flex items-center gap-2.5 text-cream/70">
          <CarIcon size={13} className="text-accent shrink-0" />
          <span>{carName}</span>
        </div>
        <div className="flex items-center gap-2.5 text-cream/70">
          <Calendar size={13} className="text-accent shrink-0" />
          <span className="font-mono">{formatDateRange(start_date, end_date)}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="pt-4 border-t border-white/5">
        <ActionButtons
          phone={phone}
          status={status}
          onContact={() => onContact(id)}
          onConfirm={() => onConfirm(id)}
          onCancel={() => onCancel(id)}
          compact
        />
      </div>
    </motion.div>
  );
}
