"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section className="section-padding py-32 bg-navy-950 relative overflow-hidden">
      {/* Top fade — blends smoothly from the previous section */}
      <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-navy-900 via-navy-950/80 to-transparent pointer-events-none z-[1]" />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-accent/15 via-accent/[0.03] to-transparent" />
      <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-[140px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 max-w-3xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-3 mb-6">
          <span className="h-px w-8 bg-accent" />
          <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium">
            C&apos;est parti
          </p>
          <span className="h-px w-8 bg-accent" />
        </div>
        <h2 className="text-4xl md:text-6xl font-display font-bold text-cream tracking-tight mb-6">
          Votre prochain trajet
          <br />
          <span className="text-accent">commence ici.</span>
        </h2>
        <p className="text-cream/60 text-lg mb-10 max-w-xl mx-auto">
          Choisissez votre voiture, sélectionnez vos dates et prenez la
          route en quelques minutes.
        </p>
        <Link href="/booking">
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-flex items-center gap-3 bg-accent hover:bg-accent-light text-white px-10 py-4 rounded-full font-medium text-base transition-all duration-300 hover:shadow-glow"
          >
            Réserver une voiture
            <ArrowRight size={18} />
          </motion.button>
        </Link>
      </motion.div>
    </section>
  );
}
