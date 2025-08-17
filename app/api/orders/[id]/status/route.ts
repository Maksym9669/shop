import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../../lib/supabase/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: order, error } = await supabase
    .from("orders")
    .select("id, status, total_amount, created_at")
    .eq("id", id)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Return only basic order status info without sensitive data
  return NextResponse.json({
    id: order.id,
    status: order.status,
    total_amount: order.total_amount,
    created_at: order.created_at,
  });
}
