"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle } from "lucide-react";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  tone?: "danger" | "default";
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirmer",
  cancelLabel = "Annuler",
  onConfirm,
  onCancel,
  tone = "danger",
}: ConfirmDialogProps) {
  const confirmCls =
    tone === "danger"
      ? "bg-red-500 hover:bg-red-600 text-white"
      : "bg-accent hover:bg-accent-light text-white";
  const iconCls =
    tone === "danger"
      ? "bg-red-500/15 text-red-400 border-red-500/30"
      : "bg-accent/15 text-accent border-accent/30";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center px-4 bg-navy-950/70 backdrop-blur-sm"
          onClick={onCancel}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 5 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-sm bg-navy-900 border border-white/10 rounded-2xl shadow-lifted p-6"
          >
            <div
              className={`w-12 h-12 rounded-xl border flex items-center justify-center mb-4 ${iconCls}`}
            >
              <AlertTriangle size={20} />
            </div>
            <h3 className="font-display font-semibold text-cream text-lg mb-1">
              {title}
            </h3>
            <p className="text-sm text-cream/60 mb-6">{message}</p>
            <div className="flex items-center gap-3">
              <button
                onClick={onCancel}
                className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-cream/80 text-sm font-medium transition-colors"
              >
                {cancelLabel}
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onConfirm}
                className={`flex-1 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${confirmCls}`}
              >
                {confirmLabel}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
