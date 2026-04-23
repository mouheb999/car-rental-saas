import { createClient } from "@supabase/supabase-js";

/**
 * SERVER-ONLY Supabase client. Uses the `service_role` key which bypasses
 * Row Level Security. Never import this from a Client Component or any file
 * that ships to the browser — it would leak the secret.
 *
 * Only usage: inside Route Handlers under `src/app/api/admin/**`.
 */

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRole) {
  // eslint-disable-next-line no-console
  console.warn(
    "[supabaseAdmin] Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. " +
      "Admin API routes will fail until both are set in .env.local."
  );
}

export const supabaseAdmin = createClient(
  url ?? "http://invalid.local",
  serviceRole ?? "invalid",
  {
    auth: { persistSession: false, autoRefreshToken: false },
    global: {
      // Next.js patches global fetch to add aggressive caching.
      // Force every Supabase request to bypass that cache so admin
      // reads always return the latest data from PostgreSQL.
      fetch: (input, init) =>
        fetch(input, { ...init, cache: "no-store" }),
    },
  }
);
