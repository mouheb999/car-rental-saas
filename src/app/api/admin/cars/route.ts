import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/admin/cars
 * Returns ALL cars (including unavailable ones). Public RLS only exposes
 * available=true; admins need the full list.
 */
export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("cars")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ cars: data ?? [] });
}

/**
 * POST /api/admin/cars
 * Body: car insert payload (without id + created_at).
 */
export async function POST(req: Request) {
  let payload: Record<string, unknown>;
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  if (!payload.name || typeof payload.name !== "string") {
    return NextResponse.json(
      { error: "`name` is required" },
      { status: 400 }
    );
  }

  // Strip forbidden fields
  delete payload.id;
  delete payload.created_at;

  const { data, error } = await supabaseAdmin
    .from("cars")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ car: data }, { status: 201 });
}
