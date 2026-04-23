"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import CarCard from "@/components/ui/CarCard";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, Calendar, MapPin, Loader2 } from "lucide-react";
import { useCars } from "@/lib/useCars";
import { categories } from "@/lib/data";

function formatPrettyDate(iso: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
    });
  } catch {
    return iso;
  }
}

function CarsPageInner() {
  const searchParams = useSearchParams();
  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");
  const location = searchParams.get("location");
  const qs = searchParams.toString();

  const [activeCategory, setActiveCategory] = useState("Tout");
  const [priceRange, setPriceRange] = useState(200);
  const [showFilters, setShowFilters] = useState(false);

  const { cars, loading, error } = useCars();

  const filtered = useMemo(() => {
    return cars.filter((car) => {
      if (!car.available) return false;
      const matchCategory =
        activeCategory === "Tout" || car.category === activeCategory;
      const matchPrice = car.price <= priceRange;
      return matchCategory && matchPrice;
    });
  }, [cars, activeCategory, priceRange]);

  const hasSearchCriteria = Boolean(startDate || endDate || location);

  return (
    <div className="pt-28 pb-20">
      <div className="max-w-7xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-accent" />
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium">
              Notre flotte
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-cream tracking-tight">
            Nos véhicules
          </h1>
          <p className="text-cream/50 mt-4 max-w-xl">
            Des voitures récentes, bien entretenues et prêtes à prendre la route
            partout en Tunisie.
          </p>
        </motion.div>

        {/* Active search criteria banner */}
        {hasSearchCriteria && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-navy-900 border border-accent/20 rounded-2xl p-4 flex flex-wrap items-center gap-4"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-accent font-semibold">
              Recherche
            </span>
            {location && (
              <span className="inline-flex items-center gap-2 text-sm text-cream/80">
                <MapPin size={14} className="text-accent" />
                {location}
              </span>
            )}
            {startDate && (
              <span className="inline-flex items-center gap-2 text-sm text-cream/80">
                <Calendar size={14} className="text-accent" />
                {formatPrettyDate(startDate)}
                {endDate && ` → ${formatPrettyDate(endDate)}`}
              </span>
            )}
          </motion.div>
        )}

        <div className="flex gap-8">
          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-accent text-white p-4 rounded-full shadow-glow"
            aria-label="Toggle filters"
          >
            {showFilters ? <X size={20} /> : <SlidersHorizontal size={20} />}
          </button>

          {/* Sidebar Filters */}
          <aside
            className={`${
              showFilters
                ? "fixed inset-0 z-30 bg-navy-950 p-6 pt-28"
                : "hidden"
            } lg:block lg:relative lg:bg-transparent lg:p-0 lg:z-auto w-full lg:w-64 shrink-0`}
          >
            <div className="lg:sticky lg:top-28 space-y-8">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/90 mb-4">
                  Catégorie
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        setActiveCategory(cat);
                        setShowFilters(false);
                      }}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                        activeCategory === cat
                          ? "bg-accent text-white"
                          : "bg-white/5 text-cream/60 hover:bg-white/10 hover:text-cream"
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/90 mb-4">
                  Prix max :{" "}
                  <span className="text-accent">{priceRange} TND</span> / jour
                </h3>
                <input
                  type="range"
                  min={100}
                  max={200}
                  step={5}
                  value={priceRange}
                  onChange={(e) => setPriceRange(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <div className="flex justify-between text-xs text-cream/40 mt-1">
                  <span>100 TND</span>
                  <span>200 TND</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <p className="text-sm text-cream/50">
                  <span className="text-cream font-medium">
                    {filtered.length}
                  </span>{" "}
                  véhicule{filtered.length > 1 ? "s" : ""} disponible
                  {filtered.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>
          </aside>

          {/* Car Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-20 text-cream/50">
                <Loader2 size={20} className="animate-spin mr-3 text-accent" />
                Chargement des véhicules…
              </div>
            ) : error ? (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl p-6 text-sm">
                Impossible de charger les véhicules : {error}
              </div>
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeCategory + priceRange}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8"
                >
                  {filtered.length > 0 ? (
                    filtered.map((car, index) => (
                      <CarCard
                        key={car.id}
                        car={car}
                        index={index}
                        queryString={qs}
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-20">
                      <p className="text-cream/50 text-lg">
                        Aucun véhicule ne correspond à vos critères.
                      </p>
                      <button
                        onClick={() => {
                          setActiveCategory("Tout");
                          setPriceRange(200);
                        }}
                        className="mt-4 text-accent text-sm font-medium hover:underline"
                      >
                        Réinitialiser les filtres
                      </button>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CarsPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-40 flex justify-center text-cream/40">
          <Loader2 size={20} className="animate-spin" />
        </div>
      }
    >
      <CarsPageInner />
    </Suspense>
  );
}
