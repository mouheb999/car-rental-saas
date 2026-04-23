"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import {
  fetchReservations,
  updateReservationStatus,
  type ReservationWithCar,
} from "./reservationsDb";
import type { ReservationStatus } from "./database.types";

interface UseReservationsResult {
  reservations: ReservationWithCar[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  confirm: (id: string) => Promise<void>;
  cancel: (id: string) => Promise<void>;
}

/**
 * Fetches all reservations + subscribes to realtime INSERT/UPDATE/DELETE events.
 * Any change in the `reservations` table triggers an optimistic refetch so the
 * admin dashboard stays in sync with no manual reload.
 */
export function useReservations(): UseReservationsResult {
  const [reservations, setReservations] = useState<ReservationWithCar[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const rows = await fetchReservations();
      setReservations(rows);
      setError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur de chargement";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();

    const channel = supabase
      .channel("reservations-admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "reservations" },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  const updateStatus = useCallback(
    async (id: string, status: ReservationStatus) => {
      // Optimistic update so UI reacts instantly
      setReservations((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
      try {
        await updateReservationStatus(id, status);
      } catch (e) {
        // Revert on error
        load();
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
    confirm: (id) => updateStatus(id, "confirmed"),
    cancel: (id) => updateStatus(id, "cancelled"),
  };
}
