import { NextRequest, NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "../../../lib/s3";
import jwt from "jsonwebtoken";

export async function GET() {
  const supabase = await createClient();
  const { data, error } = await supabase.from("products").select("*");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  console.log("s3: ", s3);
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

  const formData = await req.formData();

  const name = formData.get("name");
  const description = formData.get("description");
  const price = formData.get("price");
  const categoryId = formData.get("category_id");
  const quantity = formData.get("quantity");

  const image = formData.get("image") as File;

  let imageUrl;
  if (image) {
    const buffer = Buffer.from(await image.arrayBuffer());
    const key = `products/${Date.now()}-${image.name}`;

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME!,
        Key: key,
        Body: buffer,
        ContentType: image.type,
      })
    );

    imageUrl = `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
  }

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
