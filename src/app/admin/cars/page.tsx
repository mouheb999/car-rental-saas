"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Pencil,
  Search,
  X,
  Check,
  CircleDot,
  Plus,
  Trash2,
  Fuel,
  Gauge,
  Users,
  Zap,
  Loader2,
  RefreshCw,
  Wifi,
} from "lucide-react";
import AdminTopBar from "@/components/admin/AdminTopBar";
import Toast, { ToastTone } from "@/components/admin/Toast";
import CarEditModal from "@/components/admin/CarEditModal";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { useCars } from "@/lib/useCars";
import { insertCar, updateCar, deleteCar } from "@/lib/carsDb";
import { fromCarRow, toCarInsert, type AdminCar } from "@/lib/adminTypes";

export default function AdminCarsPage() {
  const { cars: rows, loading, error, refetch } = useCars();
  const cars = useMemo(() => rows.map(fromCarRow), [rows]);

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "edit">("create");
  const [editingCar, setEditingCar] = useState<AdminCar | null>(null);
  const [pendingDelete, setPendingDelete] = useState<AdminCar | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  const [toast, setToast] = useState<{
    message: string | null;
    tone: ToastTone;
  }>({ message: null, tone: "success" });

  const showToast = (message: string, tone: ToastTone) => {
    setToast({ message, tone });
    setTimeout(() => setToast({ message: null, tone }), 2400);
  };

  const openCreate = () => {
    setEditingCar(null);
    setModalMode("create");
    setModalOpen(true);
  };

  const openEdit = (car: AdminCar) => {
    setEditingCar(car);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleSave = async (payload: AdminCar) => {
    try {
      const insertPayload = toCarInsert(payload);
      if (modalMode === "create") {
        await insertCar(insertPayload);
        showToast("Voiture ajoutée", "success");
      } else {
        await updateCar(payload.id, insertPayload);
        showToast("Voiture mise à jour", "success");
      }
      setModalOpen(false);
      // Realtime will update the list automatically; refetch as safety.
      refetch();
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Erreur d'enregistrement",
        "error"
      );
    }
  };

  const toggleAvailability = async (car: AdminCar) => {
    setBusyId(car.id);
    try {
      await updateCar(car.id, { available: !car.available });
      showToast("Disponibilité mise à jour", "success");
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Erreur de mise à jour",
        "error"
      );
    } finally {
      setBusyId(null);
    }
  };

  const confirmDelete = async () => {
    if (!pendingDelete) return;
    try {
      await deleteCar(pendingDelete.id);
      showToast("Voiture supprimée", "error");
    } catch (e) {
      showToast(
        e instanceof Error ? e.message : "Erreur de suppression",
        "error"
      );
    } finally {
      setPendingDelete(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return cars;
    return cars.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.brand.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [cars, query]);

  const availableCount = cars.filter((c) => c.available).length;

  return (
    <div className="min-h-screen bg-navy-950 text-cream">
      <AdminTopBar />

      <main className="max-w-7xl mx-auto px-6 md:px-10 py-10 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-8"
        >
          <div>
            <h1 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
              Gestion des voitures
            </h1>
            <p className="text-cream/50 mt-2">
              Ajoutez, modifiez et gérez toute votre flotte.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <span className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-semibold">
              <Wifi size={12} />
              Temps réel
            </span>
            <div className="bg-navy-900 border border-white/5 rounded-2xl px-4 py-2.5 min-w-[100px]">
              <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40 font-medium">
                Total
              </p>
              <p className="text-xl font-display font-bold text-cream">
                {cars.length}
              </p>
            </div>
            <div className="bg-navy-900 border border-emerald-500/20 rounded-2xl px-4 py-2.5 min-w-[120px]">
              <p className="text-[10px] uppercase tracking-[0.2em] text-emerald-400/70 font-medium">
                Disponibles
              </p>
              <p className="text-xl font-display font-bold text-emerald-400">
                {availableCount}
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={openCreate}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-accent hover:bg-accent-light text-white text-sm font-medium transition-all hover:shadow-glow-sm"
            >
              <Plus size={16} />
              Ajouter une voiture
            </motion.button>
          </div>
        </motion.div>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl px-5 py-4 text-sm flex items-center justify-between gap-4">
            <span>Erreur : {error}</span>
            <button
              onClick={refetch}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-cream/80 text-xs font-medium transition-colors"
            >
              <RefreshCw size={12} />
              Réessayer
            </button>
          </div>
        )}

        {/* Search */}
        <div className="flex items-center gap-2.5 bg-navy-900 border border-white/10 rounded-xl px-3.5 py-2.5 focus-within:border-accent/40 transition-colors md:w-80 mb-6">
          <Search size={14} className="text-cream/40 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher (nom, marque, catégorie)…"
            className="bg-transparent text-sm text-cream placeholder:text-cream/30 outline-none w-full"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20 text-cream/50">
            <Loader2 size={20} className="animate-spin mr-3 text-accent" />
            Chargement des voitures…
          </div>
        )}

        {/* Car grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filtered.map((car, i) => (
              <motion.div
                key={car.id}
                layout
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.4 }}
                className="group bg-navy-900 border border-white/5 rounded-2xl overflow-hidden hover:border-accent/30 transition-colors flex flex-col"
              >
                {/* Image */}
                <div className="relative h-44 bg-gradient-to-br from-white/5 to-white/[0.02] overflow-hidden">
                  {car.image ? (
                    <Image
                      src={car.image}
                      alt={car.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 400px"
                      unoptimized={car.image.startsWith("data:")}
                      className="object-contain p-4 transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-cream/20 text-xs">
                      Aucune image
                    </div>
                  )}
                  <div className="absolute top-3 left-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold border backdrop-blur-md ${
                        car.available
                          ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                          : "bg-red-500/20 text-red-300 border-red-500/40"
                      }`}
                    >
                      <CircleDot size={10} />
                      {car.available ? "Disponible" : "Indisponible"}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-semibold border bg-navy-950/60 backdrop-blur-md text-cream/80 border-white/10">
                      {car.category}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="p-5 flex-1 flex flex-col">
                  <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40 font-medium mb-1">
                    {car.brand} · {car.year}
                  </p>
                  <h3 className="font-display font-semibold text-cream text-lg mb-2 truncate">
                    {car.name}
                  </h3>

                  <div className="grid grid-cols-4 gap-2 mb-4 text-[10px] text-cream/60">
                    <div className="flex items-center gap-1">
                      <Users size={11} className="text-accent" />
                      {car.seats}
                    </div>
                    <div className="flex items-center gap-1">
                      <Gauge size={11} className="text-accent" />
                      {car.horsepower}ch
                    </div>
                    <div className="flex items-center gap-1">
                      <Fuel size={11} className="text-accent" />
                      {car.fuel.slice(0, 4)}
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap size={11} className="text-accent" />
                      {car.transmission === "Automatique" ? "Auto" : "Man"}
                    </div>
                  </div>

                  <div className="flex items-baseline gap-1.5 mb-5">
                    <span className="text-2xl font-bold text-accent">
                      {car.price}
                    </span>
                    <span className="text-xs font-semibold text-accent/80">
                      TND
                    </span>
                    <span className="text-xs text-cream/40">/ jour</span>
                  </div>

                  {/* Actions */}
                  <div className="mt-auto flex items-center gap-2">
                    <button
                      onClick={() => openEdit(car)}
                      className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-accent text-white text-xs font-medium hover:bg-accent-light hover:shadow-glow-sm transition-all"
                    >
                      <Pencil size={13} />
                      Modifier
                    </button>
                    <button
                      onClick={() => toggleAvailability(car)}
                      disabled={busyId === car.id}
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border transition-colors ${
                        busyId === car.id
                          ? "bg-white/5 border-white/10 text-cream/30 cursor-wait"
                          : car.available
                          ? "bg-white/5 border-white/10 text-cream/60 hover:text-yellow-400 hover:border-yellow-500/30"
                          : "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20"
                      }`}
                      aria-label="Basculer la disponibilité"
                      title={
                        car.available
                          ? "Marquer indisponible"
                          : "Marquer disponible"
                      }
                    >
                      {busyId === car.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : car.available ? (
                        <X size={14} />
                      ) : (
                        <Check size={14} />
                      )}
                    </button>
                    <button
                      onClick={() => setPendingDelete(car)}
                      className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10 text-cream/50 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30 transition-colors"
                      aria-label="Supprimer"
                      title="Supprimer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full bg-navy-900 border border-white/5 rounded-2xl p-10 text-center">
                <p className="text-cream/40 text-sm">
                  {cars.length === 0
                    ? "Aucune voiture dans la base de données. Cliquez sur « Ajouter une voiture » pour commencer."
                    : "Aucune voiture ne correspond à votre recherche."}
                </p>
              </div>
            )}
          </div>
        )}
      </main>

      <CarEditModal
        open={modalOpen}
        mode={modalMode}
        initial={editingCar}
        onClose={() => setModalOpen(false)}
        onSave={handleSave}
      />

      <ConfirmDialog
        open={!!pendingDelete}
        title="Supprimer cette voiture ?"
        message={
          pendingDelete
            ? `« ${pendingDelete.name} » sera retirée de votre flotte. Cette action est définitive.`
            : ""
        }
        confirmLabel="Supprimer"
        cancelLabel="Annuler"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />

      <Toast message={toast.message} tone={toast.tone} />
    </div>
  );
}
