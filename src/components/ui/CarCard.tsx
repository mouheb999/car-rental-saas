"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import type { CarRow } from "@/lib/database.types";
import { Users, Fuel, Settings, ArrowRight } from "lucide-react";

interface CarCardProps {
  car: CarRow;
  index?: number;
  /** Extra query string to forward when navigating to the detail page (hero dates/location). */
  queryString?: string;
}

export default function CarCard({ car, index = 0, queryString }: CarCardProps) {
  const href = queryString
    ? `/cars/${car.id}?${queryString}`
    : `/cars/${car.id}`;

  const isDataUrl = (car.image ?? "").startsWith("data:");

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Link href={href} className="block group">
        <div className="relative bg-gradient-to-b from-navy-900 to-navy-800 rounded-2xl overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-accent/30 group-hover:shadow-lifted group-hover:-translate-y-1.5">
          {/* Image */}
          <div className="relative h-56 overflow-hidden bg-gradient-to-br from-navy-850 via-navy-800 to-navy-850">
            <div className="absolute inset-x-8 bottom-0 h-32 bg-accent/10 rounded-full blur-3xl" />
            {car.image ? (
              <Image
                src={car.image}
                alt={car.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                unoptimized={isDataUrl}
                className="object-contain p-4 transition-transform duration-700 group-hover:scale-110"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-cream/20 text-xs">
                Aucune image
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-navy-900/60 via-transparent to-transparent" />

            {car.category && (
              <div className="absolute top-4 left-4 bg-navy-950/70 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 text-[11px] font-medium text-cream/90 uppercase tracking-wider">
                {car.category}
              </div>
            )}

            <div className="absolute top-4 right-4 bg-accent/90 backdrop-blur-md rounded-full px-3 py-1 text-[11px] font-semibold text-white">
              Disponible
            </div>
          </div>

          {/* Title strip */}
          <div className="px-6 pt-5 pb-2">
            {car.brand && (
              <p className="text-[10px] text-cream/50 uppercase tracking-[0.2em] mb-1">
                {car.brand}
              </p>
            )}
            <h3 className="text-xl font-display font-bold text-cream leading-tight">
              {car.name}
            </h3>
          </div>

          {/* Body */}
          <div className="px-6 pb-6">
            <div className="grid grid-cols-3 gap-2 mb-6">
              <div className="flex flex-col items-center gap-1.5 bg-white/[0.03] rounded-xl py-3 border border-white/5">
                <Users size={15} className="text-accent" />
                <span className="text-[11px] text-cream/60">
                  {car.seats ?? 5} places
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 bg-white/[0.03] rounded-xl py-3 border border-white/5">
                <Fuel size={15} className="text-accent" />
                <span className="text-[11px] text-cream/60">
                  {car.fuel ?? "—"}
                </span>
              </div>
              <div className="flex flex-col items-center gap-1.5 bg-white/[0.03] rounded-xl py-3 border border-white/5">
                <Settings size={15} className="text-accent" />
                <span className="text-[11px] text-cream/60">
                  {car.transmission === "Automatique" ? "Auto" : "Manuelle"}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-white/5">
              <div>
                <p className="text-[10px] text-cream/40 uppercase tracking-[0.2em]">
                  À partir de
                </p>
                <p className="text-2xl font-bold text-cream leading-tight">
                  {car.price}
                  <span className="text-sm text-accent font-semibold ml-1">
                    TND
                  </span>
                  <span className="text-xs text-cream/40 font-normal">
                    {" "}
                    / jour
                  </span>
                </p>
              </div>
              <span className="flex items-center gap-1.5 text-xs font-medium text-accent group-hover:gap-2.5 transition-all">
                Réserver
                <ArrowRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
