"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/ui/Logo";

const footerLinks = {
  Société: [
    { label: "À propos", href: "#" },
    { label: "Carrières", href: "#" },
    { label: "Presse", href: "#" },
  ],
  Support: [
    { label: "Centre d'aide", href: "#" },
    { label: "Contact", href: "#" },
    { label: "FAQ", href: "#" },
  ],
  Mentions: [
    { label: "Confidentialité", href: "#" },
    { label: "Conditions", href: "#" },
    { label: "Cookies", href: "#" },
  ],
};

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-navy-950 text-cream border-t border-white/5">
      <div className="max-w-7xl mx-auto section-padding py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div>
            <div className="mb-6">
              <Logo
                className="w-[170px] h-[68px] md:w-[200px] md:h-[80px]"
                useStyle={false}
              />
            </div>
            <p className="text-cream/50 text-sm leading-relaxed">
              Roulez malin, allez plus loin. Des véhicules modernes, une
              réservation simple et des prix transparents — partout en
              Tunisie.
            </p>
          </div>

          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-cream/90 mb-5">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-cream/50 hover:text-accent transition-colors duration-300"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-cream/40">
            &copy; {new Date().getFullYear()} ALIA GO. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-sm text-cream/40">
              Roulez malin. Allez plus loin.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
