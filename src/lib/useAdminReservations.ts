"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adminApi } from "./adminApi";
import type { ReservationWithCar } from "./reservationsDb";
import type { ReservationStatus } from "./database.types";

/**
 * Admin-side reservations hook backed by /api/admin/reservations.
 *
 * Realtime can't work here because anon clients are blocked by RLS
 * from reading the reservations table. Instead we poll every 5s — more
 * than fast enough for a booking admin and dead simple.
 *
 * A `patchInFlight` ref prevents polling from overwriting optimistic
 * updates while a PATCH request is in-flight.
 */
const POLL_MS = 5000;

interface UseAdminReservationsResult {
  reservations: ReservationWithCar[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  contact: (id: string) => Promise<void>;
  confirm: (id: string) => Promise<void>;
  cancel: (id: string) => Promise<void>;
}

export function useAdminReservations(): UseAdminReservationsResult {
  const [reservations, setReservations] = useState<ReservationWithCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);
  const patchInFlight = useRef(false);

  const load = useCallback(async () => {
    // Skip polling while a PATCH is in-flight to avoid overwriting
    // the optimistic update with stale server data.
    if (patchInFlight.current) return;
    try {
      const rows = await adminApi.listReservations();
      if (!mounted.current || patchInFlight.current) return;
      setReservations(rows);
      setError(null);
    } catch (e) {
      if (!mounted.current) return;
      setError(e instanceof Error ? e.message : "Erreur de chargement");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    load();
    const interval = setInterval(load, POLL_MS);
    return () => {
      mounted.current = false;
      clearInterval(interval);
    };
  }, [load]);

  const patch = useCallback(
    async (id: string, status: ReservationStatus) => {
      // Block polling while the write is in-flight so the optimistic
      // update isn't overwritten by stale server data.
      patchInFlight.current = true;

      // Optimistic update — UI reflects the change immediately
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );

      try {
        await adminApi.updateReservationStatus(id, status);
        // PATCH succeeded. Resume polling — next cycle will sync
        // canonical state from the server automatically.
        patchInFlight.current = false;
      } catch (e) {
        // On failure, resume polling and refetch the real state
        patchInFlight.current = false;
        await load();
        throw e;
      }
    },
    [load]
  );

  return {
    reservations,
    loading,
    error,
    refetch: load,
    contact: (id) => patch(id, "contacted"),
    confirm: (id) => patch(id, "confirmed"),
    cancel: (id) => patch(id, "cancelled"),
  };
}
