"use client";

import { supabase } from "./supabase";
import type {
  ReservationRow,
  ReservationStatus,
  CarRow,
} from "./database.types";

export type ReservationWithCar = ReservationRow & {
  cars: Pick<CarRow, "id" | "name" | "image" | "price"> | null;
};

export async function fetchReservations(): Promise<ReservationWithCar[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("*, cars(id, name, image)")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as ReservationWithCar[];
}

export async function createReservation(payload: {
  name: string;
  phone: string;
  car_id: string;
  start_date: string;
  end_date: string;
  pickup_location?: string | null;
}): Promise<{ id: string }> {
  // Generate the id client-side so we can return it without needing
  // read access to the `reservations` table (blocked by RLS for anon).
  const id = crypto.randomUUID();
  const { error } = await supabase
    .from("reservations")
    .insert({
      id,
      ...payload,
      status: "pending",
    });
  if (error) throw error;
  return { id };
}

export async function updateReservationStatus(
  id: string,
  status: ReservationStatus
): Promise<ReservationRow> {
  const { data, error } = await supabase
    .from("reservations")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

/**
 * Checks whether the car is free on the given date range.
 *
 * Uses the SECURITY DEFINER RPC `is_car_available` instead of a direct
 * `select` on `reservations` — so the anon client never needs read access
 * to customer PII. The function runs server-side in Postgres and only
 * returns a single boolean.
 */
export async function isCarAvailable(
  carId: string,
  startDate: string,
  endDate: string
): Promise<boolean> {
  const { data, error } = await supabase.rpc("is_car_available", {
    p_car_id: carId,
    p_start: startDate,
    p_end: endDate,
  });
  if (error) throw error;
  return Boolean(data);
}

/**
 * Kept for backwards compatibility with the booking page. Now piggybacks
 * on `isCarAvailable` and just returns an empty array if free or a single
 * marker element if not. The caller only checks `.length > 0`.
 */
export async function findOverlappingReservations(
  carId: string,
  startDate: string,
  endDate: string
): Promise<Array<{ id: string }>> {
  const available = await isCarAvailable(carId, startDate, endDate);
  return available ? [] : [{ id: "overlap" }];
}
