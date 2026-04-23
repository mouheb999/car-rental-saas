"use client";

/**
 * Thin wrapper around fetch for /api/admin/** endpoints.
 * The admin cookie is HTTP-only and sent automatically by the browser,
 * so no header plumbing is needed here.
 *
 * On 401 we redirect to /admin/login so an expired session sends the
 * user back to auth without a confusing error.
 */
async function adminFetch<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    credentials: "same-origin",
    cache: "no-store",
  });

  if (res.status === 401) {
    if (typeof window !== "undefined") {
      window.location.href = "/admin/login";
    }
    throw new Error("Session expirée. Reconnexion requise.");
  }

  const json = (await res.json().catch(() => ({}))) as {
    error?: string;
  } & Record<string, unknown>;

  if (!res.ok) {
    throw new Error(json.error ?? `Request failed: ${res.status}`);
  }
  return json as T;
}

import type { CarRow } from "./database.types";
import type { ReservationWithCar } from "./reservationsDb";

// ---------- Reservations ----------

export const adminApi = {
  listReservations: () =>
    adminFetch<{ reservations: ReservationWithCar[] }>(
      "/api/admin/reservations"
    ).then((r) => r.reservations),

  updateReservationStatus: (
    id: string,
    status: "pending" | "confirmed" | "cancelled"
  ) =>
    adminFetch<{ reservation: ReservationWithCar }>(
      `/api/admin/reservations/${id}`,
      { method: "PATCH", body: JSON.stringify({ status }) }
    ).then((r) => r.reservation),

  // ---------- Cars ----------

  listCars: () =>
    adminFetch<{ cars: CarRow[] }>("/api/admin/cars").then((r) => r.cars),

  createCar: (payload: Omit<CarRow, "id" | "created_at">) =>
    adminFetch<{ car: CarRow }>("/api/admin/cars", {
      method: "POST",
      body: JSON.stringify(payload),
    }).then((r) => r.car),

  updateCar: (id: string, payload: Partial<CarRow>) =>
    adminFetch<{ car: CarRow }>(`/api/admin/cars/${id}`, {
      method: "PATCH",
      body: JSON.stringify(payload),
    }).then((r) => r.car),

  deleteCar: (id: string) =>
    adminFetch<{ ok: true }>(`/api/admin/cars/${id}`, {
      method: "DELETE",
    }),

  // ---------- Auth ----------

  logout: () =>
    adminFetch<{ ok: true }>("/api/admin/logout", { method: "POST" }),
};
