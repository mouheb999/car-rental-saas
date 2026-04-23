"use client";

import { MessageCircle, Phone, CheckCircle2, XCircle, PhoneCall } from "lucide-react";
import { motion } from "framer-motion";
import type { ReservationStatus } from "@/lib/database.types";

interface ActionButtonsProps {
  phone: string;
  status: ReservationStatus;
  onContact: () => void;
  onConfirm: () => void;
  onCancel: () => void;
  compact?: boolean;
}

const WHATSAPP_MESSAGE = encodeURIComponent(
  "Bonjour, nous vous contactons concernant votre demande de réservation chez ALIA GO."
);

export default function ActionButtons({
  phone,
  status,
  onContact,
  onConfirm,
  onCancel,
  compact = false,
}: ActionButtonsProps) {
  const sizeCls = compact
    ? "px-3 py-2 text-[11px]"
    : "px-3.5 py-2 text-xs";

  const isPending = status === "pending";
  const isContacted = status === "contacted";
  const isFinal = status === "confirmed" || status === "cancelled";

  return (
    <div
      className={`flex flex-wrap items-center ${compact ? "gap-1.5" : "gap-2"}`}
    >
      {/* WhatsApp — always visible */}
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

      {/* Call — always visible */}
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

      {/* Contacter le client — only when pending */}
      {isPending && (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onContact}
          className={`inline-flex items-center gap-1.5 rounded-xl font-medium transition-colors ${sizeCls} bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25`}
        >
          <PhoneCall size={13} />
          Contacter le client
        </motion.button>
      )}

      {/* Accepter — only when contacted */}
      {isContacted && (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onConfirm}
          className={`inline-flex items-center gap-1.5 rounded-xl font-medium transition-colors ${sizeCls} bg-accent text-white border border-accent hover:bg-accent-light hover:shadow-glow-sm`}
        >
          <CheckCircle2 size={13} />
          Accepter
        </motion.button>
      )}

      {/* Refuser — when pending or contacted */}
      {!isFinal && (
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={onCancel}
          className={`inline-flex items-center gap-1.5 rounded-xl font-medium transition-colors ${sizeCls} bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25`}
        >
          <XCircle size={13} />
          Refuser
        </motion.button>
      )}
    </div>
  );
}
