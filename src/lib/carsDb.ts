"use client";

import { supabase } from "./supabase";
import type { CarRow } from "./database.types";

export async function fetchCars(): Promise<CarRow[]> {
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchCarById(id: string): Promise<CarRow | null> {
  const { data, error } = await supabase
    .from("cars")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function insertCar(
  car: Omit<CarRow, "id" | "created_at">
): Promise<CarRow> {
  const { data, error } = await supabase
    .from("cars")
    .insert(car)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function updateCar(
  id: string,
  patch: Partial<CarRow>
): Promise<CarRow> {
  const { data, error } = await supabase
    .from("cars")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCar(id: string): Promise<void> {
  const { error } = await supabase.from("cars").delete().eq("id", id);
  if (error) throw error;
}
