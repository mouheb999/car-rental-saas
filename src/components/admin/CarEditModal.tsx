"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Check,
  Upload,
  Image as ImageIcon,
  Plus,
  Trash2,
  Link as LinkIcon,
} from "lucide-react";
import type { AdminCar } from "@/lib/adminTypes";

interface CarEditModalProps {
  open: boolean;
  mode: "create" | "edit";
  initial?: AdminCar | null;
  onClose: () => void;
  onSave: (car: AdminCar) => void;
}

const FUEL_OPTIONS: AdminCar["fuel"][] = [
  "Essence",
  "Diesel",
  "Hybride",
  "Électrique",
];
const TRANSMISSION_OPTIONS: AdminCar["transmission"][] = [
  "Manuelle",
  "Automatique",
];
const CATEGORY_OPTIONS = ["Citadine", "Compacte", "Berline", "SUV"];

const EMPTY: AdminCar = {
  id: "",
  name: "",
  brand: "",
  image: "",
  price: 100,
  seats: 5,
  transmission: "Manuelle",
  fuel: "Essence",
  horsepower: 100,
  year: new Date().getFullYear(),
  category: "Citadine",
  description: "",
  gallery: [],
  available: true,
};

function slugify(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function CarEditModal({
  open,
  mode,
  initial,
  onClose,
  onSave,
}: CarEditModalProps) {
  const [form, setForm] = useState<AdminCar>(EMPTY);
  const [error, setError] = useState<string | null>(null);
  const mainFileRef = useRef<HTMLInputElement>(null);
  const galleryFileRef = useRef<HTMLInputElement>(null);

  // Reset form whenever the modal opens
  useEffect(() => {
    if (open) {
      setForm(initial ? { ...initial } : { ...EMPTY });
      setError(null);
    }
  }, [open, initial]);

  const update = <K extends keyof AdminCar>(key: K, value: AdminCar[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleMainUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const dataUrl = await fileToDataUrl(file);
    update("image", dataUrl);
    e.target.value = "";
  };

  const handleGalleryUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    const urls = await Promise.all(files.map(fileToDataUrl));
    setForm((prev) => ({ ...prev, gallery: [...prev.gallery, ...urls] }));
    e.target.value = "";
  };

  const addGalleryUrl = () => {
    const url = window.prompt("URL de l'image :");
    if (!url) return;
    setForm((prev) => ({ ...prev, gallery: [...prev.gallery, url] }));
  };

  const removeGalleryItem = (i: number) => {
    setForm((prev) => ({
      ...prev,
      gallery: prev.gallery.filter((_, idx) => idx !== i),
    }));
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return setError("Le nom est obligatoire");
    if (!form.brand.trim()) return setError("La marque est obligatoire");
    if (!form.image.trim()) return setError("L'image principale est obligatoire");
    if (!form.price || form.price <= 0) return setError("Prix invalide");
    if (!form.horsepower || form.horsepower <= 0)
      return setError("Puissance invalide");

    const payload: AdminCar = {
      ...form,
      id: form.id || slugify(form.name) || `car-${Date.now()}`,
      gallery: form.gallery.length > 0 ? form.gallery : [form.image],
    };

    onSave(payload);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-navy-950/70 backdrop-blur-sm overflow-y-auto"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl bg-navy-900 border border-white/10 rounded-2xl shadow-lifted my-auto"
          >
            {/* Header */}
            <div className="flex items-center gap-4 p-5 border-b border-white/5 sticky top-0 bg-navy-900 rounded-t-2xl z-10">
              <div className="flex-1 min-w-0">
                <p className="text-[10px] uppercase tracking-[0.2em] text-accent font-medium mb-1">
                  {mode === "create" ? "Nouvelle voiture" : "Modifier"}
                </p>
                <h2 className="font-display font-semibold text-cream truncate">
                  {mode === "create"
                    ? "Ajouter une voiture à la flotte"
                    : form.name || "Voiture"}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 text-cream/60 hover:text-cream hover:bg-white/10 transition-colors"
                aria-label="Fermer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Body */}
            <div className="p-5 space-y-6 max-h-[75vh] overflow-y-auto">
              {/* Main image */}
              <div>
                <label className="text-xs uppercase tracking-wider text-cream/50 font-medium block mb-2">
                  Image principale
                </label>
                <div className="flex items-stretch gap-3">
                  <div className="relative w-32 h-24 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0 flex items-center justify-center">
                    {form.image ? (
                      <Image
                        src={form.image}
                        alt="Aperçu"
                        fill
                        sizes="128px"
                        unoptimized={form.image.startsWith("data:")}
                        className="object-contain p-2"
                      />
                    ) : (
                      <ImageIcon size={22} className="text-cream/30" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col gap-2">
                    <input
                      type="text"
                      value={form.image.startsWith("data:") ? "" : form.image}
                      onChange={(e) => update("image", e.target.value)}
                      placeholder="Coller une URL d'image…"
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-cream placeholder:text-cream/30 outline-none focus:border-accent/40 transition-colors"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => mainFileRef.current?.click()}
                        className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-cream/80 text-xs font-medium transition-colors"
                      >
                        <Upload size={13} />
                        Importer
                      </button>
                      {form.image && (
                        <button
                          type="button"
                          onClick={() => update("image", "")}
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 border border-white/10 text-cream/60 text-xs font-medium transition-colors"
                        >
                          <Trash2 size={13} />
                          Retirer
                        </button>
                      )}
                    </div>
                    <input
                      ref={mainFileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleMainUpload}
                    />
                  </div>
                </div>
              </div>

              {/* Gallery */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase tracking-wider text-cream/50 font-medium">
                    Galerie ({form.gallery.length})
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={addGalleryUrl}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cream/70 text-[11px] font-medium transition-colors"
                    >
                      <LinkIcon size={11} />
                      URL
                    </button>
                    <button
                      type="button"
                      onClick={() => galleryFileRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-cream/70 text-[11px] font-medium transition-colors"
                    >
                      <Plus size={11} />
                      Importer
                    </button>
                    <input
                      ref={galleryFileRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={handleGalleryUpload}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {form.gallery.map((src, i) => (
                    <div
                      key={i}
                      className="relative w-20 h-20 rounded-xl bg-white/5 border border-white/10 overflow-hidden group"
                    >
                      <Image
                        src={src}
                        alt={`Galerie ${i + 1}`}
                        fill
                        sizes="80px"
                        unoptimized={src.startsWith("data:")}
                        className="object-contain p-1.5"
                      />
                      <button
                        type="button"
                        onClick={() => removeGalleryItem(i)}
                        className="absolute top-1 right-1 w-5 h-5 rounded-full bg-navy-950/80 text-cream/70 hover:bg-red-500/80 hover:text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        aria-label="Retirer"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}
                  {form.gallery.length === 0 && (
                    <p className="text-[11px] text-cream/30 italic py-4">
                      Aucune image en galerie (l'image principale sera utilisée).
                    </p>
                  )}
                </div>
              </div>

              {/* Name + Brand */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Field label="Nom">
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => update("name", e.target.value)}
                    placeholder="Seat Ibiza"
                    className="field-input"
                  />
                </Field>
                <Field label="Marque">
                  <input
                    type="text"
                    value={form.brand}
                    onChange={(e) => update("brand", e.target.value)}
                    placeholder="Seat"
                    className="field-input"
                  />
                </Field>
              </div>

              {/* Price + Year + HP + Seats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Field label="Prix / jour (TND)">
                  <input
                    type="number"
                    min={1}
                    step={5}
                    value={form.price}
                    onChange={(e) => update("price", Number(e.target.value))}
                    className="field-input"
                  />
                </Field>
                <Field label="Année">
                  <input
                    type="number"
                    min={2000}
                    max={2030}
                    value={form.year}
                    onChange={(e) => update("year", Number(e.target.value))}
                    className="field-input"
                  />
                </Field>
                <Field label="Puissance (ch)">
                  <input
                    type="number"
                    min={1}
                    value={form.horsepower}
                    onChange={(e) =>
                      update("horsepower", Number(e.target.value))
                    }
                    className="field-input"
                  />
                </Field>
                <Field label="Places">
                  <input
                    type="number"
                    min={2}
                    max={9}
                    value={form.seats}
                    onChange={(e) => update("seats", Number(e.target.value))}
                    className="field-input"
                  />
                </Field>
              </div>

              {/* Fuel + Transmission + Category */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Field label="Carburant">
                  <select
                    value={form.fuel}
                    onChange={(e) =>
                      update("fuel", e.target.value as AdminCar["fuel"])
                    }
                    className="field-input"
                  >
                    {FUEL_OPTIONS.map((o) => (
                      <option key={o} value={o} className="bg-navy-900">
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Transmission">
                  <select
                    value={form.transmission}
                    onChange={(e) =>
                      update(
                        "transmission",
                        e.target.value as AdminCar["transmission"]
                      )
                    }
                    className="field-input"
                  >
                    {TRANSMISSION_OPTIONS.map((o) => (
                      <option key={o} value={o} className="bg-navy-900">
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Catégorie">
                  <select
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                    className="field-input"
                  >
                    {CATEGORY_OPTIONS.map((o) => (
                      <option key={o} value={o} className="bg-navy-900">
                        {o}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>

              {/* Description */}
              <Field label="Description">
                <textarea
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  rows={3}
                  placeholder="Brève description du véhicule…"
                  className="field-input resize-none"
                />
              </Field>

              {/* Availability */}
              <div>
                <label className="text-xs uppercase tracking-wider text-cream/50 font-medium block mb-2">
                  Disponibilité
                </label>
                <div className="flex items-center justify-between bg-white/5 rounded-xl px-4 py-3 border border-white/5">
                  <div>
                    <p className="text-sm text-cream font-medium">
                      {form.available ? "Disponible" : "Indisponible"}
                    </p>
                    <p className="text-[11px] text-cream/40 mt-0.5">
                      {form.available
                        ? "Visible et réservable par les clients"
                        : "Masquée des résultats de recherche"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => update("available", !form.available)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full border transition-colors ${
                      form.available
                        ? "bg-accent border-accent"
                        : "bg-white/10 border-white/10"
                    }`}
                    role="switch"
                    aria-checked={form.available}
                  >
                    <span
                      className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
                        form.available ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-500/30 bg-red-500/10 text-red-400 text-sm px-4 py-2.5">
                  {error}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-3 p-5 border-t border-white/5 sticky bottom-0 bg-navy-900 rounded-b-2xl">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-3 rounded-xl bg-white/5 text-cream/80 text-sm font-medium hover:bg-white/10 transition-colors"
              >
                Annuler
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-accent hover:bg-accent-light text-white text-sm font-medium transition-all hover:shadow-glow-sm"
              >
                <Check size={14} />
                {mode === "create" ? "Ajouter" : "Enregistrer"}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs uppercase tracking-wider text-cream/50 font-medium block mb-2">
        {label}
      </label>
      {children}
    </div>
  );
}
