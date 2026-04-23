"use client";

import AnimatedSection from "@/components/ui/AnimatedSection";
import { motion } from "framer-motion";
import { Car, CalendarDays, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: Car,
    title: "Choisissez votre voiture",
    description:
      "Parcourez notre flotte et sélectionnez le véhicule adapté à vos besoins.",
    step: "01",
  },
  {
    icon: CalendarDays,
    title: "Sélectionnez vos dates",
    description:
      "Choisissez vos dates et votre lieu de prise en charge en toute flexibilité.",
    step: "02",
  },
  {
    icon: CheckCircle2,
    title: "Confirmez et roulez",
    description:
      "Finalisez votre réservation en quelques secondes et profitez de la route.",
    step: "03",
  },
];

export default function HowItWorks() {
  return (
    <section className="section-padding section-gap bg-navy-950 relative overflow-hidden">
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] bg-accent/[0.05] rounded-full blur-[120px] pointer-events-none -translate-y-1/2" />
      <div className="max-w-7xl mx-auto relative">
        <AnimatedSection>
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-3 mb-4">
              <span className="h-px w-8 bg-accent" />
              <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium">
                Comment ça marche
              </p>
              <span className="h-px w-8 bg-accent" />
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-cream tracking-tight">
              Réservez en trois étapes
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {/* Connecting line */}
          <div className="hidden md:block absolute top-10 left-[16.66%] right-[16.66%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {steps.map((step, index) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, duration: 0.6 }}
              className="relative text-center group"
            >
              <div className="relative inline-flex mb-8">
                <div className="w-20 h-20 rounded-2xl bg-navy-900 border border-white/5 flex items-center justify-center group-hover:bg-accent/10 group-hover:border-accent/40 group-hover:shadow-glow-sm transition-all duration-500">
                  <step.icon size={26} className="text-accent" />
                </div>
                <span className="absolute -top-2 -right-4 text-4xl font-display font-bold text-cream/[0.08]">
                  {step.step}
                </span>
              </div>
              <h3 className="text-xl font-display font-semibold text-cream mb-3">
                {step.title}
              </h3>
              <p className="text-cream/50 text-sm leading-relaxed max-w-xs mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
