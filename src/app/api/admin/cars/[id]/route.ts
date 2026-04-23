import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * PATCH /api/admin/cars/[id]
 * Body: any subset of car fields to update.
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  let payload: Record<string, unknown>;
  try {
    payload = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  delete payload.id;
  delete payload.created_at;

  const { data, error } = await supabaseAdmin
    .from("cars")
    .update(payload)
    .eq("id", params.id)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ car: data });
}

/**
 * DELETE /api/admin/cars/[id]
 */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const { error } = await supabaseAdmin
    .from("cars")
    .delete()
    .eq("id", params.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
