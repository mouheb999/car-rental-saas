"use client";

import { MessageCircle, Phone, CheckCircle2, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import type { ReservationStatus } from "./StatusBadge";

interface ActionButtonsProps {
  phone: string;
  status: ReservationStatus;
  onConfirm: () => void;
  onCancel: () => void;
  compact?: boolean;
}

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Bonjour, je confirme votre réservation chez ALIA GO."
);

export default function ActionButtons({
  phone,
  status,
  onConfirm,
  onCancel,
  compact = false,
}: ActionButtonsProps) {
  const disabled = status !== "pending";
  const sizeCls = compact
    ? "px-3 py-2 text-[11px]"
    : "px-3.5 py-2 text-xs";

  return (
    <div
      className={`flex flex-wrap items-center ${compact ? "gap-1.5" : "gap-2"}`}
    >
      {/* WhatsApp */}
      <motion.a
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        href={`https://wa.me/216${phone}?text=${WHATSAPP_MESSAGE}`}
        target="_blank"
        rel="noopener noreferrer"
        className={`inline-flex items-center gap-1.5 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 font-medium transition-colors ${sizeCls}`}
        aria-label="WhatsApp"
      >
        <MessageCircle size={13} />
        WhatsApp
      </motion.a>

      {/* Call */}
      <motion.a
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        href={`tel:${phone}`}
        className={`inline-flex items-center gap-1.5 rounded-xl bg-white/5 text-cream/80 border border-white/10 hover:bg-white/10 hover:text-cream font-medium transition-colors ${sizeCls}`}
        aria-label="Appeler"
      >
        <Phone size={13} />
        Appeler
      </motion.a>

      {/* Confirm */}
      <motion.button
        whileHover={disabled ? {} : { scale: 1.04 }}
        whileTap={disabled ? {} : { scale: 0.96 }}
        disabled={disabled}
        onClick={onConfirm}
        className={`inline-flex items-center gap-1.5 rounded-xl font-medium transition-colors ${sizeCls} ${
          disabled
            ? "bg-white/5 text-cream/30 border border-white/5 cursor-not-allowed"
            : "bg-accent text-white border border-accent hover:bg-accent-light hover:shadow-glow-sm"
        }`}
      >
        <CheckCircle2 size={13} />
        Confirmer
      </motion.button>

      {/* Cancel */}
      <motion.button
        whileHover={disabled ? {} : { scale: 1.04 }}
        whileTap={disabled ? {} : { scale: 0.96 }}
        disabled={disabled}
        onClick={onCancel}
        className={`inline-flex items-center gap-1.5 rounded-xl font-medium transition-colors ${sizeCls} ${
          disabled
            ? "bg-white/5 text-cream/30 border border-white/5 cursor-not-allowed"
            : "bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25"
        }`}
      >
        <XCircle size={13} />
        Annuler
      </motion.button>
    </div>
  );
}
