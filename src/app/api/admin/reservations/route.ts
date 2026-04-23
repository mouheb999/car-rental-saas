import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/reservations
 * Returns every reservation joined with its car (id, name, image).
 * Middleware has already verified the admin cookie, so no extra auth
 * check is needed here.
 */
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("reservations")
    .select("*, cars(id, name, image, price)")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ reservations: data ?? [] });
}
