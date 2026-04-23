"use client";

import { supabase } from "./supabase";
import type {
  ReservationRow,
  ReservationStatus,
  CarRow,
} from "./database.types";

export type ReservationWithCar = ReservationRow & {
  cars: Pick<CarRow, "id" | "name" | "image"> | null;
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
}): Promise<ReservationRow> {
  const { data, error } = await supabase
    .from("reservations")
    .insert({
      ...payload,
      status: "pending",
    })
    .select("*")
    .single();
  if (error) throw error;
  return data;
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
 * Returns any confirmed/pending reservations for this car that overlap the
 * requested range. Overlap: new_start <= existing_end AND new_end >= existing_start.
 * Cancelled reservations are ignored.
 */
export async function findOverlappingReservations(
  carId: string,
  startDate: string,
  endDate: string
): Promise<ReservationRow[]> {
  const { data, error } = await supabase
    .from("reservations")
    .select("*")
    .eq("car_id", carId)
    .in("status", ["pending", "confirmed"])
    .lte("start_date", endDate) // existing_start <= new_end
    .gte("end_date", startDate); // existing_end >= new_start
  if (error) throw error;
  return data ?? [];
}
