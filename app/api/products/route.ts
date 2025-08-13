import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import jwt from "jsonwebtoken";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("accessToken")?.value;

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify token
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
      email: string;
      role: string;
      fullName: string;
    };
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (decoded?.role !== "admin") {
    // TODO: Change to enum
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const {
    name,
    description,
    price,
    category_id: categoryId,
    image_url: imageUrl,
    quantity,
  } = body;

  console.log("Body: ", body);

  if (!name || !price || !categoryId || !quantity || !description) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  console.log("1111111111-555555555555555");

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
