"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Bell, Car as CarIcon } from "lucide-react";
import Logo from "@/components/ui/Logo";

const navLinks = [
  { href: "/admin/dashboard", label: "Réservations", Icon: LayoutDashboard },
  { href: "/admin/cars", label: "Voitures", Icon: CarIcon },
];

export default function AdminTopBar() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 bg-navy-950/90 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <Link href="/" className="flex items-center group shrink-0">
            <Logo
              className="w-[120px] h-[48px] md:w-[140px] md:h-[56px]"
              useStyle={false}
            />
          </Link>
          <span className="hidden md:inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 border border-accent/30 text-accent text-[11px] font-semibold uppercase tracking-[0.2em]">
            <LayoutDashboard size={12} />
            Admin
          </span>

          <nav className="hidden sm:flex items-center gap-1">
            {navLinks.map((link) => {
              const active = pathname?.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                    active
                      ? "bg-white/10 text-cream border border-white/10"
                      : "text-cream/60 hover:text-cream hover:bg-white/5 border border-transparent"
                  }`}
                >
                  <link.Icon size={13} />
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <button
            className="hidden sm:flex w-9 h-9 items-center justify-center rounded-full bg-white/5 border border-white/10 text-cream/70 hover:text-accent hover:border-accent/40 transition-colors"
            aria-label="Notifications"
          >
            <Bell size={15} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-accent to-accent-light flex items-center justify-center text-white text-xs font-bold">
              AG
            </div>
            <div className="hidden md:block leading-tight">
              <p className="text-xs font-medium text-cream">Admin</p>
              <p className="text-[10px] text-cream/40">ALIA GO</p>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile nav (below bar) */}
      <nav className="sm:hidden flex items-center gap-1 px-6 pb-3 overflow-x-auto scrollbar-hide">
        {navLinks.map((link) => {
          const active = pathname?.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                active
                  ? "bg-white/10 text-cream border border-white/10"
                  : "text-cream/60 hover:text-cream bg-white/5 border border-transparent"
              }`}
            >
              <link.Icon size={13} />
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
