import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  // Check admin auth here (example placeholder)
  const isAdmin = true; // Replace with real auth check
  if (!isAdmin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    name,
    description,
    price,
    category_id: categoryId,
    image_url: imageUrl,
    quantity,
  } = body;

  if (!name || !price || !categoryId || !quantity || !description) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const supabase = await createClient();

  const insertFields = {} as any;
  if (name) insertFields.name = name;
  if (price) insertFields.price = price;
  if (categoryId) insertFields.category_id = categoryId;
  if (quantity) insertFields.quantity = quantity;
  if (description) insertFields.description = description;
  if (imageUrl) insertFields.image_url = imageUrl;

  const { data, error } = await supabase
    .from("products")
    .insert([insertFields])
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
