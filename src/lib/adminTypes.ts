import type { CarRow } from "./database.types";

/**
 * Admin-side car representation used by the edit modal & card grid.
 * All fields are non-nullable for ease of form handling; missing DB values
 * are normalised to safe defaults in `fromCarRow`.
 */
export interface AdminCar {
  id: string;
  name: string;
  brand: string;
  image: string;
  price: number;
  seats: number;
  transmission: "Manuelle" | "Automatique";
  fuel: "Essence" | "Diesel" | "Hybride" | "Électrique";
  horsepower: number;
  year: number;
  category: string;
  description: string;
  gallery: string[];
  available: boolean;
}

function normaliseTransmission(v: string | null): AdminCar["transmission"] {
  return v === "Automatique" ? "Automatique" : "Manuelle";
}

function normaliseFuel(v: string | null): AdminCar["fuel"] {
  if (v === "Diesel" || v === "Hybride" || v === "Électrique") return v;
  return "Essence";
}

export function fromCarRow(row: CarRow): AdminCar {
  return {
    id: row.id,
    name: row.name,
    brand: row.brand ?? "",
    image: row.image ?? "",
    price: row.price,
    seats: row.seats ?? 5,
    transmission: normaliseTransmission(row.transmission),
    fuel: normaliseFuel(row.fuel),
    horsepower: row.horsepower ?? 100,
    year: row.year ?? new Date().getFullYear(),
    category: row.category ?? "Citadine",
    description: row.description ?? "",
    gallery: row.gallery ?? [],
    available: row.available,
  };
}

/**
 * Payload shape for insert/update. We omit `id` and `created_at` so Supabase
 * generates them on insert. On update we only send the mutable fields.
 */
export function toCarInsert(
  car: AdminCar
): Omit<CarRow, "id" | "created_at"> {
  return {
    name: car.name.trim(),
    brand: car.brand.trim() || null,
    image: car.image || null,
    price: car.price,
    seats: car.seats,
    transmission: car.transmission,
    fuel: car.fuel,
    horsepower: car.horsepower,
    year: car.year,
    category: car.category,
    description: car.description || null,
    gallery: car.gallery,
    available: car.available,
  };
}
