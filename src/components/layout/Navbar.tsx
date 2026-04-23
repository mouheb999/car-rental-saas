"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { href: "/", label: "Accueil" },
  { href: "/cars", label: "Nos voitures" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Hide public navbar on admin routes
  if (pathname?.startsWith("/admin")) return null;

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-navy-950/85 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.35)] py-2.5"
          : "bg-transparent py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex md:grid md:grid-cols-[auto_1fr_auto] items-center justify-between md:gap-6">
        <Link href="/" className="flex items-center group shrink-0">
          <Logo
            className="w-[140px] h-[56px] md:w-[180px] md:h-[72px]"
            useStyle={false}
          />
        </Link>

        {/* Centered wordmark */}
        <Link
          href="/"
          className="hidden md:flex justify-center items-center group"
        >
          <span className="font-display font-bold tracking-[0.35em] text-sm lg:text-base text-cream/90 hover:text-accent transition-colors duration-300">
            ALIA&nbsp;GO
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 justify-end">
          {navLinks.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                  active
                    ? "text-accent"
                    : "text-cream/70 hover:text-cream"
                }`}
              >
                {link.label}
                {active && (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-px bg-accent"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
          <Link
            href="/booking"
            className="ml-4 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-full hover:bg-accent-light transition-all duration-300 hover:shadow-glow"
          >
            Réserver
          </Link>
        </nav>

        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="md:hidden text-cream"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-navy-950/95 backdrop-blur-xl"
          >
            <div className="px-6 py-6 flex flex-col gap-2">
              {navLinks.map((link) => {
                const active = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className={`font-medium py-3 px-2 border-b border-white/5 ${
                      active ? "text-accent" : "text-cream/80"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
              <Link
                href="/booking"
                onClick={() => setMobileOpen(false)}
                className="mt-3 px-5 py-3 bg-accent text-white text-center text-sm font-medium rounded-full"
              >
                Réserver
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
