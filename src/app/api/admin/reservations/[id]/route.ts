import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabaseAdmin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const ALLOWED_STATUS = ["pending", "confirmed", "cancelled"] as const;
type AllowedStatus = (typeof ALLOWED_STATUS)[number];

/**
 * PATCH /api/admin/reservations/[id]
 * Body: { status: 'pending' | 'confirmed' | 'cancelled' }
 */
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  let body: { status?: string };
  try {
    body = (await req.json()) as { status?: string };
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const status = body.status;
  if (!status || !ALLOWED_STATUS.includes(status as AllowedStatus)) {
    return NextResponse.json(
      { error: `status must be one of: ${ALLOWED_STATUS.join(", ")}` },
      { status: 400 }
    );
  }

  const { data, error } = await supabaseAdmin
    .from("reservations")
    .update({ status })
    .eq("id", params.id)
    .select("*, cars(id, name, image)")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ reservation: data });
}
