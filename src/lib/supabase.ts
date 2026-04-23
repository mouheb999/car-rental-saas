"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  // Don't throw at import time in dev — surface a clear message instead.
  // eslint-disable-next-line no-console
  console.warn(
    "[supabase] Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY. " +
      "Copy .env.local.example to .env.local and fill in your keys."
  );
}

// We don't pass a Database generic: our query helpers in `carsDb.ts` and
// `reservationsDb.ts` already return strongly-typed `CarRow` / `ReservationRow`
// values thanks to our hand-written types in `database.types.ts`.
export const supabase = createClient(
  supabaseUrl ?? "http://invalid.local",
  supabaseAnonKey ?? "invalid",
  {
    auth: { persistSession: false },
    realtime: { params: { eventsPerSecond: 10 } },
  }
);

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);
