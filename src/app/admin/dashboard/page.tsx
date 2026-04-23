"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ClipboardList,
  Clock,
  PhoneCall,
  CheckCircle2,
  XCircle,
  Search,
  Loader2,
  RefreshCw,
  Wifi,
  DollarSign,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import ReservationRow from "@/components/admin/ReservationRow";
import ReservationCard from "@/components/admin/ReservationCard";
import Toast, { ToastTone } from "@/components/admin/Toast";
import { useAdminReservations } from "@/lib/useAdminReservations";
import type { ReservationStatus } from "@/lib/database.types";

type FilterKey = "all" | ReservationStatus;

function daysBetween(start: string, end: string): number {
  const a = new Date(start + "T00:00:00").getTime();
  const b = new Date(end + "T00:00:00").getTime();
  return Math.max(Math.round((b - a) / 86_400_000), 0);
}

export default function AdminDashboardPage() {
  const {
    reservations,
    loading,
    error,
    refetch,
    contact,
    confirm,
    cancel,
  } = useAdminReservations();

  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [toast, setToast] = useState<{
    message: string | null;
    tone: ToastTone;
  }>({ message: null, tone: "success" });

  const showToast = (message: string, tone: ToastTone) => {
    setToast({ message, tone });
    setTimeout(() => setToast({ message: null, tone }), 2600);
  };

  const handleContact = async (id: string) => {
    try {
      await contact(id);
      showToast("Client contacté", "success");
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Erreur lors du contact",
        "error"
      );
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      await confirm(id);
      showToast("Réservation confirmée", "success");
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Erreur lors de la confirmation",
        "error"
      );
    }
  };

  const handleCancel = async (id: string) => {
    try {
      await cancel(id);
      showToast("Réservation refusée", "error");
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Erreur lors du refus",
        "error"
      );
    }
  };

  const stats = useMemo(() => {
    const total = reservations.length;
    const pending = reservations.filter((r) => r.status === "pending").length;
    const contacted = reservations.filter((r) => r.status === "contacted").length;
    const confirmed = reservations.filter(
      (r) => r.status === "confirmed"
    ).length;
    const cancelled = reservations.filter(
      (r) => r.status === "cancelled"
    ).length;
    return { total, pending, contacted, confirmed, cancelled };
  }, [reservations]);

  // Revenue calculation — only confirmed reservations
  const revenue = useMemo(() => {
    const confirmedRes = reservations.filter((r) => r.status === "confirmed");
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();

    let totalRevenue = 0;
    let monthlyRevenue = 0;

    for (const r of confirmedRes) {
      const days = daysBetween(r.start_date, r.end_date);
      const pricePerDay = r.cars?.price ?? 0;
      const amount = pricePerDay * days;
      totalRevenue += amount;

      const createdAt = new Date(r.created_at);
      if (createdAt.getMonth() === thisMonth && createdAt.getFullYear() === thisYear) {
        monthlyRevenue += amount;
      }
    }

    return { totalRevenue, monthlyRevenue, confirmedCount: confirmedRes.length };
  }, [reservations]);

  const filtered = useMemo(() => {
    return reservations.filter((r) => {
      const matchFilter = filter === "all" || r.status === filter;
      const q = query.trim().toLowerCase();
      const carName = r.cars?.name?.toLowerCase() ?? "";
      const matchQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        carName.includes(q) ||
        r.phone.includes(q);
      return matchFilter && matchQuery;
    });
  }, [reservations, filter, query]);

  const filters: { key: FilterKey; label: string; count: number }[] = [
    { key: "all", label: "Toutes", count: stats.total },
    { key: "pending", label: "En attente", count: stats.pending },
    { key: "contacted", label: "Contactés", count: stats.contacted },
    { key: "confirmed", label: "Confirmées", count: stats.confirmed },
    { key: "cancelled", label: "Refusées", count: stats.cancelled },
  ];

  const statCards = [
    {
      label: "Total",
      value: stats.total,
      Icon: ClipboardList,
      tint: "text-cream bg-white/5 border-white/10",
    },
    {
      label: "En attente",
      value: stats.pending,
      Icon: Clock,
      tint: "text-yellow-400 bg-yellow-500/10 border-yellow-500/30",
    },
    {
      label: "Contactés",
      value: stats.contacted,
      Icon: PhoneCall,
      tint: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    },
    {
      label: "Confirmées",
      value: stats.confirmed,
      Icon: CheckCircle2,
      tint: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      label: "Refusées",
      value: stats.cancelled,
      Icon: XCircle,
      tint: "text-red-400 bg-red-500/10 border-red-500/30",
    },
  ];

  const revenueCards = [
    {
      label: "Total revenus",
      value: `${revenue.totalRevenue.toLocaleString("fr-FR")} TND`,
      Icon: DollarSign,
      tint: "text-accent bg-accent/10 border-accent/30",
    },
    {
      label: "Revenus ce mois",
      value: `${revenue.monthlyRevenue.toLocaleString("fr-FR")} TND`,
      Icon: TrendingUp,
      tint: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
    },
    {
      label: "Réservations confirmées",
      value: revenue.confirmedCount,
      Icon: CalendarCheck,
      tint: "text-blue-400 bg-blue-500/10 border-blue-500/30",
    },
  ];

  return (
    <div className="min-h-screen bg-navy-950 text-cream">
      <AdminTopBar />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-12">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
              Tableau de bord
            </h1>
            <p className="text-cream/50 mt-2">
              Gérez vos réservations facilement
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
              <Wifi size={12} />
              Sync auto 5 s
            </span>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cream/70 hover:text-cream text-xs font-medium transition-colors"
            >
              <RefreshCw size={13} />
              Actualiser
            </button>
          </div>
        </motion.div>

        {/* Error banner */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl px-5 py-4 text-sm">
            Impossible de charger les réservations : {error}
          </div>
        )}

        {/* Revenue section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-sm uppercase tracking-[0.2em] text-cream/40 font-semibold mb-4">
            Revenus
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {revenueCards.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 * i + 0.15, duration: 0.4 }}
                className="bg-navy-900 border border-white/5 rounded-2xl p-5 hover:border-accent/20 transition-colors"
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs uppercase tracking-[0.2em] text-cream/40 font-medium">
                    {s.label}
                  </p>
                  <div
                    className={`w-9 h-9 rounded-xl border flex items-center justify-center ${s.tint}`}
                  >
                    <s.Icon size={16} />
                  </div>
                </div>
                <p className="text-2xl md:text-3xl font-display font-bold text-cream">
                  {s.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stat cards */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-10">
          {statCards.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i, duration: 0.4 }}
              className="bg-navy-900 border border-white/5 rounded-2xl p-5 hover:border-accent/20 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs uppercase tracking-[0.2em] text-cream/40 font-medium">
                  {s.label}
                </p>
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center ${s.tint}`}
                >
                  <s.Icon size={16} />
                </div>
              </div>
              <p className="text-3xl font-display font-bold text-cream">
                {s.value}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Filters + search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide -mx-6 md:mx-0 px-6 md:px-0">
            {filters.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium border transition-colors ${
                    active
                      ? "bg-accent text-white border-accent shadow-glow-sm"
                      : "bg-white/5 text-cream/70 border-white/10 hover:border-accent/40 hover:text-cream"
                  }`}
                >
                  {f.label}
                  <span
                    className={`inline-flex items-center justify-center min-w-[18px] h-[18px] rounded-full text-[10px] font-bold ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-white/10 text-cream/80"
                    }`}
                  >
                    {f.count}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2.5 bg-navy-900 border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-accent/40 transition-colors md:w-72">
            <Search size={14} className="text-cream/40 shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher…"
              className="bg-transparent text-sm text-cream placeholder:text-cream/30 outline-none w-full"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-cream/50">
            <Loader2 size={20} className="animate-spin mr-3 text-accent" />
            Chargement des réservations…
          </div>
        )}

        {/* Desktop table */}
        {!loading && (
          <div className="hidden lg:block bg-navy-900 border border-white/5 rounded-2xl overflow-hidden shadow-lifted">
            <table className="w-full">
              <thead>
                <tr className="bg-white/[0.02] border-b border-white/5">
                  {[
                    "Nom",
                    "Téléphone",
                    "Voiture",
                    "Dates",
                    "Statut",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-6 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-cream/50"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length > 0 ? (
                  filtered.map((r, i) => (
                    <ReservationRow
                      key={r.id}
                      reservation={r}
                      index={i}
                      onContact={handleContact}
                      onConfirm={handleConfirm}
                      onCancel={handleCancel}
                    />
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-16 text-center">
                      <p className="text-cream/40 text-sm">
                        {reservations.length === 0
                          ? "Aucune réservation pour le moment."
                          : "Aucune réservation ne correspond à vos critères."}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Mobile / tablet cards */}
        {!loading && (
          <div className="grid lg:hidden grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.length > 0 ? (
              filtered.map((r, i) => (
                <ReservationCard
                  key={r.id}
                  reservation={r}
                  index={i}
                  onContact={handleContact}
                  onConfirm={handleConfirm}
                  onCancel={handleCancel}
                />
              ))
            ) : (
              <div className="col-span-full bg-navy-900 border border-white/5 rounded-2xl p-10 text-center">
                <p className="text-cream/40 text-sm">
                  {reservations.length === 0
                    ? "Aucune réservation pour le moment."
                    : "Aucune réservation ne correspond à vos critères."}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <Toast message={toast.message} tone={toast.tone} />
    </div>
  );
}
