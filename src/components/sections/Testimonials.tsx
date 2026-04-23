"use client";

import { testimonials } from "@/lib/data";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

export default function Testimonials() {
  return (
    <section className="section-padding section-gap bg-navy-900 relative">
      {/* Smooth fade into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-b from-transparent to-navy-950 pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-3">
              Témoignages
            </p>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-cream tracking-tight">
              Ils nous font confiance
            </h2>
          </div>
        </AnimatedSection>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.12, duration: 0.6 }}
              className="bg-navy-850 rounded-2xl p-8 border border-white/5 hover:border-accent/20 hover:-translate-y-1 transition-all duration-500"
            >
              <div className="flex gap-1 mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className="fill-accent text-accent"
                  />
                ))}
              </div>
              <p className="text-cream/75 text-sm leading-relaxed mb-8">
                &ldquo;{testimonial.text}&rdquo;
              </p>
              <div className="pt-6 border-t border-white/5">
                <p className="font-semibold text-cream text-sm">
                  {testimonial.name}
                </p>
                <p className="text-xs text-cream/40 mt-1">{testimonial.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
