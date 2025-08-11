import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  // Check admin auth here
  const isAdmin = true; // Replace with real auth check
  if (!isAdmin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const {
    name,
    description,
    price,
    categoryId,
    image_url: imageUrl,
    quantity,
  } = body;

  if (
    !name &&
    !description &&
    !price &&
    !categoryId &&
    !imageUrl &&
    !quantity
  ) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const updates: any = {};

  if (name) updates.name = name;
  if (description) updates.description = description;
  if (price) updates.price = price;
  if (categoryId) updates.category_id = categoryId;
  if (imageUrl) updates.imageUrl = imageUrl;
  if (quantity) updates.quantity = quantity;

  updates.updated_at = new Date();

  const { data, error } = await supabase
    .from("products")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = await params;
  // Check admin auth here
  const isAdmin = true; // Replace with real auth check
  if (!isAdmin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  //   const { error } = await supabase.from("products").delete().eq("id", id);

  //   if (error)
  //     return NextResponse.json({ error: error.message }, { status: 500 });

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  const result = await supabase.from("products").delete().eq("id", id);
  console.log("Result: ", result);

  return NextResponse.json({ message: "Deleted successfully" });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  // Check admin auth here
  const isAdmin = true; // Replace with real auth check
  if (!isAdmin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const supabase = await createClient();
  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(product);
}
