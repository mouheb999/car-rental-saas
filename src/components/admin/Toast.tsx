"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, XCircle } from "lucide-react";

export type ToastTone = "success" | "error";

interface ToastProps {
  message: string | null;
  tone: ToastTone;
}

export default function Toast({ message, tone }: ToastProps) {
  const Icon = tone === "success" ? CheckCircle2 : XCircle;
  const cls =
    tone === "success"
      ? "bg-emerald-500/15 text-emerald-400 border-emerald-500/30"
      : "bg-red-500/15 text-red-400 border-red-500/30";

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none">
      <AnimatePresence>
        {message && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className={`pointer-events-auto flex items-center gap-3 rounded-2xl border backdrop-blur-xl px-5 py-4 shadow-lifted ${cls}`}
          >
            <Icon size={18} />
            <p className="text-sm font-medium">{message}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
