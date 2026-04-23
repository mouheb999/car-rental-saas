"use client";

import { brands } from "@/lib/data";
import AnimatedSection from "@/components/ui/AnimatedSection";
import { motion } from "framer-motion";

export default function Brands() {
  return (
    <section className="section-padding py-20 bg-navy-900 relative">
      <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-b from-navy-950 to-transparent pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-navy-950 pointer-events-none" />
      <div className="max-w-7xl mx-auto">
        <AnimatedSection>
          <div className="text-center mb-12">
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium mb-3">
              Marques de confiance
            </p>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-cream tracking-tight">
              Fiabilité et qualité
            </h2>
          </div>
        </AnimatedSection>

        <div className="flex gap-5 overflow-x-auto pb-2 scrollbar-hide snap-x">
          {brands.map((brand, index) => (
            <motion.div
              key={brand.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -4 }}
              className="flex-shrink-0 snap-center group cursor-pointer"
            >
              <div className="w-36 h-24 rounded-2xl border border-white/5 bg-navy-850 flex items-center justify-center transition-all duration-300 group-hover:border-accent/30 group-hover:bg-navy-800">
                <span className="text-base font-display font-bold text-cream/30 group-hover:text-cream transition-all duration-500 tracking-wider">
                  {brand.logo}
                </span>
              </div>
              <p className="text-xs text-cream/40 text-center mt-3 group-hover:text-cream/80 transition-colors">
                {brand.name}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
