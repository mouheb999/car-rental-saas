"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Loader2, ArrowRight, AlertCircle, ShieldCheck } from "lucide-react";
import Logo from "@/components/ui/Logo";

function LoginInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") ?? "/admin/dashboard";

  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "same-origin",
      });

      if (res.ok) {
        // Full reload so middleware sees the new cookie immediately
        window.location.href = next;
        return;
      }

      const body = (await res.json().catch(() => ({}))) as { error?: string };
      setError(body.error ?? "Mot de passe incorrect.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Impossible de se connecter."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-950 text-cream flex items-center justify-center px-6 py-16">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="flex flex-col items-center mb-10">
          <Logo />
          <span className="mt-5 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-[11px] font-semibold uppercase tracking-[0.2em]">
            <ShieldCheck size={12} />
            Admin
          </span>
        </div>

        <div className="bg-navy-900 border border-white/5 rounded-2xl p-8 shadow-lifted">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto mb-4">
              <Lock size={20} className="text-accent" />
            </div>
            <h1 className="text-2xl font-display font-bold text-cream">
              Connexion administrateur
            </h1>
            <p className="text-cream/50 text-sm mt-2">
              Entrez votre mot de passe pour accéder au tableau de bord.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-xs uppercase tracking-wider text-cream/50 font-medium block mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoFocus
                autoComplete="current-password"
                className="w-full bg-white/5 rounded-xl px-4 py-3.5 text-sm text-cream placeholder:text-cream/30 outline-none border border-white/5 focus:border-accent/50 transition-colors"
              />
            </div>

            {error && (
              <div className="flex items-start gap-2.5 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                <AlertCircle size={15} className="shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <motion.button
              type="submit"
              disabled={!password || submitting}
              whileHover={password && !submitting ? { scale: 1.01 } : undefined}
              whileTap={password && !submitting ? { scale: 0.99 } : undefined}
              className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                password && !submitting
                  ? "bg-accent hover:bg-accent-light text-white hover:shadow-glow"
                  : "bg-white/5 text-cream/40 cursor-not-allowed"
              }`}
            >
              {submitting ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Connexion…
                </>
              ) : (
                <>
                  Se connecter
                  <ArrowRight size={14} />
                </>
              )}
            </motion.button>
          </form>

          <p className="text-[11px] text-cream/30 text-center mt-6">
            Session valide 8 heures. Cookie HTTP-only sécurisé.
          </p>
        </div>

        <button
          onClick={() => router.push("/")}
          className="block mx-auto mt-6 text-xs text-cream/40 hover:text-cream/70 transition-colors"
        >
          ← Retour au site
        </button>
      </motion.div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center text-cream/40">
          <Loader2 size={20} className="animate-spin" />
        </div>
      }
    >
      <LoginInner />
    </Suspense>
  );
}
