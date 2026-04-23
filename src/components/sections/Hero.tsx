"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, Calendar, ArrowRight, Search } from "lucide-react";

// Volkswagen Golf 8 — local asset in /public
const HERO_IMG = "/hero.jpg";

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const router = useRouter();
  const today = new Date().toISOString().split("T")[0];

  // Booking bar state
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (location.trim()) params.set("location", location.trim());
    if (startDate) params.set("start", startDate);
    if (endDate) params.set("end", endDate);
    const qs = params.toString();
    router.push(qs ? `/cars?${qs}` : "/cars");
  };
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax on the background image
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  // Fade content as user scrolls
  const contentOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  // Smoothly fade the bottom of the image into the navy background as user scrolls
  const bottomFadeOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1, 1]);
  const bottomFadeHeight = useTransform(
    scrollYProgress,
    [0, 1],
    ["45%", "100%"]
  );

  return (
    <section
      ref={ref}
      className="relative h-[100svh] min-h-[620px] md:min-h-[720px] overflow-hidden bg-navy-950"
    >
      {/* Background image with parallax */}
      <motion.div style={{ y }} className="absolute inset-0">
        <Image
          src={HERO_IMG}
          alt="Volkswagen Golf 8"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Layered gradients for depth + readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/70 via-navy-950/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/90 via-navy-950/40 to-transparent md:via-transparent" />
      </motion.div>

      {/* Bottom fade — grows/strengthens as user scrolls for a smooth dissolve */}
      <motion.div
        style={{
          opacity: bottomFadeOpacity,
          height: bottomFadeHeight,
        }}
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-navy-950 via-navy-950/80 to-transparent pointer-events-none z-[1]"
      />

      {/* Ambient orange glow behind car */}
      <div className="absolute top-1/3 right-[10%] w-[500px] md:w-[650px] h-[500px] md:h-[650px] bg-accent/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 left-1/4 w-[300px] md:w-[400px] h-[200px] md:h-[300px] bg-accent/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Content */}
      <motion.div
        style={{ opacity: contentOpacity }}
        className="relative z-10 h-full flex flex-col justify-center px-6 md:px-12 lg:px-20 xl:px-32 max-w-7xl mx-auto pt-24 md:pt-28"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex items-center gap-3 mb-4 md:mb-6"
        >
          <span className="h-px w-8 md:w-10 bg-accent" />
          <span className="text-accent text-[10px] md:text-xs uppercase tracking-[0.25em] md:tracking-[0.3em] font-medium">
            Location de voitures — Tunisie
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-4xl sm:text-5xl md:text-7xl lg:text-[5.5rem] font-display font-bold text-cream leading-[0.95] tracking-tight mb-4 md:mb-6 max-w-3xl text-balance"
        >
          Votre voiture.
          <br />
          <span className="text-accent">Votre liberté.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.6 }}
          className="text-cream/70 text-base md:text-lg max-w-lg mb-8 md:mb-10"
        >
          Des véhicules modernes et fiables aux prix justes. Réservez en
          quelques minutes, partez en quelques heures.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-wrap items-center gap-3 md:gap-4 mb-10 md:mb-16"
        >
          <Link href="/cars">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-6 md:px-8 py-3.5 md:py-4 rounded-2xl font-medium text-sm transition-all duration-300 hover:shadow-glow"
            >
              Voir les véhicules
              <ArrowRight size={16} />
            </motion.button>
          </Link>
          <Link
            href="/booking"
            className="px-6 md:px-8 py-3.5 md:py-4 border border-white/15 hover:border-accent/50 hover:text-accent text-cream/80 text-sm font-medium rounded-2xl transition-all duration-300"
          >
            Réserver
          </Link>
        </motion.div>

        {/* Floating booking bar — hidden on mobile for a cleaner hero */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="hidden md:block w-full max-w-4xl"
        >
          <div className="glass rounded-2xl p-2.5">
            <div className="flex items-stretch gap-2">
              <div className="flex-1 flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-colors rounded-xl px-4 py-3">
                <MapPin size={16} className="text-accent shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-cream/40 font-medium">
                    Lieu de prise en charge
                  </p>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Tunis, Sousse, Djerba…"
                    className="w-full bg-transparent text-sm text-cream placeholder:text-cream/30 outline-none"
                  />
                </div>
              </div>

              <div className="flex-1 flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-colors rounded-xl px-4 py-3">
                <Calendar size={16} className="text-accent shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-cream/40 font-medium">
                    Date de départ
                  </p>
                  <input
                    type="date"
                    min={today}
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-transparent text-sm text-cream placeholder:text-cream/30 outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              <div className="flex-1 flex items-center gap-3 bg-white/5 hover:bg-white/10 transition-colors rounded-xl px-4 py-3">
                <Calendar size={16} className="text-accent shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase tracking-wider text-cream/40 font-medium">
                    Date de retour
                  </p>
                  <input
                    type="date"
                    min={startDate || today}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-transparent text-sm text-cream placeholder:text-cream/30 outline-none [color-scheme:dark]"
                  />
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSearch}
                className="flex items-center justify-center gap-2 bg-accent hover:bg-accent-light text-white px-7 py-4 rounded-xl font-medium text-sm transition-all duration-300 hover:shadow-glow whitespace-nowrap"
              >
                <Search size={16} />
                Rechercher
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
