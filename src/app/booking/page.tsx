"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  User,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Loader2,
  AlertCircle,
  Home,
} from "lucide-react";
import { useCar } from "@/lib/useCars";
import {
  createReservation,
  findOverlappingReservations,
} from "@/lib/reservationsDb";

const steps = [
  { id: 1, label: "Dates", icon: Calendar },
  { id: 2, label: "Informations", icon: User },
  { id: 3, label: "Confirmation", icon: CheckCircle },
];

function daysBetween(start: string, end: string): number {
  if (!start || !end) return 0;
  const a = new Date(start + "T00:00:00").getTime();
  const b = new Date(end + "T00:00:00").getTime();
  return Math.round((b - a) / 86_400_000);
}

function BookingInner() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const carIdParam = searchParams.get("carId");
  const urlStart = searchParams.get("start") ?? "";
  const urlEnd = searchParams.get("end") ?? "";
  const urlLocation = searchParams.get("location") ?? "";

  const { car, loading: carLoading, error: carError } = useCar(
    carIdParam ?? undefined
  );

  const today = new Date().toISOString().split("T")[0];

  // State
  const [startDate, setStartDate] = useState(urlStart);
  const [endDate, setEndDate] = useState(urlEnd);
  const [pickupLocation, setPickupLocation] = useState(urlLocation);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // Skip step 1 if we arrive with valid carId + dates
  const hasPreselectedDates =
    Boolean(carIdParam) && Boolean(urlStart) && Boolean(urlEnd);
  const [currentStep, setCurrentStep] = useState(hasPreselectedDates ? 2 : 1);

  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reservationId, setReservationId] = useState<string | null>(null);

  useEffect(() => {
    if (urlStart) setStartDate(urlStart);
    if (urlEnd) setEndDate(urlEnd);
    if (urlLocation) setPickupLocation(urlLocation);
  }, [urlStart, urlEnd, urlLocation]);

  const days = useMemo(
    () => Math.max(daysBetween(startDate, endDate), 0),
    [startDate, endDate]
  );

  const serviceFee = 25;
  const total = car ? car.price * days + serviceFee : 0;
  const datesValid = startDate && endDate && days > 0;

  const next = () => setCurrentStep((s) => Math.min(s + 1, 3));
  const prev = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const canContinueStep1 = datesValid;
  const canSubmit =
    datesValid &&
    firstName.trim() &&
    lastName.trim() &&
    phone.trim() &&
    car !== null;

  const handleSubmit = async () => {
    if (!car || !canSubmit) return;
    setSubmitting(true);
    setSubmitError(null);

    try {
      // Availability check
      const overlaps = await findOverlappingReservations(
        car.id,
        startDate,
        endDate
      );
      if (overlaps.length > 0) {
        setSubmitError(
          "Ce véhicule est déjà réservé sur ces dates. Essayez d'autres dates."
        );
        setSubmitting(false);
        setCurrentStep(1);
        return;
      }

      // Insert
      const res = await createReservation({
        name: `${firstName.trim()} ${lastName.trim()}`.trim(),
        phone: phone.trim(),
        car_id: car.id,
        start_date: startDate,
        end_date: endDate,
        pickup_location: pickupLocation.trim() || null,
      });

      setReservationId(res.id);
      setCurrentStep(3);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Une erreur est survenue.";
      setSubmitError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  // No car selected: redirect guidance
  if (!carIdParam) {
    return (
      <div className="pt-40 pb-20 max-w-xl mx-auto px-6 text-center">
        <div className="bg-navy-900 border border-white/5 rounded-2xl p-8">
          <div className="w-14 h-14 rounded-full bg-accent/15 border border-accent/30 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={22} className="text-accent" />
          </div>
          <h2 className="text-xl font-display font-semibold text-cream mb-2">
            Aucun véhicule sélectionné
          </h2>
          <p className="text-cream/50 mb-6 text-sm">
            Choisissez d&rsquo;abord une voiture dans notre flotte pour lancer
            une réservation.
          </p>
          <Link
            href="/cars"
            className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-6 py-3 rounded-xl text-sm font-medium transition-all"
          >
            Voir les véhicules
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    );
  }

  if (carLoading) {
    return (
      <div className="pt-40 pb-20 flex items-center justify-center text-cream/50">
        <Loader2 size={20} className="animate-spin mr-3 text-accent" />
        Chargement…
      </div>
    );
  }

  if (carError || !car) {
    return (
      <div className="pt-40 pb-20 max-w-xl mx-auto px-6 text-center">
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 rounded-2xl p-6 text-sm">
          {carError ?? "Véhicule introuvable."}
        </div>
        <Link
          href="/cars"
          className="text-accent mt-6 inline-block text-sm font-medium"
        >
          ← Retour à la flotte
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 min-h-screen">
      <div className="max-w-5xl mx-auto section-padding">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px w-8 bg-accent" />
            <p className="text-xs uppercase tracking-[0.3em] text-accent font-medium">
              Réservation
            </p>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-cream tracking-tight">
            Réservez votre voiture
          </h1>
        </motion.div>

        {/* Progress */}
        <div className="flex items-center justify-between mb-12">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center flex-1">
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-500 ${
                    currentStep >= step.id
                      ? "bg-accent text-white shadow-glow-sm"
                      : "bg-white/5 text-cream/40 border border-white/5"
                  }`}
                >
                  {currentStep > step.id ? (
                    <CheckCircle size={18} />
                  ) : (
                    step.id
                  )}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block transition-colors ${
                    currentStep >= step.id ? "text-cream" : "text-cream/40"
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div
                    className={`h-px transition-colors duration-500 ${
                      currentStep > step.id ? "bg-accent" : "bg-white/10"
                    }`}
                  />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step Content */}
          <div className="lg:col-span-2">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-navy-900 rounded-2xl border border-white/5 p-8">
                    <h2 className="text-xl font-display font-semibold text-cream mb-6">
                      Choisissez vos dates
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs uppercase tracking-wider text-cream/50 font-medium block mb-2">
                          Date de départ
                        </label>
                        <input
                          type="date"
                          min={today}
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full bg-white/5 rounded-xl px-4 py-3.5 text-sm text-cream outline-none border border-white/5 focus:border-accent/50 transition-colors [color-scheme:dark]"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-cream/50 font-medium block mb-2">
                          Date de retour
                        </label>
                        <input
                          type="date"
                          min={startDate || today}
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full bg-white/5 rounded-xl px-4 py-3.5 text-sm text-cream outline-none border border-white/5 focus:border-accent/50 transition-colors [color-scheme:dark]"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="text-xs uppercase tracking-wider text-cream/50 font-medium block mb-2">
                        Lieu de prise en charge
                      </label>
                      <input
                        type="text"
                        value={pickupLocation}
                        onChange={(e) => setPickupLocation(e.target.value)}
                        placeholder="Tunis, Sousse, Djerba…"
                        className="w-full bg-white/5 rounded-xl px-4 py-3.5 text-sm text-cream placeholder:text-cream/30 outline-none border border-white/5 focus:border-accent/50 transition-colors"
                      />
                    </div>
                    {startDate && endDate && days <= 0 && (
                      <p className="mt-4 text-sm text-red-400">
                        La date de retour doit être après la date de départ.
                      </p>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-navy-900 rounded-2xl border border-white/5 p-8">
                    <h2 className="text-xl font-display font-semibold text-cream mb-6">
                      Vos informations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="text-xs uppercase tracking-wider text-cream/50 font-medium block mb-2">
                          Prénom *
                        </label>
                        <input
                          type="text"
                          value={firstName}
                          onChange={(e) => setFirstName(e.target.value)}
                          placeholder="Mohamed"
                          className="w-full bg-white/5 rounded-xl px-4 py-3.5 text-sm text-cream placeholder:text-cream/30 outline-none border border-white/5 focus:border-accent/50 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-xs uppercase tracking-wider text-cream/50 font-medium block mb-2">
                          Nom *
                        </label>
                        <input
                          type="text"
                          value={lastName}
                          onChange={(e) => setLastName(e.target.value)}
                          placeholder="Ben Salah"
                          className="w-full bg-white/5 rounded-xl px-4 py-3.5 text-sm text-cream placeholder:text-cream/30 outline-none border border-white/5 focus:border-accent/50 transition-colors"
                        />
                      </div>
                    </div>
                    <div className="mt-6">
                      <label className="text-xs uppercase tracking-wider text-cream/50 font-medium block mb-2">
                        Adresse e-mail
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="prenom@exemple.com"
                        className="w-full bg-white/5 rounded-xl px-4 py-3.5 text-sm text-cream placeholder:text-cream/30 outline-none border border-white/5 focus:border-accent/50 transition-colors"
                      />
                    </div>
                    <div className="mt-6">
                      <label className="text-xs uppercase tracking-wider text-cream/50 font-medium block mb-2">
                        Téléphone *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="98 123 456"
                        className="w-full bg-white/5 rounded-xl px-4 py-3.5 text-sm text-cream placeholder:text-cream/30 outline-none border border-white/5 focus:border-accent/50 transition-colors"
                      />
                      <p className="text-[11px] text-cream/40 mt-2">
                        Nous utiliserons ce numéro pour vous contacter via
                        WhatsApp ou appel.
                      </p>
                    </div>

                    {submitError && (
                      <div className="mt-5 flex items-start gap-3 bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-xl px-4 py-3">
                        <AlertCircle
                          size={16}
                          className="shrink-0 mt-0.5"
                        />
                        <span>{submitError}</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {currentStep === 3 && reservationId && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="bg-navy-900 rounded-2xl border border-white/5 p-10 text-center">
                    <div className="w-16 h-16 bg-accent/10 border border-accent/30 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={32} className="text-accent" />
                    </div>
                    <h2 className="text-2xl font-display font-semibold text-cream mb-3">
                      Demande envoyée !
                    </h2>
                    <p className="text-cream/50 mb-8 max-w-md mx-auto">
                      Votre réservation a bien été enregistrée. Notre équipe
                      vous contactera sur WhatsApp ou par téléphone pour la
                      confirmer sous peu.
                    </p>

                    <div className="bg-navy-850 border border-white/5 rounded-xl p-6 max-w-sm mx-auto text-left space-y-3 mb-8">
                      <div className="flex justify-between text-sm">
                        <span className="text-cream/50">Véhicule</span>
                        <span className="font-medium text-cream">
                          {car.name}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-cream/50">Durée</span>
                        <span className="font-medium text-cream">
                          {days} jour{days > 1 ? "s" : ""}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm pt-3 border-t border-white/5">
                        <span className="text-cream/50">Total</span>
                        <span className="font-bold text-accent">
                          {total} TND
                        </span>
                      </div>
                      <div className="pt-3 border-t border-white/5 text-[11px] text-cream/40 text-center">
                        Réf. #{reservationId.slice(0, 8).toUpperCase()}
                      </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                      <Link
                        href="/"
                        className="inline-flex items-center gap-2 bg-white/5 hover:bg-white/10 text-cream px-5 py-3 rounded-xl text-sm font-medium transition-colors"
                      >
                        <Home size={14} />
                        Accueil
                      </Link>
                      <Link
                        href="/cars"
                        className="inline-flex items-center gap-2 bg-accent hover:bg-accent-light text-white px-5 py-3 rounded-xl text-sm font-medium transition-all hover:shadow-glow"
                      >
                        Voir d&rsquo;autres véhicules
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation */}
            {currentStep < 3 && (
              <div className="flex items-center justify-between mt-8">
                {currentStep > 1 && !hasPreselectedDates ? (
                  <button
                    onClick={prev}
                    className="flex items-center gap-2 text-sm font-medium text-cream/50 hover:text-cream transition-colors"
                  >
                    <ArrowLeft size={14} />
                    Retour
                  </button>
                ) : (
                  <div />
                )}

                {currentStep === 1 && (
                  <motion.button
                    onClick={next}
                    disabled={!canContinueStep1}
                    whileHover={canContinueStep1 ? { scale: 1.02 } : undefined}
                    whileTap={canContinueStep1 ? { scale: 0.98 } : undefined}
                    className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      canContinueStep1
                        ? "bg-accent hover:bg-accent-light text-white hover:shadow-glow"
                        : "bg-white/5 text-cream/40 cursor-not-allowed"
                    }`}
                  >
                    Continuer
                    <ArrowRight size={14} />
                  </motion.button>
                )}

                {currentStep === 2 && (
                  <motion.button
                    onClick={handleSubmit}
                    disabled={!canSubmit || submitting}
                    whileHover={
                      canSubmit && !submitting ? { scale: 1.02 } : undefined
                    }
                    whileTap={
                      canSubmit && !submitting ? { scale: 0.98 } : undefined
                    }
                    className={`flex items-center gap-2 px-8 py-3.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                      canSubmit && !submitting
                        ? "bg-accent hover:bg-accent-light text-white hover:shadow-glow"
                        : "bg-white/5 text-cream/40 cursor-not-allowed"
                    }`}
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={14} className="animate-spin" />
                        Envoi en cours…
                      </>
                    ) : (
                      <>
                        Confirmer la réservation
                        <ArrowRight size={14} />
                      </>
                    )}
                  </motion.button>
                )}
              </div>
            )}
          </div>

          {/* Summary sidebar */}
          {currentStep < 3 && (
            <motion.aside
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:sticky lg:top-28 h-fit bg-navy-900 rounded-2xl border border-white/5 shadow-lifted overflow-hidden"
            >
              {car.image && (
                <div className="relative h-40 bg-gradient-to-br from-white/5 to-white/[0.02]">
                  <Image
                    src={car.image}
                    alt={car.name}
                    fill
                    sizes="300px"
                    unoptimized={car.image.startsWith("data:")}
                    className="object-contain p-3"
                  />
                </div>
              )}
              <div className="p-6 space-y-4">
                <div>
                  {car.brand && (
                    <p className="text-[10px] uppercase tracking-[0.2em] text-cream/40 mb-1">
                      {car.brand}
                    </p>
                  )}
                  <h3 className="font-display font-semibold text-cream text-lg">
                    {car.name}
                  </h3>
                </div>

                {datesValid ? (
                  <div className="space-y-2 text-sm pt-3 border-t border-white/5">
                    <div className="flex justify-between text-cream/60">
                      <span>Du</span>
                      <span className="text-cream font-medium font-mono">
                        {startDate}
                      </span>
                    </div>
                    <div className="flex justify-between text-cream/60">
                      <span>Au</span>
                      <span className="text-cream font-medium font-mono">
                        {endDate}
                      </span>
                    </div>
                    {pickupLocation && (
                      <div className="flex justify-between text-cream/60">
                        <span>Lieu</span>
                        <span className="text-cream font-medium truncate ml-2">
                          {pickupLocation}
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-xs text-cream/40 pt-3 border-t border-white/5">
                    Sélectionnez vos dates pour voir le total.
                  </p>
                )}

                <div className="space-y-2 text-sm pt-3 border-t border-white/5">
                  <div className="flex justify-between">
                    <span className="text-cream/50">
                      {car.price} TND × {days || 0} j
                    </span>
                    <span className="text-cream font-medium">
                      {car.price * (days || 0)} TND
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-cream/50">Frais de service</span>
                    <span className="text-cream font-medium">
                      {serviceFee} TND
                    </span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-white/5 text-base font-bold">
                    <span className="text-cream">Total</span>
                    <span className="text-accent">{total} TND</span>
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  return (
    <Suspense
      fallback={
        <div className="pt-40 flex justify-center text-cream/40">
          <Loader2 size={20} className="animate-spin" />
        </div>
      }
    >
      <BookingInner />
    </Suspense>
  );
}
