"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { adminApi } from "./adminApi";
import type { CarRow } from "./database.types";

const POLL_MS = 8000;

interface UseAdminCarsResult {
  cars: CarRow[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Admin-side cars hook backed by /api/admin/cars. Returns ALL cars
 * (including unavailable ones), polls every 8s for multi-admin sync.
 */
export function useAdminCars(): UseAdminCarsResult {
  const [cars, setCars] = useState<CarRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    try {
      const rows = await adminApi.listCars();
      if (!mounted.current) return;
      setCars(rows);
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

  return { cars, loading, error, refetch: load };
}
