"use client";

import { useCars } from "@/lib/useCars";
import CarCard from "@/components/ui/CarCard";
import AnimatedSection from "@/components/ui/AnimatedSection";
import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";

export default function FeaturedCars() {
  const { cars, loading, error } = useCars();
  const featured = cars.filter((c) => c.available).slice(0, 6);

  return (
    <section className="section-padding section-gap bg-navy-950 relative">
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-accent/[0.04] rounded-full blur-[120px] pointer-events-none" />
      <div className="max-w-7xl mx-auto relative">
        <AnimatedSection>
          <div className="flex items-end justify-between mb-16">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-8 bg-accent" />
                <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium">
                  Notre flotte
                </p>
              </div>
              <h2 className="text-4xl md:text-5xl font-display font-bold text-cream tracking-tight">
                Des voitures pour
                <br />
                chaque trajet
              </h2>
            </div>
            <Link
              href="/cars"
              className="hidden md:flex items-center gap-2 text-sm font-medium text-cream/60 hover:text-accent transition-colors group"
            >
              Voir tout
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>
          </div>
        </AnimatedSection>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-cream/50">
            <Loader2 size={20} className="animate-spin mr-3 text-accent" />
            Chargement…
          </div>
        ) : error ? (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl p-6 text-sm">
            {error}
          </div>
        ) : featured.length === 0 ? (
          <p className="text-cream/40 text-center py-16">
            Aucun véhicule disponible pour le moment.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featured.map((car, index) => (
              <CarCard key={car.id} car={car} index={index} />
            ))}
          </div>
        )}

        <div className="mt-12 text-center md:hidden">
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 text-sm font-medium text-accent"
          >
            View All Vehicles
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  );
}
