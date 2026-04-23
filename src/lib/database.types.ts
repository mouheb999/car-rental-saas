// Minimal hand-written Database types matching our SQL schema.
// Keep in sync with supabase.schema.sql.

export type ReservationStatus = "pending" | "confirmed" | "cancelled";

export interface CarRow {
  id: string;
  name: string;
  brand: string | null;
  image: string | null;
  price: number;
  available: boolean;
  fuel: string | null;
  transmission: string | null;
  seats: number | null;
  horsepower: number | null;
  year: number | null;
  category: string | null;
  description: string | null;
  gallery: string[] | null;
  created_at: string;
}

export interface ReservationRow {
  id: string;
  name: string;
  phone: string;
  car_id: string | null;
  start_date: string; // ISO date "YYYY-MM-DD"
  end_date: string;
  pickup_location: string | null;
  status: ReservationStatus;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      cars: {
        Row: CarRow;
        Insert: Omit<CarRow, "id" | "created_at"> & {
          id?: string;
          created_at?: string;
        };
        Update: Partial<CarRow>;
      };
      reservations: {
        Row: ReservationRow;
        Insert: Omit<ReservationRow, "id" | "created_at" | "status"> & {
          id?: string;
          created_at?: string;
          status?: ReservationStatus;
        };
        Update: Partial<ReservationRow>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
