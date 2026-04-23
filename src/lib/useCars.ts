"use client";

import { useCallback, useEffect, useState } from "react";
import { supabase } from "./supabase";
import { fetchCars, fetchCarById } from "./carsDb";
import type { CarRow } from "./database.types";

interface UseCarsResult {
  cars: CarRow[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Fetch cars + subscribe to realtime changes on the `cars` table.
 * Any INSERT/UPDATE/DELETE triggers a refetch so the UI stays live.
 */
export function useCars(): UseCarsResult {
  const [cars, setCars] = useState<CarRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const rows = await fetchCars();
      setCars(rows);
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
      .channel("cars-public")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cars" },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [load]);

  return { cars, loading, error, refetch: load };
}

interface UseCarResult {
  car: CarRow | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useCar(id: string | undefined): UseCarResult {
  const [car, setCar] = useState<CarRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!id) {
      setCar(null);
      setLoading(false);
      return;
    }
    try {
      const row = await fetchCarById(id);
      setCar(row);
      setError(null);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Erreur de chargement";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    load();
    if (!id) return;

    const channel = supabase
      .channel(`car-${id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "cars", filter: `id=eq.${id}` },
        () => {
          load();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, load]);

  return { car, loading, error, refetch: load };
}
